#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of images that were successfully organized and can be safely removed
const imagesToRemove = [
  // Hero Images
  'hero-home.jpg',
  'hero-about.jpg',
  'Imghero.jpg',
  'BG1.png',
  'BG2.png',
  
  // Background Images
  'background2.jpg',
  'background3.jpg',
  'background4.jpg',
  'background5.jpg',
  'background6.jpg',
  'background8.jpg',
  'background9.jpg',
  'background10.jpg',
  'background11.jpg',
  'background12.jpg',
  'background13.jpg',
  'background14.jpg',
  'backgroundinfoabout.jpg',
  'backgroundinfoabout2.jpg',
  'bg3.jpg',
  'bg4.jpg',
  'footerBG.png',
  
  // Bridal Images
  'bg-bride.jpg',
  'bg-bride2.jpg',
  'bg-bride3.png',
  'bg-bride4.jpg',
  'bg-bride5.jpg',
  'bg-bride6.jpg',
  'bg-bride7.jpg',
  
  // Makeup Images
  'makeup.jpg',
  'mua.jpg',
  'Glamour.jpg',
  
  // Hair Images
  'hairstyle.jpg',
  'hairstyle2.jpg',
  
  // Facial Images
  'service1.jpg',
  'service2.jpg',
  'service3.jpg',
  'service5.jpg',
  'service6.jpg',
  'service7.jpg',
  
  // Spa Images
  'spa.jpg',
  
  // Waxing Images
  'wax (3).jpg',
  
  // Team Images
  'girl.jpg',
  'girl1.jpg',
  'woman.jpg',
  'woman1.jpg',
  
  // Product Images
  'kit.jpg',
  'lipstic.jpg',
  'perfume.jpg',
  'routine (1).jpg',
  'routine (2).jpg',
  'routine (3).jpg',
  'IMAGE-Skincare-Collections.jpg',
  
  // Testimonial Images
  'card1.jpg',
  'card2.jpg',
  'card3.jpg',
  'card4.jpg',
  'card5.jpg',
  'card6.jpg',
  'imgcard (1).jpg',
  'imgcard (2).jpg',
  'imgcard (3).jpg',
  
  // Logo Images
  'logobeauty (1).png',
  'logobeauty (2).png',
  'MENU.png',
  
  // UI Elements
  'Ellipse.png',
  'Ellipse (1).png',
  'Ellipse (2).png',
  'Ellipse (3).png',
  'Ellipse (4).png',
  'Ellipse (5).png',
  'Ellipse (6).png',
  'Ellipse (7).png',
  
  // Miscellaneous
  'img3.jpg',
  'image11.jpg',
  'image2.jpg',
  'img1.webp',
  'makeover.jpg',
  'off1.jpg',
  'off2.jpg',
  'off3.jpg',
  'off4.jpg',
  'off5.jpg',
  'infoPeople.png'
];

// Function to cleanup old images
function cleanupOldImages() {
  console.log('🧹 Starting cleanup of old images...\n');

  const publicDir = path.join(__dirname, '../public');
  const assetsDir = path.join(__dirname, '../src/assets');
  
  let removedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  // Process each image
  imagesToRemove.forEach(imageName => {
    const publicPath = path.join(publicDir, imageName);
    const assetsPath = path.join(assetsDir, imageName);
    
    // Check if file exists in public folder
    if (fs.existsSync(publicPath)) {
      try {
        fs.unlinkSync(publicPath);
        console.log(`  ✅ Removed: ${imageName} (from public)`);
        removedCount++;
      } catch (error) {
        console.log(`  ❌ Error removing ${imageName}: ${error.message}`);
        errorCount++;
      }
    } else if (fs.existsSync(assetsPath)) {
      try {
        fs.unlinkSync(assetsPath);
        console.log(`  ✅ Removed: ${imageName} (from assets)`);
        removedCount++;
      } catch (error) {
        console.log(`  ❌ Error removing ${imageName}: ${error.message}`);
        errorCount++;
      }
    } else {
      console.log(`  ⚠️  Skipped: ${imageName} (not found)`);
      skippedCount++;
    }
  });

  // Remove .DS_Store files if they exist
  const dsStorePaths = [
    path.join(publicDir, '.DS_Store'),
    path.join(assetsDir, '.DS_Store')
  ];

  dsStorePaths.forEach(dsPath => {
    if (fs.existsSync(dsPath)) {
      try {
        fs.unlinkSync(dsPath);
        console.log(`  ✅ Removed: .DS_Store`);
      } catch (error) {
        console.log(`  ❌ Error removing .DS_Store: ${error.message}`);
      }
    }
  });

  console.log(`\n📊 Cleanup Summary:`);
  console.log(`  ✅ Removed: ${removedCount} old images`);
  console.log(`  ⚠️  Skipped: ${skippedCount} images (not found)`);
  console.log(`  ❌ Errors: ${errorCount} files`);
  console.log(`\n🎉 Cleanup complete!`);
  console.log(`\n💡 Note: All images are now organized in src/assets/images/`);
  console.log(`   Use the new import system: import { heroImages } from '../utils/imageImports'`);
}

// Run the script
cleanupOldImages(); 