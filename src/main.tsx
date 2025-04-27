
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error handler for uncaught exceptions
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error);
  // You could send this to an analytics service in production
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // You could send this to an analytics service in production
});

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container not found. Failed to mount React app');
}

const root = createRoot(container);

// Wrap the rendering in a try-catch for additional error handling
try {
  root.render(<App />);
} catch (error) {
  console.error('Failed to render application:', error);
  // Show a basic error screen if React fails to render
  container.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; padding: 20px; text-align: center;">
      <h1 style="margin-bottom: 20px; color: #e11d48;">Application Error</h1>
      <p>Sorry, something went wrong while loading the application.</p>
      <button 
        onclick="window.location.reload()" 
        style="margin-top: 20px; padding: 10px 16px; background-color: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;"
      >
        Reload Page
      </button>
    </div>
  `;
}
