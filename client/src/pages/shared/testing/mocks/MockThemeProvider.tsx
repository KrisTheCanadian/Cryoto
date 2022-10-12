import {createTheme, ThemeProvider} from '@mui/material/styles';
import getDesignTokens from 'theme';
import {ReactNode} from 'react';

const theme = createTheme(getDesignTokens('light'));

function MockThemePropvider(props: {children: ReactNode}) {
  const {children} = props;
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export {MockThemePropvider, theme};
