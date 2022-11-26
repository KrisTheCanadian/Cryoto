import {AccountInfo} from '@azure/msal-browser';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  apiRouteTransactionsGetTransactionsByReceiverOId,
  apiRouteTransactionsGetTransactionsBySenderOId,
} from '../routes';

import getTransactions from './transactions';

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

it('GetTransactions returns success', async () => {
  const data: any = [];
  const accounts: AccountInfo[] = [
    {
      environment: 'environment',
      homeAccountId: 'homeAccountId',
      localAccountId: 'localAccountId',
      tenantId: 'tenantId',
      username: 'username',
    },
  ];

  const sender_url = `${apiRouteTransactionsGetTransactionsBySenderOId}?senderOId=${accounts[0].homeAccountId}`;
  const receiver_url = `${apiRouteTransactionsGetTransactionsByReceiverOId}?receiverOId=${accounts[0].homeAccountId}`;

  mock.onGet(sender_url).reply(200, data);
  mock.onGet(receiver_url).reply(200, data);

  const res = await getTransactions();
  expect(res).toEqual(data);
});
