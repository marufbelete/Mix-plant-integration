import cron from "node-cron";
import axios from "axios";

// Mocked/placeholder dependencies (replace with real ones in your app)
const config = {
  SYNC_URL: "http://localhost:5000",
  OFFLINE_SERVER_URL: "http://localhost:7000",
};
function toFormData(payload: any) {
  // Implement as needed for file uploads
  return payload;
}

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
      console.log("🚫 Internet .");
      // const online = await isOnline();
      // if (!online) {
      //   console.log("🚫 Internet not available. Skipping sync.");
      //   return;
      // }

      try {
        const cloud_data = await axios.request({
          method: "GET",
          url: `${config.SYNC_URL}/api/sync?metadata=plant_ready`,
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

            let payload = JSON.parse(sync_data.payload);

            // Handle file uploads differently
            if (
              sync_data.endpoint === "/api/article" &&
              (sync_data.method === "PUT" || sync_data.method === "POST")
            ) {
              payload = toFormData(sync_data.payload);
              headers["Content-Type"] = "multipart/form-data";
            }

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

export async function initMixPlantSync() {
  await dataSyncBootFromCloud();
}
