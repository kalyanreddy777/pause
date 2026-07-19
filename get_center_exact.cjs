const fs = require('fs');
const jpeg = require('jpeg-js');

const jpegData = fs.readFileSync('frame.jpg');
const rawImageData = jpeg.decode(jpegData, {useTArray: true});

const width = rawImageData.width;
const height = rawImageData.height;

let minX = width, maxX = 0, minY = height, maxY = 0;
let count = 0;

for (let y = Math.floor(height/2); y < height; y++) {
    for (let x = Math.floor(width/3); x < Math.floor(width*2/3); x++) {
        const idx = (y * width + x) * 4;
        const r = rawImageData.data[idx];
        const g = rawImageData.data[idx + 1];
        const b = rawImageData.data[idx + 2];
        
        if (g > r && g > b + 30 && r > 100) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            count++;
        }
    }
}

console.log(`Green screen bounds: X:${minX}-${maxX}, Y:${minY}-${maxY}`);
const cx = (minX + maxX) / 2;
const cy = (minY + maxY) / 2;
console.log(`Center: ${cx}, ${cy}`);
console.log(`Left %: ${(cx / width * 100).toFixed(2)}%`);
console.log(`Top %: ${(cy / height * 100).toFixed(2)}%`);
console.log(`Bottom %: ${((height - cy) / height * 100).toFixed(2)}%`);

