import {act, render, screen} from '@testing-library/react';
import {
  PublicClientApplication,
  IPublicClientApplication,
  Configuration,
  AccountInfo,
} from '@azure/msal-browser';
import {MsalProvider} from '@azure/msal-react';
import {MemoryRouter} from 'react-router-dom';
import App from 'src/App';
import {I18nextProvider} from 'react-i18next';

import i18n from '@/i18n/i18n';

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
  const PermissionError = 'You do not have permission to access this page.';
  const SignIn = 'Sign In';

  beforeEach(() => {
    pca = new PublicClientApplication(msalConfig);
    getAllAccountsSpy = jest.spyOn(pca, 'getAllAccounts');
    getAllAccountsSpy.mockImplementation(() => [testAccount]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should ensure the home page is protected', async () => {
    const intersectionObserverMock = () => ({
      observe: () => null,
    });
    window.IntersectionObserver = jest
      .fn()
      .mockImplementation(intersectionObserverMock);
    render(
      <MemoryRouter initialEntries={['/']}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </MemoryRouter>,
    );

    expect(screen.queryByText(SignIn)).toBeInTheDocument();
  });

  it('should ensure the wallet page is protected', async () => {
    render(
      <MemoryRouter initialEntries={['/wallet']}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </MemoryRouter>,
    );

    expect(screen.queryByText(SignIn)).toBeInTheDocument();
  });

  it('should ensure the marketplace page is protected', async () => {
    render(
      <MemoryRouter initialEntries={['/market']}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </MemoryRouter>,
    );

    expect(screen.queryByText(SignIn)).toBeInTheDocument();
  });

  it('should ensure the profile page is protected', async () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </MemoryRouter>,
    );

    expect(screen.queryByText(SignIn)).toBeInTheDocument();
  });

  it('should ensure the orders page is protected', async () => {
    render(
      <MemoryRouter initialEntries={['/orders']}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </MemoryRouter>,
    );

    expect(screen.queryByText(SignIn)).toBeInTheDocument();
  });

  it('should ensure the settings page is protected', async () => {
    render(
      <MemoryRouter initialEntries={['/settings']}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </MemoryRouter>,
    );

    expect(screen.queryByText(SignIn)).toBeInTheDocument();
  });

  it('should display the wallet route if a signed in regular user tries to access it', async () => {
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

    expect(screen.queryByText(SignIn)).not.toBeInTheDocument();
    expect(screen.queryByText(PermissionError)).not.toBeInTheDocument();
  });
});
