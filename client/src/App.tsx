import {useTranslation} from 'react-i18next';
import {Suspense, useMemo, useState} from 'react';
import {CssBaseline, PaletteMode, Stack} from '@mui/material';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {Routes, Route} from 'react-router-dom';
import {NavBar} from '@shared/components/NavBar';
import {SideBar} from '@shared/components/SideBar';

import {MarketPlace} from './pages/MarketPlace';
import {HomePage} from './pages/HomePage';
import {Wallet} from './pages/Wallet';
import getDesignTokens from './theme';
import './App.css';
import {Profile} from './pages/Profile';
import {Orders} from './pages/Orders';
import {Settings} from './pages/Settings';

function App() {
  const {t, i18n} = useTranslation();
  // dark mode / light mode logic
  const [mode, setMode] = useState<PaletteMode>('light');
  const colorMode = useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === 'light' ? 'dark' : 'light',
        );
      },
    }),
    [],
  );
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  return (
    <Suspense fallback="Loading...">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar toggleColorMode={colorMode.toggleColorMode} />
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={2}
          position="relative"
        >
          <SideBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/marketplace" element={<MarketPlace />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Stack>
      </ThemeProvider>
    </Suspense>
  );
}
export default App;
