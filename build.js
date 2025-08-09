const fs = require('fs');
const path = require('path');

// Define the distribution directory
const distDir = path.join(__dirname, 'dist');

// 1. Create a directory named `dist`. If it already exists, clear its contents.
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir);

// 2. Copy index.html and data.txt into the dist directory.
fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(distDir, 'index.html'));
fs.copyFileSync(path.join(__dirname, 'data.txt'), path.join(distDir, 'data.txt'));

console.log('Build successful! The dist directory is ready for deployment.');