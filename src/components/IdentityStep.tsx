import React, { useState } from 'react';
import { BuilderIdentity } from '../types';
import { THEMES } from '../renderer/themes';
import { IdentityCard } from './IdentityCard';
import { AlertTriangle } from 'lucide-react';

interface IdentityStepProps {
  name: string;
  position: string;
  onChangeName: (val: string) => void;
  onChangePosition: (val: string) => void;
  selectedIdentity: BuilderIdentity;
  onSelectIdentity: (identity: BuilderIdentity) => void;
  onNext: () => void;
}

export const IdentityStep: React.FC<IdentityStepProps> = ({
  name,
  position,
  onChangeName,
  onChangePosition,
  selectedIdentity,
  onSelectIdentity,
  onNext,
}) => {
  const identities = Object.values(THEMES);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!name.trim()) {
      setValidationError('Please enter your name.');
      return;
    }
    if (!position.trim()) {
      setValidationError('Please enter your position or role.');
      return;
    }
    setValidationError(null);
    onNext();
  };

  return (
    <div className="step-wrapper identity-step-container">
      <div className="step-header">
        <h2 className="step-title">SELECT IDENTITY</h2>
        <p className="step-subtitle">Enter your details and choose the role that defines your building journey at Hacker House Goa 2026</p>
      </div>

      {validationError && (
        <div className="error-banner">
          <AlertTriangle size={18} className="error-icon" />
          <span className="error-text">{validationError}</span>
        </div>
      )}

      {/* Inputs for Name and Position */}
      <div className="identity-inputs-container">
        <div className="input-group">
          <label className="input-label" htmlFor="user-name">YOUR NAME</label>
          <input
            id="user-name"
            type="text"
            className="identity-input"
            value={name}
            onChange={(e) => {
              onChangeName(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="Enter your name"
            maxLength={40}
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="user-position">YOUR POSITION / ROLE</label>
          <input
            id="user-position"
            type="text"
            className="identity-input"
            value={position}
            onChange={(e) => {
              onChangePosition(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="e.g. Cybersecurity Student"
            maxLength={50}
          />
        </div>
      </div>

      <div className="section-divider">
        <span className="input-label">SELECT IDENTITY</span>
      </div>

      {/* Grid of builder identity cards */}
      <div className="identity-grid">
        {identities.map((theme) => (
          <IdentityCard
            key={theme.id}
            theme={theme}
            isSelected={theme.id === selectedIdentity}
            onSelect={() => onSelectIdentity(theme.id)}
          />
        ))}
      </div>

      {/* Navigation button */}
      <div className="step-actions">
        <button type="button" onClick={handleConfirm} className="btn-primary-large">
          CONFIRM IDENTITY
        </button>
      </div>
    </div>
  );
};
