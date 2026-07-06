#!/usr/bin/env node
/**
 * v1.0.0 Release oluşturucu
 * Kullanım: node scripts/create-release.cjs
 * GitHub token'ını sorar, binary'leri release asset olarak yükler.
 */

const https = require("https");
const fs = require("fs");
const readline = require("readline");

const REPO = "o7xMarasli/beni-iceri-al-DPI";
const TAG = "v1.0.1";
const ASSETS_DIR = "D:\\Projeler\\beni-iceri-al-DPI\\src-tauri\\target\\release\\bundle";

const ASSETS = [
  { file: `${ASSETS_DIR}\\nsis\\beni-iceri-al-DPI_1.0.1_x64-setup.exe`, name: "beni-iceri-al-DPI_1.0.1_x64-setup.exe" },
  { file: `${ASSETS_DIR}\\msi\\beni-iceri-al-DPI_1.0.1_x64_en-US.msi`,   name: "beni-iceri-al-DPI_1.0.1_x64_en-US.msi" },
];

function askToken() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question("GitHub Personal Access Token (repo scope): ", (t) => {
      rl.close();
      resolve(t.trim());
    });
  });
}

function api(method, path, token, body = null) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: "api.github.com",
      path: `/repos/${REPO}${path}`,
      method,
      headers: {
        "User-Agent": "create-release",
        // BUG-9 FIX: Token globalThis'e atanmıyor — parametre olarak geçiriliyor
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
    };
    const req = https.request(opts, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, data }); }
      });
    });
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function uploadAsset(uploadUrl, filePath, assetName, token) {
  const stat = fs.statSync(filePath);
  return new Promise((resolve, reject) => {
    const opts = new URL(uploadUrl);
    const req = https.request({
      hostname: opts.hostname,
      path: `${opts.pathname}?name=${encodeURIComponent(assetName)}`,
      method: "POST",
      headers: {
        "User-Agent": "create-release",
        // BUG-9 FIX: Token parametre olarak alınıyor
        Authorization: `token ${token}`,
        "Content-Type": "application/octet-stream",
        "Content-Length": stat.size,
        Accept: "application/vnd.github.v3+json",
      },
    }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => { try { resolve(JSON.parse(data)); } catch { reject(new Error(data)); } });
    });
    req.on("error", reject);
    fs.createReadStream(filePath).pipe(req);
  });
}

async function main() {
  const TOKEN = await askToken();
  // BUG-9 FIX: Token artık globalThis'e atanmıyor — tüm çağrılara parametre olarak geçiriliyor

  console.log("🔍 Mevcut release kontrol...");
  const existing = await api("GET", `/releases/tags/${TAG}`, TOKEN);
  if (existing.status === 200) {
    console.log("⚠️ Release var, yenisi için siliniyor...");
    for (const a of existing.data.assets) await api("DELETE", `/releases/assets/${a.id}`, TOKEN);
    await api("DELETE", `/releases/${existing.data.id}`, TOKEN);
    console.log("  Silindi.");
  }

  const head = await api("GET", "/git/ref/heads/master", TOKEN);
  if (head.status !== 200) {
    console.error("❌ master branch bulunamadı. Önce 'git push' yaptınız mı?");
    process.exit(1);
  }

  const tagCheck = await api("GET", `/git/ref/tags/${TAG}`, TOKEN);
  if (tagCheck.status !== 200) {
    console.log(`🏷️ Tag ${TAG} oluşturuluyor...`);
    await api("POST", "/git/refs", TOKEN, { ref: `refs/tags/${TAG}`, sha: head.data.object.sha });
  } else {
    console.log(`✅ Tag ${TAG} zaten var`);
  }

  console.log("📦 Release oluşturuluyor...");
  const rel = await api("POST", "/releases", TOKEN, {
    tag_name: TAG,
    name: "v1.0.1",
    body: `# beni-iceri-al-DPI v1.0.1

Güvenlik ve hata düzeltmeleri sürümü.

## 🔒 Güvenlik Düzeltmeleri
- **[SEC-1]** Güncelleme indirme/kurma güvenliği: URL allowlist + path doğrulaması eklendi
- **[SEC-2]** İndirilen exe için SHA256 altyapısı + 50 MB boyut sınırı
- **[SEC-3]** PID dosyası %TEMP% yerine güvenli %APPDATA% dizinine taşındı

## 🐛 Hata Düzeltmeleri
- **[BUG-1]** Port seçiminde TOCTOU race condition giderildi
- **[BUG-3]** Anti-debug yanlış pozitif sorunu düzeltildi (2ms → 10ms, 3 ardışık ölçüm)
- **[BUG-6]** Versiyon karşılaştırmasında negatif versiyon parse hatası giderildi
- **[BUG-9]** GitHub token artık global scope'a sızmıyor
- **[BUG-10]** Güncelleme indirme race condition düzeltildi
- **[BUG-12]** Geçersiz port (0) artık reddediliyor

## 📦 Kurulum
- \`beni-iceri-al-DPI_1.0.1_x64-setup.exe\` — NSIS kurulum sihirbazı (önerilen)
- \`beni-iceri-al-DPI_1.0.1_x64_en-US.msi\` — MSI paketi`,
    draft: false,
    prerelease: false,
  });
  if (rel.status !== 201) { console.error("❌", rel.data); process.exit(1); }
  console.log(`✅ Release #${rel.data.id} oluşturuldu`);

  for (const a of ASSETS) {
    if (!fs.existsSync(a.file)) { console.warn(`⚠️ ${a.file} yok`); continue; }
    const mb = (fs.statSync(a.file).size / 1024 / 1024).toFixed(1);
    console.log(`⬆️ ${a.name} (${mb} MB)...`);
    const r = await uploadAsset(rel.data.upload_url, a.file, a.name, TOKEN);
    console.log(`✅ ${r.name}`);
  }

  console.log(`\n🎉 https://github.com/${REPO}/releases/tag/${TAG}`);
}

main().catch(console.error);
