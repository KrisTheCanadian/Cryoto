import {render, screen, act} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from 'react-query';
import {AlertProvider} from '@shared/hooks/Alerts';
import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';
import {
  AccountInfo,
  Configuration,
  IPublicClientApplication,
  PublicClientApplication,
} from '@azure/msal-browser';
import {MsalProvider} from '@azure/msal-react';
import {I18nextProvider} from 'react-i18next';

import BoostButton from './BoostButton';

import i18n from '@/i18n/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
    },
  },
});

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

  idTokenClaims: {
    roles: [],
  },
};
const testAccountPartner: AccountInfo = {
  homeAccountId: TEST_DATA_CLIENT_INFO.TEST_HOME_ACCOUNT_ID,
  localAccountId: TEST_DATA_CLIENT_INFO.TEST_UID_ENCODED,
  environment: 'login.windows.net',
  tenantId: TEST_DATA_CLIENT_INFO.TEST_UTID,
  username: 'example@microsoft.com',
  name: 'Abe Lincoln',

  idTokenClaims: {
    roles: ['Partner'],
  },
};

afterEach(() => {
  jest.clearAllMocks();
});

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

describe('BoostButton', () => {
  test('renders the Boost button when the user is of type Partner and can boost', async () => {
    getAllAccountsSpy.mockImplementation(() => [testAccountPartner]);

    await act(async () => {
      render(
        <MsalProvider instance={pca}>
          <QueryClientProvider client={queryClient}>
            <ThemeContextProvider>
              <AlertProvider>
                <I18nextProvider i18n={i18n}>
                  <BoostButton
                    handleBoost={jest.fn()}
                    postId="1"
                    userId="2"
                    boosts={[]}
                    boostProfiles={[]}
                    recipients={[]}
                  />
                </I18nextProvider>
              </AlertProvider>
            </ThemeContextProvider>
          </QueryClientProvider>
        </MsalProvider>,
      );
    });
    const boostButton = screen.getByText('Boost ⭐');
    expect(boostButton).toBeInTheDocument();
  });

  test('Partner cannot boost after already boosting', async () => {
    getAllAccountsSpy.mockImplementation(() => [testAccountPartner]);

    await act(async () => {
      render(
        <MsalProvider instance={pca}>
          <QueryClientProvider client={queryClient}>
            <ThemeContextProvider>
              <AlertProvider>
                <I18nextProvider i18n={i18n}>
                  <BoostButton
                    handleBoost={jest.fn()}
                    postId="1"
                    userId="partnerId"
                    boosts={['partnerId']}
                    boostProfiles={[{oId: 'partnerId', name: 'partnerName'}]}
                    recipients={[]}
                  />
                </I18nextProvider>
              </AlertProvider>
            </ThemeContextProvider>
          </QueryClientProvider>
        </MsalProvider>,
      );
    });
    const boostButton = screen.getByTestId('boost-button');
    expect(boostButton).toBeDisabled();
  });

  test('Partner cannot boost his/her own post', async () => {
    getAllAccountsSpy.mockImplementation(() => [testAccountPartner]);

    await act(async () => {
      render(
        <MsalProvider instance={pca}>
          <QueryClientProvider client={queryClient}>
            <ThemeContextProvider>
              <AlertProvider>
                <I18nextProvider i18n={i18n}>
                  <BoostButton
                    handleBoost={jest.fn()}
                    postId="1"
                    userId="partnerId"
                    boosts={['boostedId', 'skjf']}
                    boostProfiles={[
                      {oId: 'boostedId', name: 'partnerName'},
                      {oId: 'skjf', name: 'partnerName'},
                    ]}
                    recipients={['partnerId']}
                  />
                </I18nextProvider>
              </AlertProvider>
            </ThemeContextProvider>
          </QueryClientProvider>
        </MsalProvider>,
      );
    });
    const boostButton = screen.getByTestId('boost-button');
    expect(boostButton).toBeDisabled();
  });
  test('Partner can boost his/her own post if there are other recipients in post', async () => {
    getAllAccountsSpy.mockImplementation(() => [testAccountPartner]);

    await act(async () => {
      render(
        <MsalProvider instance={pca}>
          <QueryClientProvider client={queryClient}>
            <ThemeContextProvider>
              <AlertProvider>
                <I18nextProvider i18n={i18n}>
                  <BoostButton
                    handleBoost={jest.fn()}
                    postId="1"
                    userId="partnerUser"
                    boosts={['boostedId', 'skjf']}
                    boostProfiles={[
                      {oId: 'boostedId', name: 'partnerName'},
                      {oId: 'skjf', name: 'partnerName'},
                    ]}
                    recipients={['partnerUser', 'otherusers']}
                  />
                </I18nextProvider>
              </AlertProvider>
            </ThemeContextProvider>
          </QueryClientProvider>
        </MsalProvider>,
      );
    });
    const boostButton = screen.getByTestId('boost-button');
    expect(boostButton).toBeEnabled();
  });

  test('renders the Boosted button when the user is not a partner', async () => {
    await act(async () => {
      render(
        <MsalProvider instance={pca}>
          <QueryClientProvider client={queryClient}>
            <ThemeContextProvider>
              <AlertProvider>
                <I18nextProvider i18n={i18n}>
                  <BoostButton
                    handleBoost={jest.fn()}
                    postId="1"
                    userId="2"
                    boosts={['boostedId', 'skjf']}
                    boostProfiles={[
                      {oId: 'boostedId', name: 'partnerName'},
                      {oId: 'skjf', name: 'partnerName'},
                    ]}
                    recipients={[]}
                  />
                </I18nextProvider>
              </AlertProvider>
            </ThemeContextProvider>
          </QueryClientProvider>
        </MsalProvider>,
      );
    });
    const boostButton = screen.getByText('Boosted ⭐');
    expect(boostButton).toBeInTheDocument();
  });

  test('does not render button when the user is not a partner and there are no boosts ', async () => {
    await act(async () => {
      render(
        <MsalProvider instance={pca}>
          <QueryClientProvider client={queryClient}>
            <ThemeContextProvider>
              <AlertProvider>
                <I18nextProvider i18n={i18n}>
                  <BoostButton
                    handleBoost={jest.fn()}
                    postId="1"
                    userId="2"
                    boosts={[]}
                    boostProfiles={[]}
                    recipients={[]}
                  />
                </I18nextProvider>
              </AlertProvider>
            </ThemeContextProvider>
          </QueryClientProvider>
        </MsalProvider>,
      );
    });
    const boostButton = screen.queryByTestId('boost-button');
    expect(boostButton).not.toBeInTheDocument();
  });
});
