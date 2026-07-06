import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import pngToIco from 'png-to-ico';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    const rceditModule = await import('rcedit');
    const rcedit = rceditModule.rcedit || rceditModule.default;
    const exePath = path.join(__dirname, 'src-tauri', 'binaries', 'beni-iceri-al-DPI-proxy-x86_64-pc-windows-msvc.exe');
    const pngPath = path.join(__dirname, 'public', 'beni-iceri-al-DPI.png');
    const iconPath = path.join(__dirname, 'src-tauri', 'icons', 'beni-iceri-al-DPI.ico');

    // Also convert uninstall.png to uninstall.ico — same icon for uninstall
    const uninstallPngPath = path.join(__dirname, 'public', 'beni-iceri-al-DPI.png');
    const uninstallIconPath = path.join(__dirname, 'src-tauri', 'icons', 'uninstall.ico');

    console.log(`Converting ${pngPath} to ICO...`);
    try {
        const buf = await pngToIco(pngPath);
        fs.writeFileSync(iconPath, buf);
        console.log(`Created temporary ICO at ${iconPath}`);
        
        console.log(`Converting ${uninstallPngPath} to ICO...`);
        const uninstallBuf = await pngToIco(uninstallPngPath);
        fs.writeFileSync(uninstallIconPath, uninstallBuf);
        console.log(`Created temporary ICO at ${uninstallIconPath}`);
    } catch (err) {
        console.error('Failed to convert PNG to ICO:', err);
        return;
    }

    console.log(`Updating icon for ${exePath} using ${iconPath}`);

    try {
        await rcedit(exePath, {
            icon: iconPath,
            'version-string': {
                ProductName: 'beni-iceri-al-DPI',
                FileDescription: 'beni-iceri-al-DPI Service',
                CompanyName: 'o7xMarasli',
                LegalCopyright: 'Copyright © 2026 o7xMarasli'
            }
        });
        console.log('Icon updated successfully!');
    } catch (e) {
        console.error('Failed to update icon:', e);
    }
}

main();
