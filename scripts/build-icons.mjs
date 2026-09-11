/**
 * Rasterise brand/hc-mark.svg into the app icons.
 *
 *   node scripts/build-icons.mjs
 *
 * Run by hand; the PNGs are committed. The SVG is the source of truth — edit
 * that, re-run this, never touch the PNGs directly.
 *
 * Three outputs, because three platforms want different things:
 *   app/icon.png            512 RGBA — the browser tab, via Next's file
 *                                      convention for app/icon.png
 *   app/apple-icon.png      180 RGB  — iOS composites non-alpha icons onto its
 *                                      own mask, so the alpha is flattened
 *                                      onto the navy rather than left clear
 *   public/icon-192.png     192 RGBA — Android's launcher size
 *   public/icon-maskable.png 512 RGBA
 *
 * The last two live in public/ rather than app/ deliberately: Next's icon
 * convention matches `icon.png`, `icon1.png` and so on, NOT `icon-192.png`,
 * so a hyphenated name in app/ gets no route and the manifest would point at
 * a 404. public/ serves any filename at its own path.
 *
 * Plus a maskable variant. Android applies its own mask over whatever it is
 * given, so an icon that already has its own rounded corners gets rounded
 * twice — visibly. The maskable version pads the artwork into the middle 80%
 * safe area on a full-bleed square, which is what the spec asks for.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const svg = await readFile(path.join(root, "brand/hc-mark.svg"));

/** The plate colour, for flattening and for the maskable bleed. */
const GROUND = { r: 0x0a, g: 0x19, b: 0x2f };

const png = (size) => sharp(svg).resize(size, size).png({ compressionLevel: 9 });

await png(512).toFile(path.join(root, "app/icon.png"));
await png(192).toFile(path.join(root, "public/icon-192.png"));

/* iOS: no alpha. Flattened onto the same navy the artwork already sits on, so
   the corners iOS masks away were never a different colour anyway. */
await png(180).flatten({ background: GROUND }).toFile(path.join(root, "app/apple-icon.png"));

/* Maskable: the artwork at 80%, centred on a full-bleed square of the same
   navy. Android can then crop to a circle, a squircle or a teardrop and never
   clip a letter. */
const inner = Math.round(512 * 0.8);
const art = await sharp(svg).resize(inner, inner).png().toBuffer();
await sharp({
  create: { width: 512, height: 512, channels: 4, background: { ...GROUND, alpha: 1 } },
})
  .composite([{ input: art, gravity: "centre" }])
  .png({ compressionLevel: 9 })
  .toFile(path.join(root, "public/icon-maskable.png"));

console.log("app/icon.png 512 · app/apple-icon.png 180 · public/icon-192.png · public/icon-maskable.png");
