/**
 * Reads a File object and returns its data URL representation.
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };
    reader.onerror = () => reject(reader.error || new Error('FileReader error'));
    reader.readAsDataURL(file);
  });
}

/**
 * Loads an image URL into an HTMLImageElement to obtain dimensions.
 */
export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image element'));
    img.src = url;
  });
}

interface ImageBounds {
  width: number;
  height: number;
  x: number;
  y: number;
}

/**
 * Calculates the bounding box for an image to cover a container of dimensions (cw, ch)
 * incorporating user zoom and user translation (panX, panY).
 */
export function calculateImageBounds(
  imgWidth: number,
  imgHeight: number,
  containerWidth: number,
  containerHeight: number,
  zoom: number,
  panX: number,
  panY: number
): ImageBounds {
  // Base scale to cover the container
  const baseScale = Math.max(containerWidth / imgWidth, containerHeight / imgHeight);
  
  // Total scale including user zoom
  const totalScale = baseScale * zoom;
  
  const width = imgWidth * totalScale;
  const height = imgHeight * totalScale;
  
  // Center-aligned base coordinates + user panning
  const x = (containerWidth - width) / 2 + panX;
  const y = (containerHeight - height) / 2 + panY;
  
  return { width, height, x, y };
}
