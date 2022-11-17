import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {MemoryRouter} from 'react-router-dom';
import {I18nextProvider} from 'react-i18next';
import AlertSystem from '@shared/hooks/Alerts/AlertSystem';
import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';
import {
  AccountInfo,
  Configuration,
  IPublicClientApplication,
  PublicClientApplication,
} from '@azure/msal-browser';
import {MsalProvider} from '@azure/msal-react';

import i18n from './i18n/i18n';
import App from './App';
import {StyleGuide} from '@/pages/StyleGuide';

const TEST_CONFIG = {
  MSAL_CLIENT_ID: '0813e1d1-ad72-46a9-8665-399bba48c201',
};

const TEST_DATA_CLIENT_INFO = {
  TEST_UID: '123-test-uid',
  TEST_UID_ENCODED: 'MTIzLXRlc3QtdWlk',
  TEST_UTID: '456-test-utid',
  TEST_UTID_ENCODED: 'NDU2LXRlc3QtdXRpZA==',
  TEST_UTID_URLENCODED: 'NDU2LXRlc3QtdXRpZA',
  TEST_DECODED_CLIENT_INFO: '{"uid":"123-test-uid","utid":"456-test-utid"}',
  TEST_INVALID_JSON_CLIENT_INFO: '{"uid":"123-test-uid""utid":"456-test-utid"}',
  TEST_RAW_CLIENT_INFO:
    'eyJ1aWQiOiIxMjMtdGVzdC11aWQiLCJ1dGlkIjoiNDU2LXRlc3QtdXRpZCJ9',
  TEST_CLIENT_INFO_B64ENCODED: 'eyJ1aWQiOiIxMjM0NSIsInV0aWQiOiI2Nzg5MCJ9',
  TEST_HOME_ACCOUNT_ID: 'MTIzLXRlc3QtdWlk.NDU2LXRlc3QtdXRpZA==',
};

const testAccount: AccountInfo = {
  homeAccountId: TEST_DATA_CLIENT_INFO.TEST_HOME_ACCOUNT_ID,
  localAccountId: TEST_DATA_CLIENT_INFO.TEST_UID_ENCODED,
  environment: 'login.windows.net',
  tenantId: TEST_DATA_CLIENT_INFO.TEST_UTID,
  username: 'example@microsoft.com',
  name: 'Abe Lincoln',
  idTokenClaims: {roles: []},
};

describe('Authentication and Permission tests', () => {
  let pca: IPublicClientApplication;
  let getAllAccountsSpy: jest.SpyInstance;
  const msalConfig: Configuration = {
    auth: {
      clientId: TEST_CONFIG.MSAL_CLIENT_ID,
    },
  };

  beforeEach(() => {
    pca = new PublicClientApplication(msalConfig);
    getAllAccountsSpy = jest.spyOn(pca, 'getAllAccounts');
    getAllAccountsSpy.mockImplementation(() => [testAccount]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const PermissionError = 'You do not have permission to access this page.';

const SignIn = 'Sign In';

  it('should load Main Page at /', async () => {
    const intersectionObserverMock = () => ({
      observe: () => null,
    });
    window.IntersectionObserver = jest
      .fn()
      .mockImplementation(intersectionObserverMock);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <I18nextProvider i18n={i18n}>
            <AlertSystem />
            <App />
          </I18nextProvider>
        </MemoryRouter>,
      );
    });
    expect(screen.queryByText(SignIn)).toBeInTheDocument();
  });

  it('should load wallet at /wallet', async () => {
    await act(async () => {
      render(
        <MsalProvider instance={pca}>
          <MemoryRouter initialEntries={['/wallet']}>
            <I18nextProvider i18n={i18n}>
              <App />
            </I18nextProvider>
          </MemoryRouter>
        </MsalProvider>,
      );
    });

    const homeLink = screen.getByText('Wallet').closest('a');

    expect(homeLink).toHaveClass('Mui-selected');
  });

  it('dark mode toggle should work', async () => {
    await act(async () => {
      render(
        <MsalProvider instance={pca}>
          <MemoryRouter initialEntries={['/wallet']}>
            <I18nextProvider i18n={i18n}>
              <App />
            </I18nextProvider>
          </MemoryRouter>
        </MsalProvider>,
      );
    });
    const darkModeSwitch = screen.getByTestId('dark-mode-toggle');
    const body = document.getElementsByTagName('body')[0];

    act(() => {
      darkModeSwitch.click();
    });

    expect(body).toHaveStyle('background-color: rgb(18, 18, 18)');
  });
});
