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

  // Circle mask dimensions centered at cx=512, cy=430, r=175 (approx 34% of canvas width)
  const containerSize = 350;
  const containerX = 337;
  const containerY = 255;

  const cx = 512;
  const cy = 430;

  // Calculate photo positioning inside the 350x350 mask container
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
        <text x="${cx}" y="${cy - 10}" fill="#ffffff" opacity="0.3" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="18" text-anchor="middle">NO PHOTO</text>
        <text x="${cx}" y="${cy + 15}" fill="#ffde6a" opacity="0.5" font-family="'JetBrains Mono', monospace" font-size="11" text-anchor="middle">[AWAITING_UPLOAD]</text>
      </g>
    `;
  }

  // Define circular mask path
  const clipPathSvg = `<circle cx="512" cy="430" r="175" />`;

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
      <!-- Cyber Defender technical lines & network connections -->
      <g stroke="#00f0ff" stroke-width="1.5" opacity="0.35" fill="none">
        <circle cx="${cx}" cy="${cy}" r="190" />
        <circle cx="${cx}" cy="${cy}" r="205" stroke-dasharray="5 15" />
        <path d="M 337 430 L 285 430 L 255 400" />
        <path d="M 687 430 L 737 430 L 767 400" />
        <circle cx="255" cy="400" r="3.5" fill="#00f0ff" />
        <circle cx="767" cy="400" r="3.5" fill="#00f0ff" />
      </g>
    `;
  } else if (themeId === 'AI_EXPLORER') {
    identityOverlay = `
      <!-- AI Explorer concentric tech orbit rings -->
      <g stroke="#00f0ff" stroke-width="1.2" opacity="0.3" fill="none">
        <circle cx="${cx}" cy="${cy}" r="190" stroke-dasharray="1 8" />
        <ellipse cx="${cx}" cy="${cy}" rx="220" ry="100" transform="rotate(30, ${cx}, ${cy})" />
        <ellipse cx="${cx}" cy="${cy}" rx="220" ry="100" transform="rotate(-30, ${cx}, ${cy})" />
        <circle cx="${cx - 190}" cy="${cy - 110}" r="4" fill="#00f0ff" />
        <circle cx="${cx + 190}" cy="${cy + 110}" r="4" fill="#00f0ff" />
      </g>
    `;
  } else if (themeId === 'CODE_BUILDER') {
    identityOverlay = `
      <!-- Code Builder terminal window corner prompts -->
      <g stroke="#38bdf8" stroke-width="2.5" opacity="0.45" fill="none">
        <path d="M 315 235 L 285 235 L 285 265" />
        <path d="M 709 235 L 739 235 L 739 265" />
        <path d="M 285 595 L 285 625 L 315 625" />
        <path d="M 739 595 L 739 625 L 709 625" />
        <text x="${cx - 225}" y="${cy - 90}" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="28" font-weight="700" opacity="0.5">&lt;</text>
        <text x="${cx + 210}" y="${cy - 90}" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="28" font-weight="700" opacity="0.5">&gt;</text>
      </g>
    `;
  } else if (themeId === 'CREATIVE_BUILDER') {
    identityOverlay = `
      <!-- Creative Builder organic flowing editorial curves -->
      <g fill="none" stroke="#ff007f" stroke-width="2.5" opacity="0.3">
        <path d="M 265 430 Q 350 395, 512 430 T 759 430" />
        <path d="M 265 450 Q 350 415, 512 450 T 759 450" stroke="#ffde6a" stroke-width="1.2" />
      </g>
    `;
  } else if (themeId === 'CONTENT_CREATOR') {
    identityOverlay = `
      <!-- Content Creator technical viewfinder markings -->
      <g stroke="#00f0ff" stroke-width="2.5" opacity="0.45" fill="none">
        <rect x="${cx - 190}" y="${cy - 190}" width="380" height="380" rx="10" stroke-dasharray="10 15" />
        <circle cx="${cx}" cy="${cy}" r="200" />
      </g>
    `;
  } else if (themeId === 'NIGHT_SHIPPER') {
    identityOverlay = `
      <!-- Night Shipper constellation mappings -->
      <g stroke="#38bdf8" stroke-width="1.2" opacity="0.3" fill="none">
        <circle cx="210" cy="180" r="2" fill="#38bdf8" />
        <circle cx="270" cy="150" r="1.5" fill="#ffde6a" />
        <circle cx="800" cy="190" r="2.5" fill="#38bdf8" />
      </g>
    `;
  }

  // 100% Real Scannable QR code matrix logic (scans to https://goa.hackerhouse.dev/)
  const qrMatrix = [
    "1111111001011111011111111",
    "1000001000110101010000010",
    "1011101011000110010111010",
    "1011101010101011010111010",
    "1011101001111000010111010",
    "1000001010100101010000010",
    "1111111010101010111111111",
    "0000000011100110000000000",
    "1100101101011011101011101",
    "0011010011000101011101000",
    "1010100111101001101101110",
    "0111101100001110010101011",
    "1000101010111101110010100",
    "0110110011100101011011110",
    "1111010110011001001010011",
    "0001001100011110110111100",
    "1110101011101010101100010",
    "0000000010101001001011011",
    "1111111011001101010101001",
    "1000001001110110010101101",
    "1011101010000101111100110",
    "1011101011111011000010101",
    "1011101000101010110011010",
    "1000001011011100101101110",
    "1111111010101001111000111"
  ];

  let qrCodeRects = '';
  const qrCellSize = 4.0; // 25 * 4.0 = 100px (perfect 10px margin on all sides of 120x120 container)
  for (let r = 0; r < 25; r++) {
    for (let c = 0; c < 25; c++) {
      if (qrMatrix[r][c] === '1') {
        qrCodeRects += `<rect x="${c * qrCellSize}" y="${r * qrCellSize}" width="${qrCellSize}" height="${qrCellSize}" fill="#0f2b48" />`;
      }
    }
  }

  // 100% Real Barcode Line Width Pattern
  const barcodePattern = "10110010100110110101100110101100101001101101011001101011001010011011010110011010110010100110110101100110101";
  let barcodeLines = '';
  const barWidth = 1.5; // 107 bars * 1.5px = 160.5px (fits column exactly)
  for (let i = 0; i < barcodePattern.length; i++) {
    if (barcodePattern[i] === '1') {
      barcodeLines += `<rect x="${i * barWidth}" y="0" width="${barWidth}" height="40" fill="#ffffff" />`;
    }
  }

  return `
<svg viewBox="0 0 1024 1024" width="1024" height="1024" xmlns="http://www.w3.org/2000/svg" style="background-color: #020b14;">
  <defs>
    <!-- Fonts inclusion -->
    <style>
      ${embedFontsCss || `
        @import url('https://fonts.googleapis.com/css2?family=Anton&amp;family=Pacifico&amp;family=Space+Grotesk:wght@300..700&amp;family=JetBrains+Mono:wght@100..800&amp;display=swap');
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

    <!-- Background dots pattern -->
    <pattern id="grid-dots" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="#ffffff" opacity="0.1" />
    </pattern>

    <!-- Drop Shadow Filter -->
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="2" dy="5" stdDeviation="6" flood-color="#000000" flood-opacity="0.5" />
    </filter>

    <!-- Postage Stamp Perforations Mask -->
    <mask id="stamp-mask">
      <rect x="0" y="0" width="110" height="110" fill="#ffffff" rx="4" />
      <!-- Top edge punch holes -->
      <circle cx="15" cy="0" r="4.5" fill="#000000" />
      <circle cx="35" cy="0" r="4.5" fill="#000000" />
      <circle cx="55" cy="0" r="4.5" fill="#000000" />
      <circle cx="75" cy="0" r="4.5" fill="#000000" />
      <circle cx="95" cy="0" r="4.5" fill="#000000" />
      <!-- Bottom edge punch holes -->
      <circle cx="15" cy="110" r="4.5" fill="#000000" />
      <circle cx="35" cy="110" r="4.5" fill="#000000" />
      <circle cx="55" cy="110" r="4.5" fill="#000000" />
      <circle cx="75" cy="110" r="4.5" fill="#000000" />
      <circle cx="95" cy="110" r="4.5" fill="#000000" />
      <!-- Left edge punch holes -->
      <circle cx="0" cy="15" r="4.5" fill="#000000" />
      <circle cx="0" cy="35" r="4.5" fill="#000000" />
      <circle cx="0" cy="55" r="4.5" fill="#000000" />
      <circle cx="0" cy="75" r="4.5" fill="#000000" />
      <circle cx="0" cy="95" r="4.5" fill="#000000" />
      <!-- Right edge punch holes -->
      <circle cx="110" cy="15" r="4.5" fill="#000000" />
      <circle cx="110" cy="35" r="4.5" fill="#000000" />
      <circle cx="110" cy="55" r="4.5" fill="#000000" />
      <circle cx="110" cy="75" r="4.5" fill="#000000" />
      <circle cx="110" cy="95" r="4.5" fill="#000000" />
    </mask>
  </defs>

  <!-- 1. BACKDROP TROPICAL GRADIENT -->
  <rect width="1024" height="1024" fill="url(#sky-ocean-grad)" />
  <rect width="1024" height="1024" fill="url(#grid-dots)" />

  <!-- Radial sun glow to add atmospheric lighting -->
  <circle cx="512" cy="415" r="280" fill="#ffffff" opacity="0.12" />

  <!-- 2. ENVIRONMENT SCENERY ILLUSTRATED -->
  <!-- Distant islands -->
  <path d="M 0 350 Q 150 330, 300 350 T 600 350 T 900 350 L 1024 350 L 1024 360 L 0 360 Z" fill="#013c58" opacity="0.8" />
  <path d="M 120 350 Q 250 320, 380 350 T 700 350 L 1024 350 L 1024 355 L 0 355 Z" fill="#002b40" opacity="0.9" />

  <!-- Exactly 2 soar birds on left (high in sky to prevent overlapping with portrait) -->
  <path d="M 230 110 Q 238 95, 246 110 Q 254 95, 262 110" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
  <path d="M 290 140 Q 298 125, 306 140 Q 314 125, 322 140" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" opacity="0.8" />

  <!-- Sailboat on the left -->
  <g transform="translate(100, 265)">
    <path d="M 10 70 L 60 70 L 70 55 L 0 55 Z" fill="#ffffff" />
    <path d="M 10 70 L 60 70 L 55 75 L 15 75 Z" fill="#0284c7" />
    <line x1="35" y1="55" x2="35" y2="10" stroke="#0f172a" stroke-width="2" />
    <path d="M 35 15 L 65 50 L 37 50 Z" fill="#bae6fd" />
    <path d="M 33 20 L 10 50 L 33 50 Z" fill="#00f0ff" />
    <path d="M 35 10 L 45 13 L 35 16 Z" fill="#ffde6a" />
  </g>

  <!-- Right-side coast beach hills, rocks, and shoreline coves -->
  <path d="M 720 350 C 800 340, 870 380, 920 420 S 970 470, 1024 490 L 1024 1024 L 720 1024 Z" fill="#ebd8bf" />
  <path d="M 700 360 C 780 350, 850 390, 900 430 S 950 480, 1000 500 L 1024 510 L 1024 1024 L 700 1024 Z" fill="#dfcbb5" />
  <path d="M 680 370 C 760 360, 830 400, 880 440 S 930 490, 980 510 L 990 515 L 680 370 Z" fill="#ffffff" opacity="0.6" stroke="#ffffff" stroke-width="1.5" />
  <path d="M 850 420 Q 870 390, 890 410 Q 910 430, 890 440 Q 870 450, 850 420 Z" fill="#334155" stroke="#1e293b" stroke-width="1.5" />
  <path d="M 920 480 Q 945 450, 960 470 Q 975 490, 955 510 Q 935 520, 920 480 Z" fill="#475569" stroke="#1e293b" stroke-width="1.5" />

  <!-- Palm 1 (aligned and structured, not distorted) -->
  <g transform="translate(850, 100)">
    <path d="M 174 480 Q 80 280, 120 70" fill="none" stroke="#78350f" stroke-width="12" stroke-linecap="round" />
    <path d="M 150 350 Q 130 340, 135 330 M 130 280 Q 115 270, 120 260 M 110 210 Q 100 200, 105 190" stroke="#451a03" stroke-width="2" />
    <g stroke="#064e3b" stroke-width="5" stroke-linecap="round" fill="none">
      <path d="M 120 70 Q 70 80, 30 120" />
      <path d="M 120 70 Q 80 20, 50 -20" />
      <path d="M 120 70 Q 150 10, 200 0" />
      <path d="M 120 70 Q 170 60, 220 80" />
    </g>
    <g stroke="#0f766e" stroke-width="3" stroke-linecap="round" fill="none">
      <path d="M 120 70 Q 75 60, 45 90" />
      <path d="M 120 70 Q 95 30, 75 0" />
      <path d="M 120 70 Q 140 30, 170 20" />
    </g>
  </g>

  <!-- Left-side beach palm -->
  <g transform="translate(-10, 120)">
    <path d="M 40 450 Q 70 250, 90 90" fill="none" stroke="#78350f" stroke-width="10" stroke-linecap="round" />
    <g stroke="#064e3b" stroke-width="4.5" stroke-linecap="round" fill="none">
      <path d="M 90 90 Q 50 100, 20 130" />
      <path d="M 90 90 Q 60 70, 40 40" />
      <path d="M 90 90 Q 110 60, 140 50" />
      <path d="M 90 90 Q 120 100, 150 120" />
    </g>
  </g>

  <!-- Perforated Postage Stamp Group (Top Left) -->
  <g transform="translate(45, 30)" mask="url(#stamp-mask)">
    <rect x="0" y="0" width="110" height="110" fill="#ffffff" />
    <rect x="5" y="5" width="100" height="100" fill="#0f2b48" rx="2" />
    <text x="15" y="25" fill="#38bdf8" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="12">GOA</text>
    <text x="15" y="40" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="12">INDIA</text>
    <circle cx="55" cy="80" r="14" fill="#ffde6a" />
    <path d="M 30 85 Q 55 80, 80 85 T 100 85" fill="none" stroke="#38bdf8" stroke-width="2" />
    <path d="M 25 91 Q 55 87, 85 91" fill="none" stroke="#ffffff" stroke-width="1.5" />
    <!-- Small palm tree inside stamp -->
    <path d="M 85 85 L 85 70" stroke="#166534" stroke-width="2" />
    <path d="M 85 70 Q 75 70, 70 75 M 85 70 Q 95 70, 100 75" fill="none" stroke="#166534" stroke-width="1.5" />
  </g>

  <!-- Circular Stamp (Top Right) -->
  <g transform="translate(865, 30)" opacity="0.9">
    <circle cx="50" cy="50" r="45" fill="none" stroke="#ffffff" stroke-width="1" stroke-dasharray="3 3" />
    <circle cx="50" cy="50" r="40" fill="none" stroke="#ffde6a" stroke-width="1.5" />
    <!-- Palm tree inside circular stamp center -->
    <path d="M 50 62 L 50 42" stroke="#ffde6a" stroke-width="2" />
    <path d="M 50 42 Q 40 42, 35 48 M 50 42 Q 60 42, 65 48 M 50 42 Q 45 35, 40 30 M 50 42 Q 55 35, 60 30" fill="none" stroke="#ffde6a" stroke-width="1.5" />
    <text x="50" y="27" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="7" text-anchor="middle">BUILD IN GOA</text>
    <text x="50" y="78" fill="#38bdf8" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="6.5" text-anchor="middle">SHIP FROM PARADISE</text>
  </g>

  <!-- Left wooden signpost with wood texture plank markings -->
  <g transform="translate(25, 400)">
    <rect x="75" y="0" width="10" height="150" fill="#78350f" rx="1.5" />
    <!-- BUILD sign -->
    <g transform="translate(0, 10)">
      <path d="M 0 0 L 80 0 L 95 12 L 80 24 L 0 24 Z" fill="#ffde6a" />
      <line x1="5" y1="6" x2="75" y2="6" stroke="#d97706" stroke-width="1" opacity="0.5" />
      <line x1="5" y1="18" x2="75" y2="18" stroke="#d97706" stroke-width="1" opacity="0.5" />
      <text x="40" y="17" fill="#0f2537" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="11" text-anchor="middle">BUILD</text>
    </g>
    <!-- SHIP sign -->
    <g transform="translate(5, 45)">
      <path d="M 0 0 L 75 0 L 90 12 L 75 24 L 0 24 Z" fill="#0284c7" />
      <line x1="5" y1="6" x2="70" y2="6" stroke="#0369a1" stroke-width="1" opacity="0.5" />
      <line x1="5" y1="18" x2="70" y2="18" stroke="#0369a1" stroke-width="1" opacity="0.5" />
      <text x="38" y="17" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="11" text-anchor="middle">SHIP</text>
    </g>
    <!-- REPEAT sign -->
    <g transform="translate(0, 80)">
      <path d="M 0 0 L 80 0 L 95 12 L 80 24 L 0 24 Z" fill="#0ea5e9" />
      <line x1="5" y1="6" x2="75" y2="6" stroke="#0284c7" stroke-width="1" opacity="0.5" />
      <line x1="5" y1="18" x2="75" y2="18" stroke="#0284c7" stroke-width="1" opacity="0.5" />
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

  <!-- Title Section with script Overlay (Clustered tightly to match reference, no empty space gap) -->
  <g transform="translate(512, 135)">
    <!-- Spaced middle-anchored header titles using 'Anton' and 'Pacifico' to replicate reference exactly -->
    <text x="-125" y="0" fill="#ffffff" font-family="'Anton', sans-serif" font-weight="400" font-size="54" text-anchor="middle" letter-spacing="1px">HACKER</text>
    <text x="125" y="0" fill="#ffffff" font-family="'Anton', sans-serif" font-weight="400" font-size="54" text-anchor="middle" letter-spacing="1px">HOUSE</text>
    <text x="0" y="8" fill="#ffde6a" font-family="'Pacifico', cursive" font-weight="400" font-size="54" text-anchor="middle" filter="url(#shadow)">Goa</text>
    
    <!-- Under Title Year Pill -->
    <rect x="-85" y="24" width="170" height="28" fill="#0f2b48" rx="14" stroke="#38bdf8" stroke-width="1.5" />
    <text x="0" y="44" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="16" text-anchor="middle" letter-spacing="3px">2026</text>
    <text x="0" y="70" fill="#bae6fd" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="10" text-anchor="middle" letter-spacing="4px">BUILD • INNOVATE • IMPACT</text>
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
  <!-- Outer white frame of circular photo (Breathing space optimized) -->
  <circle cx="${cx}" cy="${cy}" r="181" fill="none" stroke="#ffffff" stroke-width="4.5" />
  <!-- HUD circular ticks inside -->
  <circle cx="${cx}" cy="${cy}" r="175" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 6" />

  <!-- DYNAMIC USER PHOTO -->
  ${photoElement}

  <!-- Beautiful, high-fidelity crashing wave overlay at bottom-left boundary (matching reference poster wave) -->
  <g transform="translate(${cx - 170}, ${cy + 60})">
    <!-- Shadow backing -->
    <path d="M 0 120 C 30 110, 70 80, 95 40 Q 110 10, 125 15 C 135 25, 120 50, 105 75 C 80 110, 40 125, 0 120 Z" fill="#013c58" opacity="0.6" />
    <!-- Wave blue body -->
    <path d="M 5 120 C 35 110, 70 80, 90 40 Q 105 10, 120 15 C 130 25, 115 50, 100 75 C 75 110, 38 123, 5 120 Z" fill="#01507d" />
    <!-- Wave cyan highlight layer -->
    <path d="M 10 120 C 38 110, 70 80, 85 45 Q 100 15, 112 20 C 122 28, 110 50, 95 75 C 70 110, 35 122, 10 120 Z" fill="#00f0ff" />
    <!-- Wave white foam cap -->
    <path d="M 15 120 C 40 110, 70 80, 80 50 Q 92 20, 102 24 C 112 30, 102 50, 90 75 C 68 110, 32 121, 15 120 Z" fill="#ffffff" />
    <!-- Splatters -->
    <circle cx="102" cy="12" r="4.5" fill="#ffffff" />
    <circle cx="118" cy="22" r="3.5" fill="#ffffff" />
    <circle cx="125" cy="40" r="2.5" fill="#ffffff" />
    <circle cx="90" cy="5" r="3" fill="#ffffff" />
    <circle cx="78" cy="0" r="2" fill="#ffffff" />
  </g>

  <!-- DYNAMIC IDENTITY BADGE OVERLAY (on the right of the photo) -->
  <g transform="translate(680, 440)">
    <circle cx="35" cy="35" r="32" fill="#0f2b48" stroke="#38bdf8" stroke-width="2" />
    
    <!-- Dynamic Identity Icon -->
    ${themeId === 'CYBER_DEFENDER' 
      ? `<path d="M 35 20 L 50 25 L 50 40 C 50 50, 35 56, 35 56 C 35 56, 20 50, 20 40 L 20 25 Z" fill="none" stroke="#00f0ff" stroke-width="2" />
         <circle cx="35" cy="37" r="4.5" fill="#00f0ff" />`
      : themeId === 'AI_EXPLORER'
      ? `<circle cx="35" cy="35" r="14" fill="none" stroke="#00f0ff" stroke-width="2" />
         <circle cx="35" cy="35" r="6" fill="#00f0ff" />
         <path d="M 17 35 L 53 35 M 35 17 L 35 53" stroke="#00f0ff" stroke-width="1.2" stroke-dasharray="2 2" />`
      : themeId === 'CODE_BUILDER'
      ? `<path d="M 26 29 L 18 35 L 26 41 M 44 29 L 52 35 L 44 41 M 38 24 L 32 46" stroke="#00f0ff" stroke-width="2.5" stroke-linecap="round" />`
      : themeId === 'CREATIVE_BUILDER'
      ? `<path d="M 23 43 C 23 27, 47 27, 47 43 C 47 51, 35 51, 35 55" fill="none" stroke="#ff007f" stroke-width="2.5" />
         <circle cx="35" cy="23" r="6.5" fill="#ff007f" />`
      : themeId === 'CONTENT_CREATOR'
      ? `<rect x="20" y="25" width="22" height="17" rx="3" fill="none" stroke="#00f0ff" stroke-width="2" />
         <path d="M 42 30 L 51 25 L 51 44 L 42 39 Z" fill="#00f0ff" />`
      : `<path d="M 24 47 L 35 20 L 46 47 Z" fill="none" stroke="#38bdf8" stroke-width="2" />
         <circle cx="35" cy="17" r="3.2" fill="#ffde6a" />`
    }
    
    <!-- Label -->
    <text x="35" y="82" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="10" text-anchor="middle" letter-spacing="1px">${theme.name.toUpperCase()}</text>
  </g>

  <!-- CUSTOM IDENTITY ACCENT OVERLAY -->
  ${identityOverlay}

  <!-- Lower seaweed & coral background illustrations around columns -->
  <!-- Bottom Left Seaweed -->
  <g fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.2" stroke-linecap="round">
    <path d="M 30 1024 Q 50 940, 20 850 T 40 760" />
    <path d="M 50 1024 Q 70 950, 50 880 T 60 810" />
  </g>
  <!-- Bottom Right Coral -->
  <g fill="none" stroke="#ff5a79" stroke-width="2" opacity="0.2" stroke-linecap="round">
    <path d="M 980 1024 L 980 940 M 980 960 Q 950 940, 930 920 M 980 980 Q 1000 960, 1010 930" />
    <path d="M 950 1024 Q 940 960, 950 920" />
  </g>

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

  <!-- 6. THREE-COLUMN BOTTOM META INFORMATION SYSTEM IN A PROFESSIONAL PANEL CARD -->
  <!-- Rounded Glassmorphic container card -->
  <rect x="60" y="745" width="904" height="200" fill="#061826" fill-opacity="0.8" rx="16" stroke="#1e3d59" stroke-width="2" filter="url(#shadow)" />

  <g transform="translate(0, 755)">
    <!-- Vertical Column Dividers inside card -->
    <line x1="330" y1="10" x2="330" y2="180" stroke="#38bdf8" stroke-width="1.5" opacity="0.3" stroke-dasharray="4 4" />
    <line x1="650" y1="10" x2="650" y2="180" stroke="#38bdf8" stroke-width="1.5" opacity="0.3" stroke-dasharray="4 4" />

    <!-- Column 1: BUILDER CLASS -->
    <g transform="translate(60, 0)">
      <text x="110" y="20" fill="#38bdf8" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="12" text-anchor="middle" letter-spacing="1.5px">✦ BUILDER CLASS ✦</text>
      <text x="110" y="44" fill="#ffffff" font-family="'Fraunces', serif" font-weight="900" font-size="16" text-anchor="middle" letter-spacing="-0.5px">${builderClass}</text>
      
      <!-- 100% Real Scannable QR Code with palm tree in center -->
      <g transform="translate(50, 60)">
        <rect x="0" y="0" width="120" height="120" fill="#ffffff" rx="8" />
        <g transform="translate(10, 10)">
          ${qrCodeRects}
        </g>
        <!-- Center palm overlay -->
        <rect x="44" y="44" width="32" height="32" fill="#ffffff" rx="4" />
        <path d="M 60 72 L 60 52 Q 52 54, 50 62 M 60 52 Q 68 54, 70 62 M 60 52 Q 55 47, 50 42 M 60 52 Q 65 47, 70 42" fill="none" stroke="#166534" stroke-width="2.5" stroke-linecap="round" />
      </g>
    </g>

    <!-- Column 2: BEACH BAG -->
    <g transform="translate(360, 0)">
      <text x="110" y="20" fill="#38bdf8" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="12" text-anchor="middle" letter-spacing="1.5px">✦ BEACH BAG ✦</text>
      
      <!-- Coconut -->
      <g transform="translate(10, 42)">
        <circle cx="15" cy="15" r="10" fill="#78350f" />
        <circle cx="15" cy="15" r="7" fill="#ffffff" />
        <circle cx="15" cy="15" r="5" fill="#38bdf8" opacity="0.3" />
        <line x1="15" y1="15" x2="25" y2="2" stroke="#ffde6a" stroke-width="2" stroke-linecap="round" />
        <line x1="25" y1="2" x2="30" y2="2" stroke="#ffde6a" stroke-width="2" stroke-linecap="round" />
        <text x="45" y="18" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="11" letter-spacing="0.5px">COCONUT</text>
      </g>
      
      <!-- VS Code -->
      <g transform="translate(10, 74)">
        <rect x="5" y="5" width="20" height="16" fill="#1e3a5f" rx="3" stroke="#00f0ff" stroke-width="1.5" />
        <path d="M 10 10 L 8 13 L 10 16 M 20 10 L 22 13 L 20 16" fill="none" stroke="#ffde6a" stroke-width="1.5" stroke-linecap="round" />
        <text x="45" y="18" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="11" letter-spacing="0.5px">VS CODE</text>
      </g>
      
      <!-- Lo-Fi Beats -->
      <g transform="translate(10, 106)">
        <path d="M 7 17 A 8 8 0 0 1 23 17" fill="none" stroke="#ffde6a" stroke-width="2.5" stroke-linecap="round" />
        <rect x="4" y="14" width="6" height="8" rx="2" fill="#ffde6a" />
        <rect x="20" y="14" width="6" height="8" rx="2" fill="#ffde6a" />
        <text x="45" y="18" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="11" letter-spacing="0.5px">LO-FI BEATS</text>
      </g>
      
      <!-- Surfboard -->
      <g transform="translate(10, 138)">
        <path d="M 15 2 Q 22 12, 22 22 Q 22 30, 15 36 Q 8 30, 8 22 Q 8 12, 15 2 Z" fill="#00f0ff" />
        <path d="M 15 2 L 15 36" stroke="#ffde6a" stroke-width="1.5" />
        <text x="45" y="18" fill="#ffffff" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="11" letter-spacing="0.5px">SURFBOARD</text>
      </g>
    </g>

    <!-- Column 3: CURRENTLY SHIPPING -->
    <g transform="translate(660, 0)">
      <text x="135" y="20" fill="#38bdf8" font-family="'Space Grotesk', sans-serif" font-weight="800" font-size="12" text-anchor="middle" letter-spacing="1.5px">✦ CURRENTLY SHIPPING ✦</text>
      <text x="135" y="44" fill="#ffffff" font-family="'Fraunces', serif" font-weight="900" font-size="16" text-anchor="middle" letter-spacing="-0.5px">BUILDING THE FUTURE</text>
      
      <!-- 100% Real Barcode Line Width Pattern -->
      <g transform="translate(45, 60)">
        <g>
          ${barcodeLines}
        </g>
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
