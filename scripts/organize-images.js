#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Production-grade image organization script
const imageMapping = {
  // Hero Images
  'hero': {
    'hero-home.jpg': 'hero-home-main.jpg',
    'hero-about.jpg': 'hero-about-main.jpg',
    'Imghero.jpg': 'hero-home-alt.jpg',
    'BG1.png': 'hero-bg-primary.png',
    'BG2.png': 'hero-bg-secondary.png'
  },

  // Background Images
  'backgrounds': {
    'background2.jpg': 'bg-section-1.jpg',
    'background3.jpg': 'bg-section-2.jpg',
    'background4.jpg': 'bg-section-3.jpg',
    'background5.jpg': 'bg-section-4.jpg',
    'background6.jpg': 'bg-section-5.jpg',
    'background8.jpg': 'bg-section-6.jpg',
    'background9.jpg': 'bg-section-7.jpg',
    'background10.jpg': 'bg-section-8.jpg',
    'background11.jpg': 'bg-section-9.jpg',
    'background12.jpg': 'bg-section-10.jpg',
    'background13.jpg': 'bg-section-11.jpg',
    'background14.jpg': 'bg-section-12.jpg',
    'background15.jpg': 'bg-section-13.jpg',
    'backgroundinfoabout.jpg': 'bg-about-main.jpg',
    'backgroundinfoabout2.jpg': 'bg-about-secondary.jpg',
    'bg3.jpg': 'bg-overlay-1.jpg',
    'bg4.jpg': 'bg-overlay-2.jpg',
    'footerBG.png': 'bg-footer.png'
  },

  // Bridal Images
  'services/bridal': {
    'bg-bride.jpg': 'bridal-main-1.jpg',
    'bg-bride2.jpg': 'bridal-main-2.jpg',
    'bg-bride3.png': 'bridal-main-3.png',
    'bg-bride4.jpg': 'bridal-main-4.jpg',
    'bg-bride5.jpg': 'bridal-main-5.jpg',
    'bg-bride6.jpg': 'bridal-main-6.jpg',
    'bg-bride7.jpg': 'bridal-main-7.jpg',
    'bride.jpg': 'bridal-portrait-1.jpg',
    'bride3.jpg': 'bridal-portrait-2.jpg',
    'brides.jpg': 'bridal-group-1.jpg',
    'brides2.jpg': 'bridal-group-2.jpg'
  },

  // Makeup Images
  'services/makeup': {
    'makeup.jpg': 'makeup-main.jpg',
    'mua.jpg': 'makeup-artist.jpg',
    'Glamour.jpg': 'makeup-glamour.jpg',
    'glam (5).jpg': 'makeup-glamour-alt.jpg'
  },

  // Hair Images
  'services/hair': {
    'hair.jpg': 'hair-main.jpg',
    'hairstyle.jpg': 'hair-style-1.jpg',
    'hairstyle2.jpg': 'hair-style-2.jpg'
  },

  // Facial Images
  'services/facial': {
    'service1.jpg': 'facial-main.jpg',
    'service2.jpg': 'facial-treatment-1.jpg',
    'service3.jpg': 'facial-treatment-2.jpg',
    'service5.jpg': 'facial-treatment-3.jpg',
    'service6.jpg': 'facial-treatment-4.jpg',
    'service7.jpg': 'facial-treatment-5.jpg'
  },

  // Spa Images
  'services/spa': {
    'spa.jpg': 'spa-main.jpg'
  },

  // Waxing Images
  'services/waxing': {
    'wax (3).jpg': 'waxing-main.jpg'
  },

  // Team Images
  'team': {
    'girl.jpg': 'team-member-1.jpg',
    'girl1.jpg': 'team-member-2.jpg',
    'woman.jpg': 'team-member-3.jpg',
    'woman1.jpg': 'team-member-4.jpg'
  },

  // Product Images
  'products': {
    'kit.jpg': 'product-kit.jpg',
    'lipstic.jpg': 'product-lipstick.jpg',
    'perfume.jpg': 'product-perfume.jpg',
    'routine (1).jpg': 'product-routine-1.jpg',
    'routine (2).jpg': 'product-routine-2.jpg',
    'routine (3).jpg': 'product-routine-3.jpg',
    'IMAGE-Skincare-Collections.jpg': 'product-skincare-collection.jpg'
  },

  // Testimonial Images
  'testimonials': {
    'card1.jpg': 'testimonial-1.jpg',
    'card2.jpg': 'testimonial-2.jpg',
    'card3.jpg': 'testimonial-3.jpg',
    'card4.jpg': 'testimonial-4.jpg',
    'card5.jpg': 'testimonial-5.jpg',
    'card6.jpg': 'testimonial-6.jpg',
    'imgcard (1).jpg': 'testimonial-card-1.jpg',
    'imgcard (2).jpg': 'testimonial-card-2.jpg',
    'imgcard (3).jpg': 'testimonial-card-3.jpg'
  },

  // Logo Images
  'logos': {
    'logobeauty (1).png': 'logo-primary.png',
    'logobeauty (2).png': 'logo-secondary.png',
    'MENU.png': 'logo-menu.png'
  },

  // UI Elements
  'ui': {
    'Ellipse.png': 'ui-avatar-default.png',
    'Ellipse (1).png': 'ui-avatar-1.png',
    'Ellipse (2).png': 'ui-avatar-2.png',
    'Ellipse (3).png': 'ui-avatar-3.png',
    'Ellipse (4).png': 'ui-avatar-4.png',
    'Ellipse (5).png': 'ui-avatar-5.png',
    'Ellipse (6).png': 'ui-avatar-6.png',
    'Ellipse (7).png': 'ui-avatar-7.png'
  },

  // Miscellaneous
  'misc': {
    'img3.jpg': 'misc-image-1.jpg',
    'image11.jpg': 'misc-image-2.jpg',
    'image2.jpg': 'misc-image-3.jpg',
    'img1.webp': 'misc-image-4.webp',
    'makeover.jpg': 'misc-makeover.jpg',
    'off1.jpg': 'misc-offer-1.jpg',
    'off2.jpg': 'misc-offer-2.jpg',
    'off3.jpg': 'misc-offer-3.jpg',
    'off4.jpg': 'misc-offer-4.jpg',
    'off5.jpg': 'misc-offer-5.jpg',
    'infoPeople.png': 'misc-info-people.png'
  }
};

// Function to organize images
function organizeImages() {
  console.log('🚀 Starting image organization...\n');

  const publicDir = path.join(__dirname, '../public');
  const assetsDir = path.join(__dirname, '../src/assets');
  const imagesDir = path.join(__dirname, '../src/assets/images');

  // Create directories if they don't exist
  Object.keys(imageMapping).forEach(category => {
    const categoryPath = path.join(imagesDir, category);
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
    }
  });

  let movedCount = 0;
  let skippedCount = 0;

  // Process each category
  Object.entries(imageMapping).forEach(([category, files]) => {
    console.log(`📁 Processing category: ${category}`);
    
    Object.entries(files).forEach(([oldName, newName]) => {
      const sourcePaths = [
        path.join(publicDir, oldName),
        path.join(assetsDir, oldName)
      ];

      let sourcePath = null;
      for (const path of sourcePaths) {
        if (fs.existsSync(path)) {
          sourcePath = path;
          break;
        }
      }

      if (sourcePath) {
        const destPath = path.join(imagesDir, category, newName);
        
        try {
          fs.copyFileSync(sourcePath, destPath);
          console.log(`  ✅ ${oldName} → ${newName}`);
          movedCount++;
        } catch (error) {
          console.log(`  ❌ Error copying ${oldName}: ${error.message}`);
        }
      } else {
        console.log(`  ⚠️  Skipped: ${oldName} (not found)`);
        skippedCount++;
      }
    });
  });

  console.log(`\n📊 Summary:`);
  console.log(`  ✅ Moved: ${movedCount} images`);
  console.log(`  ⚠️  Skipped: ${skippedCount} images`);
  console.log(`\n🎉 Image organization complete!`);
}

// Run the script
organizeImages(); 