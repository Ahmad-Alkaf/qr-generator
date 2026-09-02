// Regenerates every logo asset from MARK_PATH in src/lib/brand.ts.
// Run: npm run icons
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const brand = readFileSync(resolve(root, "src/lib/brand.ts"), "utf8");

const color = brand.match(/BRAND_ORANGE\s*=\s*"([^"]+)"/)[1];
const viewBox = brand.match(/MARK_VIEWBOX\s*=\s*"([^"]+)"/)[1];
const path = [...brand.matchAll(/^\s*"([^"]+)",\s*$/gm)]
  .map((m) => m[1])
  .filter((s) => /^M/.test(s))
  .join(" ");

function svg(fill, { pad = 0 } = {}) {
  const [, , w, h] = viewBox.split(" ").map(Number);
  const box = `${-pad} ${-pad} ${w + pad * 2} ${h + pad * 2}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}"><path fill="${fill}" fill-rule="evenodd" d="${path}"/></svg>\n`;
}

const logoDir = resolve(root, "public/logo");
mkdirSync(logoDir, { recursive: true });

// Vector marks
writeFileSync(resolve(logoDir, "symbol.svg"), svg("#ffffff"));
writeFileSync(resolve(logoDir, "symbol-colored.svg"), svg(color));

// PNG icon set: orange mark on a transparent ground with a small margin.
const iconSvg = Buffer.from(svg(color, { pad: 4 }));
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
for (const size of sizes) {
  await sharp(iconSvg).resize(size, size).png().toFile(resolve(logoDir, `icon-${size}.png`));
}

// favicon.ico with 16, 32, and 48 px PNG frames.
const frames = [];
for (const size of [16, 32, 48]) {
  frames.push({ size, png: await sharp(iconSvg).resize(size, size).png().toBuffer() });
}
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);
let offset = 6 + 16 * frames.length;
const entries = [];
for (const { size, png } of frames) {
  const e = Buffer.alloc(16);
  e.writeUInt8(size >= 256 ? 0 : size, 0);
  e.writeUInt8(size >= 256 ? 0 : size, 1);
  e.writeUInt8(0, 2);
  e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(png.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += png.length;
  entries.push(e);
}
const ico = Buffer.concat([header, ...entries, ...frames.map((f) => f.png)]);
writeFileSync(resolve(root, "src/app/favicon.ico"), ico);
writeFileSync(resolve(logoDir, "favicon.ico"), ico);

// Copy used by the KafLabs product card (sibling repository), if present.
try {
  const kaflabs = resolve(root, "../kaflabs/qr-anvil-icon.png");
  await sharp(iconSvg).resize(192, 192).png().toFile(kaflabs);
  console.log("wrote", kaflabs);
} catch {
  // kaflabs folder not present; skip
}

console.log(`Icons written from MARK_PATH (${sizes.length} PNG sizes, 2 SVG, favicon.ico).`);
