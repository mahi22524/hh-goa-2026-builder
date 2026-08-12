import React, { useState } from 'react';
import { StepId, BuilderIdentity, PhotoTransform, ShapeType } from './types';
import { Progress } from './components/Progress';
import { UploadStep } from './components/UploadStep';
import { IdentityStep } from './components/IdentityStep';
import { AdjustStep } from './components/AdjustStep';
import { GenerateStep } from './components/GenerateStep';
import { ResultStep } from './components/ResultStep';
import './styles.css';

const DEFAULT_TRANSFORM: PhotoTransform = { x: 0, y: 0, zoom: 1.0 };

export default function App() {
  // Application Wizard States (Preserved during back/forth navigation)
  const [step, setStep] = useState<StepId>('UPLOAD');
  
  // Image specifications
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [photoType, setPhotoType] = useState<string | null>(null);
  const [photoDimensions, setPhotoDimensions] = useState({ width: 0, height: 0 });

  // User input states
  const [name, setName] = useState<string>('');
  const [position, setPosition] = useState<string>('');

  // Customizer selections
  const [selectedIdentity, setSelectedIdentity] = useState<BuilderIdentity>('CYBER_DEFENDER');
  const [transform, setTransform] = useState<PhotoTransform>(DEFAULT_TRANSFORM);
  const [shape, setShape] = useState<ShapeType>('CIRCLE');

  // Outputs of generation
  const [localPngUrl, setLocalPngUrl] = useState<string | null>(null);
  const [publicImageUrl, setPublicImageUrl] = useState<string | null>(null);

  // --- Handlers ---
  
  const handleUploadSuccess = (
    url: string,
    filename: string,
    type: string,
    width: number,
    height: number
  ) => {
    setPhotoUrl(url);
    setPhotoName(filename);
    setPhotoType(type);
    setPhotoDimensions({ width, height });
    setTransform(DEFAULT_TRANSFORM); // Reset transform for new photo
    setStep('IDENTITY');
  };

  const handleSelectIdentity = (identity: BuilderIdentity) => {
    setSelectedIdentity(identity);
  };

  const handleNextFromIdentity = () => {
    setStep('ADJUST');
  };

  const handleNextFromAdjust = () => {
    setStep('GENERATE');
  };

  const handleGenerationComplete = (localUrl: string, publicUrl: string) => {
    setLocalPngUrl(localUrl);
    setPublicImageUrl(publicUrl);
    setStep('RESULT');
  };

  const handleBackToAdjust = () => {
    setStep('ADJUST');
  };

  const handleStepBack = () => {
    if (step === 'IDENTITY') {
      setStep('UPLOAD');
    } else if (step === 'ADJUST') {
      setStep('IDENTITY');
    }
  };

  const handleReset = () => {
    // Reset state cleanly to begin fresh
    setStep('UPLOAD');
    setPhotoUrl(null);
    setPhotoName(null);
    setPhotoType(null);
    setPhotoDimensions({ width: 0, height: 0 });
    setName('');
    setPosition('');
    setSelectedIdentity('CYBER_DEFENDER');
    setTransform(DEFAULT_TRANSFORM);
    setShape('CIRCLE');
    setLocalPngUrl(null);
    setPublicImageUrl(null);
  };

  return (
    <div className={`app-container theme-step-${step.toLowerCase()}`}>
      {/* Goa environmental decorations (strictly separate from generated graphic) */}
      {step === 'UPLOAD' && (
        <>
          <svg className="sky-bird sky-bird-1" viewBox="0 0 20 12"><path d="M 0 6 C 5 2, 10 2, 10 6 C 10 2, 15 2, 20 6" /></svg>
          <svg className="sky-bird sky-bird-2" viewBox="0 0 20 12"><path d="M 0 6 C 5 2, 10 2, 10 6 C 10 2, 15 2, 20 6" /></svg>
          <svg className="ocean-sailboat" viewBox="0 0 40 40"><path d="M 20 5 L 20 30 M 20 10 L 35 22 L 20 22 M 20 14 L 8 25 L 20 25 M 5 30 L 35 30 C 30 35, 10 35, 5 30 Z" fill="none" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" /></svg>
          <svg className="palm-tree-left" viewBox="0 0 100 150" fill="none" stroke="#0284c7" strokeWidth="3"><path d="M 20 140 Q 30 70, 50 10 M 50 10 Q 10 20, 5 50 M 50 10 Q 90 20, 95 50 M 50 10 Q 20 0, 15 -20 M 50 10 Q 80 0, 85 -20 M 50 10 Q 50 -10, 50 -35" /></svg>
          <svg className="palm-tree-right" viewBox="0 0 100 150" fill="none" stroke="#0284c7" strokeWidth="3"><path d="M 20 140 Q 30 70, 50 10 M 50 10 Q 10 20, 5 50 M 50 10 Q 90 20, 95 50 M 50 10 Q 20 0, 15 -20 M 50 10 Q 80 0, 85 -20 M 50 10 Q 50 -10, 50 -35" /></svg>
        </>
      )}
      {step === 'IDENTITY' && (
        <>
          <svg className="ocean-sailboat" viewBox="0 0 40 40" opacity="0.4"><path d="M 20 5 L 20 30 M 20 10 L 35 22 L 20 22 M 20 14 L 8 25 L 20 25 M 5 30 L 35 30 C 30 35, 10 35, 5 30 Z" fill="none" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" /></svg>
          <svg className="palm-tree-left" viewBox="0 0 100 150" fill="none" stroke="#0284c7" strokeWidth="3" opacity="0.5"><path d="M 20 140 Q 30 70, 50 10 M 50 10 Q 10 20, 5 50 M 50 10 Q 90 20, 95 50 M 50 10 Q 20 0, 15 -20 M 50 10 Q 80 0, 85 -20 M 50 10 Q 50 -10, 50 -35" /></svg>
          <svg className="palm-tree-right" viewBox="0 0 100 150" fill="none" stroke="#0284c7" strokeWidth="3" opacity="0.5"><path d="M 20 140 Q 30 70, 50 10 M 50 10 Q 10 20, 5 50 M 50 10 Q 90 20, 95 50 M 50 10 Q 20 0, 15 -20 M 50 10 Q 80 0, 85 -20 M 50 10 Q 50 -10, 50 -35" /></svg>
        </>
      )}
      {step === 'ADJUST' && (
        <>
          <div className="seaweed-left">
            <svg viewBox="0 0 50 150" fill="none" stroke="#bae6fd" strokeWidth="2" opacity="0.3"><path d="M 25 150 Q 10 100, 25 50 T 25 0 M 15 150 Q 30 100, 15 50 T 35 10" /></svg>
          </div>
          <div className="seaweed-right">
            <svg viewBox="0 0 50 150" fill="none" stroke="#bae6fd" strokeWidth="2" opacity="0.3"><path d="M 25 150 Q 10 100, 25 50 T 25 0 M 15 150 Q 30 100, 15 50 T 35 10" /></svg>
          </div>
          <div className="underwater-bubble" style={{ left: '12%', width: '10px', height: '10px', animationDelay: '0s', animationDuration: '6s' }} />
          <div className="underwater-bubble" style={{ left: '42%', width: '14px', height: '14px', animationDelay: '2s', animationDuration: '8s' }} />
          <div className="underwater-bubble" style={{ left: '78%', width: '8px', height: '8px', animationDelay: '4s', animationDuration: '5s' }} />
        </>
      )}
      {step === 'RESULT' && (
        <>
          <svg className="palm-tree-left" viewBox="0 0 100 150" fill="none" stroke="#0284c7" strokeWidth="3"><path d="M 20 140 Q 30 70, 50 10 M 50 10 Q 10 20, 5 50 M 50 10 Q 90 20, 95 50 M 50 10 Q 20 0, 15 -20 M 50 10 Q 80 0, 85 -20 M 50 10 Q 50 -10, 50 -35" /></svg>
          <svg className="palm-tree-right" viewBox="0 0 100 150" fill="none" stroke="#0284c7" strokeWidth="3"><path d="M 20 140 Q 30 70, 50 10 M 50 10 Q 10 20, 5 50 M 50 10 Q 90 20, 95 50 M 50 10 Q 20 0, 15 -20 M 50 10 Q 80 0, 85 -20 M 50 10 Q 50 -10, 50 -35" /></svg>
        </>
      )}

      {/* Brand Header */}
      <header className="app-header">
        <div className="header-brand-container">
          <h1 className="header-title-large">HACKER HOUSE</h1>
          <div className="header-subtitle-row">
            {/* Wavy line left */}
            <svg className="wavy-line" viewBox="0 0 30 6" width="30" height="6">
              <path d="M 0 3 Q 7.5 0, 15 3 T 30 3" fill="none" stroke="#0ea5e9" strokeWidth="2.5" />
            </svg>
            <span className="header-goa-title">GOA 2026</span>
            {/* Wavy line right */}
            <svg className="wavy-line" viewBox="0 0 30 6" width="30" height="6">
              <path d="M 0 3 Q 7.5 0, 15 3 T 30 3" fill="none" stroke="#0ea5e9" strokeWidth="2.5" />
            </svg>
          </div>
          <p className="header-tagline">BUILD • INNOVATE • IMPACT</p>
        </div>
        
        {/* Transition wave at bottom of header */}
        <div className="wave-container">
          <svg className="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
            <defs>
              <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g className="parallax">
              <use href="#gentle-wave" x="48" y="0" fill="rgba(255, 222, 106, 0.03)" />
              <use href="#gentle-wave" x="48" y="3" fill="rgba(247, 244, 235, 0.06)" />
              <use href="#gentle-wave" x="48" y="5" fill="rgba(27, 61, 39, 0.3)" />
              <use href="#gentle-wave" x="48" y="7" fill="var(--color-bg)" />
            </g>
          </svg>
        </div>
      </header>

      {/* Progress Header / Navigation */}
      <Progress currentStep={step} onBack={handleStepBack} />

      {/* Main Wizard Area */}
      <main className="main-content">
        {step === 'UPLOAD' && (
          <UploadStep onUploadSuccess={handleUploadSuccess} />
        )}

        {step === 'IDENTITY' && (
          <IdentityStep
            name={name}
            position={position}
            onChangeName={setName}
            onChangePosition={setPosition}
            selectedIdentity={selectedIdentity}
            onSelectIdentity={handleSelectIdentity}
            onNext={handleNextFromIdentity}
          />
        )}

        {step === 'ADJUST' && photoUrl && (
          <AdjustStep
            photoUrl={photoUrl}
            photoWidth={photoDimensions.width}
            photoHeight={photoDimensions.height}
            selectedIdentity={selectedIdentity}
            transform={transform}
            shape={shape}
            onChangeTransform={setTransform}
            onChangeShape={setShape}
            onNext={handleNextFromAdjust}
          />
        )}

        {step === 'GENERATE' && (
          <GenerateStep
            photoUrl={photoUrl}
            photoWidth={photoDimensions.width}
            photoHeight={photoDimensions.height}
            selectedIdentity={selectedIdentity}
            transform={transform}
            shape={shape}
            name={name}
            position={position}
            onGenerationComplete={handleGenerationComplete}
            onBackToAdjust={handleBackToAdjust}
          />
        )}

        {step === 'RESULT' && localPngUrl && publicImageUrl && (
          <ResultStep
            localPngUrl={localPngUrl}
            publicImageUrl={publicImageUrl}
            selectedIdentity={selectedIdentity}
            onReset={handleReset}
          />
        )}
      </main>
      
      {/* Global Brand Footer Pill matching the reference design */}
      <footer className="global-footer-pill">
        <div className="footer-pill-item">
          <svg className="footer-pill-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>GOA / INDIA</span>
        </div>
        <div className="footer-pill-divider">|</div>
        <div className="footer-pill-item">
          <svg className="footer-pill-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>28–31 OCT 2026</span>
        </div>
        <div className="footer-pill-divider">|</div>
        <div className="footer-pill-item">
          <span className="hashtag-accent">#BUILDATGOA2026</span>
        </div>
      </footer>
    </div>
  );
}
