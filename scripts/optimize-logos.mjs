import sharp from 'sharp';
import { readdir, stat, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Biggest on-page box is the landing industry row (150x60 CSS px); 440x180
// covers that at ~3x DPR. Everything here is a client logo, never a hero image.
const DIR = 'public/landing/logos';
const MAX_W = 440, MAX_H = 180;

let before = 0, after = 0;
for (const file of (await readdir(DIR)).sort()) {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.svg') continue;                     // vectors are already small
  const p = path.join(DIR, file);
  // Read to a buffer first: sharp keeps the source file open, and Windows then
  // refuses the write-back to the same path.
  const src = await readFile(p);
  const size0 = src.length;
  const img = sharp(src, { failOn: 'none' });
  const meta = await img.metadata();
  const pipe = img.resize({
    width: Math.min(meta.width ?? MAX_W, MAX_W),
    height: Math.min(meta.height ?? MAX_H, MAX_H),
    fit: 'inside',
    withoutEnlargement: true,
  });
  const out =
    ext === '.png'  ? await pipe.png({ palette: true, quality: 82, effort: 9 }).toBuffer() :
    ext === '.webp' ? await pipe.webp({ quality: 82 }).toBuffer() :
                      await pipe.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  if (out.length < size0) await writeFile(p, out);
  const size1 = (await stat(p)).size;
  before += size0; after += size1;
  if (size0 > 150_000) console.log(`${file.padEnd(46)} ${(size0/1024).toFixed(0).padStart(5)}KB -> ${(size1/1024).toFixed(0).padStart(4)}KB   was ${meta.width}x${meta.height}`);
}
console.log(`\nrasters: ${(before/1048576).toFixed(2)}MB -> ${(after/1048576).toFixed(2)}MB`);
