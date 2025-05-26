import React, { createContext, useContext, ReactNode } from 'react';
import { useTheme } from '../utils/themeLoader';

// Import content
import generalSettings from '../content/settings/general.json';
import headerSettings from '../content/settings/header.json';
import webinarDatesContent from '../content/sections/webinarDates.json';
import faqContent from '../content/sections/faq.json';

// Default content values
const defaultContent = {
  general: generalSettings,
  header: headerSettings,
  webinarDates: webinarDatesContent,
  faq: faqContent
};

// Create the context
const ContentContext = createContext(defaultContent);

// Create a provider component
export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load content (in a real implementation, this would fetch from JSON files or an API)
  const content = defaultContent;
  
  // Apply theme from branding settings
  useTheme();
  
  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
};

// Create a hook to use the content
export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};