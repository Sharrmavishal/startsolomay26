import React, { useState, useCallback } from 'react';
import { getImageUrl } from '../utils/cloudinary';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  publicId: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  placeholder?: 'blur' | 'pixelate';
}

export const Image: React.FC<ImageProps> = ({
  publicId,
  alt,
  className,
  width,
  height,
  quality = 80,
  format = 'auto',
  placeholder = 'blur',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  // Generate optimized image URL
  const imageUrl = getImageUrl(publicId, {
    width,
    height,
    quality,
    format,
    placeholder
  });

  // Generate low-quality placeholder
  const placeholderUrl = getImageUrl(publicId, {
    width: width ? Math.min(width, 50) : 50,
    height: height ? Math.min(height, 50) : 50,
    quality: 10,
    format: 'jpg',
    effect: 'blur:300'
  });

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* Placeholder */}
      {!isLoaded && (
        <img
          src={placeholderUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
          aria-hidden="true"
        />
      )}
      
      {/* Main image */}
      <img
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};