# Hlola Brand Assets

This directory contains key brand assets for the hlola GRC platform.

## Logo Files

### Full Logos
- `Hlola Full Color.svg` - Primary logo for light backgrounds
- `Hlola Full Black.svg` - Monochrome version for single-color applications  
- `Hlola Full White.svg` - For dark backgrounds

### Icon/Symbol Only
- `Hlola Icon Color.svg` - Standalone symbol in brand colors
- `Hlola Icon Black.svg` - Monochrome symbol
- `Hlola Icon White.svg` - For dark backgrounds

## Brand Colors

- **Hlola Blue**: `#26558e` - Primary brand color
- **Hlola Cyan**: `#41c3d6` - Accent color

## Usage in Next.js

```jsx
import Image from 'next/image'

// Using the full color logo
<Image 
  src="/brand/Hlola Full Color.svg" 
  alt="hlola logo" 
  width={180} 
  height={38} 
  priority 
/>

// Using the icon only
<Image 
  src="/brand/Hlola Icon Color.svg" 
  alt="hlola" 
  width={32} 
  height={32} 
/>
```

## Complete Brand Guidelines

See `BRAND_CI.md` in the project root for comprehensive brand guidelines including messaging, positioning, and usage guidelines.
