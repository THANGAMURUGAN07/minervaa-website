#!/usr/bin/env node

/**
 * Generate gallery manifest by scanning image folders in public directory
 * Run this before building: node scripts/generate-gallery-manifest.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const publicDir = path.join(__dirname, '../public');
const outputFile = path.join(__dirname, '../public/gallery-manifest.json');

const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// Gallery folder names to scan
const galleryFolders = [
  'independence day',
  'rainbow day',
  'bharathiyar celebration day',
  'vijayadhasamy',
  'food festival',
  'award day',
  'pongal',
  'annual day'
];

const manifest = {};

galleryFolders.forEach(folderName => {
  const folderPath = path.join(publicDir, folderName);
  
  try {
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath)
        .filter(file => supportedExtensions.includes(path.extname(file).toLowerCase()))
        .sort();
      
      manifest[folderName] = files;
      console.log(`✓ Found ${files.length} images in "${folderName}"`);
    }
  } catch (error) {
    console.warn(`⚠ Error reading "${folderName}":`, error.message);
    manifest[folderName] = [];
  }
});

// Write manifest to public folder
fs.writeFileSync(outputFile, JSON.stringify(manifest, null, 2));
console.log(`\n✓ Gallery manifest generated at /public/gallery-manifest.json`);
