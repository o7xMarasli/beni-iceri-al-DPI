#!/usr/bin/env node
/**
 * Obfuscate built Vite JS assets before Tauri bundles them.
 *
 * Çalışır: vite build → bu script → tauri build
 *
 * Bu script dist/assets/ içindeki tüm JS dosyalarını javascript-obfuscator
 * ile şifreler: değişken isimleri karıştırılır, string'ler obfuscate edilir,
 * kontrol akışı düzleştirilir.
 */
const JavaScriptObfuscator = require("javascript-obfuscator");
const { readdirSync, readFileSync, writeFileSync } = require("fs");
const { resolve } = require("path");

const distDir = resolve("dist/assets");

let files;
try {
  files = readdirSync(distDir).filter(f => f.endsWith(".js"));
} catch {
  console.log("[obfuscate] No dist/assets found, skipping.");
  process.exit(0);
}

if (files.length === 0) {
  console.log("[obfuscate] No JS files in dist/assets, skipping.");
  process.exit(0);
}

console.log(`[obfuscate] Obfuscating ${files.length} JS file(s)...`);

const OBFUSCATOR_OPTIONS = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: false,        // webview'de console spam yapar
  disableConsoleOutput: false,   // biz log kullanıyoruz
  identifierNamesGenerator: "hexadecimal",
  renameGlobals: false,          // Tauri API çağrılarını kırar
  rotateStringArray: true,
  selfDefending: false,          // Tauri IPC'yi kırabilir
  shuffleStringArray: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayEncoding: ["rc4"],
  stringArrayThreshold: 0.8,
  transformObjectKeys: true,
  unicodeEscapeSequence: false,
};

let totalIn = 0;
let totalOut = 0;

for (const file of files) {
  const filePath = resolve(distDir, file);
  const code = readFileSync(filePath, "utf-8");
  totalIn += code.length;

  console.log(`[obfuscate] Processing ${file} (${(code.length / 1024).toFixed(1)} KB)...`);

  try {
    const result = JavaScriptObfuscator.obfuscate(code, OBFUSCATOR_OPTIONS);
    const obfuscated = result.getObfuscatedCode();
    writeFileSync(filePath, obfuscated, "utf-8");
    totalOut += obfuscated.length;
    console.log(`[obfuscate]  ✓ ${file} → ${(obfuscated.length / 1024).toFixed(1)} KB`);
  } catch (err) {
    console.error(`[obfuscate]  ✗ ${file}: ${err.message}`);
  }
}

console.log(`[obfuscate] Done. ${(totalIn / 1024).toFixed(1)} KB → ${(totalOut / 1024).toFixed(1)} KB`);
