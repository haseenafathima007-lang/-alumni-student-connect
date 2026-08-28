const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const rootDir = "c:\\Users\\hasee\\OneDrive\\Desktop\\Alumini Student Connect";
const backupZipPath = path.join(rootDir, "Alumni_Student_Connect_Backup.zip");
const tempDir = path.join(rootDir, "backup_temp");

function copyDir(src, dest, ignore = []) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (ignore.includes(entry.name)) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, ignore);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  console.log("📦 Preparing project backup...");
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  if (fs.existsSync(backupZipPath)) {
    fs.unlinkSync(backupZipPath);
  }

  fs.mkdirSync(tempDir, { recursive: true });

  console.log("📂 Copying client source files...");
  copyDir(path.join(rootDir, "client"), path.join(tempDir, "client"), [
    "node_modules",
    "dist",
    ".vite",
  ]);

  console.log("📂 Copying server source files...");
  copyDir(path.join(rootDir, "server"), path.join(tempDir, "server"), [
    "node_modules",
  ]);

  console.log("🗜️ Creating ZIP archive using PowerShell Compress-Archive...");
  const psCmd = `powershell -NoProfile -Command "Compress-Archive -Path '${tempDir}\\*' -DestinationPath '${backupZipPath}' -CompressionLevel Optimal"`;
  execSync(psCmd, { stdio: "inherit" });

  fs.rmSync(tempDir, { recursive: true, force: true });

  const stats = fs.statSync(backupZipPath);
  console.log("✅ Backup successfully created!");
  console.log(`📍 Location: ${backupZipPath}`);
  console.log(`📊 Size: ${(stats.size / 1024).toFixed(2)} KB`);
} catch (err) {
  console.error("❌ Backup failed:", err.message);
  process.exit(1);
}
