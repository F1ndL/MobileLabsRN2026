const fs = require('fs');
const path = require('path');

const expoDir = path.join(process.cwd(), '.expo');

if (fs.existsSync(expoDir)) {
  fs.rmSync(expoDir, { recursive: true, force: true });
}

console.log('Project cache was reset. Source files were kept for Lab 5.');
