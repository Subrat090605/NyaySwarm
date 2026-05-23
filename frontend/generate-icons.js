// generate-icons.js
// Run this with Node.js to generate PWA icons from an SVG
// Place in nyayswarm/frontend/ and run: node generate-icons.js

const fs = require("fs");
const path = require("path");

// Create icons directory
const iconsDir = path.join(__dirname, "public", "icons");
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

// SVG icon — the NyaySwarm scale icon
const svgTemplate = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#FF6B1A"/>
  <text x="50%" y="58%" font-size="${size * 0.55}" text-anchor="middle" dominant-baseline="middle" fill="white">⚖</text>
</svg>`;

const sizes = [72, 96, 128, 192, 512];

sizes.forEach(size => {
  const svgContent = svgTemplate(size);
  const filepath = path.join(iconsDir, `icon-${size}.svg`);
  fs.writeFileSync(filepath, svgContent);
  console.log(`Created: icon-${size}.svg`);
});

console.log("\nIcons created as SVG files in public/icons/");
console.log("For production, convert to PNG using: npm install sharp");
console.log("Or use https://realfavicongenerator.net to generate all sizes from one image");
