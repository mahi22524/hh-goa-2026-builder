import React from 'react';
import { StepId } from '../types';
import { ChevronLeft } from 'lucide-react';

interface ProgressProps {
  currentStep: StepId;
  onBack?: () => void;
}

const STEPS: { id: StepId; label: string; num: string }[] = [
  { id: 'UPLOAD', label: 'Upload', num: '01' },
  { id: 'IDENTITY', label: 'Identity', num: '02' },
  { id: 'ADJUST', label: 'Adjust', num: '03' },
  { id: 'GENERATE', label: 'Generate', num: '04' },
  { id: 'RESULT', label: 'Result', num: '05' },
];

export const Progress: React.FC<ProgressProps> = ({ currentStep, onBack }) => {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
  const activeStep = STEPS[currentIndex];

  const showBackButton = onBack && currentIndex > 0 && currentStep !== 'RESULT' && currentStep !== 'GENERATE';

  return (
    <div className="progress-container">
      {/* Top indicator bar */}
      <div className="progress-segments">
        {STEPS.map((step, idx) => {
          const isActive = idx <= currentIndex;
          return (
            <div
              key={step.id}
              className={`progress-segment ${isActive ? 'active' : ''}`}
              title={step.label}
            />
          );
        })}
      </div>

      {/* Title & Navigation */}
      <div className="progress-nav">
        <div className="nav-left">
          {showBackButton ? (
            <button onClick={onBack} className="back-button" aria-label="Go back">
              <ChevronLeft size={20} />
              <span>Back</span>
            </button>
          ) : (
            <div className="nav-placeholder" />
          )}
        </div>

        <div className="nav-center">
          <span className="step-number">{activeStep.num}</span>
          <span className="step-label">{activeStep.label.toUpperCase()}</span>
        </div>

        <div className="nav-right">
          <span className="step-fraction">{currentIndex + 1}/{STEPS.length}</span>
        </div>
      </div>
    </div>
  );
};
