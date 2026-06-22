import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './paypal_ball_app'; // Ini memanggil file utama kamu

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
