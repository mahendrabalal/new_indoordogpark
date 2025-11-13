# Logo Assets

This folder contains all logo variations for IndoorDogPark.

## Current Files

### ✅ Available Logos

```
logo.png                     → Main logo (orange, transparent, horizontal layout) - DEFAULT
logo-grayscale.png          → Grayscale version (transparent, horizontal layout)
logo-stacked.png            → Stacked layout (orange, light gray background)
logo-stacked-grayscale.png  → Stacked layout (grayscale, light gray background)
```

### File Specifications

| File | Colors | Background | Layout | Size | Use Case |
|------|--------|------------|--------|------|----------|
| `logo.png` | Orange (#FF5722) | Transparent | Horizontal | 29KB | **Main website logo** (headers, nav) |
| `logo-grayscale.png` | Gray | Transparent | Horizontal | 29KB | Print, monochrome displays |
| `logo-stacked.png` | Orange (#FF5722) | Light gray | Vertical | 24KB | Square spaces, social media |
| `logo-stacked-grayscale.png` | Gray | Light gray | Vertical | 22KB | Monochrome square spaces |

## Usage in Code

### Main Header (50x50px)
```tsx
<Image 
  src="/images/logo/logo.png" 
  alt="Indoor Dog Park logo" 
  width={50} 
  height={50} 
  priority 
/>
```

### Search Header (40x40px)
```tsx
<Image 
  src="/images/logo/logo.png" 
  alt="Indoor Dog Park logo" 
  width={40} 
  height={40} 
/>
```

### Grayscale Version (for dark mode or print)
```tsx
<Image 
  src="/images/logo/logo-grayscale.png" 
  alt="Indoor Dog Park logo" 
  width={50} 
  height={50} 
/>
```

## Logo Design Details

### Horizontal Layouts (`logo.png`, `logo-grayscale.png`)
- **Format**: Dog icon above text
- **Text**: "IndoorDogPark" in bold sans-serif
- **Best for**: Headers, navigation bars, wide spaces
- **Aspect Ratio**: ~3:2 (landscape)

### Stacked Layouts (`logo-stacked.png`, `logo-stacked-grayscale.png`)
- **Format**: Dog icon centered above text
- **Background**: Light gray (#E8E8E8 or similar)
- **Best for**: Profile pictures, app icons, square containers
- **Aspect Ratio**: 1:1 (square)

## When to Use Each Logo

### `logo.png` (Primary - Orange, Transparent)
- ✅ Main website header
- ✅ White backgrounds
- ✅ Light colored backgrounds
- ✅ Most common use case

### `logo-grayscale.png` (Grayscale, Transparent)
- ✅ Print materials
- ✅ Monochrome designs
- ✅ Professional documents
- ✅ When color is not available

### `logo-stacked.png` (Stacked, With Background)
- ✅ Social media profile pictures
- ✅ App icons (if needed)
- ✅ Square containers
- ✅ When a background is needed

### `logo-stacked-grayscale.png` (Stacked Grayscale)
- ✅ Monochrome square spaces
- ✅ Professional profiles
- ✅ Grayscale print materials

## Color Palette

### Primary Orange
- **Hex**: `#FF5722` (approximately)
- **Use**: Main brand color, default logo

### Grayscale
- **Hex**: `#6B6B6B` (approximately)
- **Use**: Professional/formal contexts, print

## Best Practices

✅ **DO:**
- Use `logo.png` as the default for all web headers
- Use transparent versions whenever possible
- Keep aspect ratios intact
- Use grayscale for print materials
- Test logos on different backgrounds

❌ **DON'T:**
- Stretch or distort logos
- Change the colors arbitrarily
- Add filters or effects
- Use low-quality versions on high-res displays
- Place transparent logos on busy backgrounds without testing

## File Optimization

All logos are already reasonably optimized:
- `logo.png`: 29KB
- `logo-grayscale.png`: 29KB
- `logo-stacked.png`: 24KB
- `logo-stacked-grayscale.png`: 22KB

These sizes are good for web use. If you need further optimization:
- Use [TinyPNG](https://tinypng.com/) for lossless compression
- Use [Squoosh](https://squoosh.app/) for advanced optimization

## Future Additions (Optional)

Consider adding these variations if needed:

```
logo-white.png              → White version for dark backgrounds
logo-icon-only.png          → Just the dog icon (no text)
logo-social-square.png      → 1200x1200px for social media posts
logo-favicon.png            → 512x512px for generating favicons
```

## Favicon & App Icons

Favicon and PWA icons are in `/public/icons/`:
- `favicon.ico` - Browser favicon
- `icon-*.png` - PWA app icons (various sizes)

These should be kept separate from logo assets.

## Quick Reference

**Current website header uses**: `/images/logo/logo.png` (50x50px)
**Current search header uses**: `/images/logo/logo.png` (40x40px)

---

Last updated: November 13, 2025
