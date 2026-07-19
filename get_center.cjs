const fs = require('fs');
const jpeg = require('jpeg-js');

const jpegData = fs.readFileSync('frame.jpg');
const rawImageData = jpeg.decode(jpegData, {useTArray: true});

const width = rawImageData.width;
const height = rawImageData.height;
console.log(`Image size: ${width}x${height}`);

// print a grid
const cols = 80;
const rows = 45;

for (let y = 0; y < rows; y++) {
    let line = "";
    for (let x = 0; x < cols; x++) {
        const origX = Math.floor(x * width / cols);
        const origY = Math.floor(y * height / rows);
        const idx = (origY * width + origX) * 4;
        const r = rawImageData.data[idx];
        const g = rawImageData.data[idx + 1];
        const b = rawImageData.data[idx + 2];
        
        // nokia green is roughly #b0c96c -> R:176, G:201, B:108
        // Let's just find pixels where G > R and G > B by a margin
        if (g > r && g > b + 30 && r > 100) {
            line += "O";
        } else {
            line += ".";
        }
    }
    console.log(y.toString().padStart(2, '0') + " " + line);
}
