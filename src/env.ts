import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Check if running inside packaged binary (pkg)
const isPkg = Boolean((process as any).pkg);

// 1. External override: check if .env exists next to the running executable (e.g. for pkg binary)
const exeDir = path.dirname(process.execPath);
const externalEnv = path.join(exeDir, ".env");

// 2. Project root / dev .env
const cwdEnv = path.join(process.cwd(), ".env");

// 3. Bundled snapshot assets (pkg AST scanner recognizes literal path.join(__dirname, ...))
const bundledDirEnv = path.join(__dirname, ".env");
const bundledDistEnv = path.join(__dirname, "../.env");
const bundledRootEnv = path.join(__dirname, "../../.env");

// In development / standard node: prioritize project root .env (cwdEnv) so dev settings take effect immediately.
// In pkg executable: prioritize external .env next to exe, then cwdEnv, then internal bundled assets.
const candidatePaths = isPkg
  ? [externalEnv, cwdEnv, bundledDirEnv, bundledDistEnv, bundledRootEnv]
  : [cwdEnv, externalEnv, bundledDirEnv, bundledDistEnv, bundledRootEnv];

let loaded = false;
let loadedPath = "";
for (const envPath of candidatePaths) {
  try {
    if (fs.existsSync(envPath)) {
      dotenv.config({ path: envPath });
      loaded = true;
      loadedPath = envPath;
      break;
    }
  } catch {
    // Continue to next candidate
  }
}

if (!loaded) {
  dotenv.config();
}

console.log(`[ENV] Mode: ${isPkg ? "pkg-binary" : "development/node"}`);
console.log(`[ENV] Loaded from: ${loadedPath || "default (.env)"}`);
console.log(`[ENV] PLANT_ID: ${process.env.PLANT_ID || "(not set)"}`);
console.log(`[ENV] PORT: ${process.env.PORT || "(not set)"}`);

export default process.env;
