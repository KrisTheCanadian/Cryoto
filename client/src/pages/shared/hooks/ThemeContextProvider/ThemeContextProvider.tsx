import {createTheme, PaletteMode, ThemeProvider} from '@mui/material';
import {createContext, ReactNode, useContext, useMemo, useState} from 'react';

import getDesignTokens from '../../../../theme';

interface ThemeContextState {
  // set the type of state you want to handle with context e.g.
  mode: string | null;
  colorMode: {toggleColorMode: () => void};
}
// set an empty object as default state
const ThemeContext = createContext({} as ThemeContextState);

interface ThemeContextProviderProps {
  children: ReactNode | string | ReactNode[];
}
function ThemeContextProvider(props: ThemeContextProviderProps) {
  const {children} = props;
  let prevColorMode = localStorage.getItem('prevColorMode') as PaletteMode;
  if (!prevColorMode) {
    prevColorMode = 'light' as PaletteMode;
    localStorage.setItem('prevColorMode', prevColorMode);
  }

  const [mode, setMode] = useState<PaletteMode>(prevColorMode);
  const colorMode = useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) => {
          if (prevMode === 'light') {
            localStorage.setItem('prevColorMode', 'dark');
            return 'dark';
          } else {
            localStorage.setItem('prevColorMode', 'light');
            return 'light';
          }
        });
      },
    }),
    [],
  );
  const value = useMemo(() => {
    return {mode, colorMode};
  }, [mode, colorMode]);

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}> {children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}

// hook to get and set the dark mode state
// use colorMode.toggleColorMode() will toggle the dark mode
function useThemeModeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useCount must be used within a CountProvider');
  }
  return context;
}
export {ThemeContextProvider, useThemeModeContext};
