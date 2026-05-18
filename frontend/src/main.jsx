import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { store } from './store/store.js';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#0D1B3E',
              color: '#ffffff',
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              borderRadius: '12px',
              border: '1px solid rgba(201,168,76,0.3)',
              boxShadow: '0 8px 32px rgba(13,27,62,0.25)',
            },
            success: {
              iconTheme: { primary: '#C9A84C', secondary: '#0D1B3E' },
            },
            error: {
              style: { background: '#dc2626', border: '1px solid rgba(255,255,255,0.1)' },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
