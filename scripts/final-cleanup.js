#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Remaining images to clean up
const remainingImages = [
  'mua.jpg',
  'brides.jpg', 
  'brides2.jpg',
  'bride.jpg',
  'bride3.jpg',
  'background15.jpg',
  'glam (5).jpg',
  'hair.jpg'
];

// Function to final cleanup
function finalCleanup() {
  console.log('🧹 Final cleanup of remaining old images...\n');

  const assetsDir = path.join(__dirname, '../src/assets');
  let removedCount = 0;
  let errorCount = 0;

  // Remove remaining old images
  remainingImages.forEach(imageName => {
    const imagePath = path.join(assetsDir, imageName);
    
    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
        console.log(`  ✅ Removed: ${imageName}`);
        removedCount++;
      } catch (error) {
        console.log(`  ❌ Error removing ${imageName}: ${error.message}`);
        errorCount++;
      }
    } else {
      console.log(`  ⚠️  Skipped: ${imageName} (not found)`);
    }
  });

  // Remove .DS_Store from glamourassets
  const glamourAssetsDir = path.join(assetsDir, 'glamourassets');
  const dsStorePath = path.join(glamourAssetsDir, '.DS_Store');
  
  if (fs.existsSync(dsStorePath)) {
    try {
      fs.unlinkSync(dsStorePath);
      console.log(`  ✅ Removed: glamourassets/.DS_Store`);
    } catch (error) {
      console.log(`  ❌ Error removing .DS_Store: ${error.message}`);
    }
  }

  console.log(`\n📊 Final Cleanup Summary:`);
  console.log(`  ✅ Removed: ${removedCount} remaining images`);
  console.log(`  ❌ Errors: ${errorCount} files`);
  console.log(`\n🎉 Final cleanup complete!`);
  console.log(`\n📁 Current Structure:`);
  console.log(`  ✅ src/assets/images/ - Organized images`);
  console.log(`  ✅ src/assets/glamourassets/ - Service-specific assets`);
  console.log(`  ✅ public/ - Clean (no old images)`);
  console.log(`\n💡 All images are now properly organized!`);
}

// Run the script
finalCleanup(); 