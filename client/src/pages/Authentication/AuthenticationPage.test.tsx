import {
  AccountInfo,
  Configuration,
  IPublicClientApplication,
  PublicClientApplication,
} from '@azure/msal-browser';
import {MsalProvider} from '@azure/msal-react';
import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';
import {act, render, screen} from '@testing-library/react';
import i18n from 'i18n/i18n';
import {I18nextProvider} from 'react-i18next';
import {MemoryRouter} from 'react-router-dom';

import Authentication from './AuthenticationPage';

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

it('rendering authentication page should render a sign in button', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ThemeContextProvider>
          <I18nextProvider i18n={i18n}>
            <Authentication />
          </I18nextProvider>
        </ThemeContextProvider>
      </MemoryRouter>,
    );
  });

  expect(screen.getByText('Sign In')).toBeInTheDocument();
});

it('rendering authentication page while authenticated should render the sign out button', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <MsalProvider instance={pca}>
          <ThemeContextProvider>
            <I18nextProvider i18n={i18n}>
              <Authentication />
            </I18nextProvider>
          </ThemeContextProvider>
        </MsalProvider>
      </MemoryRouter>,
    );
  });

  expect(screen.getByText('Sign out')).toBeInTheDocument();
});
