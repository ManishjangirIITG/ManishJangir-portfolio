import { spawnSync } from "node:child_process";

const checks = [
  ["TypeScript", "npm", ["run", "typecheck"]],
  ["ESLint", "npm", ["run", "lint"]],
  ["Unit tests", "npm", ["run", "test"]],
  ["Formatting", "npm", ["run", "format:check"]],
  ["Production build", "npm", ["run", "build"]],
];

function runCheck(name, command, args) {
  console.log(`\n${"=".repeat(72)}`);
  console.log(`QUALITY CHECK: ${name}`);
  console.log(`COMMAND: ${command} ${args.join(" ")}`);
  console.log(`${"=".repeat(72)}\n`);

  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });

  if (result.error) {
    console.error(`\n✗ ${name} could not be started.`);
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`\n✗ ${name} failed with exit code ${result.status}.`);
    console.error("Quality pipeline stopped at this check.\n");
    process.exit(result.status ?? 1);
  }

  console.log(`\n✓ ${name} passed.`);
}

console.log("\nRunning portfolio quality gates...");

for (const [name, command, args] of checks) {
  runCheck(name, command, args);
}

console.log(`\n${"=".repeat(72)}`);
console.log("✓ ALL QUALITY CHECKS PASSED");
console.log(`${"=".repeat(72)}\n`);
