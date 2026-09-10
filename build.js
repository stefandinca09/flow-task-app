const fs = require('fs');
const path = require('path');

console.log('Building Flow PWA for Vercel...');

// Create public directory
const publicDir = 'public';
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Helper to copy file
function copyFile(src, dest) {
  fs.copyFileSync(src, dest);
  console.log(`✅ Copied: ${src} → ${dest}`);
}

// Helper to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);
  files.forEach((file) => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied: ${srcPath}`);
    }
  });
}

// Copy files
copyFile('TODO.html', 'public/index.html');
copyFile('manifest.json', 'public/manifest.json');
copyFile('sw.js', 'public/sw.js');
copyDir('assets', 'public/assets');

// Verify
const bgLight = 'public/assets/images/neuro-protocols-background-light.webp';
const bgDark = 'public/assets/images/neuro-protocols-background-dark.webp';

if (fs.existsSync(bgLight) && fs.existsSync(bgDark)) {
  console.log('✅ Background images verified!');
} else {
  console.warn('⚠️ Warning: Background images not found');
}

console.log('✅ Build complete!');
