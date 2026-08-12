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

  // Circle mask dimensions centered at cx=512, cy=435, r=210
  const containerSize = 420;
  const containerX = 302;
  const containerY = 225;

  const cx = 512;
  const cy = 435;

  // Calculate photo positioning inside the 420x420 mask container
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
    const placeholderX = containerX;
    const placeholderY = containerY;
    photoElement = `
      <g clip-path="url(#photo-clip)">
        <rect x="${placeholderX}" y="${placeholderY}" width="${containerSize}" height="${containerSize}" fill="#0f2b48" />
        <text x="${cx}" y="${cy - 10}" fill="#ffffff" opacity="0.3" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="20" text-anchor="middle">NO PHOTO</text>
        <text x="${cx}" y="${cy + 15}" fill="#ffde6a" opacity="0.5" font-family="'JetBrains Mono', monospace" font-size="12" text-anchor="middle">[AWAITING_UPLOAD]</text>
      </g>
    `;
  }

  // Define mask paths
  const clipPathSvg = `<circle cx="512" cy="435" r="210" />`;

  // Determine dynamic builder class and ID
  let builderClass = 'SHIPPING WIZARD';
  if (theme.id === 'CYBER_DEFENDER') builderClass = 'CYBER SENTINEL';
  else if (theme.id === 'AI_EXPLORER') builderClass = 'NEURAL PIONEER';
  else if (theme.id === 'CODE_BUILDER') builderClass = 'SHIPPING WIZARD';
  else if (theme.id === 'CREATIVE_BUILDER') builderClass = 'PIXEL ALCHEMIST';
  else if (theme.id === 'CONTENT_CREATOR') builderClass = 'NARRATIVE ARCHITECT';
  else if (theme.id === 'NIGHT_SHIPPER') builderClass = 'MIDNIGHT CAPTAIN';

  const builderId = `#HH-GOA-${(name.trim() ? name.length * 377 + position.length * 13 : 7757) % 10000}`;

  // Custom Identity Accent Overlay (viewfinder corners/lines)
  let identityOverlay = '';
  if (themeId === 'CYBER_DEFENDER') {
    identityOverlay = `
      <!-- Cyber connection lines around photo -->
      <g stroke="#00f0ff" stroke-width="1.5" opacity="0.35" fill="none">
        <path d="M 302 435 L 250 435 L 220 405" />
        <path d="M 722 435 L 772 435 L 802 405" />
        <circle cx="220" cy="405" r="3.5" fill="#00f0ff" />
        <circle cx="802" cy="405" r="3.5" fill="#00f0ff" />
      </g>
    `;
  } else if (themeId === 'AI_EXPLORER') {
    identityOverlay = `
      <!-- Concentric tech orbit rings -->
      <circle cx="${cx}" cy="${cy}" r="240" fill="none" stroke="#00f0ff" stroke-width="1" opacity="0.3" stroke-dasharray="2 10" />
      <circle cx="${cx}" cy="${cy}" r="250" fill="none" stroke="#38bdf8" stroke-width="0.8" opacity="0.25" />
    `;
  } else if (themeId === 'CODE_BUILDER') {
    identityOverlay = `
      <!-- Code bracket indicators around photo corners -->
      <g stroke="#38bdf8" stroke-width="2.5" opacity="0.45" fill="none">
        <path d="M 270 240 L 240 240 L 240 270" />
        <path d="M 754 240 L 784 240 L 784 270" />
        <path d="M 240 600 L 240 630 L 270 630" />
        <path d="M 784 600 L 784 630 L 754 630" />
      </g>
    `;
  } else if (themeId === 'CREATIVE_BUILDER') {
    identityOverlay = `
      <!-- Flowing creative curves around photo -->
      <path d="M 240 435 Q 350 400, 512 435 T 784 435" fill="none" stroke="#ff007f" stroke-width="1.5" opacity="0.3" />
      <path d="M 240 455 Q 350 420, 512 455 T 784 455" fill="none" stroke="#ffde6a" stroke-width="1" opacity="0.25" />
    `;
  } else if (themeId === 'CONTENT_CREATOR') {
    identityOverlay = `
      <!-- Camera viewfinder corner ticks -->
      <g stroke="#00f0ff" stroke-width="2" opacity="0.45" fill="none">
        <path d="M 292 235 L 292 215 L 312 215" />
        <path d="M 712 215 L 732 215 L 732 235" />
        <path d="M 292 635 L 292 655 L 312 655" />
        <path d="M 712 655 L 732 655 L 732 635" />
      </g>
    `;
  } else if (themeId === 'NIGHT_SHIPPER') {
    identityOverlay = `
      <!-- Constellation dot mappings in sky -->
      <circle cx="200" cy="180" r="1.5" fill="#38bdf8" opacity="0.8" />
      <circle cx="280" cy="150" r="1" fill="#ffde6a" opacity="0.7" />
      <circle cx="800" cy="190" r="2" fill="#38bdf8" opacity="0.9" />
    `;
  }

  return `
<svg viewBox="0 0 1024 1024" width="1024" height="1024" xmlns="http://www.w3.org/2000/svg" style="background-color: #020b14;">
  <defs>
    <!-- Fonts inclusion -->
    <style>
      ${embedFontsCss || `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Space+Grotesk:wght@300..700&display=swap');
      `}
      
      svg {
        background-color: #020b14;
        user-select: none;
      }
    </style>

    <!-- Clipping path for circular user photo -->
    <clipPath id="photo-clip">
      ${clipPathSvg}
    </clipPath>

    <!-- Sky to Ocean Gradient -->
    <linearGradient id="sky-ocean-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#bae6fd" />
      <stop offset="25%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#0284c7" />
      <stop offset="75%" stop-color="#0c4a6e" />
      <stop offset="100%" stop-color="#021526" />
    </linearGradient>

    <!-- Subtle background dots grid -->
    <pattern id="grid-dots" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="#ffffff" opacity="0.1" />
    </pattern>
  </defs>

  <!-- 1. BACKDROP TROPICAL GRADIENT -->
  <rect width="1024" height="1024" fill="url(#sky-ocean-grad)" />
  <rect width="1024" height="1024" fill="url(#grid-dots)" />

  <!-- 2. ENVIRONMENT SCENERY ILLUSTRATED -->
  <!-- Distant islands -->
  <path d="M 0 350 Q 150 330, 300 350 T 600 350 T 900 350 L 1024 350 L 1024 360 L 0 360 Z" fill="#013c58" opacity="0.8" />
  <path d="M 120 350 Q 250 320, 380 350 T 700 350 L 1024 350 L 1024 355 L 0 355 Z" fill="#002b40" opacity="0.9" />

  <!-- Exactly 2 soar birds on left -->
  <path d="M 220 130 Q 230 110, 240 130 Q 250 110, 260 130" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
  <path d="M 280 160 Q 288 145, 296 160 Q 304 145, 312 160" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" opacity="0.8" />

  <!-- Sailboat on the left -->
  <g transform="translate(110, 270)">
    <path d="M 10 70 L 60 70 L 70 55 L 0 55 Z" fill="#ffffff" />
    <path d="M 10 70 L 60 70 L 55 75 L 15 75 Z" fill="#0284c7" />
    <line x1="35" y1="55" x2="35" y2="10" stroke="#0f172a" stroke-width="2" />
    <path d="M 35 15 L 65 50 L 37 50 Z" fill="#bae6fd" />
    <path d="M 33 20 L 10 50 L 33 50 Z" fill="#00f0ff" />
    <path d="M 35 10 L 45 13 L 35 16 Z" fill="#ffde6a" />
  </g>

  <!-- Right-side coast beach hills & palms -->
  <path d="M 750 350 Q 880 310, 1024 220 L 1024 450 Q 880 430, 750 350 Z" fill="#0c4a6e" />
  <!-- Palm 1 -->
  <path d="M 980 250 Q 940 180, 920 100" fill="none" stroke="#052e16" stroke-width="8" stroke-linecap="round" />
  <path d="M 920 100 Q 880 110, 850 140 M 920 100 Q 890 80, 870 50 M 920 100 Q 940 70, 970 60 M 920 100 Q 950 110, 980 130 M 920 100 Q 910 130, 890 160" fill="none" stroke="#14532d" stroke-width="4" stroke-linecap="round" />
  <!-- Palm 2 -->
  <path d="M 1010 240 Q 980 150, 950 80" fill="none" stroke="#052e16" stroke-width="10" stroke-linecap="round" />
  <path d="M 950 80 Q 910 90, 880 120 M 950 80 Q 920 60, 900 30 M 950 80 Q 970 50, 1000 40 M 950 80 Q 980 90, 1010 110" fill="none" stroke="#15803d" stroke-width="5" stroke-linecap="round" />

  <!-- Left-side beach palm -->
  <path d="M 40 280 Q 70 180, 90 90" fill="none" stroke="#052e16" stroke-width="12" stroke-linecap="round" />
  <path d="M 90 90 Q 50 100, 20 130 M 90 90 Q 60 70, 40 40 M 90 90 Q 110 60, 140 50 M 90 90 Q 120 100, 150 120 M 90 90 Q 80 120, 60 150" fill="none" stroke="#166534" stroke-width="6" stroke-linecap="round" />

  <!-- Dotted Postage Stamp (Top Left) -->
  <g transform="translate(45, 30)">
    <rect x="0" y="0" width="110" height="110" fill="#0f2b48" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="4 4" rx="4" />
    <text x="15" y="25" fill="#38bdf8" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="12">GOA</text>
    <text x="15" y="40" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="12">INDIA</text>
    <circle cx="55" cy="80" r="14" fill="#ffde6a" />
    <path d="M 30 85 Q 55 80, 80 85 T 100 85" fill="none" stroke="#38bdf8" stroke-width="2" />
    <path d="M 25 91 Q 55 87, 85 91" fill="none" stroke="#ffffff" stroke-width="1.5" />
  </g>

  <!-- Circular Stamp (Top Right) -->
  <g transform="translate(865, 30)" opacity="0.9">
    <circle cx="50" cy="50" r="45" fill="none" stroke="#ffffff" stroke-width="1" stroke-dasharray="3 3" />
    <circle cx="50" cy="50" r="40" fill="none" stroke="#ffde6a" stroke-width="1.5" />
    <text x="50" y="42" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="8" text-anchor="middle">BUILD IN GOA</text>
    <path d="M 25 50 Q 50 45, 75 50" fill="none" stroke="#ffde6a" stroke-width="1" />
    <text x="50" y="65" fill="#38bdf8" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="7" text-anchor="middle">SHIP FROM PARADISE</text>
  </g>

  <!-- Left wooden signpost -->
  <g transform="translate(25, 410)">
    <rect x="75" y="0" width="12" height="150" fill="#78350f" rx="2" />
    <!-- BUILD sign -->
    <g transform="translate(0, 10)">
      <path d="M 0 0 L 80 0 L 95 12 L 80 24 L 0 24 Z" fill="#ffde6a" />
      <text x="40" y="17" fill="#0f2537" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="11" text-anchor="middle">BUILD</text>
    </g>
    <!-- SHIP sign -->
    <g transform="translate(5, 45)">
      <path d="M 0 0 L 75 0 L 90 12 L 75 24 L 0 24 Z" fill="#0284c7" />
      <text x="38" y="17" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="11" text-anchor="middle">SHIP</text>
    </g>
    <!-- REPEAT sign -->
    <g transform="translate(0, 80)">
      <path d="M 0 0 L 80 0 L 95 12 L 80 24 L 0 24 Z" fill="#0ea5e9" />
      <text x="40" y="17" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="10" text-anchor="middle">REPEAT</text>
    </g>
  </g>

  <!-- LET'S BUILD post-it tag (Right) -->
  <g transform="translate(825, 260) rotate(8)">
    <rect x="0" y="0" width="110" height="75" fill="#0f3b5f" stroke="#ffde6a" stroke-width="1.5" rx="4" />
    <text x="55" y="32" fill="#ffde6a" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="14" text-anchor="middle">LET'S</text>
    <text x="55" y="52" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="14" text-anchor="middle">BUILD!</text>
  </g>

  <!-- 3. TOP BRANDING TITLE BLOCK -->
  <g transform="translate(512, 12)">
    <rect x="-60" y="0" width="120" height="88" fill="#0f2b48" rx="8" stroke="#ffde6a" stroke-width="1.5" />
    <path d="M -8 18 Q 0 10, 8 18 M 0 10 L 0 35 M -12 28 Q 0 20, 12 28" fill="none" stroke="#ffde6a" stroke-width="2" stroke-linecap="round" />
    <text x="0" y="48" fill="#ffde6a" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="15" text-anchor="middle" letter-spacing="1px">HH</text>
    <text x="0" y="63" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="12" text-anchor="middle" letter-spacing="0.5px">GOA</text>
    <text x="0" y="78" fill="#ffde6a" font-family="'JetBrains Mono', monospace" font-size="10" text-anchor="middle">2026</text>
  </g>

  <g transform="translate(512, 135)">
    <text x="0" y="0" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="46" text-anchor="middle" letter-spacing="-1px">HACKER <tspan fill="#ffde6a" font-family="'Fraunces', serif" font-style="italic">Goa</tspan> HOUSE</text>
    <!-- Under Title Year Pill -->
    <rect x="-85" y="10" width="170" height="28" fill="#0f2b48" rx="14" stroke="#38bdf8" stroke-width="1.5" />
    <text x="0" y="30" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="16" text-anchor="middle" letter-spacing="3px">2026</text>
    <text x="0" y="56" fill="#bae6fd" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="10" text-anchor="middle" letter-spacing="4px">BUILD • INNOVATE • IMPACT</text>
  </g>

  <!-- Left/Right margins metadata -->
  <g transform="translate(45, 235)">
    <text x="0" y="0" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="12" opacity="0.8">28 – 31</text>
    <text x="0" y="15" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="12" opacity="0.8">OCT 2026</text>
    
    <!-- Location Pin -->
    <path d="M 0 35c0-4.4 3.6-8 8-8s8 3.6 8 8c0 4.4-8 12-8 12S 0 39.4 0 35z" fill="#ffde6a" transform="translate(0, 15)" />
    <text x="22" y="46" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="12" transform="translate(0, 15)">GOA</text>
    <text x="22" y="58" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="10" opacity="0.7" transform="translate(0, 15)">INDIA</text>
  </g>

  <!-- 4. PHOTO WORKSPACE LAYOUT -->
  <!-- Outer white frame of circular photo -->
  <circle cx="${cx}" cy="${cy}" r="222" fill="none" stroke="#ffffff" stroke-width="4.5" />
  <!-- HUD circular ticks inside -->
  <circle cx="${cx}" cy="${cy}" r="215" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="6 8" />

  <!-- DYNAMIC USER PHOTO -->
  ${photoElement}

  <!-- Wave crashing overlay on the circular boundary (bottom left) -->
  <g transform="translate(${cx - 170}, ${cy + 95})">
    <path d="M 0 60 C 20 40, 50 10, 80 0 C 95 -5, 110 5, 120 20 C 130 35, 125 50, 100 65 C 80 75, 40 80, 0 60 Z" fill="#0284c7" />
    <path d="M 5 62 C 22 45, 52 20, 78 10 C 90 5, 102 12, 110 25 Q 90 40, 70 55 C 50 65, 25 70, 5 62 Z" fill="#00f0ff" />
    <path d="M 10 65 C 25 50, 55 30, 75 22 C 85 18, 92 22, 98 30 Q 82 42, 65 54 C 48 62, 28 68, 10 65 Z" fill="#ffffff" />
    <circle cx="105" cy="15" r="3.5" fill="#ffffff" />
    <circle cx="115" cy="28" r="2.5" fill="#ffffff" />
    <circle cx="85" cy="8" r="2" fill="#ffffff" />
  </g>

  <!-- DYNAMIC IDENTITY BADGE OVERLAY (on the right of the photo) -->
  <g transform="translate(730, 440)">
    <circle cx="45" cy="45" r="40" fill="#0f2b48" stroke="#38bdf8" stroke-width="2" />
    
    <!-- Dynamic Identity Icon -->
    ${themeId === 'CYBER_DEFENDER' 
      ? `<path d="M 45 25 L 65 32 L 65 52 C 65 64, 45 72, 45 72 C 45 72, 25 64, 25 52 L 25 32 Z" fill="none" stroke="#00f0ff" stroke-width="2.5" />
         <circle cx="45" cy="48" r="6" fill="#00f0ff" />`
      : themeId === 'AI_EXPLORER'
      ? `<circle cx="45" cy="45" r="18" fill="none" stroke="#00f0ff" stroke-width="2.5" />
         <circle cx="45" cy="45" r="8" fill="#00f0ff" />
         <path d="M 22 45 L 68 45 M 45 22 L 45 68" stroke="#00f0ff" stroke-width="1.5" stroke-dasharray="2 2" />`
      : themeId === 'CODE_BUILDER'
      ? `<path d="M 33 37 L 23 45 L 33 53 M 57 37 L 67 45 L 57 53 M 49 31 L 41 59" stroke="#00f0ff" stroke-width="3" stroke-linecap="round" />`
      : themeId === 'CREATIVE_BUILDER'
      ? `<path d="M 30 55 C 30 35, 60 35, 60 55 C 60 65, 45 65, 45 70" fill="none" stroke="#ff007f" stroke-width="3" />
         <circle cx="45" cy="30" r="8" fill="#ff007f" />`
      : themeId === 'CONTENT_CREATOR'
      ? `<rect x="25" y="32" width="30" height="22" rx="4" fill="none" stroke="#00f0ff" stroke-width="2.5" />
         <path d="M 55 38 L 67 31 L 67 55 L 55 48 Z" fill="#00f0ff" />`
      : `<path d="M 30 60 L 45 25 L 60 60 Z" fill="none" stroke="#38bdf8" stroke-width="2.5" />
         <circle cx="45" cy="22" r="4" fill="#ffde6a" />`
    }
    
    <!-- Label -->
    <text x="45" y="102" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="11" text-anchor="middle" letter-spacing="1px">${theme.name.toUpperCase()}</text>
  </g>

  <!-- CUSTOM IDENTITY ACCENT OVERLAY -->
  ${identityOverlay}

  <!-- 5. NAME & POSITION PILLS -->
  <!-- Name badge rounded container -->
  <g transform="translate(150, 622)">
    <rect x="0" y="0" width="724" height="60" fill="#0f2b48" rx="30" stroke="#38bdf8" stroke-width="2.5" />
    <text x="35" y="38" fill="#ffde6a" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="24">✦</text>
    <text x="689" y="38" fill="#ffde6a" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="24" text-anchor="end">✦</text>
    <text x="362" y="41" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="28" text-anchor="middle" letter-spacing="1px">${displayName}</text>
  </g>

  <!-- Position pill underneath -->
  <g transform="translate(300, 694)">
    <rect x="0" y="0" width="424" height="34" fill="#ffde6a" rx="17" />
    <text x="212" y="22" fill="#0f2b48" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="14" text-anchor="middle" letter-spacing="0.5px">⚡ ${displayPosition} ⚡</text>
  </g>

  <!-- 6. THREE-COLUMN BOTTOM META INFORMATION SYSTEM -->
  <g transform="translate(0, 755)">
    <!-- Vertical Column Dividers -->
    <line x1="330" y1="10" x2="330" y2="180" stroke="#38bdf8" stroke-width="1.5" opacity="0.3" stroke-dasharray="4 4" />
    <line x1="650" y1="10" x2="650" y2="180" stroke="#38bdf8" stroke-width="1.5" opacity="0.3" stroke-dasharray="4 4" />

    <!-- Column 1: BUILDER CLASS -->
    <g transform="translate(60, 0)">
      <text x="110" y="20" fill="#38bdf8" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="12" text-anchor="middle" letter-spacing="1.5px">✦ BUILDER CLASS ✦</text>
      <text x="110" y="44" fill="#ffffff" font-family="'Fraunces', serif" font-weight="900" font-size="16" text-anchor="middle" letter-spacing="-0.5px">${builderClass}</text>
      
      <!-- Mock Vector QR Code -->
      <g transform="translate(50, 60)">
        <rect x="0" y="0" width="120" height="120" fill="#ffffff" rx="8" />
        <rect x="10" y="10" width="30" height="30" fill="#0f2b48" />
        <rect x="15" y="15" width="20" height="20" fill="#ffffff" />
        <rect x="18" y="18" width="14" height="14" fill="#0f2b48" />
        
        <rect x="80" y="10" width="30" height="30" fill="#0f2b48" />
        <rect x="85" y="15" width="20" height="20" fill="#ffffff" />
        <rect x="88" y="18" width="14" height="14" fill="#0f2b48" />
        
        <rect x="10" y="80" width="30" height="30" fill="#0f2b48" />
        <rect x="15" y="85" width="20" height="20" fill="#ffffff" />
        <rect x="18" y="88" width="14" height="14" fill="#0f2b48" />
        
        <!-- Random QR code data dots -->
        <rect x="50" y="15" width="10" height="20" fill="#0ea5e9" />
        <rect x="50" y="45" width="20" height="10" fill="#0ea5e9" />
        <rect x="15" y="50" width="20" height="10" fill="#0ea5e9" />
        <rect x="80" y="50" width="15" height="15" fill="#0ea5e9" />
        <rect x="50" y="80" width="20" height="20" fill="#0ea5e9" />
        <rect x="80" y="80" width="10" height="10" fill="#0ea5e9" />
        
        <!-- Mini Palm tree at QR center -->
        <path d="M 60 70 L 60 50 Q 50 52, 48 60 M 60 50 Q 70 52, 72 60 M 60 50 Q 55 45, 50 40 M 60 50 Q 65 45, 70 40" fill="none" stroke="#166534" stroke-width="2.5" />
      </g>
    </g>

    <!-- Column 2: BEACH BAG -->
    <g transform="translate(360, 0)">
      <text x="110" y="20" fill="#38bdf8" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="12" text-anchor="middle" letter-spacing="1.5px">✦ BEACH BAG ✦</text>
      
      <!-- Coconut -->
      <g transform="translate(10, 42)">
        <circle cx="20" cy="10" r="10" fill="#78350f" />
        <path d="M 12 6 Q 16 10, 20 8 M 22 4 Q 24 10, 20 12" fill="none" stroke="#ffffff" stroke-width="1.5" />
        <text x="45" y="14" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="11" letter-spacing="0.5px">COCONUT</text>
      </g>
      
      <!-- VS Code -->
      <g transform="translate(10, 74)">
        <rect x="10" y="2" width="20" height="16" fill="#0ea5e9" rx="3" />
        <path d="M 14 6 L 18 10 L 14 14" fill="none" stroke="#ffffff" stroke-width="2" />
        <text x="45" y="14" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="11" letter-spacing="0.5px">VS CODE</text>
      </g>
      
      <!-- Lo-Fi Beats -->
      <g transform="translate(10, 106)">
        <path d="M 12 18 L 12 10 A 8 8 0 0 1 28 10 L 28 18" fill="none" stroke="#ffde6a" stroke-width="3" stroke-linecap="round" />
        <circle cx="12" cy="18" r="4" fill="#ffde6a" />
        <circle cx="28" cy="18" r="4" fill="#ffde6a" />
        <text x="45" y="14" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="11" letter-spacing="0.5px">LO-FI BEATS</text>
      </g>
      
      <!-- Surfboard -->
      <g transform="translate(10, 138)">
        <path d="M 20 0 Q 25 10, 25 20 Q 25 30, 20 35 Q 15 30, 15 20 Q 15 10, 20 0 Z" fill="#00f0ff" />
        <path d="M 20 0 L 20 35" stroke="#ffffff" stroke-width="1.2" />
        <text x="45" y="14" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="11" letter-spacing="0.5px">SURFBOARD</text>
      </g>
    </g>

    <!-- Column 3: CURRENTLY SHIPPING -->
    <g transform="translate(660, 0)">
      <text x="135" y="20" fill="#38bdf8" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="12" text-anchor="middle" letter-spacing="1.5px">✦ CURRENTLY SHIPPING ✦</text>
      <text x="135" y="44" fill="#ffffff" font-family="'Fraunces', serif" font-weight="900" font-size="16" text-anchor="middle" letter-spacing="-0.5px">BUILDING THE FUTURE</text>
      
      <!-- Mock Barcode System -->
      <g transform="translate(45, 60)">
        <line x1="0" y1="0" x2="0" y2="40" stroke="#ffffff" stroke-width="2" />
        <line x1="5" y1="0" x2="5" y2="40" stroke="#ffffff" stroke-width="4" />
        <line x1="12" y1="0" x2="12" y2="40" stroke="#ffffff" stroke-width="1" />
        <line x1="16" y1="0" x2="16" y2="40" stroke="#ffffff" stroke-width="3" />
        <line x1="23" y1="0" x2="23" y2="40" stroke="#ffffff" stroke-width="5" />
        <line x1="32" y1="0" x2="32" y2="40" stroke="#ffffff" stroke-width="2" />
        <line x1="38" y1="0" x2="38" y2="40" stroke="#ffffff" stroke-width="4" />
        <line x1="46" y1="0" x2="46" y2="40" stroke="#ffffff" stroke-width="1" />
        <line x1="50" y1="0" x2="50" y2="40" stroke="#ffffff" stroke-width="3" />
        <line x1="58" y1="0" x2="58" y2="40" stroke="#ffffff" stroke-width="6" />
        <line x1="68" y1="0" x2="68" y2="40" stroke="#ffffff" stroke-width="2" />
        <line x1="74" y1="0" x2="74" y2="40" stroke="#ffffff" stroke-width="4" />
        <line x1="82" y1="0" x2="82" y2="40" stroke="#ffffff" stroke-width="1" />
        <line x1="86" y1="0" x2="86" y2="40" stroke="#ffffff" stroke-width="3" />
        <line x1="94" y1="0" x2="94" y2="40" stroke="#ffffff" stroke-width="5" />
        <line x1="104" y1="0" x2="104" y2="40" stroke="#ffffff" stroke-width="2" />
        <line x1="110" y1="0" x2="110" y2="40" stroke="#ffffff" stroke-width="4" />
        <line x1="118" y1="0" x2="118" y2="40" stroke="#ffffff" stroke-width="1" />
        <line x1="122" y1="0" x2="122" y2="40" stroke="#ffffff" stroke-width="3" />
        <line x1="130" y1="0" x2="130" y2="40" stroke="#ffffff" stroke-width="6" />
        <line x1="140" y1="0" x2="140" y2="40" stroke="#ffffff" stroke-width="2" />
        <line x1="146" y1="0" x2="146" y2="40" stroke="#ffffff" stroke-width="4" />
        <line x1="154" y1="0" x2="154" y2="40" stroke="#ffffff" stroke-width="1" />
        <line x1="158" y1="0" x2="158" y2="40" stroke="#ffffff" stroke-width="3" />
        <line x1="166" y1="0" x2="166" y2="40" stroke="#ffffff" stroke-width="5" />
        <text x="83" y="55" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="10" text-anchor="middle">BUILDER ID: ${builderId}</text>
      </g>
      
      <!-- Coder illustration under tree -->
      <g transform="translate(20, 115)">
        <line x1="0" y1="45" x2="180" y2="45" stroke="#ffffff" stroke-width="1" opacity="0.3" />
        <path d="M 160 45 Q 150 20, 140 5" fill="none" stroke="#78350f" stroke-width="3" />
        <path d="M 140 5 Q 110 5, 90 20 M 140 5 Q 120 -10, 100 -20 M 140 5 Q 160 -10, 180 -15 M 140 5 Q 170 10, 190 20" fill="none" stroke="#166534" stroke-width="2.5" />
        <circle cx="80" cy="36" r="5" fill="#38bdf8" />
        <path d="M 80 41 L 80 45 L 75 45 M 80 41 L 88 43 L 92 45" stroke="#38bdf8" stroke-width="2.5" fill="none" />
        <polygon points="92,40 98,34 98,45" fill="#ffde6a" opacity="0.75" />
        <line x1="92" y1="45" x2="98" y2="45" stroke="#ffffff" stroke-width="1.5" />
      </g>
    </g>
  </g>

  <!-- 7. BOTTOM BEACH SHORELINE & HASHTAG -->
  <!-- Starfish bottom left -->
  <g transform="translate(120, 946)">
    <path d="M 0 -15 L 4 -4 L 15 -4 L 7 3 L 10 14 L 0 7 L -10 14 L -7 3 L -15 -4 L -4 -4 Z" fill="#ff5a79" stroke="#ffffff" stroke-width="1" />
  </g>
  
  <text x="330" y="976" fill="#ffde6a" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="20">★</text>
  <text x="694" y="976" fill="#ffde6a" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="20" text-anchor="end">★</text>
  <text x="512" y="978" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="25" text-anchor="middle" letter-spacing="4px">#FRAMEINGOA</text>
</svg>
  `.trim();
}
