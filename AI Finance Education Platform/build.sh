#!/bin/bash

# Netlify Build Script for WealthNexus AI
# This ensures proper dependency installation and build process

echo "🚀 Starting WealthNexus AI build process..."

# Clean any existing dist folder
echo "🧹 Cleaning build directory..."
rm -rf dist

# Install dependencies with legacy peer deps
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Run the build
echo "🔨 Building application..."
npm run build

# Verify build output
if [ -d "dist" ]; then
  echo "✅ Build successful! Output directory created."
  echo "📁 Build artifacts:"
  ls -lh dist/
else
  echo "❌ Build failed! No dist directory found."
  exit 1
fi

echo "🎉 Build process complete!"
