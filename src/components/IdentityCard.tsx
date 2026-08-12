import React from 'react';
import { ThemeConfig, BuilderIdentity } from '../types';

interface IdentityCardProps {
  theme: ThemeConfig;
  isSelected: boolean;
  onSelect: () => void;
}

const renderSwatchSvg = (id: BuilderIdentity) => {
  switch (id) {
    case 'CYBER_DEFENDER':
      return (
        <svg viewBox="0 0 160 80" className="identity-swatch" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cyber-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#072314" />
              <stop offset="100%" stopColor="#1b3d27" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#cyber-grad)" />
          <line x1="0" y1="20" x2="160" y2="20" stroke="#ffde6a" strokeWidth="0.5" opacity="0.3" />
          <line x1="0" y1="60" x2="160" y2="60" stroke="#ffde6a" strokeWidth="0.5" opacity="0.3" />
          <line x1="40" y1="0" x2="40" y2="80" stroke="#ffde6a" strokeWidth="0.5" opacity="0.3" />
          <line x1="120" y1="0" x2="120" y2="80" stroke="#ffde6a" strokeWidth="0.5" opacity="0.3" />
          <rect x="55" y="15" width="50" height="50" fill="none" stroke="#ffde6a" strokeWidth="1.5" strokeDasharray="4 2" />
          <circle cx="80" cy="40" r="12" fill="none" stroke="#f2725c" strokeWidth="1" />
          <path d="M 80 20 L 80 30 M 80 50 L 80 60 M 60 40 L 70 40 M 90 40 L 100 40" stroke="#ffde6a" strokeWidth="1" />
        </svg>
      );
    case 'AI_EXPLORER':
      return (
        <svg viewBox="0 0 160 80" className="identity-swatch" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ai-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#03140b" />
              <stop offset="100%" stopColor="#2d4d38" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#ai-grad)" />
          <circle cx="80" cy="40" r="28" fill="none" stroke="#ffde6a" strokeWidth="1" opacity="0.4" strokeDasharray="3 3" />
          <circle cx="80" cy="40" r="20" fill="none" stroke="#f7f4eb" strokeWidth="0.7" opacity="0.5" />
          <circle cx="80" cy="40" r="10" fill="none" stroke="#ffde6a" strokeWidth="1.5" />
          <line x1="80" y1="40" x2="120" y2="20" stroke="#ffde6a" strokeWidth="0.8" opacity="0.7" />
          <line x1="80" y1="40" x2="45" y2="60" stroke="#ffde6a" strokeWidth="0.8" opacity="0.7" />
          <circle cx="120" cy="20" r="4" fill="#f2725c" />
          <circle cx="45" cy="60" r="3.5" fill="#f7f4eb" />
          <circle cx="95" cy="25" r="2" fill="#ffde6a" />
        </svg>
      );
    case 'CODE_BUILDER':
      return (
        <svg viewBox="0 0 160 80" className="identity-swatch" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="code-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#03140b" />
              <stop offset="100%" stopColor="#1a1f33" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#code-grad)" />
          <text x="15" y="22" fill="#ffde6a" fontFamily="monospace" fontSize="12" fontWeight="700">&gt;_</text>
          <text x="35" y="22" fill="#f7f4eb" fontFamily="monospace" fontSize="10" opacity="0.8">const ship = ()</text>
          <text x="20" y="42" fill="#f2725c" fontFamily="monospace" fontSize="12" fontWeight="700">{`{`}</text>
          <text x="32" y="42" fill="#ffde6a" fontFamily="monospace" fontSize="9">goa: '2026'</text>
          <text x="20" y="62" fill="#f2725c" fontFamily="monospace" fontSize="12" fontWeight="700">{`}`}</text>
          <circle cx="130" cy="20" r="3" fill="#f2725c" />
          <circle cx="138" cy="20" r="3" fill="#ffde6a" />
          <circle cx="146" cy="20" r="3" fill="#2d4d38" />
        </svg>
      );
    case 'CREATIVE_BUILDER':
      return (
        <svg viewBox="0 0 160 80" className="identity-swatch" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="creative-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#03140b" />
              <stop offset="100%" stopColor="#3d1b27" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#creative-grad)" />
          <circle cx="65" cy="40" r="24" fill="none" stroke="#ff007f" strokeWidth="2" />
          <rect x="75" y="25" width="35" height="35" fill="none" stroke="#ffde6a" strokeWidth="1.5" transform="rotate(15, 92, 42)" />
          <line x1="30" y1="20" x2="130" y2="60" stroke="#f7f4eb" strokeWidth="1.5" opacity="0.6" />
          <circle cx="110" cy="50" r="6" fill="#ff007f" />
          <text x="15" y="65" fill="#f7f4eb" fontFamily="Georgia, serif" fontStyle="italic" fontSize="16" opacity="0.7">d</text>
        </svg>
      );
    case 'CONTENT_CREATOR':
      return (
        <svg viewBox="0 0 160 80" className="identity-swatch" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="content-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#03140b" />
              <stop offset="100%" stopColor="#3b3d1b" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#content-grad)" />
          <path d="M 20 25 L 20 15 L 30 15 M 130 15 L 140 15 L 140 25 M 20 55 L 20 65 L 30 65 M 130 65 L 140 65 L 140 55" fill="none" stroke="#ffde6a" strokeWidth="1.5" />
          <circle cx="130" cy="25" r="4" fill="#f2725c" />
          <text x="105" y="42" fill="#f7f4eb" fontFamily="monospace" fontSize="8" fontWeight="700">REC</text>
          <line x1="50" y1="40" x2="50" y2="40" stroke="#f7f4eb" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="60" y1="30" x2="60" y2="50" stroke="#f7f4eb" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="70" y1="20" x2="70" y2="60" stroke="#ffde6a" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="80" y1="25" x2="80" y2="55" stroke="#f7f4eb" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="90" y1="35" x2="90" y2="45" stroke="#f7f4eb" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'NIGHT_SHIPPER':
      return (
        <svg viewBox="0 0 160 80" className="identity-swatch" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="night-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#020b06" />
              <stop offset="100%" stopColor="#0e1e14" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#night-grad)" />
          <path d="M 130 35 A 12 12 0 0 1 110 15 A 12 12 0 0 0 130 35 Z" fill="#ffde6a" opacity="0.8" />
          <circle cx="40" cy="25" r="1.5" fill="#ffde6a" />
          <circle cx="50" cy="45" r="1" fill="#f7f4eb" opacity="0.7" />
          <circle cx="85" cy="20" r="1.5" fill="#f7f4eb" />
          <circle cx="75" cy="55" r="1" fill="#ffde6a" opacity="0.6" />
          <path d="M 20 65 C 50 65, 80 45, 110 15" fill="none" stroke="#f7f4eb" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
          <polygon points="110,15 104,17 108,21" fill="#f7f4eb" opacity="0.7" />
          <text x="20" y="30" fill="#ffde6a" fontFamily="monospace" fontSize="8">04:00 AM</text>
        </svg>
      );
    default:
      return null;
  }
};

export const IdentityCard: React.FC<IdentityCardProps> = ({ theme, isSelected, onSelect }) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`identity-card ${isSelected ? 'selected' : ''}`}
      aria-pressed={isSelected}
    >
      {/* Static Visual Swatch */}
      {renderSwatchSvg(theme.id)}
      
      {/* Details */}
      <div className="identity-info">
        <span className="identity-category">{theme.category}</span>
        <h3 className="identity-title">{theme.name}</h3>
      </div>

      {/* Selected Indicator Checkmark / Badge */}
      {isSelected && (
        <div className="selected-badge" aria-hidden="true">
          <div className="selected-badge-dot" />
        </div>
      )}
    </button>
  );
};
