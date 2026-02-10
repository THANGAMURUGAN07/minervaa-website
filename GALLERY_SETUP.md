# Gallery Setup Guide

## How to Add Images to the Gallery

### Step 1: Place Images in Public Folder
Add images to one of these folders in the `public/` directory:
- `independence day/`
- `rainbow day/`
- `bharathiyar celebration day/`
- `vijayadhasamy/`
- `food festival/`
- `award day/`
- `pongal/`
- `annual day/`

Supported image formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`

### Step 2: Generate Gallery Manifest
Run this command to automatically discover and list all images:

```bash
node scripts/generate-gallery-manifest.js
```

This creates a `gallery-manifest.json` file in the `public/` folder that the gallery uses to display images.

### Step 3: Verify in Browser
Visit the gallery page - all images from the folders will appear automatically!

## Automated Gallery Update
You can add this command to your build process by updating `package.json`:

```json
{
  "scripts": {
    "build": "node scripts/generate-gallery-manifest.js && vite build"
  }
}
```

## How It Works
- **galleryConfig.js** - Defines events and folder names (update titles/colors here)
- **generate-gallery-manifest.js** - Scans folders and creates manifest
- **gallery-manifest.json** - Generated file listing all images per folder
- **GallerySection.jsx** - Loads images dynamically from manifest

No need to manually edit image arrays anymore!
