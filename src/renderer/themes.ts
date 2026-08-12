import { ThemeConfig, BuilderIdentity } from '../types';

export const THEMES: Record<BuilderIdentity, ThemeConfig> = {
  CYBER_DEFENDER: {
    id: 'CYBER_DEFENDER',
    name: 'Cyber Defender',
    category: 'CYBERSECURITY',
    colors: {
      bg: '#020b14', // Deep midnight blue
      text: '#ffffff', // White
      accent: '#00f0ff', // Electric cyan
      muted: '#092540', // Dark ocean blue
      coral: '#ffde6a', // Sparingly used yellow accent
    },
    swatchGradient: 'linear-gradient(135deg, #020b14 0%, #092540 50%, #00f0ff 100%)',
  },
  AI_EXPLORER: {
    id: 'AI_EXPLORER',
    name: 'AI Explorer',
    category: 'AI / ML',
    colors: {
      bg: '#020b14',
      text: '#ffffff',
      accent: '#00f0ff',
      muted: '#0e3152',
      coral: '#ffde6a',
    },
    swatchGradient: 'linear-gradient(135deg, #020b14 0%, #ffde6a 40%, #0e3152 100%)',
  },
  CODE_BUILDER: {
    id: 'CODE_BUILDER',
    name: 'Code Builder',
    category: 'FRONTEND',
    colors: {
      bg: '#020b14',
      text: '#ffffff',
      accent: '#38bdf8',
      muted: '#1e293b', // Slate blue
      coral: '#ffde6a',
    },
    swatchGradient: 'linear-gradient(135deg, #020b14 0%, #1e293b 60%, #ffffff 100%)',
  },
  CREATIVE_BUILDER: {
    id: 'CREATIVE_BUILDER',
    name: 'Creative Builder',
    category: 'DESIGN',
    colors: {
      bg: '#020b14',
      text: '#ffffff',
      accent: '#ff007f', // Keep creative magenta accent
      muted: '#3b0b30', // Plum tone
      coral: '#ffde6a',
    },
    swatchGradient: 'linear-gradient(135deg, #020b14 0%, #ff007f 50%, #ffde6a 100%)',
  },
  CONTENT_CREATOR: {
    id: 'CONTENT_CREATOR',
    name: 'Content Creator',
    category: 'CONTENT',
    colors: {
      bg: '#020b14',
      text: '#ffffff',
      accent: '#38bdf8',
      muted: '#0f385c',
      coral: '#ffde6a',
    },
    swatchGradient: 'linear-gradient(135deg, #020b14 0%, #ffffff 50%, #0f385c 100%)',
  },
  NIGHT_SHIPPER: {
    id: 'NIGHT_SHIPPER',
    name: 'Night Shipper',
    category: 'BUILD / SHIP',
    colors: {
      bg: '#01050d', // Deepest midnight blue
      text: '#ffffff',
      accent: '#38bdf8',
      muted: '#05182e',
      coral: '#ffde6a',
    },
    swatchGradient: 'linear-gradient(135deg, #01050d 0%, #05182e 70%, #38bdf8 100%)',
  },
};
