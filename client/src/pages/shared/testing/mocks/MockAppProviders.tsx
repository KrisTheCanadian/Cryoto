import {createTheme} from '@mui/material/styles';
import getDesignTokens from 'theme';
import {ReactNode} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {I18nextProvider} from 'react-i18next';
import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';

import i18n from '../../../../i18n/i18n';

const theme = createTheme(getDesignTokens('light'));

function MockAppProviders(props: {children: ReactNode}) {
  const {children} = props;
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <ThemeContextProvider>{children}</ThemeContextProvider>
      </BrowserRouter>
    </I18nextProvider>
  );
}

export {MockAppProviders, theme};
