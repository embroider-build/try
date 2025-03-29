import { resolve } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";

async function main() {
  const command = process.argv[2];
  switch (command) {
    case "list":
      await listCommand();
      break;
    case "apply":
      await applyCommand();
      break;
    case undefined:
      process.stderr.write(`supported commands: list, apply\n`);
      process.exit(-1);
      break;
    default:
      process.stderr.write(`no such command ${command}\n`);
      process.exit(-1);
  }
}

async function listCommand() {
  const config = await loadConfig();
  process.stdout.write(
    JSON.stringify({
      name: config.scenarios.map((s) => s.name),
      include: config.scenarios,
    }) + "\n"
  );
}

async function applyCommand() {
  const scenarioName = process.argv[3];
  if (!scenarioName) {
    process.stderr.write(`apply command needs to be passed a scenario name\n`);
    process.exit(-1);
  }
  const config = await loadConfig();
  const scenario = config.scenarios.find((s) => s.name === scenarioName);
  if (!scenario) {
    process.stderr.write(`No such scenario "${scenarioName}"\n`);
    process.exit(-1);
  }
  await applyScenario(scenario);
}

async function loadConfig() {
  const { default: config } = await import(resolve(process.cwd(), ".try.mjs"));
  return config;
}

async function applyScenario(scenario) {
  const pkgJSONPath = resolve(process.cwd(), "package.json");
  const pkg = JSON.parse(readFileSync(pkgJSONPath, "utf8"));
  if (scenario.npm) {
    for (let key of [
      "devDependencies",
      "dependencies",
      "peerDependencies",
      "overrides",
    ]) {
      if (scenario.npm[key]) {
        if (!pkg[key]) {
          pkg[key] = {};
        }
        Object.assign(pkg[key], scenario.npm[key]);
      }
    }
  }
  writeFileSync(pkgJSONPath, JSON.stringify(pkg, null, 2));
  process.stdout.write(`Applied scenario ${scenario.name}\n`);
}

await main();
