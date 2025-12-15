import cron from "node-cron";
import { MixPlantService } from "./mix_plant.service";
import { PrismaService } from "../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import axios from "../http_client";
// Mocked/placeholder dependencies (replace with real ones in your app)
const config = {
  // SYNC_URL: "http://localhost:5000",
  SYNC_URL: "https://app-api.decentgroups.com",
  // OFFLINE_SERVER_URL: "http://localhost:5000",
  OFFLINE_SERVER_URL: "http://localhost:7000",
  // PLANT_ID: "PLANT_A",
  PLANT_ID: "PLANT_B",
};

function createCronJob(
  schedule: string,
  job: () => void,
  name: string,
  runOnInit = false,
  options?: any
) {
  const task = cron.schedule(schedule, job, options);
  if (runOnInit) job();
  console.log(`Cron job '${name}' scheduled: ${schedule}`);
  return task;
}

async function isOnline() {
  try {
    await axios.get("https://www.google.com", { timeout: 6000 });
    return true;
  } catch (error) {
    return false;
  }
}

export const dataSyncBootFromCloud = async () => {
  createCronJob(
    "*/1 * * * *",
    async () => {
      const online = await isOnline();
      if (!online) {
        console.log("🚫 Internet not available. Skipping sync.");
        return;
      }
      console.log("🚫 Internet .");
      try {
        const cloud_data = await axios.request({
          method: "GET",
          url: `${config.SYNC_URL}/api/sync?metadata=plant_ready&branch=${config.PLANT_ID}`,
          headers: {
            "Content-Type": "application/json",
            "X-From-Sync": "true",
          },
          validateStatus: (status) => status >= 200 && status < 300,
        });

        if (!cloud_data?.data?.length) return;
        const failed_codes: string[] = [];
        for (const sync_data of cloud_data.data) {
          const unique_codes = sync_data?.unique_code?.split(",");
          if (unique_codes?.some((code: string) => failed_codes.includes(code)))
            continue;
          try {
            const headers: any = {
              "Content-Type": "application/json",
              "X-From-Sync": "true",
              "Sync-Id": sync_data.id,
            };

            const payload = JSON.parse(sync_data.payload);

            // Process the sync operation
            await axios.request({
              method: sync_data.method,
              url: `${config.OFFLINE_SERVER_URL}${sync_data.endpoint}`,
              data: payload,
              headers,
              validateStatus: (status) => status >= 200 && status < 300,
            });

            // Only soft delete if successful
            await axios.request({
              method: "PUT",
              url: `${config.SYNC_URL}/api/sync/status/${sync_data.id}`,
              headers: {
                "Content-Type": "application/json",
                "X-From-Sync": "true",
              },
              validateStatus: (status) => status >= 200 && status < 300,
            });
          } catch (error: any) {
            await axios.request({
              method: "PUT",
              url: `${config.SYNC_URL}/api/sync`,
              data: {
                code: sync_data.id,
                error: JSON.stringify(error.response?.data || "Unknown error"),
              },
              headers: {
                "Content-Type": "application/json",
                "X-From-Sync": "true",
              },
              validateStatus: (status) => status >= 200 && status < 300,
            });
            if (unique_codes) failed_codes.push(...unique_codes);
            continue;
          }
        }
      } catch (branchError: any) {
        console.error(`Error processing get dump data :`, branchError.message);
        // Continue with next branch even if current branch fails
      }
    },
    "DATA_DUMP",
    false,
    { timezone: "Africa/Nairobi" }
  );
};

// Initialize services
const configService = new ConfigService();
const prismaService = new PrismaService(configService);
const mixPlantService = new MixPlantService(prismaService, configService);

// Cron: Every minute, POST unsynced production/bill payloads to cloud API
async function sendPrdbillToCloudCron() {
  createCronJob(
    "*/1 * * * *",
    async () => {
      try {
        // Get unsynced bills using the service
        const unsyncedBills = (await mixPlantService.getUnsyncedPrdbills(
          10
        )) as any[];
        if (unsyncedBills.length === 0) {
          console.log("[CRON] No unsynced prdbill records found");
          return;
        }

        console.log(
          `[CRON] Found ${unsyncedBills.length} unsynced prdbill records`
        );

        // Process each unsynced bill
        for (const bill of unsyncedBills) {
          try {
            const payload = {
              pk: bill.pk,
              pxxh: bill.pxxh,
              pk_station: bill.pk_station,
              pk_xsbill: bill.pk_xsBill, // Note: field name in DB is pk_xsBill (uppercase B)
              pk_recipe: bill.pk_recipe,
              qty: bill.qty,
              prddate: bill.prddate,
              driver: bill.driver,
              cheno: bill.cheno,
              // Add any other fields you need to send
            };

            const url = `${config.SYNC_URL}/api/schedule/plant/prdbill`;
            const res = await axios.request({
              method: "POST",
              url,
              data: payload,
              headers: { "Content-Type": "application/json" },
              validateStatus: (status) => status >= 200 && status < 300,
              timeout: 10000, // 10 second timeout
            });

            // If we get here, the API call was successful
            console.log(
              `[CRON] Successfully synced prdbill ${bill.pk} (Status: ${res.status})`
            );

            // Update the record to mark as synced using the primary key
            await prismaService.prdbill_his.update({
              where: { pk: bill.pk },
              data: { zbv1: "synced" },
            });
          } catch (err: any) {
            console.error(
              `[CRON] Failed to sync prdbill ${bill.pk}:`,
              err?.response?.status,
              err?.response?.data || err?.message
            );
            // Continue with next record even if one fails
          }
        }
      } catch (err: any) {
        console.error(
          "[CRON] Error in prdbill sync job:",
          err?.message || "Unknown error"
        );
      }
    },
    "PRDBILL_POST",
    false,
    { timezone: "Africa/Nairobi" }
  );
}
// Cron: Every 5 minutes, POST unsynced production/bill payloads to cloud API
let isSyncing = false;

async function sendMaterialToCloudCron() {
  createCronJob(
    "*/1 * * * *",
    async () => {
      if (isSyncing) {
        console.log("[CRON] Sync already in progress. Skipping this run.");
        return;
      }

      isSyncing = true;
      try {
        const unsyncedMaterial =
          (await mixPlantService.getUnsyncedMaterialills()) as any[];

        if (unsyncedMaterial.length === 0) {
          console.log("[CRON] No unsynced material records found");
          return;
        }

        console.log(
          `[CRON] Found ${unsyncedMaterial.length} unsynced material records`
        );

        for (const material of unsyncedMaterial) {
          try {
            const url = `${config.SYNC_URL}/api/schedule/plant/prod_material`;
            const res = await axios.post(url, material, {
              headers: { "Content-Type": "application/json" },
              timeout: 10000,
              validateStatus: (status) => status >= 200 && status < 300,
            });
            console.log(
              `[CRON] Successfully synced material ${material.pk} (Status: ${res.status})`
            );
            await prismaService.prdbill_material.update({
              where: { pk: material.pk },
              data: { MaterialVersion: "synced" },
            });
          } catch (err: any) {
            console.error(
              `[CRON] Failed to sync material ${material.pk}:`,
              err?.response?.status,
              err?.response?.data || err?.message
            );
          }
        }
      } catch (err: any) {
        console.error(
          "[CRON] Error in material sync job:",
          err?.message || "Unknown error"
        );
      } finally {
        isSyncing = false;
      }
    },
    "MATERIAL_POST",
    false,
    { timezone: "Africa/Nairobi" }
  );
}

export async function initMixPlantSync() {
  await dataSyncBootFromCloud();
  await sendPrdbillToCloudCron();
  await sendMaterialToCloudCron();
}
