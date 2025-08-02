# 🖼️ Production-Grade Image Structure

## 📁 Folder Organization

```
src/assets/images/
├── hero/                 # Hero section images
├── backgrounds/          # Background images for sections
├── services/            # Service-specific images
│   ├── bridal/          # Bridal makeup and styling
│   ├── makeup/          # General makeup services
│   ├── facial/          # Facial treatments
│   ├── hair/            # Hair styling and treatments
│   ├── spa/             # Spa and wellness
│   ├── waxing/          # Waxing services
│   ├── threading/       # Threading services
│   ├── manicure/        # Nail care
│   ├── pedicure/        # Foot care
│   └── mehandi/         # Henna/Mehandi services
├── team/                # Team member photos
├── testimonials/        # Customer testimonials
├── products/            # Product images
├── logos/               # Brand logos and icons
├── ui/                  # UI elements and avatars
└── misc/                # Miscellaneous images
```

## 🏷️ Naming Conventions

### **Hero Images**
- `hero-home-main.jpg` - Main homepage hero
- `hero-home-alt.jpg` - Alternative homepage hero
- `hero-about-main.jpg` - About page hero
- `hero-bg-primary.png` - Primary hero background
- `hero-bg-secondary.png` - Secondary hero background

### **Background Images**
- `bg-section-1.jpg` to `bg-section-13.jpg` - Section backgrounds
- `bg-about-main.jpg` - About page background
- `bg-about-secondary.jpg` - About page secondary background
- `bg-overlay-1.jpg`, `bg-overlay-2.jpg` - Overlay backgrounds
- `bg-footer.png` - Footer background

### **Service Images**
- **Bridal**: `bridal-main-1.jpg` to `bridal-main-7.jpg`
- **Makeup**: `makeup-main.jpg`, `makeup-artist.jpg`, `makeup-glamour.jpg`
- **Hair**: `hair-main.jpg`, `hair-style-1.jpg`, `hair-style-2.jpg`
- **Facial**: `facial-main.jpg`, `facial-treatment-1.jpg` to `facial-treatment-5.jpg`
- **Spa**: `spa-main.jpg`
- **Waxing**: `waxing-main.jpg`

### **Team Images**
- `team-member-1.jpg` to `team-member-4.jpg`

### **Product Images**
- `product-kit.jpg` - Beauty kit
- `product-lipstick.jpg` - Lipstick
- `product-perfume.jpg` - Perfume
- `product-routine-1.jpg` to `product-routine-3.jpg` - Skincare routines
- `product-skincare-collection.jpg` - Skincare collection

### **Testimonial Images**
- `testimonial-1.jpg` to `testimonial-6.jpg` - Customer photos
- `testimonial-card-1.jpg` to `testimonial-card-3.jpg` - Card images

### **Logo Images**
- `logo-primary.png` - Primary logo
- `logo-secondary.png` - Secondary logo
- `logo-menu.png` - Menu icon

### **UI Elements**
- `ui-avatar-default.png` - Default avatar
- `ui-avatar-1.png` to `ui-avatar-7.png` - User avatars

## 🔧 Usage Examples

### **Importing Images**
```javascript
// Import from centralized utility
import { heroImages, serviceImages, getImage } from '../utils/imageImports';

// Direct usage
const heroImage = heroImages.homeMain;
const bridalImage = serviceImages.bridal.main1;

// Using helper function
const image = getImage('hero', 'homeMain');
```

### **In React Components**
```jsx
import { heroImages, serviceImages } from '../utils/imageImports';

function HeroSection() {
  return (
    <div 
      style={{ 
        backgroundImage: `url(${heroImages.homeMain})` 
      }}
    >
      {/* Content */}
    </div>
  );
}

function BridalService() {
  return (
    <div>
      <img src={serviceImages.bridal.main1} alt="Bridal Makeup" />
    </div>
  );
}
```

## 🚀 Migration Guide

### **Step 1: Run Organization Script**
```bash
node scripts/organize-images.js
```

### **Step 2: Update Component Imports**
Replace old image imports:
```javascript
// Old way
import heroImage from '../assets/hero-home.jpg';

// New way
import { heroImages } from '../utils/imageImports';
const heroImage = heroImages.homeMain;
```

### **Step 3: Update Image References**
```jsx
// Old way
<img src="/hero-home.jpg" alt="Hero" />

// New way
<img src={heroImages.homeMain} alt="Hero" />
```

## 📋 Best Practices

### **1. Image Optimization**
- Use WebP format when possible
- Compress images for web
- Provide multiple sizes for responsive design
- Use descriptive alt text

### **2. Performance**
- Lazy load images below the fold
- Use appropriate image formats
- Implement proper caching strategies
- Consider using image CDN

### **3. Accessibility**
- Always include alt text
- Use semantic image names
- Provide text alternatives for decorative images
- Ensure sufficient color contrast

### **4. Maintenance**
- Keep image names consistent
- Document any new image additions
- Regular cleanup of unused images
- Version control for image changes

## 🔄 Update Process

### **Adding New Images**
1. Place image in appropriate category folder
2. Follow naming convention
3. Add to `imageImports.js`
4. Update documentation
5. Test in components

### **Renaming Images**
1. Update file name in folder
2. Update `imageImports.js`
3. Update all component references
4. Test thoroughly

### **Removing Images**
1. Remove from folder
2. Remove from `imageImports.js`
3. Remove all component references
4. Update documentation

## 📊 Image Statistics

- **Total Categories**: 9
- **Service Subcategories**: 10
- **Total Images**: 80+
- **Formats Supported**: JPG, PNG, WebP
- **Organization**: Production-ready

## 🎯 Benefits

✅ **Consistent naming** across the project  
✅ **Easy maintenance** and updates  
✅ **Type-safe imports** with centralized management  
✅ **Scalable structure** for future growth  
✅ **Performance optimized** with proper organization  
✅ **Developer-friendly** with clear documentation 