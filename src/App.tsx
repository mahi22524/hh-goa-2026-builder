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
    <div className="app-container">
      {/* Brand Header */}
      <header className="app-header">
        <h1 className="brand-title">HACKER HOUSE GOA 2026</h1>
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
    </div>
  );
}
