const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Read the base SVG
const logoSvgPath = path.join(__dirname, 'src/assets/athos-logo.svg');
const logoSvgContent = fs.readFileSync(logoSvgPath, 'utf-8');

// Create bright blue version (#00AEEF - works well on both light and dark)
const blueSvg = logoSvgContent.replace('fill: #fff;', 'fill: #00AEEF;');

// Create "on" version with bottom-right brick in coral color
// The second path in the SVG is the bottom-right brick
function createOnVersion(svgContent) {
  // Add a second class for the coral brick
  const withCoralClass = svgContent.replace(
    '</style>',
    `  .cls-2 {
        fill: #FF6B35;
      }
    </style>`
  );
  
  // Change the second path (bottom-right brick) to use cls-2
  return withCoralClass.replace(
    '<path class="cls-1" d="M40,34.79c0,2.87-2.1,5.2-4.7,5.2h-10.42c-3.66,0-5.9-4.42-4.02-7.9l4.37-8.11c.86-1.57,2.37-2.53,4.02-2.53h6.03c2.59,0,4.7,2.34,4.7,5.2l.02,8.14Z"/>',
    '<path class="cls-2" d="M40,34.79c0,2.87-2.1,5.2-4.7,5.2h-10.42c-3.66,0-5.9-4.42-4.02-7.9l4.37-8.11c.86-1.57,2.37-2.53,4.02-2.53h6.03c2.59,0,4.7,2.34,4.7,5.2l.02,8.14Z"/>'
  );
}

const blueSvgOn = createOnVersion(blueSvg);

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'src/assets/icons');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Convert icons with bright blue color
async function convertIcons() {
  try {
    // Bright blue icons (off state)
    await sharp(Buffer.from(blueSvg))
      .resize(48, 48)
      .png()
      .toFile(path.join(outputDir, 'athos-icon-48.png'));
    
    await sharp(Buffer.from(blueSvg))
      .resize(128, 128)
      .png()
      .toFile(path.join(outputDir, 'athos-icon-128.png'));
    
    // Bright blue icons with coral brick (on state)
    await sharp(Buffer.from(blueSvgOn))
      .resize(48, 48)
      .png()
      .toFile(path.join(outputDir, 'athos-icon-on-48.png'));
    
    await sharp(Buffer.from(blueSvgOn))
      .resize(128, 128)
      .png()
      .toFile(path.join(outputDir, 'athos-icon-on-128.png'));
    
    console.log('✓ Icons converted successfully!');
    console.log('  Bright blue (#00AEEF) icons:');
    console.log('    - athos-icon-48.png');
    console.log('    - athos-icon-128.png');
    console.log('    - athos-icon-on-48.png (with coral brick)');
    console.log('    - athos-icon-on-128.png (with coral brick)');
  } catch (error) {
    console.error('Error converting icons:', error);
    process.exit(1);
  }
}

convertIcons();
