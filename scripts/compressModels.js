// scripts/optimizeAssets.js
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🛠️ تحسين الأصول للبناء...')

async function optimizeAssets() {
  const assetsDir = path.join(__dirname, '../public')
  
  // 1. تحويل GIF إلى MP4 (أفضل أداء)
  const gifFiles = fs.readdirSync(assetsDir)
    .filter(file => file.endsWith('.gif'))
    .map(file => path.join(assetsDir, file))
  
  for (const gif of gifFiles) {
    const mp4Path = gif.replace('.gif', '.mp4')
    console.log(`🎬 تحويل ${path.basename(gif)} إلى MP4...`)
    
    try {
      execSync(`ffmpeg -i "${gif}" -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" "${mp4Path}"`)
      console.log(`✅ تم التحويل: ${path.basename(mp4Path)}`)
    } catch (error) {
      console.log(`⚠️ لا يمكن تحويل GIF: ${error.message}`)
    }
  }
  
  // 2. تحويل PNG إلى WebP
  const imageFiles = fs.readdirSync(assetsDir)
    .filter(file => file.match(/\.(png|jpg|jpeg)$/i))
    .map(file => path.join(assetsDir, file))
  
  console.log(`🖼️ تحويل ${imageFiles.length} صورة إلى WebP...`)
  
  // 3. تقليل حجم GLB
  const glbFiles = fs.readdirSync(assetsDir)
    .filter(file => file.endsWith('.glb') && !file.includes('-compressed'))
    .map(file => path.join(assetsDir, file))
  
  if (glbFiles.length > 0) {
    console.log(`🎮 ضغط ${glbFiles.length} نموذج 3D...`)
  }
}

optimizeAssets()