/**
 * Helper to convert HEIC/HEIF files to PNG using heic2any client-side.
 */
export async function convertHeicToPng(file: File): Promise<Blob> {
  try {
    const heic2any = (await import('heic2any')).default;
    const converted = await heic2any({
      blob: file,
      toType: 'image/png',
    });
    if (Array.isArray(converted)) {
      return converted[0];
    }
    return converted as Blob;
  } catch (error) {
    console.error('HEIC conversion failed:', error);
    throw new Error('Failed to convert HEIC/HEIF image. Please try a JPG or PNG.');
  }
}

/**
 * Checks if a file is HEIC/HEIF by its extension or mime-type.
 */
export function isHeicFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return (
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    name.endsWith('.heic') ||
    name.endsWith('.heif')
  );
}
