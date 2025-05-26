import CMS from 'decap-cms-app';
import { createRoot } from 'react-dom/client';

// Initialize the CMS
CMS.init();

// Create a custom preview component for the CMS
const CmsApp = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Start Solo Blueprint CMS</h1>
      <p>Edit your website content using the sidebar on the left.</p>
    </div>
  );
};

// Wait for the CMS to be ready
if (document.getElementById('nc-root')) {
  const root = createRoot(document.getElementById('nc-root')!);
  root.render(<CmsApp />);
}