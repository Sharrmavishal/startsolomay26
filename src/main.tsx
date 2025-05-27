import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { ContentProvider } from './components/ContentProvider';

// Add a visible error message in case of initialization failures
const rootElement = document.getElementById('root');

if (!rootElement) {
  // Create an element to show error if root is missing
  const errorDiv = document.createElement('div');
  errorDiv.style.padding = '20px';
  errorDiv.style.color = 'red';
  errorDiv.style.fontFamily = 'Arial, sans-serif';
  errorDiv.innerHTML = '<h1>Error initializing app</h1><p>Root element not found.</p>';
  document.body.appendChild(errorDiv);
  console.error('Root element not found');
} else {
  try {
    // Create fallback content in case React fails to render
    const fallbackContent = document.createElement('div');
    fallbackContent.id = 'react-fallback';
    fallbackContent.style.display = 'none';
    fallbackContent.style.padding = '20px';
    fallbackContent.style.fontFamily = 'Arial, sans-serif';
    fallbackContent.innerHTML = `
      <h1>Start Solo by Diksha Sethi</h1>
      <p>There was a problem loading the application. Please refresh the page or try again later.</p>
    `;
    document.body.appendChild(fallbackContent);
    
    // Initialize React with error handling
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <BrowserRouter>
          <ContentProvider>
            <App />
          </ContentProvider>
        </BrowserRouter>
      </StrictMode>
    );
    
    // If React renders successfully, hide the fallback
    setTimeout(() => {
      const appMayHaveRendered = rootElement.childNodes.length > 0;
      if (!appMayHaveRendered) {
        console.error('React may have failed to render');
        document.getElementById('react-fallback')!.style.display = 'block';
      }
    }, 2000);
  } catch (error) {
    console.error('Error initializing React app:', error);
    document.getElementById('react-fallback')!.style.display = 'block';
  }
}