#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Components that need fixing
const componentsToFix = [
  'src/components/About/AboutInfo2.jsx',
  'src/components/About/AboutInfo.jsx',
  'src/components/Blog/BlogInfo.jsx',
  'src/components/Blog/BlogDetails.jsx',
  'src/components/Blog/RelatedPost.jsx',
  'src/components/Contacts/ContactForm.jsx',
  'src/components/Contacts/OurOffice.jsx',
  'src/components/Footer.jsx'
];

function fixDuplicateImports() {
  console.log('🔧 Fixing duplicate imports...\n');

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

      // Fix duplicate imports by consolidating them
      const importGroups = {
        'heroImages': [],
        'backgroundImages': [],
        'serviceImages': [],
        'teamImages': [],
        'productImages': [],
        'testimonialImages': [],
        'logoImages': [],
        'uiImages': [],
        'miscImages': []
      };

      // Extract all imports and their variables
      const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]\.\.\/\.\.\/utils\/imageImports['"];?\s*const\s+(\w+)\s*=\s*([^;]+);/g;
      let match;
      
      while ((match = importRegex.exec(content)) !== null) {
        const imports = match[1].trim();
        const variable = match[2].trim();
        const value = match[3].trim();
        
        // Parse the imports
        imports.split(',').forEach(imp => {
          const cleanImp = imp.trim();
          if (importGroups[cleanImp]) {
            importGroups[cleanImp].push({ variable, value });
          }
        });
      }

      // Remove all old import statements
      content = content.replace(/import\s+\{[^}]+\}\s+from\s+['"]\.\.\/\.\.\/utils\/imageImports['"];?\s*const\s+\w+\s*=\s*[^;]+;/g, '');

      // Add consolidated imports at the top
      const consolidatedImports = [];
      const consolidatedVariables = [];

      Object.entries(importGroups).forEach(([importName, variables]) => {
        if (variables.length > 0) {
          consolidatedImports.push(importName);
          variables.forEach(({ variable, value }) => {
            consolidatedVariables.push(`const ${variable} = ${value};`);
          });
        }
      });

      if (consolidatedImports.length > 0) {
        const newImportStatement = `import { ${consolidatedImports.join(', ')} } from '../../utils/imageImports';\n\n${consolidatedVariables.join('\n')}`;
        
        // Find the first import statement and replace everything before it
        const firstImportIndex = content.search(/import\s+/);
        if (firstImportIndex !== -1) {
          const beforeImports = content.substring(0, firstImportIndex);
          const afterImports = content.substring(firstImportIndex);
          content = beforeImports + newImportStatement + '\n\n' + afterImports;
        } else {
          // If no other imports, add at the beginning
          content = newImportStatement + '\n\n' + content;
        }
        
        hasChanges = true;
        console.log(`  ✅ Fixed: ${componentPath} - consolidated ${consolidatedImports.length} import groups`);
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
  console.log(`\n🎉 Duplicate import fixes complete!`);
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Test the build: npm run build`);
  console.log(`   2. Check for any remaining issues`);
  console.log(`   3. Verify all images load correctly`);
}

// Run the script
fixDuplicateImports(); 