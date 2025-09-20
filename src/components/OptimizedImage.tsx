import React, { useState, useCallback } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  sizes?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  quality = 80,
  priority = false,
  sizes = '100vw',
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

  // Generate responsive image URLs for different screen sizes
  const generateResponsiveSrc = (baseSrc: string, width: number) => {
    // If it's a Cloudinary URL, add optimization parameters
    if (baseSrc.includes('res.cloudinary.com')) {
      const url = new URL(baseSrc);
      const pathParts = url.pathname.split('/');
      const versionIndex = pathParts.findIndex(part => part.startsWith('v'));
      
      if (versionIndex !== -1) {
        // Insert optimization parameters after version
        pathParts.splice(versionIndex + 1, 0, 
          `w_${width},c_scale,q_${quality},f_auto`
        );
        url.pathname = pathParts.join('/');
        return url.toString();
      }
    }
    return baseSrc;
  };

  // Generate srcset for responsive images
  const generateSrcSet = (baseSrc: string) => {
    const breakpoints = [320, 640, 768, 1024, 1280, 1536];
    return breakpoints
      .map(w => `${generateResponsiveSrc(baseSrc, w)} ${w}w`)
      .join(', ');
  };

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
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Main image */}
      <img
        src={generateResponsiveSrc(src, width || 800)}
        srcSet={generateSrcSet(src)}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
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

// Hook for intersection observer to lazy load images
export const useIntersectionObserver = (ref: React.RefObject<HTMLElement>, options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return isIntersecting;
};
