import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// 1. External override: check if .env exists next to the running executable
const exeDir = path.dirname(process.execPath);
const externalEnv = path.join(exeDir, ".env");

// 2. Bundled snapshot assets (pkg AST scanner recognizes literal path.join(__dirname, ...))
const bundledDirEnv = path.join(__dirname, ".env");
const bundledDistEnv = path.join(__dirname, "../.env");
const bundledRootEnv = path.join(__dirname, "../../.env");
const cwdEnv = path.join(process.cwd(), ".env");

const candidatePaths = [
  externalEnv,
  bundledDirEnv,
  bundledDistEnv,
  bundledRootEnv,
  cwdEnv,
];

let loaded = false;
for (const envPath of candidatePaths) {
  try {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
      loaded = true;
      break;
    }
  } catch {
    // Continue to next candidate
  }
}

if (!loaded) {
  dotenv.config();
}

console.log(`[ENV] PLANT_ID: ${process.env.PLANT_ID || "(not set)"}`);

export default process.env;
