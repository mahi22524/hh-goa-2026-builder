import React, { useEffect, useState, useRef } from 'react';
import { exportToPng } from '../renderer/exportPng';
import { ShapeType, PhotoTransform, BuilderIdentity } from '../types';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

interface GenerateStepProps {
  photoUrl: string | null;
  photoWidth: number;
  photoHeight: number;
  selectedIdentity: BuilderIdentity;
  transform: PhotoTransform;
  shape: ShapeType;
  name: string;
  position: string;
  onGenerationComplete: (localPngUrl: string, publicImageUrl: string) => void;
  onBackToAdjust: () => void;
}

export const GenerateStep: React.FC<GenerateStepProps> = ({
  photoUrl,
  photoWidth,
  photoHeight,
  selectedIdentity,
  transform,
  shape,
  name,
  position,
  onGenerationComplete,
  onBackToAdjust,
}) => {
  const [status, setStatus] = useState<'rendering' | 'uploading' | 'error'>('rendering');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const hasTriggered = useRef(false);

  const startGeneration = async () => {
    setStatus('rendering');
    setErrorMsg('');

    try {
      // 1. Export SVG to PNG Data URL (Client Canvas Render)
      const localPngUrl = await exportToPng({
        photoUrl,
        photoWidth,
        photoHeight,
        themeId: selectedIdentity,
        shape,
        transform,
        name,
        position,
      });

      setStatus('uploading');

      // 2. Upload PNG to Express Server (to get a public url for X OG card sharing)
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: localPngUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to upload generated frame to sharing server.');
      }

      const data = await response.json();
      if (!data.url) {
        throw new Error('Server returned an empty sharing URL.');
      }

      // 3. Complete and advance to Result screen
      onGenerationComplete(localPngUrl, data.url);
    } catch (err: any) {
      console.error('Generation pipeline failed:', err);
      setStatus('error');
      setErrorMsg(err.message || 'An error occurred while compiling your HH Goa 2026 frame.');
    }
  };

  useEffect(() => {
    // Prevent double triggering in React 18 strict mode
    if (hasTriggered.current) return;
    hasTriggered.current = true;
    startGeneration();
  }, []);

  return (
    <div className="step-wrapper generate-step-container">
      <div className="generate-status-card">
        {status === 'rendering' && (
          <div className="status-indicator">
            <div className="generate-wave-wrapper">
              <svg className="generate-wave-svg" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
                <defs>
                  <path id="gentle-wave-loader" d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                </defs>
                <g className="parallax-loader">
                  <use href="#gentle-wave-loader" x="48" y="0" fill="rgba(255, 222, 106, 0.2)" />
                  <use href="#gentle-wave-loader" x="48" y="3" fill="rgba(56, 189, 248, 0.4)" />
                  <use href="#gentle-wave-loader" x="48" y="5" fill="var(--color-yellow)" />
                </g>
              </svg>
            </div>
            <h2 className="status-title">GENERATING FRAME</h2>
            <p className="status-subtitle">Rasterizing SVG layout and custom typography into high-res PNG...</p>
          </div>
        )}

        {status === 'uploading' && (
          <div className="status-indicator">
            <div className="generate-wave-wrapper">
              <svg className="generate-wave-svg" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
                <defs>
                  <path id="gentle-wave-loader" d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                </defs>
                <g className="parallax-loader">
                  <use href="#gentle-wave-loader" x="48" y="0" fill="rgba(255, 222, 106, 0.2)" />
                  <use href="#gentle-wave-loader" x="48" y="3" fill="rgba(56, 189, 248, 0.4)" />
                  <use href="#gentle-wave-loader" x="48" y="5" fill="var(--color-yellow)" />
                </g>
              </svg>
            </div>
            <h2 className="status-title">COMPILING SHARABLE PATH</h2>
            <p className="status-subtitle">Syncing frames with the official Hacker House Goa index...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="status-indicator error">
            <div className="error-icon-circle">
              <AlertTriangle size={32} />
            </div>
            <h2 className="status-title">GENERATION FAILED</h2>
            <p className="status-subtitle error-msg">{errorMsg}</p>
            
            <div className="error-actions">
              <button onClick={startGeneration} className="btn-primary">
                <RefreshCw size={16} />
                <span>Retry Generation</span>
              </button>
              <button onClick={onBackToAdjust} className="btn-secondary">
                Modify Adjustments
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
