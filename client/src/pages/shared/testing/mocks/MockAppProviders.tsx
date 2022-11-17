import {createTheme} from '@mui/material/styles';
import {ReactNode} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {I18nextProvider} from 'react-i18next';
import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';
import {AlertProvider} from '@shared/hooks/Alerts/AlertContext';

import i18n from '@/i18n/i18n';
import getDesignTokens from '@/theme';

const theme = createTheme(getDesignTokens('light'));

function MockAppProviders(props: {children: ReactNode}) {
  const {children} = props;
  return (
    <I18nextProvider i18n={i18n}>
      <AlertProvider>
        <BrowserRouter>
          <ThemeContextProvider>{children}</ThemeContextProvider>
        </BrowserRouter>
      </AlertProvider>
    </I18nextProvider>
  );
}

export {MockAppProviders, theme};
