import React from 'react';
import { getImageUrl } from '../utils/cloudinary';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  publicId: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const Image: React.FC<ImageProps> = ({
  publicId,
  alt,
  className,
  width,
  height,
  ...props
}) => {
  const imageUrl = getImageUrl(publicId, {
    width,
    height
  });

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="lazy"
      {...props}
    />
  );
};