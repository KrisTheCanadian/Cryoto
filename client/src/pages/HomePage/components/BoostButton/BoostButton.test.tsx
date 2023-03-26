import {render, fireEvent, screen, waitFor, act} from '@testing-library/react';
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

jest.mock('@/data/api/requests/posts');
jest.mock('src/data/api/helpers/', () => {
  return {
    getAccessToken: jest.fn(() => {
      return 'access_token';
    }),
    getUserId: jest.fn(() => {
      return 'homeAccountId';
    }),
  };
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
  idTokenClaims: {roles: []},
};

describe('BoostButton', () => {
  const queryClient = new QueryClient();
  let pca: IPublicClientApplication;
  let getAllAccountsSpy: jest.SpyInstance;
  const msalConfig: Configuration = {
    auth: {
      clientId: TEST_CONFIG.MSAL_CLIENT_ID,
    },
  };
  beforeEach(() => {
    jest.resetAllMocks();
    pca = new PublicClientApplication(msalConfig);
    getAllAccountsSpy = jest.spyOn(pca, 'getAllAccounts');
    getAllAccountsSpy.mockImplementation(() => [testAccount]);
  });

  it('renders without errors', async () => {
    await act(async () => {
      render(
        <MsalProvider instance={pca}>
          <QueryClientProvider client={queryClient}>
            <ThemeContextProvider>
              <AlertProvider>
                <I18nextProvider i18n={i18n}>
                  <BoostButton
                    postId="post-id-123"
                    userId="user-id-123"
                    interactionEnabled
                    boosts={[]}
                    onBoost={() => {}}
                    onFail={() => {}}
                  />
                </I18nextProvider>
              </AlertProvider>
            </ThemeContextProvider>
          </QueryClientProvider>
        </MsalProvider>,
      );
    });

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onBoost when the user clicks the boost button', async () => {
    const onBoostMock = jest.fn();
    await act(async () => {
      render(
        <MsalProvider instance={pca}>
          <QueryClientProvider client={queryClient}>
            <ThemeContextProvider>
              <AlertProvider>
                <I18nextProvider i18n={i18n}>
                  <BoostButton
                    postId="post-id-123"
                    userId="user-id-123"
                    interactionEnabled
                    boosts={[]}
                    onBoost={onBoostMock}
                    onFail={() => {}}
                  />
                </I18nextProvider>
              </AlertProvider>
            </ThemeContextProvider>
          </QueryClientProvider>
        </MsalProvider>,
      );
    });

    const button = screen.getByRole('button');

    fireEvent.click(button);

    await waitFor(() => {
      expect(onBoostMock).toHaveBeenCalledTimes(1);
    });
  });

  it('disables the boost button if interaction is not enabled', async () => {
    await act(async () => {
      render(
        <MsalProvider instance={pca}>
          <QueryClientProvider client={queryClient}>
            <ThemeContextProvider>
              <AlertProvider>
                <I18nextProvider i18n={i18n}>
                  <BoostButton
                    postId="post-id-123"
                    userId="user-id-123"
                    interactionEnabled={false}
                    boosts={[]}
                    onBoost={() => {}}
                    onFail={() => {}}
                  />
                </I18nextProvider>
              </AlertProvider>
            </ThemeContextProvider>
          </QueryClientProvider>
        </MsalProvider>,
      );
    });

    expect(screen.queryByRole('button')).toBeNull();
  });
});
