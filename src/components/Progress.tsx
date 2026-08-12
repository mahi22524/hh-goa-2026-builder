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
      {/* White wavy background band matching visual reference */}
      <svg className="progress-bg-wave" viewBox="0 0 500 90" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 0 0 C 125 10, 375 -10, 500 0 L 500 90 C 375 100, 125 80, 0 90 Z"
          fill="#ffffff"
        />
      </svg>

      {/* Custom curved ocean wave journey progress line */}
      <div className="progress-wave-journey">
        <svg viewBox="0 0 500 50" className="progress-wave-svg" preserveAspectRatio="none">
          {/* Background curved wave line */}
          <path
            d="M 20 25 C 80 5, 140 45, 200 25 C 260 5, 320 45, 380 25 C 430 10, 460 30, 480 25"
            fill="none"
            stroke="rgba(247, 244, 235, 0.15)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          
          {/* Highlighted active path segment up to current step */}
          <path
            d="M 20 25 C 80 5, 140 45, 200 25 C 260 5, 320 45, 380 25 C 430 10, 460 30, 480 25"
            fill="none"
            stroke="var(--color-yellow)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="500"
            strokeDashoffset={500 - (currentIndex / 4) * 460}
            style={{ transition: 'stroke-dashoffset 0.4s ease-in-out' }}
          />

          {/* Dots/markers on the wave path */}
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isActive = idx === currentIndex;

            // X-coordinates match the spacing of labels
            const xCoords = [20, 135, 250, 365, 480];
            const yCoords = [25, 20, 25, 28, 25]; // Matching the peaks/valleys
            const x = xCoords[idx];
            const y = yCoords[idx];

            let dotColor = "rgba(247, 244, 235, 0.3)";
            if (isActive) dotColor = "var(--color-yellow)";
            else if (isCompleted) dotColor = "#38bdf8";

            return (
              <g key={step.id}>
                {isActive && (
                  <circle cx={x} cy={y} r="8" fill="rgba(255, 222, 106, 0.35)" className="active-glow-ring" />
                )}
                <circle cx={x} cy={y} r={isActive ? "5" : "4"} fill={dotColor} />
              </g>
            );
          })}
        </svg>

        {/* Labels under the curved line */}
        <div className="progress-wave-labels">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isActive = idx === currentIndex;

            let labelClass = "upcoming";
            if (isActive) labelClass = "active";
            else if (isCompleted) labelClass = "completed";

            return (
              <div key={step.id} className={`wave-label-col ${labelClass}`}>
                <span className="wave-label-num">{step.num}</span>
                <span className="wave-label-text">{step.label.toUpperCase()}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Back Navigation Bar */}
      {showBackButton && (
        <div className="progress-nav-bar">
          <button onClick={onBack} className="back-button" aria-label="Go back">
            <ChevronLeft size={16} />
            <span>BACK</span>
          </button>
        </div>
      )}
    </div>
  );
};
