import { useEffect } from 'react';

// Default branding settings
const defaultBranding = {
  primaryColor: {
    default: "#e57341",
    light: "#f8a47f",
    dark: "#c45a2f"
  },
  secondaryColor: {
    default: "#0097b2",
    light: "#33b3ca",
    dark: "#007a8f"
  },
  accentColor: {
    default: "#eeb44e",
    light: "#f4c87a",
    dark: "#d9a13c"
  },
  tertiaryColor: {
    default: "#6e936a",
    light: "#8aaa87",
    dark: "#5a7857"
  },
  highlightColor: {
    default: "#e44041",
    light: "#ea6c6d",
    dark: "#c13334"
  },
  richColor: {
    default: "#3e1311",
    light: "#5a2d2b",
    dark: "#2a0d0c"
  },
  typography: {
    headingFont: "sans-serif",
    bodyFont: "sans-serif",
    baseFontSize: "16px"
  }
};

// Function to generate CSS variables from branding settings
export const generateCSSVariables = (brandingSettings = defaultBranding) => {
  const {
    primaryColor,
    secondaryColor,
    accentColor,
    tertiaryColor,
    highlightColor,
    richColor,
    typography
  } = brandingSettings;

  // Create CSS variables
  const cssVariables = `
    :root {
      /* Primary Colors */
      --color-primary: ${primaryColor.default};
      --color-primary-light: ${primaryColor.light};
      --color-primary-dark: ${primaryColor.dark};
      
      /* Secondary Colors */
      --color-secondary: ${secondaryColor.default};
      --color-secondary-light: ${secondaryColor.light};
      --color-secondary-dark: ${secondaryColor.dark};
      
      /* Accent Colors */
      --color-accent: ${accentColor.default};
      --color-accent-light: ${accentColor.light};
      --color-accent-dark: ${accentColor.dark};
      
      /* Tertiary Colors */
      --color-tertiary: ${tertiaryColor.default};
      --color-tertiary-light: ${tertiaryColor.light};
      --color-tertiary-dark: ${tertiaryColor.dark};
      
      /* Highlight Colors */
      --color-highlight: ${highlightColor.default};
      --color-highlight-light: ${highlightColor.light};
      --color-highlight-dark: ${highlightColor.dark};
      
      /* Rich Colors */
      --color-rich: ${richColor.default};
      --color-rich-light: ${richColor.light};
      --color-rich-dark: ${richColor.dark};
      
      /* Typography */
      --font-heading: ${typography.headingFont};
      --font-body: ${typography.bodyFont};
      --font-size-base: ${typography.baseFontSize};
    }
  `;

  return cssVariables;
};

// Hook to apply theme to the document
export const useTheme = () => {
  useEffect(() => {
    try {
      // Create style element
      const styleElement = document.createElement('style');
      styleElement.id = 'dynamic-theme';
      styleElement.innerHTML = generateCSSVariables();
      
      // Add to document head
      document.head.appendChild(styleElement);
      
      // Cleanup on unmount
      return () => {
        const existingStyle = document.getElementById('dynamic-theme');
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }, []);
};