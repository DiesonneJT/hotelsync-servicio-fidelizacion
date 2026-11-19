const { test } = require("node:test");
const assert = require("node:assert");
const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

test("sintaxis valida en todos los archivos JS de src", () => {
  const srcDir = path.join(__dirname, "..", "src");
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".js")) files.push(full);
    }
  }
  walk(srcDir);
  assert.ok(files.length > 0, "No se encontraron archivos JS");
  for (const file of files) {
    execSync(`node --check "${file}"`, { stdio: "pipe" });
  }
});

test("package.json declara scripts obligatorios", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8"));
  assert.ok(pkg.scripts.start, "Falta script start");
  assert.ok(pkg.scripts.test, "Falta script test");
  assert.ok(pkg.name, "Falta name");
});
