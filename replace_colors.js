const fs = require('fs');
const path = require('path');

const replacements = {
  '#B97863': '#4A8B9A', // Primary -> Teal
  '#A3674F': '#366A77', // Primary Dark
  '#C9917F': '#78AAB7', // Primary Light
  '#2F2523': '#142B3B', // Deep -> Navy
  '#7B5E57': '#506A77', // Brown -> Slate
  '#F7EDE8': '#EBF2F5', // Blush -> Soft Blue
  '#FFF9F5': '#F5F8FA', // Ivory -> Cool White
  '#D9A441': '#D4AF37', // Gold
  '#F0E3DC': '#D6E4E8', // Border
  '#C9B0A8': '#8CA4B0', // Footer text
  '#3D2E2B': '#1A384D', // Footer dark
  '#4A3835': '#214358',
  '#5A4541': '#29536C',
  '#9A7D78': '#6B8A99',
  '#4F7F70': '#3B8263',
  '#EAF1EE': '#E8F0EC',
  '#E7D4CC': '#C9DADD',
  // Lowercase versions just in case
  '#b97863': '#4A8B9A',
  '#a3674f': '#366A77',
  '#c9917f': '#78AAB7',
  '#2f2523': '#142B3B',
  '#7b5e57': '#506A77',
  '#f7ede8': '#EBF2F5',
  '#fff9f5': '#F5F8FA',
  '#d9a441': '#D4AF37',
  '#f0e3dc': '#D6E4E8',
  '#c9b0a8': '#8CA4B0',
  '#3d2e2b': '#1A384D',
  '#4a3835': '#214358',
  '#5a4541': '#29536C',
  '#9a7d78': '#6B8A99',
  '#4f7f70': '#3B8263',
  '#eaf1ee': '#E8F0EC',
  '#e7d4cc': '#C9DADD'
};

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts') && !filePath.endsWith('.js') && !filePath.endsWith('.css') && !filePath.endsWith('.md')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  for (const [oldColor, newColor] of Object.entries(replacements)) {
    const regex = new RegExp(oldColor, 'g'); // exact case first, added lowercase variants to dict
    if (regex.test(content)) {
      content = content.replace(regex, newColor);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', filePath);
  }
}

walkDir('./frontend/app', processFile);
walkDir('./frontend/components', processFile);
walkDir('./frontend/data', processFile);
processFile('./frontend/tailwind.config.ts');
processFile('./frontend/app/globals.css');
processFile('./BRAND.md');
