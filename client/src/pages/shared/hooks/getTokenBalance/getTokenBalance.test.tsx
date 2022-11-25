import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import getTokenBalance from './getTokenBalance';

import {apiRouteCryptoGetTokenBalance} from '@/data/api/routes';

const TokenValue = Math.floor(1000000 * Math.random());
const mock = new MockAdapter(axios);

it('Get wallet balance functionality', async () => {
  const data = {response: TokenValue};
  mock.onGet(apiRouteCryptoGetTokenBalance).reply(200, data);

  const value = await getTokenBalance('toSpend', '');

  expect(value).toEqual(data);
});
