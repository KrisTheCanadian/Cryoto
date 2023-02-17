import {PaletteMode, ThemeOptions} from '@mui/material';

declare module '@mui/material/styles' {
  interface Theme {
    interface: {
      main: string;
      contrastMain: string;
      offBackground: string;
      contrastText: string;
      titleText: string;
      type: string;
      border: string;
      shadow: string;
      icon: string;
    };
    borderRadius: {
      default: number;
      medium: number;
      large: number;
    };
    border: {
      default: string;
    };
    padding: {
      default: string;
    };
    margin: {
      default: number;
      medium: number;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    interface?: {
      main?: string;
      contrastMain?: string;
      offBackground?: string;
      contrastText?: string;
      titleText?: string;
      type?: string;
      border?: string;
      shadow?: string;
      icon?: string;
    };
    borderRadius?: {
      default?: number;
      medium?: number;
      large?: number;
    };
    border?: {
      default?: string;
    };
    padding?: {
      default?: string;
    };
    margin?: {
      default?: number;
    };
  }
}

const getDesignTokens = (mode: PaletteMode) =>
  ({
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
      subtitle2: {
        fontSize: '1.2rem',
      },
      button: {
        textTransform: 'capitalize',
      },
    },
    interface: {
      shadow: '0px 0px 20px 9px rgba(0,0,0,0.08)',
      mode,
      ...(mode === 'light'
        ? {
            main: '#FFFFFF',
            contrastMain: '#F8FAFB',
            offBackground: '#FFFFFF',
            contrastText: '#4e4949de',
            titleText: '#454CE1',
            icon: '#727373',
            type: 'light',
            border: '#F2F2F2',
          }
        : {
            main: '#242424',
            contrastMain: '#3a3a3a',
            offBackground: '#2c2c2c',
            contrastText: '#aaa9b0de',
            titleText: '#BCC0FF',
            icon: '#727373',
            type: 'dark',
            border: '#484848',
          }),
    },
    borderRadius: {
      default: 2,
      medium: 4,
      large: 8,
    },
    border: {
      mode,
      ...(mode === 'light'
        ? {
            default: '3px solid #F2F2F2',
          }
        : {
            default: '3px solid #484848',
          }),
    },
    padding: {
      // padding for content, eg. posts or settings
      default: '16px 24px 16px 24px',
    },
    margin: {
      // margin between content, eg. between posts
      default: 2,
      medium: 4,
    },
    palette: {
      primary: {
        mode,
        ...(mode === 'light'
          ? {
              main: '#454CE1',
            }
          : {
              main: '#767DFD',
            }),
        secondary: '#cc20e9',
      },
      mode,
      ...(mode === 'light'
        ? {
            // palette values for light mode
            background: {
              default: '#F8FAFB',
            },
          }
        : {
            // palette values for dark mode
          }),
    },
  } as ThemeOptions);

export default getDesignTokens;
