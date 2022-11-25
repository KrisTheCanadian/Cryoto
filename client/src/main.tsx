import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {MsalProvider} from '@azure/msal-react';
import {PublicClientApplication} from '@azure/msal-browser';

import {msalConfig} from './pages/Authentication';
import App from './App';

import './index.css';
import './i18n/i18n';

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MsalProvider>
  </React.StrictMode>,
);
