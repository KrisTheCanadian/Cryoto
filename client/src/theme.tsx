import {colors, PaletteMode} from '@mui/material';

declare module '@mui/material/styles' {
  interface Theme {
    interface: {
      main: string;
      contrastMain: string;
      offBackground: string;
      shadow: string;
    };
    borderRadius: {
      default: number;
      medium: number;
      large: number;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    interface?: {
      main?: string;
      contrastMain?: string;
      offBackground?: string;
      shadow?: string;
    };
    borderRadius?: {
      default?: number;
      medium?: number;
      large?: number;
    };
  }
}

const getDesignTokens = (mode: PaletteMode) => ({
  typography: {
    fontFamily: [
      'Inter var experimental',
      'Inter var',
      'ui-sans-serif',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Helvetica',
      'Arial',
      'Noto Sans',
      'sans-serif',
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
      'Noto Color Emoji',
    ].join(','),
  },
  interface: {
    shadow: '0px 0px 20px 9px rgba(0,0,0,0.08)',
    mode,
    ...(mode === 'light'
      ? {
          main: 'white',
          contrastMain: colors.grey[200],
          offBackground: 'white',
        }
      : {main: '#242424', contrastMain: '#3a3a3a', offBackground: '#2c2c2c'}),
  },
  borderRadius: {
    default: 4,
    medium: 8,
    large: 16,
  },
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
        }
      : {
          // palette values for dark mode
        }),
  },
});

export default getDesignTokens;
