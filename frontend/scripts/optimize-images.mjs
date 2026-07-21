// One-off asset optimization: portfolio PNGs and the logo → WebP.
// Run from frontend/: node scripts/optimize-images.mjs
import { readdir, stat, unlink } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const portfolioDir = path.resolve('public/portfolio')

for (const file of await readdir(portfolioDir)) {
  if (!file.endsWith('.png')) continue
  const src = path.join(portfolioDir, file)
  const dest = src.replace(/\.png$/, '.webp')
  const before = (await stat(src)).size
  await sharp(src)
    .resize({ width: 1280, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(dest)
  const after = (await stat(dest)).size
  await unlink(src)
  console.log(`${file}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`)
}

const logoSrc = path.resolve('public/simandev-logo.jpg')
const logoDest = path.resolve('public/simandev-logo.webp')
const logoBefore = (await stat(logoSrc)).size
await sharp(logoSrc)
  .resize({ width: 128, height: 128, fit: 'cover' })
  .webp({ quality: 85 })
  .toFile(logoDest)
const logoAfter = (await stat(logoDest)).size
await unlink(logoSrc)
console.log(`simandev-logo.jpg: ${(logoBefore / 1024).toFixed(0)}KB -> ${(logoAfter / 1024).toFixed(0)}KB`)
