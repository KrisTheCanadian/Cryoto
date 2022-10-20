import {Suspense} from 'react';
import {CssBaseline} from '@mui/material';
import {Routes, Route} from 'react-router-dom';
import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';

import {StyleGuide} from './pages/StyleGuide';
import {AuthenticationPage} from './pages/Authentication';
import {MarketPlace} from './pages/MarketPlace';
import {HomePage} from './pages/HomePage';
import {Wallet} from './pages/Wallet';
import './App.css';
import {Profile} from './pages/Profile';
import {Orders} from './pages/Orders';
import {Settings} from './pages/Settings';

function App() {
  return (
    <Suspense fallback="Loading...">
      <ThemeContextProvider>
        <CssBaseline />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/marketplace" element={<MarketPlace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/styleguide" element={<StyleGuide />} />
          <Route path="/authentication" element={<AuthenticationPage />} />
        </Routes>
      </ThemeContextProvider>
    </Suspense>
  );
}

export default App;
