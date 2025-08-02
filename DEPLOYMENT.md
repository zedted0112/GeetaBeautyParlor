# GitHub Pages Deployment Guide

## Current Setup

Your website is configured to deploy automatically to GitHub Pages when you push to the `master` branch.

### Repository Details
- **Repository**: https://github.com/zedted0112/GeetaBeautyParlor
- **Live URL**: https://zedted0112.github.io/GeetaBeautyParlor/
- **Branch**: `master`

## Deployment Process

1. **Automatic Deployment**: When you push to `master`, GitHub Actions automatically:
   - Builds your React app
   - Deploys to GitHub Pages
   - Updates the live website

2. **Manual Deployment**: If needed, you can manually trigger deployment:
   ```bash
   npm run build
   git add .
   git commit -m "Update website"
   git push origin master
   ```

## Configuration Files

### Vite Config (`vite.config.js`)
- Base path: `/GeetaBeautyParlor/` (for production)
- Build output: `dist/` folder
- Optimized for GitHub Pages

### GitHub Actions (`.github/workflows/deploy.yml`)
- Triggers on push to `master` branch
- Uses Node.js 18
- Builds and deploys automatically

## Troubleshooting

### If deployment fails:

1. **Check GitHub Actions**: Go to your repository → Actions tab
2. **Verify build locally**: Run `npm run build` to ensure it works
3. **Check repository settings**: Ensure GitHub Pages is enabled
4. **Verify branch name**: Make sure you're pushing to `master`

### Common Issues:

1. **404 Errors**: Check if the base path in `vite.config.js` matches your repository name
2. **Build Failures**: Ensure all dependencies are installed (`npm install`)
3. **Permission Issues**: Check if GitHub Actions has proper permissions

## GitHub Pages Settings

To verify/enable GitHub Pages:

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" section
4. Ensure source is set to "GitHub Actions"

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## File Structure

```
├── .github/workflows/deploy.yml  # GitHub Actions workflow
├── vite.config.js               # Vite configuration
├── package.json                 # Dependencies and scripts
├── src/                         # Source code
└── dist/                        # Built files (generated)
```

## Support

If you encounter issues:
1. Check the GitHub Actions logs
2. Verify your repository settings
3. Ensure all files are committed and pushed 