import {useTranslation} from 'react-i18next';
import {Suspense, useMemo, useState} from 'react';
import {CssBaseline, PaletteMode, Stack} from '@mui/material';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {Routes, Route} from 'react-router-dom';
import {NavBar} from '@shared/components/NavBar';
import {SideBar} from '@shared/components/SideBar';

import {HomePage} from './pages/HomePage';
import {Wallet} from './pages/Wallet';
import getDesignTokens from './theme';
import './App.css';

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
          </Routes>
        </Stack>
      </ThemeProvider>
    </Suspense>
  );
}
export default App;
