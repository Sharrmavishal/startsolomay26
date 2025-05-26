import type { Strapi } from '@strapi/strapi';

const strapiUrl = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

export const fetchAPI = async (path: string, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  const requestUrl = `${strapiUrl}/api${path}`;
  const response = await fetch(requestUrl, mergedOptions);
  
  if (!response.ok) {
    throw new Error(`An error occurred: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data;
};

export const getStrapiURL = (path = '') => {
  return `${strapiUrl}${path}`;
};

export const getStrapiMedia = (media: any) => {
  if (!media) return null;
  const { url } = media;
  return url.startsWith('/') ? getStrapiURL(url) : url;
};