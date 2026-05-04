const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC   = path.join(__dirname, '..', 'public');
const ICONS    = path.join(PUBLIC, 'icons');
const SPLASH   = path.join(PUBLIC, 'splash');

fs.mkdirSync(ICONS,  { recursive: true });
fs.mkdirSync(SPLASH, { recursive: true });

const BG    = '#0D1A1F';
const CREAM = '#f5ead8';

// Glass SVG coords: x 2–30 (w=28), y 4–48 (h=44)
function glassSvg(canvasSize, paddingRatio = 0.18) {
  const usable = canvasSize * (1 - paddingRatio * 2);
  const scale  = usable / 44;
  const tx     = (canvasSize - 28 * scale) / 2 - 2 * scale;
  const ty     = (canvasSize - 44 * scale) / 2 - 4 * scale;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasSize}" height="${canvasSize}" viewBox="0 0 ${canvasSize} ${canvasSize}">
  <rect width="${canvasSize}" height="${canvasSize}" fill="${BG}"/>
  <g transform="translate(${tx.toFixed(2)}, ${ty.toFixed(2)}) scale(${scale.toFixed(4)})"
     stroke="${CREAM}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" fill="none">
    <line x1="2"  y1="4"    x2="30" y2="4"/>
    <line x1="2"  y1="4"    x2="16" y2="30"/>
    <line x1="30" y1="4"    x2="16" y2="30"/>
    <line x1="16" y1="30"   x2="16" y2="41"/>
    <ellipse cx="16" cy="44.5" rx="11" ry="3.5"/>
  </g>
</svg>`;
}

// Maskable icon: glass within the 80% safe zone
function maskableSvg(canvasSize) {
  return glassSvg(canvasSize, 0.12);
}

// Splash screen: brand bg + centred glass icon
async function splashSvg(w, h) {
  const iconSize = Math.round(Math.min(w, h) * 0.28);
  const iconBuf  = await sharp(Buffer.from(glassSvg(iconSize, 0.0)))
    .png()
    .toBuffer();

  return sharp({ create: { width: w, height: h, channels: 4, background: BG } })
    .composite([{
      input: iconBuf,
      gravity: 'center',
    }])
    .png();
}

async function run() {
  // ── App icons ────────────────────────────────────────────────────────────
  const icons = [
    { file: 'icon-512.png',          size: 512, padding: 0.18 },
    { file: 'icon-192.png',          size: 192, padding: 0.18 },
    { file: 'icon-maskable-512.png', size: 512, padding: 0.12, maskable: true },
    { file: 'apple-touch-icon.png',  size: 180, padding: 0.10 },
    { file: 'icon-167.png',          size: 167, padding: 0.10 },
    { file: 'icon-152.png',          size: 152, padding: 0.10 },
    { file: 'icon-120.png',          size: 120, padding: 0.10 },
    { file: 'favicon-32.png',        size: 32,  padding: 0.08 },
  ];

  for (const icon of icons) {
    const { file, size, padding, maskable } = icon;
    const svg = maskable ? maskableSvg(size) : glassSvg(size, padding);
    const dest = file === 'apple-touch-icon.png'
      ? path.join(PUBLIC, file)
      : path.join(ICONS, file);
    await sharp(Buffer.from(svg)).png().toFile(dest);
    console.log(`✓ ${dest.replace(PUBLIC, 'public')}`);
  }

  // ── iOS Splash screens ────────────────────────────────────────────────────
  const splashes = [
    // iPhone
    { w: 640,  h: 1136, name: 'splash-640x1136.png'  }, // SE 1st/2nd
    { w: 750,  h: 1334, name: 'splash-750x1334.png'  }, // 8 / SE 3rd
    { w: 1125, h: 2436, name: 'splash-1125x2436.png' }, // X / XS / 11 Pro
    { w: 828,  h: 1792, name: 'splash-828x1792.png'  }, // XR / 11
    { w: 1242, h: 2688, name: 'splash-1242x2688.png' }, // XS Max / 11 Pro Max
    { w: 1170, h: 2532, name: 'splash-1170x2532.png' }, // 12 / 13 / 14
    { w: 1284, h: 2778, name: 'splash-1284x2778.png' }, // 12 Pro Max / 13 Pro Max / 14 Plus
    { w: 1179, h: 2556, name: 'splash-1179x2556.png' }, // 14 Pro / 15 / 15 Pro
    { w: 1290, h: 2796, name: 'splash-1290x2796.png' }, // 14 Pro Max / 15 Plus / 15 Pro Max
    // iPad
    { w: 1536, h: 2048, name: 'splash-1536x2048.png' }, // iPad / Air / mini @2x
    { w: 1668, h: 2388, name: 'splash-1668x2388.png' }, // iPad Pro 11"
    { w: 2048, h: 2732, name: 'splash-2048x2732.png' }, // iPad Pro 12.9"
  ];

  for (const { w, h, name } of splashes) {
    await (await splashSvg(w, h)).toFile(path.join(SPLASH, name));
    console.log(`✓ public/splash/${name}`);
  }

  console.log('\nAll PWA assets generated.');
}

run().catch(err => { console.error(err); process.exit(1); });
