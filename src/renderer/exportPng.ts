import { renderSvgString } from './svgRenderer';
import { ShapeType, PhotoTransform } from '../types';

let cachedFontsCss = '';

/**
 * Fetches font files locally, converts them to Base64 and compiles @font-face rules.
 * Caches results in memory to avoid repetitive network requests.
 */
export async function preloadFonts(): Promise<string> {
  if (cachedFontsCss) {
    return cachedFontsCss;
  }

  try {
    const fonts = [
      { name: 'SpaceGrotesk-Regular', url: '/fonts/SpaceGrotesk-Regular.woff2', family: 'Space Grotesk', weight: '400', style: 'normal' },
      { name: 'SpaceGrotesk-Bold', url: '/fonts/SpaceGrotesk-Bold.woff2', family: 'Space Grotesk', weight: '700', style: 'normal' },
      { name: 'Fraunces-Bold', url: '/fonts/Fraunces-Bold.woff2', family: 'Fraunces', weight: '700', style: 'normal' },
      { name: 'JetBrainsMono-Regular', url: '/fonts/JetBrainsMono-Regular.woff2', family: 'JetBrains Mono', weight: '400', style: 'normal' }
    ];

    let css = '';
    for (const font of fonts) {
      const base64 = await fetchFontAsBase64(font.url);
      css += `
        @font-face {
          font-family: '${font.family}';
          src: url('data:font/woff2;base64,${base64}') format('woff2');
          font-weight: ${font.weight};
          font-style: ${font.style};
          font-display: block;
        }
      `;
    }

    cachedFontsCss = css;
    return cachedFontsCss;
  } catch (error) {
    console.error('Error preloading fonts for SVG:', error);
    return '';
  }
}

/**
 * Helper to download font resource and encode it into base64.
 */
async function fetchFontAsBase64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch font at ${url}: status ${response.status}`);
  }
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

interface ExportOptions {
  photoUrl: string | null;
  photoWidth: number;
  photoHeight: number;
  themeId: string;
  shape: ShapeType;
  transform: PhotoTransform;
  name: string;
  position: string;
}

/**
 * Converts the generated SVG frame to a 1024x1024 PNG data URI.
 * Renders client-side using Canvas.
 */
export async function exportToPng(options: ExportOptions): Promise<string> {
  // Preload and inline fonts CSS to make sure SVG on canvas resolves typography correctly
  const fontsCss = await preloadFonts();

  const svgString = renderSvgString({
    ...options,
    embedFontsCss: fontsCss,
  });

  return new Promise((resolve, reject) => {
    const img = new Image();
    // Allow canvas export without security taints if possible
    img.crossOrigin = 'anonymous';

    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas 2D context retrieval failed');
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image onto canvas
        ctx.clearRect(0, 0, 1024, 1024);
        ctx.drawImage(img, 0, 0, 1024, 1024);

        // Convert to data URI
        const pngDataUrl = canvas.toDataURL('image/png');

        URL.revokeObjectURL(url);
        resolve(pngDataUrl);
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG into image element for PNG rasterization.'));
    };

    img.src = url;
  });
}
