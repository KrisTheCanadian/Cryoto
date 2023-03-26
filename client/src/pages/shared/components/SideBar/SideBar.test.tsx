import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {I18nextProvider} from 'react-i18next';
import {MsalProvider} from '@azure/msal-react';
import {
  AccountInfo,
  Configuration,
  IPublicClientApplication,
  PublicClientApplication,
} from '@azure/msal-browser';
import {MockAppProviders} from '@shared/testing/mocks';
import {QueryClient, QueryClientProvider} from 'react-query';

import SideBar from './SideBar';

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

const MY_BALANCE = 'My Balance';
const TO_SPEND_LABEL = 'To Spend';
const TO_AWARD_LABEL = 'To Award';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
    },
  },
});

describe("Sidebar's Mini Wallet tests", () => {
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

  it('Mini wallet should be rendered when user is logged in', async () => {
    await act(async () => {
      render(
        <MsalProvider instance={pca}>
          <QueryClientProvider client={queryClient}>
            <MockAppProviders>
              <I18nextProvider i18n={i18n}>
                <SideBar />
              </I18nextProvider>
            </MockAppProviders>
          </QueryClientProvider>
        </MsalProvider>,
      );
    });

    expect(screen.getByText(MY_BALANCE)).toBeInTheDocument();
    expect(screen.getByText(TO_SPEND_LABEL)).toBeInTheDocument();
    expect(screen.getByText(TO_AWARD_LABEL)).toBeInTheDocument();
  });

  it('Home should be selected when on "\\"', async () => {
    await act(async () => {
      render(
        <MsalProvider instance={pca}>
          <QueryClientProvider client={queryClient}>
            <MockAppProviders>
              <I18nextProvider i18n={i18n}>
                <SideBar />
              </I18nextProvider>
            </MockAppProviders>
          </QueryClientProvider>
        </MsalProvider>,
      );
    });

    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).toHaveClass('Mui-selected');
  });
});
