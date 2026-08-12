import { ThemeConfig, ShapeType, PhotoTransform } from '../types';
import { THEMES } from './themes';
import { calculateImageBounds } from '../utils/image';

interface SvgRenderOptions {
  photoUrl: string | null;
  photoWidth: number;
  photoHeight: number;
  themeId: string;
  shape: ShapeType;
  transform: PhotoTransform;
  embedFontsCss?: string;
  name?: string;
  position?: string;
}

export function renderSvgString({
  photoUrl,
  photoWidth,
  photoHeight,
  themeId,
  shape,
  transform,
  embedFontsCss = '',
  name = '',
  position = '',
}: SvgRenderOptions): string {
  const theme = THEMES[themeId as keyof typeof THEMES] || THEMES.CYBER_DEFENDER;
  const colors = theme.colors;

  const displayName = (name.trim() || 'YOUR NAME').toUpperCase();
  const displayPosition = (position.trim() || 'YOUR POSITION / ROLE').toUpperCase();

  // Mask dimensions
  const containerSize = 760;
  const containerX = 132;
  const containerY = 80;

  // Calculate photo positioning inside the 760x760 mask container
  let photoElement = '';
  if (photoUrl && photoWidth > 0 && photoHeight > 0) {
    const bounds = calculateImageBounds(
      photoWidth,
      photoHeight,
      containerSize,
      containerSize,
      transform.zoom,
      transform.x,
      transform.y
    );

    const imgX = containerX + bounds.x;
    const imgY = containerY + bounds.y;
    const imgW = bounds.width;
    const imgH = bounds.height;

    photoElement = `
      <g clip-path="url(#photo-clip)">
        <image 
          href="${photoUrl}" 
          x="${imgX}" 
          y="${imgY}" 
          width="${imgW}" 
          height="${imgH}" 
          preserveAspectRatio="none" 
        />
      </g>
    `;
  } else {
    // Placeholder if no photo uploaded
    const centerX = containerX + containerSize / 2;
    const centerY = containerY + containerSize / 2;
    photoElement = `
      <g clip-path="url(#photo-clip)">
        <rect x="${containerX}" y="${containerY}" width="${containerSize}" height="${containerSize}" fill="${colors.muted}" />
        <text x="${centerX}" y="${centerY - 10}" fill="${colors.text}" opacity="0.3" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="28" text-anchor="middle">NO PHOTO UPLOADED</text>
        <text x="${centerX}" y="${centerY + 25}" fill="${colors.accent}" opacity="0.5" font-family="'JetBrains Mono', monospace" font-size="14" text-anchor="middle">[AWAITING_INPUT]</text>
      </g>
    `;
  }

  // Define mask paths
  const clipPathSvg = shape === 'CIRCLE'
    ? `<circle cx="512" cy="460" r="380" />`
    : `<rect x="${containerX}" y="${containerY}" width="${containerSize}" height="${containerSize}" rx="48" ry="48" />`;

  // Dynamic Theme-specific background and foreground decorations
  let backgroundDecorations = '';
  let foregroundDecorations = '';
  let themeTitleSection = '';

  const cx = 512;
  const cy = 460;

  switch (theme.id) {
    case 'CYBER_DEFENDER':
      // Technical cybersecurity layout
      backgroundDecorations = `
        <!-- Cyber grid background -->
        <defs>
          <pattern id="cyber-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${colors.muted}" stroke-width="0.7" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="1024" height="1024" fill="url(#cyber-grid)" />
        
        <!-- Circuit board traces behind photo -->
        <g stroke="${colors.accent}" stroke-width="1.5" fill="none" opacity="0.2">
          <path d="M 150 200 L 300 200 L 350 250 L 350 350" />
          <circle cx="150" cy="200" r="3.5" fill="${colors.accent}" />
          
          <path d="M 874 200 L 724 200 L 674 250 L 674 350" />
          <circle cx="874" cy="200" r="3.5" fill="${colors.accent}" />
          
          <path d="M 150 720 L 250 720 L 300 670 L 300 570" />
          <circle cx="150" cy="720" r="3.5" fill="${colors.accent}" />
          
          <path d="M 874 720 L 774 720 L 724 670 L 724 570" />
          <circle cx="874" cy="720" r="3.5" fill="${colors.accent}" />
        </g>
        
        <!-- Large asymmetric technical circles behind photo -->
        <circle cx="${cx}" cy="${cy}" r="410" fill="none" stroke="${colors.muted}" stroke-width="1.5" stroke-dasharray="10 15" opacity="0.3" />
        <circle cx="${cx}" cy="${cy}" r="430" fill="none" stroke="${colors.accent}" stroke-width="1" opacity="0.15" />
        <circle cx="${cx}" cy="${cy}" r="450" fill="none" stroke="${colors.accent}" stroke-width="1.5" stroke-dasharray="5 20" opacity="0.2" />

        <!-- Shield / security HUD outline at top behind photo -->
        <path d="M 512 180 Q 562 180, 562 230 Q 562 310, 512 360 Q 462 310, 462 230 Q 462 180, 512 180 Z" fill="none" stroke="${colors.accent}" stroke-width="2" opacity="0.1" />
      `;

      foregroundDecorations = `
        <!-- Safe scanning box around the photo -->
        ${shape === 'CIRCLE' 
          ? `<circle cx="${cx}" cy="${cy}" r="382" fill="none" stroke="${colors.accent}" stroke-width="2" />
             <circle cx="${cx}" cy="${cy}" r="390" fill="none" stroke="${colors.text}" stroke-width="1" opacity="0.3" stroke-dasharray="5 5" />`
          : `<rect x="${containerX - 2}" y="${containerY - 2}" width="${containerSize + 4}" height="${containerSize + 4}" rx="50" ry="50" fill="none" stroke="${colors.accent}" stroke-width="2" />
             <rect x="${containerX - 10}" y="${containerY - 10}" width="${containerSize + 20}" height="${containerSize + 20}" rx="58" ry="58" fill="none" stroke="${colors.text}" stroke-width="1" opacity="0.3" stroke-dasharray="8 8" />`
        }

        <!-- Technical Corner crosshairs for rectangular, or quadrant ticks for circular -->
        ${shape === 'CIRCLE'
          ? `<path d="M ${cx} ${cy - 395} L ${cx} ${cy - 375} M ${cx} ${cy + 375} L ${cx} ${cy + 395} M ${cx - 395} ${cy} L ${cx - 375} ${cy} M ${cx + 375} ${cy} L ${cx + 395} ${cy}" stroke="${colors.accent}" stroke-width="2" />`
          : `<path d="M ${containerX - 20} ${containerY + 30} L ${containerX - 20} ${containerY - 20} L ${containerX + 30} ${containerY - 20} 
                     M ${containerX + containerSize + 20} ${containerY + 30} L ${containerX + containerSize + 20} ${containerY - 20} L ${containerX + containerSize - 30} ${containerY - 20}
                     M ${containerX - 20} ${containerY + containerSize - 30} L ${containerX - 20} ${containerY + containerSize + 20} L ${containerX + 30} ${containerY + containerSize + 20}
                     M ${containerX + containerSize + 20} ${containerY + containerSize - 30} L ${containerX + containerSize + 20} ${containerY + containerSize + 20} L ${containerX + containerSize - 30} ${containerY + containerSize + 20}" 
                 fill="none" stroke="${colors.accent}" stroke-width="2.5" />`
        }

        <!-- Tech badges overlay -->
        <g transform="translate(150, 100)">
          <rect x="0" y="0" width="180" height="28" fill="${colors.bg}" stroke="${colors.accent}" stroke-width="1" rx="4" />
          <text x="10" y="18" fill="${colors.accent}" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700">[SECURE_ACCESS_GRANTED]</text>
        </g>
        <g transform="translate(700, 100)">
          <text x="170" y="18" fill="${colors.text}" font-family="'JetBrains Mono', monospace" font-size="11" text-anchor="end" opacity="0.7">AUTH_LEVEL: BUILDER</text>
          <text x="170" y="32" fill="${colors.coral}" font-family="'JetBrains Mono', monospace" font-size="11" text-anchor="end" font-weight="700">SYS_SEC: 99.82%</text>
        </g>
      `;

      themeTitleSection = `
        <!-- Main title: Editorial typography with Fraunces & Space Grotesk -->
        <text x="512" y="875" fill="${colors.text}" font-family="'Fraunces', serif" font-weight="900" font-size="64" text-anchor="middle" letter-spacing="-1.5px">CYBER DEFENDER</text>
        <text x="512" y="918" fill="${colors.text}" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="26" text-anchor="middle" letter-spacing="1px">${displayName}</text>
        <text x="512" y="948" fill="${colors.accent}" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="13" text-anchor="middle" letter-spacing="1px">${displayPosition}</text>
        
        <!-- Bottom metadata -->
        <text x="80" y="980" fill="${colors.text}" font-family="'Space Grotesk', sans-serif" font-size="12" opacity="0.5">HACKER HOUSE GOA 2026 // CYBERSECURITY</text>
        <text x="944" y="980" fill="${colors.text}" font-family="'JetBrains Mono', monospace" font-size="12" text-anchor="end" opacity="0.5">GOA, INDIA // 28–31 OCT 2026</text>
      `;
      break;

    case 'AI_EXPLORER':
      // Orbital/circular geometry
      backgroundDecorations = `
        <defs>
          <radialGradient id="ai-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${colors.muted}" stop-opacity="0.6" />
            <stop offset="100%" stop-color="${colors.bg}" stop-opacity="0" />
          </radialGradient>
        </defs>
        <circle cx="${cx}" cy="${cy}" r="500" fill="url(#ai-glow)" />
        
        <!-- Large concentric orbital paths -->
        <circle cx="${cx}" cy="${cy}" r="400" fill="none" stroke="${colors.accent}" stroke-width="1" opacity="0.25" stroke-dasharray="4 8" />
        <circle cx="${cx}" cy="${cy}" r="425" fill="none" stroke="${colors.text}" stroke-width="0.8" opacity="0.15" />
        <circle cx="${cx}" cy="${cy}" r="450" fill="none" stroke="${colors.accent}" stroke-width="1.5" opacity="0.2" stroke-dasharray="40 10 5 10" />
        
        <!-- Faint dot grid -->
        <defs>
          <pattern id="dot-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="${colors.muted}" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="1024" height="1024" fill="url(#dot-grid)" />
      `;

      foregroundDecorations = `
        <!-- Circular tick rings -->
        ${shape === 'CIRCLE'
          ? `<circle cx="${cx}" cy="${cy}" r="384" fill="none" stroke="${colors.accent}" stroke-width="2" />
             <circle cx="${cx}" cy="${cy}" r="376" fill="none" stroke="${colors.text}" stroke-width="0.5" opacity="0.4" />`
          : `<rect x="${containerX - 2}" y="${containerY - 2}" width="${containerSize + 4}" height="${containerSize + 4}" rx="50" ry="50" fill="none" stroke="${colors.accent}" stroke-width="2" />
             <rect x="${containerX + 6}" y="${containerY + 6}" width="${containerSize - 12}" height="${containerSize - 12}" rx="42" ry="42" fill="none" stroke="${colors.text}" stroke-width="0.5" opacity="0.4" />`
        }

        <!-- Coordinate marks & AI stats -->
        <g transform="translate(140, 110)">
          <text x="0" y="0" fill="${colors.accent}" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700">LATENT_SPACE_EXPLORER</text>
          <text x="0" y="16" fill="${colors.text}" font-family="'JetBrains Mono', monospace" font-size="10" opacity="0.5">MODEL: PFP_GEN_V2</text>
        </g>
        <g transform="translate(710, 110)">
          <text x="170" y="0" fill="${colors.text}" font-family="'JetBrains Mono', monospace" font-size="10" text-anchor="end" opacity="0.5">WEIGHTS: FLOAT16</text>
          <text x="170" y="16" fill="${colors.accent}" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700" text-anchor="end">TEMP: 0.70 [OPTIMAL]</text>
        </g>

        <!-- Technical crosshairs -->
        <line x1="${cx}" y1="${cy - 395}" x2="${cx}" y2="${cy - 365}" stroke="${colors.accent}" stroke-width="1.5" />
        <line x1="${cx}" y1="${cy + 365}" x2="${cx}" y2="${cy + 395}" stroke="${colors.accent}" stroke-width="1.5" />
        <line x1="${cx - 395}" y1="${cy}" x2="${cx - 365}" y2="${cy}" stroke="${colors.accent}" stroke-width="1.5" />
        <line x1="${cx + 365}" y1="${cy}" x2="${cx + 395}" y2="${cy}" stroke="${colors.accent}" stroke-width="1.5" />
      `;

      themeTitleSection = `
        <text x="512" y="875" fill="${colors.text}" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="64" text-anchor="middle" letter-spacing="-1px">AI EXPLORER</text>
        <text x="512" y="918" fill="${colors.text}" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="26" text-anchor="middle" letter-spacing="1px">${displayName}</text>
        <text x="512" y="948" fill="${colors.accent}" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="13" text-anchor="middle" letter-spacing="1px">${displayPosition}</text>
        
        <text x="80" y="980" fill="${colors.text}" font-family="'Space Grotesk', sans-serif" font-size="12" opacity="0.5">HACKER HOUSE GOA 2026 // AI / ML</text>
        <text x="944" y="980" fill="${colors.text}" font-family="'JetBrains Mono', monospace" font-size="12" text-anchor="end" opacity="0.5">GOA, INDIA // 28–31 OCT 2026 // 247</text>
      `;
      break;

    case 'CODE_BUILDER':
      // Structured developer code/editorial theme
      backgroundDecorations = `
        <!-- Tech binary/matrix code lines -->
        <g opacity="0.15" fill="${colors.text}" font-family="'JetBrains Mono', monospace" font-size="11">
          <text x="60" y="160">&lt;script setup&gt;</text>
          <text x="60" y="185">import { Builder } from 'goa-house';</text>
          <text x="60" y="210">const location = 'Goa, India';</text>
          <text x="60" y="235">const dates = '28–31 Oct 2026';</text>
          <text x="60" y="260">export default async function ship() {</text>
          <text x="80" y="285">const pfp = await generate({ theme: 'CODE' });</text>
          <text x="80" y="310">return pfp.save();</text>
          <text x="60" y="335">}</text>

          <text x="964" y="160" text-anchor="end">package.json</text>
          <text x="964" y="185" text-anchor="end">"dependencies": {</text>
          <text x="964" y="210" text-anchor="end">"vite": "^5.4.0",</text>
          <text x="964" y="235" text-anchor="end">"react": "^18.3.1",</text>
          <text x="964" y="260" text-anchor="end">"typescript": "^5.5.4"</text>
          <text x="964" y="285" text-anchor="end">}</text>
        </g>
        
        <!-- Large faint curly braces behind photo -->
        <text x="180" y="520" fill="${colors.muted}" font-family="'Space Grotesk', sans-serif" font-weight="300" font-size="320" text-anchor="middle" opacity="0.25">{</text>
        <text x="844" y="520" fill="${colors.muted}" font-family="'Space Grotesk', sans-serif" font-weight="300" font-size="320" text-anchor="middle" opacity="0.25">}</text>
      `;

      foregroundDecorations = `
        <!-- Chrome border for IDE window look -->
        ${shape === 'CIRCLE'
          ? `<circle cx="${cx}" cy="${cy}" r="384" fill="none" stroke="${colors.accent}" stroke-width="2" />
             <circle cx="${cx}" cy="${cy}" r="390" fill="none" stroke="${colors.muted}" stroke-width="1.5" />`
          : `<rect x="${containerX - 1}" y="${containerY - 1}" width="${containerSize + 2}" height="${containerSize + 2}" rx="32" ry="32" fill="none" stroke="${colors.accent}" stroke-width="2.5" />
             <!-- Code terminal window top bar -->
             <path d="M ${containerX} ${containerY + 36} L ${containerX + containerSize} ${containerY + 36}" stroke="${colors.accent}" stroke-width="1.5" />
             <circle cx="${containerX + 18}" cy="${containerY + 18}" r="5" fill="#f2725c" />
             <circle cx="${containerX + 32}" cy="${containerY + 18}" r="5" fill="${colors.accent}" />
             <circle cx="${containerX + 46}" cy="${containerY + 18}" r="5" fill="#2d4d38" />
             <text x="${containerX + 70}" y="${containerY + 22}" fill="${colors.text}" font-family="'JetBrains Mono', monospace" font-size="10" opacity="0.6">builder.tsx</text>`
        }

        <!-- Status Tag bottom left overlap -->
        <g transform="translate(150, 780)">
          <rect x="0" y="0" width="130" height="26" fill="${colors.bg}" stroke="${colors.accent}" stroke-width="1" rx="4" />
          <text x="10" y="17" fill="${colors.accent}" font-family="'JetBrains Mono', monospace" font-size="10" font-weight="700">STATUS: COMPILING</text>
        </g>
        
        <!-- Terminal command overlay -->
        <g transform="translate(150, 70)">
          <text x="10" y="32" fill="${colors.accent}" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700">&gt; npm run ship</text>
        </g>
      `;

      themeTitleSection = `
        <text x="512" y="875" fill="${colors.text}" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="64" text-anchor="middle" letter-spacing="-2px">CODE BUILDER</text>
        <text x="512" y="918" fill="${colors.text}" font-family="'JetBrains Mono', monospace" font-size="20" font-weight="700" text-anchor="middle">const builder = "${displayName}";</text>
        <text x="512" y="948" fill="${colors.accent}" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="700" text-anchor="middle">const role = "${displayPosition}";</text>
 
        <!-- Bottom details -->
        <text x="80" y="980" fill="${colors.text}" font-family="'Space Grotesk', sans-serif" font-size="12" opacity="0.5">HACKER HOUSE GOA 2026 // FRONTEND</text>
        <text x="944" y="980" fill="${colors.accent}" font-family="'JetBrains Mono', monospace" font-size="12" text-anchor="end" font-weight="700">28–31 OCT 2026 // 247</text>
      `;
      break;

    case 'CREATIVE_BUILDER':
      // Asymmetric bold graphics and sophisticated coral/cream accents
      backgroundDecorations = `
        <!-- Abstract flowing curves for Creative visual style -->
        <path d="M 0 350 C 300 200, 700 500, 1024 350" fill="none" stroke="${colors.accent}" stroke-width="3" opacity="0.2" />
        <path d="M 0 400 C 300 250, 700 550, 1024 400" fill="none" stroke="${colors.muted}" stroke-width="1.5" opacity="0.15" />

        <!-- Bold background shape overlapping slightly -->
        <path d="M 50 460 A 462 462 0 0 1 974 460" fill="none" stroke="${colors.muted}" stroke-width="8" opacity="0.2" />
        <circle cx="${cx}" cy="${cy}" r="415" fill="none" stroke="${colors.accent}" stroke-width="1.5" opacity="0.15" />
        
        <!-- Large accent label -->
        <text x="80" y="240" fill="${colors.muted}" font-family="'Fraunces', serif" font-style="italic" font-weight="900" font-size="120" opacity="0.18">Design</text>
      `;

      foregroundDecorations = `
        <!-- Asymmetric offset borders -->
        ${shape === 'CIRCLE'
          ? `<circle cx="${cx - 6}" cy="${cy - 6}" r="380" fill="none" stroke="${colors.accent}" stroke-width="2" />
             <circle cx="${cx}" cy="${cy}" r="380" fill="none" stroke="${colors.text}" stroke-width="2" />`
          : `<rect x="${containerX - 6}" y="${containerY - 6}" width="${containerSize}" height="${containerSize}" rx="48" ry="48" fill="none" stroke="${colors.accent}" stroke-width="2.5" />
             <rect x="${containerX}" y="${containerY}" width="${containerSize}" height="${containerSize}" rx="48" ry="48" fill="none" stroke="${colors.text}" stroke-width="2" />`
        }

        <!-- Design details -->
        <g transform="translate(140, 110)">
          <text x="0" y="0" fill="${colors.text}" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="13">GRID_SYSTEM: ACTIVE</text>
          <text x="0" y="16" fill="${colors.accent}" font-family="'JetBrains Mono', monospace" font-size="11">CMYK: 0.15.82.0</text>
        </g>
        <g transform="translate(710, 110)">
          <text x="170" y="0" fill="${colors.text}" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="13" text-anchor="end">ASPECT: 1:1 SQUARE</text>
          <text x="170" y="16" fill="${colors.accent}" font-family="'JetBrains Mono', monospace" font-size="11" text-anchor="end">RESOLUTION: 1024DPI</text>
        </g>

        <!-- Dynamic tick marks -->
        <line x1="${containerX}" y1="${containerY + 50}" x2="${containerX + 30}" y2="${containerY + 50}" stroke="${colors.accent}" stroke-width="1.5" />
        <line x1="${containerX + 50}" y1="${containerY}" x2="${containerX + 50}" y2="${containerY + 30}" stroke="${colors.accent}" stroke-width="1.5" />
      `;

      themeTitleSection = `
        <text x="512" y="875" fill="${colors.text}" font-family="'Fraunces', serif" font-weight="900" font-size="64" text-anchor="middle" letter-spacing="-1.5px">CREATIVE BUILDER</text>
        <text x="512" y="918" fill="${colors.text}" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="26" text-anchor="middle" letter-spacing="1px">${displayName}</text>
        <text x="512" y="948" fill="${colors.accent}" font-family="'Fraunces', serif" font-weight="700" font-style="italic" font-size="14" text-anchor="middle" letter-spacing="1px">${displayPosition}</text>

        <text x="80" y="980" fill="${colors.text}" font-family="'JetBrains Mono', monospace" font-size="11" opacity="0.5">HACKER HOUSE GOA 2026 // DESIGN</text>
        <text x="944" y="980" fill="${colors.text}" font-family="'JetBrains Mono', monospace" font-size="11" text-anchor="end" opacity="0.5">GOA, INDIA // 28–31 OCT 2026</text>
      `;
      break;

    case 'CONTENT_CREATOR':
      // Publishing/media layout
      backgroundDecorations = `
        <defs>
          <pattern id="media-lines" width="1024" height="20" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="1024" y2="0" stroke="${colors.muted}" stroke-width="0.8" opacity="0.2" />
          </pattern>
        </defs>
        <rect width="1024" height="1024" fill="url(#media-lines)" />
        
        <!-- Outer boundaries -->
        <rect x="40" y="40" width="944" height="944" fill="none" stroke="${colors.muted}" stroke-width="1" opacity="0.3" />
      `;

      foregroundDecorations = `
        <!-- Camera viewfinder corners overlay -->
        <g stroke="${colors.accent}" stroke-width="2.5" fill="none" opacity="0.8">
          <!-- Top Left -->
          <path d="M ${containerX + 20} ${containerY + 60} L ${containerX + 20} ${containerY + 20} L ${containerX + 60} ${containerY + 20}" />
          <!-- Top Right -->
          <path d="M ${containerX + containerSize - 60} ${containerY + 20} L ${containerX + containerSize - 20} ${containerY + 20} L ${containerX + containerSize - 20} ${containerY + 60}" />
          <!-- Bottom Left -->
          <path d="M ${containerX + 20} ${containerY + containerSize - 60} L ${containerX + 20} ${containerY + containerSize - 20} L ${containerX + 60} ${containerY + containerSize - 20}" />
          <!-- Bottom Right -->
          <path d="M ${containerX + containerSize - 60} ${containerY + containerSize - 20} L ${containerX + containerSize - 20} ${containerY + containerSize - 20} L ${containerX + containerSize - 20} ${containerY + containerSize - 60}" />
        </g>
        
        <!-- Viewfinder center bracket -->
        <g stroke="${colors.text}" stroke-width="1" opacity="0.4" fill="none">
          <line x1="${cx - 15}" y1="${cy}" x2="${cx + 15}" y2="${cy}" />
          <line x1="${cx}" y1="${cy - 15}" x2="${cx}" y2="${cy + 15}" />
        </g>

        <!-- Red REC dot overlay -->
        <g transform="translate(730, 110)">
          <circle cx="10" cy="8" r="6" fill="${colors.coral || '#f2725c'}" />
          <text x="24" y="12" fill="${colors.text}" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700">REC [LIVE]</text>
        </g>

        <g transform="translate(150, 110)">
          <text x="10" y="12" fill="${colors.text}" font-family="'JetBrains Mono', monospace" font-size="11" opacity="0.7">SHUTTER: 1/125s</text>
          <text x="10" y="26" fill="${colors.text}" font-family="'JetBrains Mono', monospace" font-size="11" opacity="0.7">ISO: 400</text>
        </g>
      `;

      themeTitleSection = `
        <text x="512" y="875" fill="${colors.text}" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="64" text-anchor="middle" letter-spacing="-1.5px">CONTENT CREATOR</text>
        <text x="512" y="918" fill="${colors.text}" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="26" text-anchor="middle" letter-spacing="1px">${displayName}</text>
        <text x="512" y="948" fill="${colors.accent}" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="13" text-anchor="middle" letter-spacing="1px">${displayPosition}</text>

        <text x="80" y="980" fill="${colors.text}" font-family="'Space Grotesk', sans-serif" font-size="12" opacity="0.5">HACKER HOUSE GOA 2026 // CONTENT</text>
        <text x="944" y="980" fill="${colors.text}" font-family="'JetBrains Mono', monospace" font-size="12" text-anchor="end" opacity="0.5">GOA, INDIA // 28–31 OCT 2026</text>
      `;
      break;

    case 'NIGHT_SHIPPER':
      // Late night maker theme (stars, moon outline, night sky coordinate ticks)
      backgroundDecorations = `
        <!-- Night sky decorations -->
        <!-- Constellation dots -->
        <circle cx="200" cy="180" r="1.5" fill="${colors.accent}" opacity="0.7" />
        <circle cx="240" cy="150" r="1.5" fill="${colors.accent}" opacity="0.5" />
        <circle cx="280" cy="170" r="2" fill="${colors.accent}" opacity="0.8" />
        <line x1="200" y1="180" x2="280" y2="170" stroke="${colors.muted}" stroke-width="0.5" opacity="0.4" />
        <line x1="280" y1="170" x2="240" y2="150" stroke="${colors.muted}" stroke-width="0.5" opacity="0.4" />

        <circle cx="800" cy="200" r="2.5" fill="${colors.accent}" opacity="0.9" />
        <circle cx="850" cy="280" r="1.5" fill="${colors.accent}" opacity="0.6" />
        
        <!-- Lunar outline -->
        <path d="M 860 140 A 30 30 0 0 1 820 100 A 30 30 0 0 0 860 140 Z" fill="${colors.accent}" opacity="0.25" />

        <!-- Vertical grid lines on margins -->
        <line x1="60" y1="0" x2="60" y2="1024" stroke="${colors.muted}" stroke-width="0.8" opacity="0.2" />
        <line x1="964" y1="0" x2="964" y2="1024" stroke="${colors.muted}" stroke-width="0.8" opacity="0.2" />
      `;

      foregroundDecorations = `
        <!-- High impact simple border with yellow corners -->
        ${shape === 'CIRCLE'
          ? `<circle cx="${cx}" cy="${cy}" r="382" fill="none" stroke="${colors.accent}" stroke-width="2" />`
          : `<rect x="${containerX}" y="${containerY}" width="${containerSize}" height="${containerSize}" rx="48" ry="48" fill="none" stroke="${colors.muted}" stroke-width="1.5" />
             <rect x="${containerX - 2}" y="${containerY - 2}" width="${containerSize + 4}" height="${containerSize + 4}" rx="50" ry="50" fill="none" stroke="${colors.accent}" stroke-width="2.5" />`
        }

        <!-- Ship detail metrics -->
        <g transform="translate(150, 110)">
          <text x="10" y="12" fill="${colors.accent}" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700">SYS_TIME: 03:42:09 AM</text>
          <text x="10" y="26" fill="${colors.text}" font-family="'JetBrains Mono', monospace" font-size="11" opacity="0.6">FUEL_METRIC: CAFFEINE</text>
        </g>
        
        <g transform="translate(710, 110)">
          <text x="160" y="12" fill="${colors.text}" font-family="'JetBrains Mono', monospace" font-size="11" text-anchor="end" opacity="0.6">STREAK: ACTIVE</text>
          <text x="160" y="26" fill="${colors.accent}" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" text-anchor="end">[PROD_DEPLOY: OK]</text>
        </g>
      `;

      themeTitleSection = `
        <text x="512" y="875" fill="${colors.text}" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="64" text-anchor="middle" letter-spacing="-2px">NIGHT SHIPPER</text>
        <text x="512" y="918" fill="${colors.text}" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="26" text-anchor="middle" letter-spacing="1px">${displayName}</text>
        <text x="512" y="948" fill="${colors.accent}" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="13" text-anchor="middle" letter-spacing="1px">${displayPosition}</text>

        <!-- Footer -->
        <text x="80" y="980" fill="${colors.text}" font-family="'Space Grotesk', sans-serif" font-size="12" opacity="0.5">HACKER HOUSE GOA 2026 // BUILD &amp; SHIP</text>
        <text x="944" y="980" fill="${colors.text}" font-family="'JetBrains Mono', monospace" font-size="12" text-anchor="end" opacity="0.5">GOA, INDIA // 28–31 OCT 2026 // 247</text>
      `;
      break;
  }

  // Final SVG String composition.
  // Note: All custom fonts must be declared indefs/style.
  // If we are exporting to PNG, embedFontsCss will have base64 files.
  // In the browser, it is empty and loads fonts from the parent document automatically.
  return `
<svg viewBox="0 0 1024 1024" width="1024" height="1024" xmlns="http://www.w3.org/2000/svg" style="background-color: ${colors.bg};">
  <defs>
    <!-- Fonts inclusion -->
    <style>
      ${embedFontsCss || `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Space+Grotesk:wght@300..700&display=swap');
      `}
      
      /* Base classes for styles */
      svg {
        background-color: ${colors.bg};
        user-select: none;
      }
    </style>

    <!-- Clipping path for user photo -->
    <clipPath id="photo-clip">
      ${clipPathSvg}
    </clipPath>
  </defs>

  <!-- BACKGROUND DECORATIONS -->
  ${backgroundDecorations}

  <!-- THE PHOTO -->
  ${photoElement}

  <!-- FOREGROUND ACCENTS & BORDERS -->
  ${foregroundDecorations}

  <!-- DYNAMIC AND GENERAL TEXTS (BRANDING) -->
  <!-- Top brand line -->
  <g transform="translate(512, 50)">
    <text text-anchor="middle" fill="${colors.text}" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="18" letter-spacing="8px">HACKER HOUSE GOA 2026</text>
    <line x1="-120" y1="8" x2="120" y2="8" stroke="${colors.accent}" stroke-width="1.5" />
  </g>

  <!-- DYNAMIC THEME TITLE & METADATA -->
  ${themeTitleSection}
</svg>
  `.trim();
}
