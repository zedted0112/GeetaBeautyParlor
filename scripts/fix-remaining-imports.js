#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapping of old asset paths to new import structure
const assetMapping = {
  // Testimonial Images
  '../../assets/card1.jpg': "import { testimonialImages } from '../../utils/imageImports';\nconst card1 = testimonialImages.testimonial1;",
  '../../assets/card2.jpg': "import { testimonialImages } from '../../utils/imageImports';\nconst card3 = testimonialImages.testimonial2;",
  '../../assets/card3.jpg': "import { testimonialImages } from '../../utils/imageImports';\nconst card6 = testimonialImages.testimonial3;",
  '../../assets/card4.jpg': "import { testimonialImages } from '../../utils/imageImports';\nconst card7 = testimonialImages.testimonial4;",
  '../../assets/card5.jpg': "import { testimonialImages } from '../../utils/imageImports';\nconst card8 = testimonialImages.testimonial5;",
  '../../assets/card6.jpg': "import { testimonialImages } from '../../utils/imageImports';\nconst card9 = testimonialImages.testimonial6;",
  
  // UI Elements
  '../../assets/Ellipse.png': "import { uiImages } from '../../utils/imageImports';\nconst peop1 = uiImages.avatarDefault;",
  '../../assets/Ellipse (1).png': "import { uiImages } from '../../utils/imageImports';\nconst peop3 = uiImages.avatar1;",
  '../../assets/Ellipse (4).png': "import { uiImages } from '../../utils/imageImports';\nconst peop6 = uiImages.avatar4;",
  '../../assets/Ellipse (5).png': "import { uiImages } from '../../utils/imageImports';\nconst peop7 = uiImages.avatar5;",
  '../../assets/Ellipse (6).png': "import { uiImages } from '../../utils/imageImports';\nconst peop8 = uiImages.avatar6;",
  '../../assets/Ellipse (7).png': "import { uiImages } from '../../utils/imageImports';\nconst peop9 = uiImages.avatar7;",
  
  // Product Images
  '../../assets/routine (1).jpg': "import { productImages } from '../../utils/imageImports';\nconst image1 = productImages.routine1;",
  '../../assets/routine (2).jpg': "import { productImages } from '../../utils/imageImports';\nconst image2 = productImages.routine2;",
  '../../assets/lipstic.jpg': "import { productImages } from '../../utils/imageImports';\nconst blog3 = productImages.lipstick;",
  
  // Testimonial Cards
  '../../assets/imgcard (1).jpg': "import { testimonialImages } from '../../utils/imageImports';\nconst blog2 = testimonialImages.card1;",
  '../../assets/imgcard (2).jpg': "import { testimonialImages } from '../../utils/imageImports';\nconst blog1 = testimonialImages.card2;",
  '../../assets/imgcard (3).jpg': "import { testimonialImages } from '../../utils/imageImports';\nconst blog4 = testimonialImages.card3;",
  
  // Service Images
  '../../assets/makeup.jpg': "import { serviceImages } from '../../utils/imageImports';\nconst region1 = serviceImages.makeup.main;",
  '../../assets/bride3.jpg': "import { serviceImages } from '../../utils/imageImports';\nconst region3 = serviceImages.bridal.portrait2;",
  '../../assets/mua.jpg': "import { serviceImages } from '../../utils/imageImports';\nconst profile = serviceImages.makeup.artist;",
  
  // Background Images
  '../../assets/background15.jpg': "import { backgroundImages } from '../../utils/imageImports';\nconst region2 = backgroundImages.section13;",
  
  // Contact Images
  '../../assets/mua.jpg': "import { serviceImages } from '../../utils/imageImports';\nconst ImageContact = serviceImages.makeup.artist;"
};

// Components that need fixing
const componentsToFix = [
  'src/components/Blog/BlogInfo.jsx',
  'src/components/Blog/BlogDetails.jsx',
  'src/components/Blog/RelatedPost.jsx',
  'src/components/Home/Region.jsx',
  'src/components/PropertiesPage/Details.jsx',
  'src/components/Contacts/ContactForm.jsx'
];

function fixRemainingImports() {
  console.log('🔧 Fixing remaining asset imports...\n');

  let updatedCount = 0;
  let errorCount = 0;

  componentsToFix.forEach(componentPath => {
    const fullPath = path.join(__dirname, '..', componentPath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`  ⚠️  Skipped: ${componentPath} (not found)`);
      return;
    }

    try {
      let content = fs.readFileSync(fullPath, 'utf8');
      let hasChanges = false;

      // Replace old asset imports with new ones
      Object.entries(assetMapping).forEach(([oldPath, newImport]) => {
        const oldImportPattern = new RegExp(`import\\s+\\w+\\s+from\\s+["']${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'];?\\s*`, 'g');
        
        if (oldImportPattern.test(content)) {
          content = content.replace(oldImportPattern, newImport);
          hasChanges = true;
          console.log(`  ✅ Fixed: ${componentPath} - ${oldPath}`);
        }
      });

      // Fix specific issues in Region.jsx
      if (componentPath === 'src/components/Home/Region.jsx') {
        // Fix the duplicate heroImage assignment
        content = content.replace(
          /const heroImage = heroImage = heroImages\.bgSecondary;/,
          'const heroImage = heroImages.bgSecondary;'
        );
        hasChanges = true;
        console.log(`  ✅ Fixed: ${componentPath} - duplicate heroImage assignment`);
      }

      if (hasChanges) {
        fs.writeFileSync(fullPath, content);
        updatedCount++;
      } else {
        console.log(`  ℹ️  No changes needed: ${componentPath}`);
      }

    } catch (error) {
      console.log(`  ❌ Error fixing ${componentPath}: ${error.message}`);
      errorCount++;
    }
  });

  console.log(`\n📊 Fix Summary:`);
  console.log(`  ✅ Fixed: ${updatedCount} components`);
  console.log(`  ❌ Errors: ${errorCount} files`);
  console.log(`\n🎉 Remaining import fixes complete!`);
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Test the build: npm run build`);
  console.log(`   2. Check for any remaining issues`);
  console.log(`   3. Verify all images load correctly`);
}

// Run the script
fixRemainingImports(); 