import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  apiRouteCryptoGetTokenBalance,
  apiRouteCryptoSelfTransferTokens,
} from '../routes';

import {getTokenBalance, selfTransferTokens} from './wallet';

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

it('selfTransferTokens returns success', async () => {
  const data = {response: true};
  const amount = 1;

  const url = `${apiRouteCryptoSelfTransferTokens}?amount=${amount}`;
  mock.onPost(url).reply(200, data);

  const res = await selfTransferTokens(amount);
  expect(res).toEqual(data);
});

it('getTokenBalance returns success', async () => {
  const data = {response: 'success'};
  mock.onGet(apiRouteCryptoGetTokenBalance).reply(200, data);

  const res = await getTokenBalance();
  expect(res).toEqual(data);
});
