#!/bin/bash

# Geetha Makeovers - Deployment Script
echo "🚀 Starting deployment for Geetha Makeovers..."

# Check if we're in master branch
if [[ $(git branch --show-current) != "master" ]]; then
    echo "❌ Error: Please switch to master branch first"
    echo "Run: git checkout master"
    exit 1
fi

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to gh-pages
echo "🌐 Deploying to GitHub Pages..."
git checkout gh-pages
git rm -rf .
cp -r dist/* .
git add .
git commit -m "Update website - $(date)"
git push origin gh-pages

# Switch back to master
git checkout master

echo "🎉 Deployment complete!"
echo "🌍 Your website is live at: https://zedted0112.github.io/GeetaBeautyParlor/"
echo "⏰ It may take a few minutes for changes to appear." 