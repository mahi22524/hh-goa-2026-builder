import React, { useRef, useState, useEffect } from 'react';
import { ShapeType, PhotoTransform, BuilderIdentity } from '../types';
import { renderSvgString } from '../renderer/svgRenderer';
import { Maximize2, Move } from 'lucide-react';

interface AdjustStepProps {
  photoUrl: string;
  photoWidth: number;
  photoHeight: number;
  selectedIdentity: BuilderIdentity;
  transform: PhotoTransform;
  shape: ShapeType;
  onChangeTransform: (transform: PhotoTransform) => void;
  onChangeShape: (shape: ShapeType) => void;
  onNext: () => void;
}

export const AdjustStep: React.FC<AdjustStepProps> = ({
  photoUrl,
  photoWidth,
  photoHeight,
  selectedIdentity,
  transform,
  shape,
  onChangeTransform,
  onChangeShape,
  onNext,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialTransform, setInitialTransform] = useState({ x: 0, y: 0 });

  // Generate live SVG string markup
  const svgMarkup = renderSvgString({
    photoUrl,
    photoWidth,
    photoHeight,
    themeId: selectedIdentity,
    shape,
    transform,
  });

  // Pointer event handlers for drag support (works for both touch and mouse)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    // Set pointer capture to receive events even if cursor moves outside the box
    containerRef.current.setPointerCapture(e.pointerId);
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialTransform({ x: transform.x, y: transform.y });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    // Get container dimensions to convert screen pixels to SVG coordinate system (1024x1024)
    const rect = containerRef.current.getBoundingClientRect();
    const scale = 1024 / rect.width;

    onChangeTransform({
      ...transform,
      x: initialTransform.x + dx * scale,
      y: initialTransform.y + dy * scale,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging && containerRef.current) {
      containerRef.current.releasePointerCapture(e.pointerId);
      setIsDragging(false);
    }
  };

  // Zoom handler
  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextZoom = parseFloat(e.target.value);
    onChangeTransform({
      ...transform,
      zoom: nextZoom,
    });
  };

  return (
    <div className="step-wrapper adjust-step-container">
      <div className="step-header">
        <h2 className="step-title">ADJUST PHOTO</h2>
        <p className="step-subtitle">Position and zoom your photo within the custom profile frame</p>
      </div>

      {/* Main Large Preview Area */}
      <div className="preview-card">
        <div
          ref={containerRef}
          className="svg-preview-container"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{ touchAction: 'none' }} // Crucial to prevent viewport scroll during pan
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
        
        {/* Interaction hints */}
        <div className="preview-indicator">
          <Move size={14} />
          <span>Drag photo to pan</span>
        </div>
      </div>

      {/* Control Panel */}
      <div className="adjust-controls">
        {/* Shape Choices */}
        <div className="control-group">
          <label className="control-label">FRAME SHAPE</label>
          <div className="shape-picker">
            <button
              type="button"
              className={`shape-btn ${shape === 'CIRCLE' ? 'active' : ''}`}
              onClick={() => onChangeShape('CIRCLE')}
            >
              CIRCLE
            </button>
            <button
              type="button"
              className={`shape-btn ${shape === 'RECTANGLE' ? 'active' : ''}`}
              onClick={() => onChangeShape('RECTANGLE')}
            >
              RECTANGLE
            </button>
          </div>
        </div>

        {/* Zoom Slider */}
        <div className="control-group">
          <div className="slider-label-row">
            <label className="control-label">ZOOM</label>
            <span className="zoom-value">{Math.round(transform.zoom * 100)}%</span>
          </div>
          <div className="zoom-slider-wrapper">
            <input
              type="range"
              min="1.0"
              max="4.0"
              step="0.01"
              value={transform.zoom}
              onChange={handleZoomChange}
              className="zoom-slider"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="step-actions">
        <button type="button" onClick={onNext} className="btn-primary-large">
          GENERATE FRAME
        </button>
      </div>
    </div>
  );
};
