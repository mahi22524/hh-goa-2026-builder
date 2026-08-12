import React, { useState, useRef } from 'react';
import { readFileAsDataUrl, loadImage } from '../utils/image';
import { isHeicFile, convertHeicToPng } from '../utils/heic';
import { Upload, FileImage, AlertTriangle, Loader2, Smartphone, FileText } from 'lucide-react';

interface UploadStepProps {
  onUploadSuccess: (
    photoUrl: string,
    photoName: string,
    photoType: string,
    width: number,
    height: number
  ) => void;
}

export const UploadStep: React.FC<UploadStepProps> = ({ onUploadSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setError(null);
    setIsProcessing(true);

    try {
      // Validate File Size (Limit to 15MB client-side)
      const MAX_SIZE = 15 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        throw new Error('File is too large. Maximum size allowed is 15MB.');
      }

      // Check if HEIC/HEIF
      if (isHeicFile(file)) {
        const pngBlob = await convertHeicToPng(file);
        const pngFile = new File([pngBlob], file.name.replace(/\.[^/.]+$/, '.png'), {
          type: 'image/png',
        });
        const url = await readFileAsDataUrl(pngFile);
        const img = await loadImage(url);
        onUploadSuccess(url, pngFile.name, pngFile.type, img.naturalWidth, img.naturalHeight);
      } else {
        // Validate Standard Formats
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
          throw new Error('Unsupported file format. Please upload JPG, PNG, or HEIC images.');
        }

        const url = await readFileAsDataUrl(file);
        const img = await loadImage(url);
        onUploadSuccess(url, file.name, file.type, img.naturalWidth, img.naturalHeight);
      }
    } catch (err: any) {
      console.error('File upload/processing error:', err);
      setError(err.message || 'An error occurred while processing your image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="step-wrapper upload-step-container">
      <div className="upload-header">
        <h2 className="step-title">CREATE YOUR FRAME</h2>
        <p className="step-subtitle">Upload your photo to start generating your custom Hacker House Goa 2026 frame</p>
      </div>

      {error && (
        <div className="error-banner">
          <AlertTriangle size={18} className="error-icon" />
          <span className="error-text">{error}</span>
        </div>
      )}

      {/* Drag and Drop Zone */}
      <div
        className={`upload-zone ${dragActive ? 'drag-active' : ''} ${isProcessing ? 'processing' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={!isProcessing ? triggerFileInput : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden-file-input"
          accept=".jpg,.jpeg,.png,.heic,.heif"
          onChange={handleFileChange}
          disabled={isProcessing}
        />

        {isProcessing ? (
          <div className="upload-state">
            <Loader2 className="processing-spinner animate-spin" size={48} />
            <h3 className="upload-state-title">Processing Photo...</h3>
            <p className="upload-state-desc">Converting image files and building preview...</p>
          </div>
        ) : (
          <div className="upload-state">
            <div className="upload-icon-wrapper">
              <Upload size={28} className="upload-icon" />
            </div>
            
            {/* Wavy separator under icon */}
            <svg className="upload-icon-wave" viewBox="0 0 30 6" width="30" height="6">
              <path d="M 0 3 Q 7.5 0, 15 3 T 30 3" fill="none" stroke="#38bdf8" strokeWidth="2" />
            </svg>

            <h3 className="upload-state-title">Drag & drop your photo</h3>
            <p className="upload-state-desc">or click to browse from files</p>
            
            {/* Split metadata row matching reference design */}
            <div className="upload-metadata-row">
              <div className="meta-item">
                <FileImage size={14} className="meta-icon" />
                <span>Supports JPG, PNG,</span>
              </div>
              <div className="meta-divider">|</div>
              <div className="meta-item">
                <Smartphone size={14} className="meta-icon" />
                <span>and iPhone HEIC</span>
              </div>
              <div className="meta-divider">|</div>
              <div className="meta-item">
                <FileText size={14} className="meta-icon" />
                <span>up to 15MB</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alternative triggers/hints */}
      <div className="upload-features">
        <div className="feature-item">
          <FileImage size={18} className="feature-icon" />
          <span>No cropping required prior to upload</span>
        </div>
      </div>
    </div>
  );
};
