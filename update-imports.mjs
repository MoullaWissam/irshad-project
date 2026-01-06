import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// الحصول على __dirname في ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateImportsInDirectory(dirPath) {
  try {
    const files = await fs.readdir(dirPath);
    
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const fileStat = await fs.stat(fullPath);
      
      if (fileStat.isDirectory()) {
        await updateImportsInDirectory(fullPath);
      } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx')) {
        await updateFileImports(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error);
  }
}

async function updateFileImports(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    
    // تحديث استيرادات .js إلى .jsx
    const updatedContent = content.replace(
      /from\s+['"](\.\/[^'"]*|\.\.\/[^'"]*)\.js(['"])/g,
      'from "$1.jsx$2'
    );
    
    // تحديث استيرادات بدون امتداد (إذا كان الملف أصبح .jsx)
    const finalContent = updatedContent.replace(
      /from\s+['"](\.\/[^'"]*|\.\.\/[^'"]*)(?!\.(js|jsx|ts|tsx|css|scss|json|png|jpg|jpeg|gif|svg|ico))(['"])/g,
      (match, p1, p2) => {
        // تحقق مما إذا كان الملف المقصود أصبح .jsx
        const importPath = path.join(path.dirname(filePath), p1);
        
        // تحقق من وجود الملف كـ .jsx
        try {
          if (fs.existsSync(importPath + '.jsx')) {
            return `from "${p1}.jsx${p2}`;
          }
        } catch (e) {}
        
        // تحقق من وجود الملف كـ .js
        try {
          if (fs.existsSync(importPath + '.js')) {
            return `from "${p1}.js${p2}`;
          }
        } catch (e) {}
        
        return match;
      }
    );
    
    if (content !== finalContent) {
      await fs.writeFile(filePath, finalContent, 'utf8');
      console.log(`✓ Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating file ${filePath}:`, error);
  }
}

// تشغيل السكريبت
async function main() {
  console.log('Updating imports...');
  await updateImportsInDirectory(path.join(__dirname, 'src'));
  console.log('✅ All imports updated successfully!');
}

main();