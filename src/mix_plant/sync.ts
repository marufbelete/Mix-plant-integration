import "../env";
import cron from "node-cron";
import { MixPlantService } from "./mix_plant.service";
import { PrismaService } from "../prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import axios from "../http_client";

const config = {
  get SYNC_URL() {
    return process.env.SYNC_URL ;
  },
  get OFFLINE_SERVER_URL() {
    return (
      process.env.OFFLINE_SERVER_URL
    );
  },
  get PLANT_ID() {
    return process.env.PLANT_ID;
  },
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

let isSyncingFromCloud = false;

export const dataSyncBootFromCloud = async () => {
  createCronJob(
    "*/5 * * * * *",
    async () => {
      if (isSyncingFromCloud) {
        return;
      }
      isSyncingFromCloud = true;

      try {
        // const online = await isOnline();
        // if (!online) {
        //   console.log("🚫 Internet not available. Skipping sync.");
        //   return;
        // }
        // console.log("🚫 Internet .");

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
          const unique_codes = sync_data?.unique_code
            ? sync_data.unique_code
                .split(",")
                .map((code: string) => code.trim())
                .filter(Boolean)
            : [];

          if (unique_codes.some((code: string) => failed_codes.includes(code))) {
            console.warn(
              `[SYNC] Skipping task ${sync_data.id} (${sync_data.endpoint}) because code in [${unique_codes.join(", ")}] failed earlier in this batch.`
            );
            continue;
          }

          try {
            const headers: any = {
              "Content-Type": "application/json",
              "X-From-Sync": "true",
              "Sync-Id": sync_data.id,
            };

            if (sync_data.unique_code) {
              headers["X-Unique-Code"] = sync_data.unique_code;
            }

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
            const errorMsg =
              error.response?.data || error.message || "Unknown error";
            await axios.request({
              method: "PUT",
              url: `${config.SYNC_URL}/api/sync`,
              data: {
                code: sync_data.id,
                error: JSON.stringify(errorMsg),
              },
              headers: {
                "Content-Type": "application/json",
                "X-From-Sync": "true",
              },
              validateStatus: (status) => status >= 200 && status < 300,
            });
            if (unique_codes.length > 0) failed_codes.push(...unique_codes);
            continue;
          }
        }
      } catch (branchError: any) {
        console.error(`Error processing get dump data :`, branchError.message);
        // Continue with next branch even if current branch fails
      } finally {
        isSyncingFromCloud = false;
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
              timeout: 100000, // 100 second timeout
            });

            // If we get here, the API call was successful
            console.log(
              `[CRON] Successfully synced prdbill ${bill.pk} (Status: ${res.status})`
            );

            // Update the record to mark as synced using the primary key
            await prismaService.$executeRaw`
            INSERT INTO sync_track.prodbill_his_sync (pbh_pk, synced, attempts, error)
            VALUES (${bill.pk}, true, 1, NULL)
            ON DUPLICATE KEY UPDATE 
              synced = true, 
              attempts = attempts + 1, 
              error = NULL,
              last_attempt = CURRENT_TIMESTAMP;
          `;
          } catch (err: any) {
            console.error(
              `[CRON] Failed to sync prdbill ${bill.pk}:`,
              err?.response?.status,
              err?.response?.data || err?.message
            );
            await prismaService.$executeRaw`
            INSERT INTO sync_track.prodbill_his_sync (pbh_pk, synced, attempts, error)
            VALUES (${bill.pk}, false, 1, ${
              err?.response?.data || err?.message
            })
            ON DUPLICATE KEY UPDATE 
              synced = false, 
              attempts = attempts + 1, 
              error = ${err?.response?.data || err?.message},
              last_attempt = CURRENT_TIMESTAMP;
          `;
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
// Cron: Every minutes, POST unsynced production/bill payloads to cloud API
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
          (await mixPlantService.getUnsyncedMaterialBills()) as any[];

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
              timeout: 100000,
              validateStatus: (status) => status >= 200 && status < 300,
            });
            console.log(
              `[CRON] Successfully synced material ${material.pk} (Status: ${res.status})`
            );
            await prismaService.$executeRaw`
            INSERT INTO sync_track.material_sync (ma_pk, synced, attempts, error)
            VALUES (${material.pk}, true, 1, NULL)
            ON DUPLICATE KEY UPDATE 
              synced = true, 
              attempts = attempts + 1, 
              error = NULL,
              last_attempt = CURRENT_TIMESTAMP;
          `;
          } catch (err: any) {
            console.error(
              `[CRON] Failed to sync material ${material.pk}:`,
              err?.response?.status,
              err?.response?.data || err?.message
            );
            await prismaService.$executeRaw`
            INSERT INTO sync_track.material_sync (ma_pk, synced, attempts, error)
            VALUES (${material.pk}, false, 1, ${
              err?.response?.data || err?.message
            })
            ON DUPLICATE KEY UPDATE 
              synced = false, 
              attempts = attempts + 1, 
              error = ${err?.response?.data || err?.message},
              last_attempt = CURRENT_TIMESTAMP;
          `;
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

let isSyncingHand = false;
async function sendMaterialHandToCloudCron() {
  createCronJob(
    "*/1 * * * *",
    async () => {
      if (isSyncingHand) {
        console.log("[CRON] Sync already in progress. Skipping this run.");
        return;
      }

      isSyncingHand = true;
      try {
        const unsyncedMaterialHand =
          (await mixPlantService.getUnsyncedMaterialHand()) as any[];

        if (unsyncedMaterialHand.length === 0) {
          console.log("[CRON] No unsynced material hand records found");
          return;
        }

        console.log(
          `[CRON] Found ${unsyncedMaterialHand.length} unsynced material hand records`
        );

        for (const material of unsyncedMaterialHand) {
          try {
            const url = `${config.SYNC_URL}/api/schedule/plant/prod_material_hand`;
            const res = await axios.post(url, material, {
              headers: { "Content-Type": "application/json" },
              timeout: 100000,
              validateStatus: (status) => status >= 200 && status < 300,
            });
            console.log(
              `[CRON] Successfully synced material hand ${material.pk} (Status: ${res.status})`
            );
            await prismaService.$executeRaw`
            INSERT INTO sync_track.material_hand_sync (row_hash, synced, attempts, error)
            VALUES (${material.row_fingerprint}, true, 1, NULL)
            ON DUPLICATE KEY UPDATE 
              synced = true, 
              attempts = attempts + 1, 
              error = NULL,
              last_attempt = CURRENT_TIMESTAMP;
          `;
          } catch (err: any) {
            console.error(
              `[CRON] Failed to sync material hand ${material.row_fingerprint}:`,
              err?.response?.status,
              err?.response?.data || err?.message
            );
            await prismaService.$executeRaw`
            INSERT INTO sync_track.material_hand_sync (row_hash, synced, attempts, error)
            VALUES (${material.row_fingerprint}, false, 1, ${
              err?.response?.data || err?.message
            })
            ON DUPLICATE KEY UPDATE 
              synced = false, 
              attempts = attempts + 1, 
              error = ${err?.response?.data || err?.message},
              last_attempt = CURRENT_TIMESTAMP;
          `;
          }
        }
      } catch (err: any) {
        console.error(
          "[CRON] Error in material hand sync job:",
          err?.message || "Unknown error"
        );
      } finally {
        isSyncingHand = false;
      }
    },
    "MATERIAL_HAND_POST",
    false,
    { timezone: "Africa/Nairobi" }
  );
}

let isSyncingHistory = false;
async function sendHistoryToCloudCron() {
  createCronJob(
    "*/1 * * * *",
    async () => {
      if (isSyncingHistory) {
        console.log("[CRON] Sync already in progress. Skipping this run.");
        return;
      }

      isSyncingHistory = true;
      try {
        const unsyncedHistory =
          (await mixPlantService.getUnsyncedBashHistory()) as any[];

        if (unsyncedHistory.length === 0) {
          console.log("[CRON] No unsynced history records found");
          return;
        }

        console.log(
          `[CRON] Found ${unsyncedHistory.length} unsynced history records`
        );

        for (const history of unsyncedHistory) {
          try {
            const url = `${config.SYNC_URL}/api/schedule/plant/history`;
            const res = await axios.post(url, history, {
              headers: { "Content-Type": "application/json" },
              timeout: 100000,
              validateStatus: (status) => status >= 200 && status < 300,
            });
            console.log(
              `[CRON] Successfully synced history ${history.pk} (Status: ${res.status})`
            );
            await prismaService.$executeRaw`
            INSERT INTO sync_track.bashistory_sync (pk_b, synced, attempts, error)
            VALUES (${history.pk}, true, 1, NULL)
            ON DUPLICATE KEY UPDATE 
              synced = true, 
              attempts = attempts + 1, 
              error = NULL,
              last_attempt = CURRENT_TIMESTAMP;
          `;
          } catch (err: any) {
            console.error(
              `[CRON] Failed to sync history ${history.pk}:`,
              err?.response?.status,
              err?.response?.data || err?.message
            );
            await prismaService.$executeRaw`
            INSERT INTO sync_track.bashistory_sync (pk_b, synced, attempts, error)
            VALUES (${history.pk}, false, 1, ${
              err?.response?.data || err?.message
            })
            ON DUPLICATE KEY UPDATE 
              synced = false, 
              attempts = attempts + 1, 
              error = ${err?.response?.data || err?.message},
              last_attempt = CURRENT_TIMESTAMP;
          `;
          }
        }
      } catch (err: any) {
        console.error(
          "[CRON] Error in history sync job:",
          err?.message || "Unknown error"
        );
      } finally {
        isSyncingHistory = false;
      }
    },
    "MATERIAL_HISTORY_POST",
    false,
    { timezone: "Africa/Nairobi" }
  );
}

export async function initMixPlantSync() {
  await dataSyncBootFromCloud();
  await sendPrdbillToCloudCron();
  await sendMaterialToCloudCron();
  await sendMaterialHandToCloudCron();
  await sendHistoryToCloudCron();
}
