// scripts/compressModels.js
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function compressGLB(inputPath, outputPath) {
  console.log(`🔧 Starting compression for: ${path.basename(inputPath)}`);
  
  try {
    const command = `npx gltf-pipeline -i "${inputPath}" -o "${outputPath}" --draco.compressionLevel=7`;
    await execAsync(command);
    
    // حساب نسبة الضغط
    const originalSize = fs.statSync(inputPath).size;
    const compressedSize = fs.statSync(outputPath).size;
    const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);
    
    console.log(`✅ Successfully compressed!`);
    console.log(`📊 Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📊 Compressed: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📊 Reduction: ${reduction}%`);
    
  } catch (error) {
    console.error(`❌ Compression failed: ${error.message}`);
  }
}

async function main() {
  console.log('🚀 Starting model compression process...\n');
  
  const modelsDir = path.join(__dirname, '..', 'public', 'models');
  
  // التأكد من وجود المجلد
  if (!fs.existsSync(modelsDir)) {
    console.log('📁 Creating models directory...');
    fs.mkdirSync(modelsDir, { recursive: true });
    console.log('✅ Please place your .glb files in public/models/ folder');
    return;
  }
  
  // البحث عن ملفات GLB
  const files = fs.readdirSync(modelsDir);
  const glbFiles = files.filter(file => file.endsWith('.glb'));
  
  if (glbFiles.length === 0) {
    console.log('ℹ️ No GLB files found in public/models/');
    console.log('📁 Please add your .glb files to this folder');
    return;
  }
  
  console.log(`📁 Found ${glbFiles.length} GLB file(s):`);
  glbFiles.forEach(file => console.log(`   - ${file}`));
  console.log('');
  
  // ضغط كل ملف
  for (const file of glbFiles) {
    if (file.includes('-compressed')) continue;
    
    const inputPath = path.join(modelsDir, file);
    const outputName = file.replace('.glb', '-compressed.glb');
    const outputPath = path.join(modelsDir, outputName);
    
    await compressGLB(inputPath, outputPath);
    console.log('---\n');
  }
  
  console.log('🎉 All models compressed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Update your BotAvatar.js to use the compressed file:');
  console.log('   Change: "/models/Murshed.glb"');
  console.log('   To:     "/models/Murshed-compressed.glb"');
}

main().catch(console.error);