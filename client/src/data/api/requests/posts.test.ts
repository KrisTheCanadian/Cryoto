import {AccountInfo} from '@azure/msal-browser';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {getNextPage} from './posts';

import {
  apiRoutePostsGetUserFeed,
  apiRouteUserProfileGetUserProfile,
} from '@/data/api/routes';

const mock = new MockAdapter(axios);

jest.mock('../helpers', () => {
  return {
    getAccessToken: jest.fn(() => {
      return 'access_token';
    }),
    getUserId: jest.fn(() => {
      return 'homeAccountId';
    }),
  };
});

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

  const url = `${apiRoutePostsGetUserFeed}?userId=${accounts[0].homeAccountId}&page=${page}&pageSize=${pageSize}`;

  mock.onGet(url).reply(200, data);

  const res = await getNextPage(page, pageSize, accounts[0].homeAccountId);

  expect(res).toEqual(data);
});
