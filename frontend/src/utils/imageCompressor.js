/**
 * Fast client-side image compressor using HTML5 Canvas.
 * Compresses images from multi-megabyte payloads down to ~150-250KB in milliseconds,
 * massively speeding up network upload to backend and Cloudinary.
 *
 * @param {File} file - Original image file
 * @param {number} maxWidth - Max width/height in px (default 1400)
 * @param {number} quality - JPEG compression quality 0.0 to 1.0 (default 0.82)
 * @returns {Promise<File>} Compressed File ready for FormData upload
 */
export const compressImage = (file, maxWidth = 1400, quality = 0.82) => {
  return new Promise((resolve) => {
    // If not an image or SVG/GIF, return as-is
    if (!file || !file.type.startsWith('image/') || file.type.includes('svg') || file.type.includes('gif')) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate proportional dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              // If compression didn't save size, use original
              return resolve(file);
            }
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};
