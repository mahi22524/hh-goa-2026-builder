import React from 'react';
import { BuilderIdentity } from '../types';
import { THEMES } from '../renderer/themes';
import { Download, Twitter, RefreshCw } from 'lucide-react';

interface ResultStepProps {
  localPngUrl: string;
  publicImageUrl: string;
  selectedIdentity: BuilderIdentity;
  onReset: () => void;
}

export const ResultStep: React.FC<ResultStepProps> = ({
  localPngUrl,
  publicImageUrl,
  selectedIdentity,
  onReset,
}) => {
  const theme = THEMES[selectedIdentity] || THEMES.CYBER_DEFENDER;
  const kebabIdentity = selectedIdentity.toLowerCase().replace(/_/g, '-');
  const filename = `hh-goa-2026-${kebabIdentity}.png`;

  // Get only the filename from the public image URL
  const imgFilename = publicImageUrl.split('/').pop() || '';

  // X (Twitter) Sharing Configuration
  // Share URL points to the backend /share OG metadata page
  const sharePageUrl = `${window.location.origin}/share?img=${imgFilename}`;
  const shareText = `Built my Hacker House Goa 2026 Builder Frame. #FrameInGoa`;
  const xShareIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(sharePageUrl)}`;

  return (
    <div className="step-wrapper result-step-container">
      <div className="step-header">
        <h2 className="step-title">FRAME GENERATED</h2>
        <p className="step-subtitle">Your official Hacker House Goa 2026 builder graphic is ready</p>
      </div>

      {/* Primary Hero Image Render */}
      <div className="result-preview-card">
        <div className="result-image-wrapper">
          <img src={localPngUrl} alt="Hacker House Goa 2026 Frame" className="result-img" />
        </div>
      </div>

      {/* Immediate Action Buttons (Fully visible on mobile viewports) */}
      <div className="result-actions">
        {/* Download Button */}
        <a href={localPngUrl} download={filename} className="btn-primary-large download-btn">
          <Download size={20} />
          <span>DOWNLOAD PNG</span>
        </a>

        {/* Share to X (Twitter) */}
        <a
          href={xShareIntent}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary-large twitter-btn"
        >
          <Twitter size={20} fill="currentColor" />
          <span>SHARE TO X</span>
        </a>

        {/* Make Another Button */}
        <button type="button" onClick={onReset} className="btn-tertiary-large reset-btn">
          <RefreshCw size={16} />
          <span>MAKE ANOTHER</span>
        </button>
      </div>
    </div>
  );
};
