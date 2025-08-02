#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapping of old image paths to new import structure
const imageMapping = {
  // Hero Images
  '/hero-home.jpg': "import { heroImages } from '../../utils/imageImports';\nconst heroImage = heroImages.homeMain;",
  '/hero-about.jpg': "import { heroImages } from '../../utils/imageImports';\nconst heroImage = heroImages.aboutMain;",
  '/Imghero.jpg': "import { heroImages } from '../../utils/imageImports';\nconst heroImage = heroImages.homeAlt;",
  '/BG1.png': "import { heroImages } from '../../utils/imageImports';\nconst heroImage = heroImages.bgPrimary;",
  '/BG2.png': "import { heroImages } from '../../utils/imageImports';\nconst heroImage = heroImage = heroImages.bgSecondary;",
  
  // Background Images
  '/background2.jpg': "import { backgroundImages } from '../../utils/imageImports';\nconst bgImage = backgroundImages.section1;",
  '/background3.jpg': "import { backgroundImages } from '../../utils/imageImports';\nconst bgImage = backgroundImages.section2;",
  '/background4.jpg': "import { backgroundImages } from '../../utils/imageImports';\nconst bgImage = backgroundImages.section3;",
  '/background5.jpg': "import { backgroundImages } from '../../utils/imageImports';\nconst bgImage = backgroundImages.section4;",
  '/background6.jpg': "import { backgroundImages } from '../../utils/imageImports';\nconst bgImage = backgroundImages.section5;",
  '/background8.jpg': "import { backgroundImages } from '../../utils/imageImports';\nconst bgImage = backgroundImages.section6;",
  '/background9.jpg': "import { backgroundImages } from '../../utils/imageImports';\nconst bgImage = backgroundImages.section7;",
  '/background10.jpg': "import { backgroundImages } from '../../utils/imageImports';\nconst bgImage = backgroundImages.section8;",
  '/background11.jpg': "import { backgroundImages } from '../../utils/imageImports';\nconst bgImage = backgroundImages.section9;",
  '/background12.jpg': "import { backgroundImages } from '../../utils/imageImports';\nconst bgImage = backgroundImages.section10;",
  '/background13.jpg': "import { backgroundImages } from '../../utils/imageImports';\nconst bgImage = backgroundImages.section11;",
  '/background14.jpg': "import { backgroundImages } from '../../utils/imageImports';\nconst bgImage = backgroundImages.section12;",
  '/background15.jpg': "import { backgroundImages } from '../../utils/imageImports';\nconst bgImage = backgroundImages.section13;",
  '/backgroundinfoabout.jpg': "import { backgroundImages } from '../../utils/imageImports';\nconst bgImage = backgroundImages.aboutMain;",
  '/backgroundinfoabout2.jpg': "import { backgroundImages } from '../../utils/imageImports';\nconst bgImage = backgroundImages.aboutSecondary;",
  '/bg3.jpg': "import { backgroundImages } from '../../utils/imageImports';\nconst bgImage = backgroundImages.overlay1;",
  '/bg4.jpg': "import { backgroundImages } from '../../utils/imageImports';\nconst bgImage = backgroundImages.overlay2;",
  '/footerBG.png': "import { backgroundImages } from '../../utils/imageImports';\nconst bgImage = backgroundImages.footer;",
  
  // Bridal Images
  '/bg-bride.jpg': "import { serviceImages } from '../../utils/imageImports';\nconst bridalImage = serviceImages.bridal.main1;",
  '/bg-bride2.jpg': "import { serviceImages } from '../../utils/imageImports';\nconst bridalImage = serviceImages.bridal.main2;",
  '/bg-bride3.png': "import { serviceImages } from '../../utils/imageImports';\nconst bridalImage = serviceImages.bridal.main3;",
  '/bg-bride4.jpg': "import { serviceImages } from '../../utils/imageImports';\nconst bridalImage = serviceImages.bridal.main4;",
  '/bg-bride5.jpg': "import { serviceImages } from '../../utils/imageImports';\nconst bridalImage = serviceImages.bridal.main5;",
  '/bg-bride6.jpg': "import { serviceImages } from '../../utils/imageImports';\nconst bridalImage = serviceImages.bridal.main6;",
  '/bg-bride7.jpg': "import { serviceImages } from '../../utils/imageImports';\nconst bridalImage = serviceImages.bridal.main7;",
  
  // Makeup Images
  '/makeup.jpg': "import { serviceImages } from '../../utils/imageImports';\nconst makeupImage = serviceImages.makeup.main;",
  '/mua.jpg': "import { serviceImages } from '../../utils/imageImports';\nconst makeupImage = serviceImages.makeup.artist;",
  '/Glamour.jpg': "import { serviceImages } from '../../utils/imageImports';\nconst makeupImage = serviceImages.makeup.glamour;",
  
  // Hair Images
  '/hair.jpg': "import { serviceImages } from '../../utils/imageImports';\nconst hairImage = serviceImages.hair.main;",
  '/hairstyle.jpg': "import { serviceImages } from '../../utils/imageImports';\nconst hairImage = serviceImages.hair.style1;",
  '/hairstyle2.jpg': "import { serviceImages } from '../../utils/imageImports';\nconst hairImage = serviceImages.hair.style2;",
  
  // Facial Images
  '/service1.jpg': "import { serviceImages } from '../../utils/imageImports';\nconst facialImage = serviceImages.facial.main;",
  '/service2.jpg': "import { serviceImages } from '../../utils/imageImports';\nconst facialImage = serviceImages.facial.treatment1;",
  '/service3.jpg': "import { serviceImages } from '../../utils/imageImports';\nconst facialImage = serviceImages.facial.treatment2;",
  '/service5.jpg': "import { serviceImages } from '../../utils/imageImports';\nconst facialImage = serviceImages.facial.treatment3;",
  '/service6.jpg': "import { serviceImages } from '../../utils/imageImports';\nconst facialImage = serviceImages.facial.treatment4;",
  '/service7.jpg': "import { serviceImages } from '../../utils/imageImports';\nconst facialImage = serviceImages.facial.treatment5;",
  
  // Spa Images
  '/spa.jpg': "import { serviceImages } from '../../utils/imageImports';\nconst spaImage = serviceImages.spa.main;",
  
  // Waxing Images
  '/wax (3).jpg': "import { serviceImages } from '../../utils/imageImports';\nconst waxingImage = serviceImages.waxing.main;",
  
  // Team Images
  '/girl.jpg': "import { teamImages } from '../../utils/imageImports';\nconst teamImage = teamImages.member1;",
  '/girl1.jpg': "import { teamImages } from '../../utils/imageImports';\nconst teamImage = teamImages.member2;",
  '/woman.jpg': "import { teamImages } from '../../utils/imageImports';\nconst teamImage = teamImages.member3;",
  '/woman1.jpg': "import { teamImages } from '../../utils/imageImports';\nconst teamImage = teamImages.member4;",
  
  // Product Images
  '/kit.jpg': "import { productImages } from '../../utils/imageImports';\nconst productImage = productImages.kit;",
  '/lipstic.jpg': "import { productImages } from '../../utils/imageImports';\nconst productImage = productImages.lipstick;",
  '/perfume.jpg': "import { productImages } from '../../utils/imageImports';\nconst productImage = productImages.perfume;",
  '/routine (1).jpg': "import { productImages } from '../../utils/imageImports';\nconst productImage = productImages.routine1;",
  '/routine (2).jpg': "import { productImages } from '../../utils/imageImports';\nconst productImage = productImages.routine2;",
  '/routine (3).jpg': "import { productImages } from '../../utils/imageImports';\nconst productImage = productImages.routine3;",
  '/IMAGE-Skincare-Collections.jpg': "import { productImages } from '../../utils/imageImports';\nconst productImage = productImages.skincareCollection;",
  
  // Logo Images
  '/logobeauty (1).png': "import { logoImages } from '../../utils/imageImports';\nconst logoImage = logoImages.primary;",
  '/logobeauty (2).png': "import { logoImages } from '../../utils/imageImports';\nconst logoImage = logoImages.secondary;",
  '/MENU.png': "import { logoImages } from '../../utils/imageImports';\nconst menuImage = logoImages.menu;",
  
  // Miscellaneous
  '/img3.jpg': "import { miscImages } from '../../utils/imageImports';\nconst miscImage = miscImages.image1;",
  '/image11.jpg': "import { miscImages } from '../../utils/imageImports';\nconst miscImage = miscImages.image2;",
  '/image2.jpg': "import { miscImages } from '../../utils/imageImports';\nconst miscImage = miscImages.image3;",
  '/img1.webp': "import { miscImages } from '../../utils/imageImports';\nconst miscImage = miscImages.image4;",
  '/makeover.jpg': "import { miscImages } from '../../utils/imageImports';\nconst miscImage = miscImages.makeover;",
  '/off1.jpg': "import { miscImages } from '../../utils/imageImports';\nconst miscImage = miscImages.offer1;",
  '/off2.jpg': "import { miscImages } from '../../utils/imageImports';\nconst miscImage = miscImages.offer2;",
  '/off3.jpg': "import { miscImages } from '../../utils/imageImports';\nconst miscImage = miscImages.offer3;",
  '/off4.jpg': "import { miscImages } from '../../utils/imageImports';\nconst miscImage = miscImages.offer4;",
  '/off5.jpg': "import { miscImages } from '../../utils/imageImports';\nconst miscImage = miscImages.offer5;",
  '/infoPeople.png': "import { miscImages } from '../../utils/imageImports';\nconst miscImage = miscImages.infoPeople;"
};

// Components that need updating
const componentsToUpdate = [
  'src/components/Home/HeroHome.jsx',
  'src/components/Home/Mua.jsx',
  'src/components/Home/Results.jsx',
  'src/components/Home/Info.jsx',
  'src/components/Home/Region.jsx',
  'src/components/About/HeroAbout.jsx',
  'src/components/About/AboutInfo.jsx',
  'src/components/About/AboutInfo2.jsx',
  'src/components/About/FindPlace.jsx',
  'src/components/Blog/BlogInfo.jsx',
  'src/components/Blog/MainBlogHero.jsx',
  'src/components/Blog/BlogDetails.jsx',
  'src/components/Contacts/ContactHero.jsx',
  'src/components/Contacts/ContactForm.jsx',
  'src/components/Contacts/OurOffice.jsx',
  'src/components/Header.jsx',
  'src/components/Footer.jsx',
  'src/components/PropertiesPage/AllProperties.jsx',
  'src/components/PropertiesPage/SimilarListings.jsx',
  'src/components/PropertiesPage/Details.jsx'
];

function updateComponentImports() {
  console.log('🔄 Starting component import updates...\n');

  let updatedCount = 0;
  let errorCount = 0;

  componentsToUpdate.forEach(componentPath => {
    const fullPath = path.join(__dirname, '..', componentPath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`  ⚠️  Skipped: ${componentPath} (not found)`);
      return;
    }

    try {
      let content = fs.readFileSync(fullPath, 'utf8');
      let hasChanges = false;

      // Replace old imports with new ones
      Object.entries(imageMapping).forEach(([oldPath, newImport]) => {
        const oldImportPattern = new RegExp(`import\\s+\\w+\\s+from\\s+["']${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'];?\\s*`, 'g');
        
        if (oldImportPattern.test(content)) {
          content = content.replace(oldImportPattern, newImport);
          hasChanges = true;
          console.log(`  ✅ Updated: ${componentPath} - ${oldPath}`);
        }
      });

      if (hasChanges) {
        fs.writeFileSync(fullPath, content);
        updatedCount++;
      } else {
        console.log(`  ℹ️  No changes needed: ${componentPath}`);
      }

    } catch (error) {
      console.log(`  ❌ Error updating ${componentPath}: ${error.message}`);
      errorCount++;
    }
  });

  console.log(`\n📊 Update Summary:`);
  console.log(`  ✅ Updated: ${updatedCount} components`);
  console.log(`  ❌ Errors: ${errorCount} files`);
  console.log(`\n🎉 Component import updates complete!`);
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Test the build: npm run build`);
  console.log(`   2. Check for any remaining import issues`);
  console.log(`   3. Update any hardcoded image paths in JSX`);
}

// Run the script
updateComponentImports(); 