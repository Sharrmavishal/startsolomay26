import { Cloudinary } from '@cloudinary/url-gen';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';
import { scale, fill } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

// Initialize Cloudinary
export const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name'
  },
  url: {
    secure: true
  }
});

interface ImageOptions {
  width?: number;
  height?: number;
  format?: string;
  quality?: number;
  crop?: 'scale' | 'fill';
}

// Helper function to get optimized image URL
export const getImageUrl = (publicId: string, options: ImageOptions = {}) => {
  const image = cld.image(publicId);
  
  // Set default format and quality
  image
    .format(format(options.format || 'auto'))
    .quality(quality(options.quality || 'auto'));
  
  // Apply resize transformation
  if (options.width || options.height) {
    if (options.crop === 'fill') {
      image.resize(fill()
        .width(options.width)
        .height(options.height)
        .gravity(autoGravity()));
    } else {
      image.resize(scale()
        .width(options.width)
        .height(options.height));
    }
  }
  
  return image.toURL();
};

// Common image sizes
export const imageSizes = {
  thumbnail: { width: 150, height: 150, crop: 'fill' },
  small: { width: 300 },
  medium: { width: 600 },
  large: { width: 900 },
  hero: { width: 1200, height: 600, crop: 'fill' }
} as const;