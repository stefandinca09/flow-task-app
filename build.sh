#!/bin/bash
set -e

echo "Building Flow PWA for Vercel..."

# Create public directory
mkdir -p public

# Copy all files
cp TODO.html public/index.html
cp manifest.json public/
cp sw.js public/
cp -r assets public/

echo "✅ Build complete!"
