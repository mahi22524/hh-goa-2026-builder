import { ThemeConfig, BuilderIdentity } from '../types';

export const THEMES: Record<BuilderIdentity, ThemeConfig> = {
  CYBER_DEFENDER: {
    id: 'CYBER_DEFENDER',
    name: 'Cyber Defender',
    category: 'CYBERSECURITY',
    colors: {
      bg: '#03140b', // Deep dark green
      text: '#f7f4eb', // Cream
      accent: '#ffde6a', // Yellow
      muted: '#1b3d27', // Dark forest green
      coral: '#f2725c', // Restrained coral
    },
    swatchGradient: 'linear-gradient(135deg, #072314 0%, #1b3d27 50%, #ffde6a 100%)',
  },
  AI_EXPLORER: {
    id: 'AI_EXPLORER',
    name: 'AI Explorer',
    category: 'AI / ML',
    colors: {
      bg: '#03140b',
      text: '#f7f4eb',
      accent: '#ffde6a',
      muted: '#2d4d38',
      coral: '#f2725c',
    },
    swatchGradient: 'linear-gradient(135deg, #03140b 0%, #ffde6a 40%, #2d4d38 100%)',
  },
  CODE_BUILDER: {
    id: 'CODE_BUILDER',
    name: 'Code Builder',
    category: 'FRONTEND',
    colors: {
      bg: '#03140b',
      text: '#f7f4eb',
      accent: '#ffde6a',
      muted: '#2d334d', // Indigo/slate tone for code builder
      coral: '#f2725c',
    },
    swatchGradient: 'linear-gradient(135deg, #03140b 0%, #2d334d 60%, #f7f4eb 100%)',
  },
  CREATIVE_BUILDER: {
    id: 'CREATIVE_BUILDER',
    name: 'Creative Builder',
    category: 'DESIGN',
    colors: {
      bg: '#03140b',
      text: '#f7f4eb',
      accent: '#ff007f', // Strong pink/magenta accent
      muted: '#3d1b27', // Dark plum/coral muted
      coral: '#ffde6a', // Yellow as secondary
    },
    swatchGradient: 'linear-gradient(135deg, #03140b 0%, #ff007f 50%, #ffde6a 100%)',
  },
  CONTENT_CREATOR: {
    id: 'CONTENT_CREATOR',
    name: 'Content Creator',
    category: 'CONTENT',
    colors: {
      bg: '#03140b',
      text: '#f7f4eb',
      accent: '#ffde6a',
      muted: '#3b3d1b', // Olive tone
      coral: '#f2725c',
    },
    swatchGradient: 'linear-gradient(135deg, #03140b 0%, #f7f4eb 50%, #3b3d1b 100%)',
  },
  NIGHT_SHIPPER: {
    id: 'NIGHT_SHIPPER',
    name: 'Night Shipper',
    category: 'BUILD / SHIP',
    colors: {
      bg: '#020b06', // Even darker night green
      text: '#f7f4eb',
      accent: '#ffde6a',
      muted: '#0e1e14',
      coral: '#f2725c',
    },
    swatchGradient: 'linear-gradient(135deg, #020b06 0%, #0e1e14 70%, #ffde6a 100%)',
  },
};
