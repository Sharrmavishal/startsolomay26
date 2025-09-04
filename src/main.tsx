import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import ContentProvider from './components/ContentProvider';
import React from 'react';

// Add error boundary with proper TypeScript syntax
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
          <h1>Something went wrong</h1>
          <p>The application encountered an error. Please refresh the page.</p>
          <details style={{ marginTop: '10px' }}>
            <summary>Error details</summary>
            <pre style={{ background: '#f5f5f5', padding: '10px', marginTop: '10px' }}>
              {this.state.error?.toString()}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

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
      <p>If this problem persists, please contact support at hello@startsolo.in</p>
    `;
    document.body.appendChild(fallbackContent);
    
    // Initialize React with error handling
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <ErrorBoundary>
          <BrowserRouter>
            <ContentProvider>
              <App />
            </ContentProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </StrictMode>
    );
    
    // If React renders successfully, hide the fallback
    setTimeout(() => {
      const appMayHaveRendered = rootElement.childNodes.length > 0;
      if (!appMayHaveRendered) {
        console.error('React may have failed to render');
        const fallback = document.getElementById('react-fallback');
        if (fallback) {
          fallback.style.display = 'block';
        }
      }
    }, 2000);
  } catch (error) {
    console.error('Error initializing React app:', error);
    const fallback = document.getElementById('react-fallback');
    if (fallback) {
      fallback.style.display = 'block';
    }
  }
}