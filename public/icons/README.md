# PWA Icons

To complete the PWA setup, you need to generate app icons in the following sizes:

## Required Icon Sizes
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

## Quick Generate Icons

You can use these tools to generate all required sizes from a single image:

1. **PWA Asset Generator**: https://www.pwabuilder.com/imageGenerator
2. **RealFaviconGenerator**: https://realfavicongenerator.net/
3. **Favicon.io**: https://favicon.io/

## Source Image Recommendation

Use the Fusion Party logo (`/public/solo-full-colour.svg`) as the source.

Make sure to:
- Use a square canvas (1024x1024 or larger)
- Include some padding around the logo
- Use a solid background color (black or magenta would work well)

## Manual Creation (if needed)

If you have ImageMagick installed:

```bash
# Convert SVG to different sizes
convert solo-full-colour.svg -resize 72x72 icons/icon-72x72.png
convert solo-full-colour.svg -resize 96x96 icons/icon-96x96.png
convert solo-full-colour.svg -resize 128x128 icons/icon-128x128.png
convert solo-full-colour.svg -resize 144x144 icons/icon-144x144.png
convert solo-full-colour.svg -resize 152x152 icons/icon-152x152.png
convert solo-full-colour.svg -resize 192x192 icons/icon-192x192.png
convert solo-full-colour.svg -resize 384x384 icons/icon-384x384.png
convert solo-full-colour.svg -resize 512x512 icons/icon-512x512.png
```

Place all generated icons in `/public/icons/` directory.
