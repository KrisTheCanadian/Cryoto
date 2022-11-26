import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {apiRouteCryptoSelfTransferTokens} from '../routes';

import {selfTransferTokens} from './crypto';

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
  const data = {response: 'success'};
  const amount = 1;

  const url = `${apiRouteCryptoSelfTransferTokens}?amount=${amount}`;
  mock.onPost(url).reply(200, data);

  const res = await selfTransferTokens(amount);
  expect(res).toEqual(data);
});
