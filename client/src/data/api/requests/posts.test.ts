/* eslint-disable import/no-extraneous-dependencies */
import {
  AccountInfo,
  AuthenticationResult,
  AuthorizationCodeRequest,
  BrowserConfiguration,
  EndSessionPopupRequest,
  EndSessionRequest,
  INavigationClient,
  IPublicClientApplication,
  Logger,
  PerformanceCallbackFunction,
  PopupRequest,
  RedirectRequest,
  WrapperSKU,
} from '@azure/msal-browser';
import {ITokenCache} from '@azure/msal-browser/dist/cache/ITokenCache';
import {CommonAuthorizationUrlRequest} from '@azure/msal-common';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  apiRoutePostsGetUserFeed,
  apiRouteUserProfileGetUserProfile,
} from 'data/api/routes';

import {getNextPage} from './posts';

const mock = new MockAdapter(axios);

it('GetNextPage returns success', async () => {
  const data = {response: true};
  mock.onGet(apiRouteUserProfileGetUserProfile).reply(200, data);

  const page = 1;
  const pageSize = 10;
  const accounts: AccountInfo[] = [
    {
      environment: 'environment',
      homeAccountId: 'homeAccountId',
      localAccountId: 'localAccountId',
      tenantId: 'tenantId',
      username: 'username',
    },
  ];

  // please don't ask me why this is necessary, I don't know, it just works
  const instance: IPublicClientApplication = {
    acquireTokenSilent: jest.fn().mockReturnValue({accessToken: 'accessToken'}),
    acquireTokenPopup: jest.fn(),
    acquireTokenRedirect: jest.fn(),
    addEventCallback: jest.fn(),
    initialize(): Promise<void> {
      throw new Error('Function not implemented.');
    },
    acquireTokenByCode(
      request: AuthorizationCodeRequest,
    ): Promise<AuthenticationResult> {
      throw new Error('Function not implemented.');
    },
    removeEventCallback(callbackId: string): void {
      throw new Error('Function not implemented.');
    },
    addPerformanceCallback(callback: PerformanceCallbackFunction): string {
      throw new Error('Function not implemented.');
    },
    removePerformanceCallback(callbackId: string): boolean {
      throw new Error('Function not implemented.');
    },
    enableAccountStorageEvents(): void {
      throw new Error('Function not implemented.');
    },
    disableAccountStorageEvents(): void {
      throw new Error('Function not implemented.');
    },
    getAccountByHomeId(homeAccountId: string): AccountInfo | null {
      throw new Error('Function not implemented.');
    },
    getAccountByLocalId(localId: string): AccountInfo | null {
      throw new Error('Function not implemented.');
    },
    getAccountByUsername(userName: string): AccountInfo | null {
      throw new Error('Function not implemented.');
    },
    getAllAccounts(): AccountInfo[] {
      throw new Error('Function not implemented.');
    },
    handleRedirectPromise(
      hash?: string | undefined,
    ): Promise<AuthenticationResult | null> {
      throw new Error('Function not implemented.');
    },
    loginPopup(
      request?: PopupRequest | undefined,
    ): Promise<AuthenticationResult> {
      throw new Error('Function not implemented.');
    },
    loginRedirect(request?: RedirectRequest | undefined): Promise<void> {
      throw new Error('Function not implemented.');
    },
    logout(logoutRequest?: EndSessionRequest | undefined): Promise<void> {
      throw new Error('Function not implemented.');
    },
    logoutRedirect(
      logoutRequest?: EndSessionRequest | undefined,
    ): Promise<void> {
      throw new Error('Function not implemented.');
    },
    logoutPopup(
      logoutRequest?: EndSessionPopupRequest | undefined,
    ): Promise<void> {
      throw new Error('Function not implemented.');
    },
    ssoSilent(
      request: Partial<
        Omit<
          CommonAuthorizationUrlRequest,
          | 'requestedClaimsHash'
          | 'responseMode'
          | 'codeChallenge'
          | 'codeChallengeMethod'
          | 'nativeBroker'
        >
      >,
    ): Promise<AuthenticationResult> {
      throw new Error('Function not implemented.');
    },
    getTokenCache(): ITokenCache {
      throw new Error('Function not implemented.');
    },
    getLogger(): Logger {
      throw new Error('Function not implemented.');
    },
    setLogger(logger: Logger): void {
      throw new Error('Function not implemented.');
    },
    setActiveAccount(account: AccountInfo | null): void {
      throw new Error('Function not implemented.');
    },
    getActiveAccount(): AccountInfo | null {
      throw new Error('Function not implemented.');
    },
    initializeWrapperLibrary(sku: WrapperSKU, version: string): void {
      throw new Error('Function not implemented.');
    },
    setNavigationClient(navigationClient: INavigationClient): void {
      throw new Error('Function not implemented.');
    },
    getConfiguration(): BrowserConfiguration {
      throw new Error('Function not implemented.');
    },
  };

  const url = `${apiRoutePostsGetUserFeed}?userId=${accounts[0].homeAccountId}&page=${page}&pageSize=${pageSize}`;

  mock.onGet(url).reply(200, data);

  const res = await getNextPage(page, pageSize, accounts, instance);

  expect(res).toEqual(data);
});
