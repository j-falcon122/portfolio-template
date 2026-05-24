#!/usr/bin/env node
/**
 * Builds a static export for GitHub Pages.
 * Temporarily moves app/api aside — API routes are incompatible with output: "export".
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const apiDir = join(root, "app", "api");
const apiBackup = join(root, ".tmp-static-export-api");

function run(command, args, env = process.env) {
  const result = spawnSync(command, args, {
    cwd: root,
    env,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function restoreApiDir() {
  if (existsSync(apiBackup)) {
    rmSync(apiDir, { recursive: true, force: true });
    cpSync(apiBackup, apiDir, { recursive: true });
    rmSync(apiBackup, { recursive: true, force: true });
  }
}

process.on("exit", restoreApiDir);
process.on("SIGINT", () => process.exit(1));
process.on("SIGTERM", () => process.exit(1));

if (existsSync(apiDir)) {
  rmSync(apiBackup, { recursive: true, force: true });
  cpSync(apiDir, apiBackup, { recursive: true });
  rmSync(apiDir, { recursive: true, force: true });
}

run("npm", ["run", "build"], {
  ...process.env,
  GITHUB_PAGES: "true",
});

const outDir = join(root, "out");
if (!existsSync(outDir)) {
  console.error("[build-static-export] Expected out/ after static export build.");
  process.exit(1);
}

writeFileSync(join(outDir, ".nojekyll"), "");

console.log("[build-static-export] Static site ready in out/");
