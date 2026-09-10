#!/bin/bash
set -e

echo "Building Flow PWA for Vercel..."

# Create public directory
mkdir -p public

# Copy all files with verbose output
echo "Copying files..."
cp TODO.html public/index.html
cp manifest.json public/
cp sw.js public/

echo "Copying assets..."
cp -rv assets public/

echo "Verifying background images..."
ls -lh public/assets/images/neuro-protocols-background-*.webp

echo "✅ Build complete!"
