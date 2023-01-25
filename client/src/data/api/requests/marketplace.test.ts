import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  apiRouteMarketPlaceGetAllItems,
  apiRouteMarketPlaceGetItemById,
  apiRouteMarketPlaceCompletePurchase,
} from '../routes';
import IOrder from '../types/IOrder';

import {getAllItems, getItemById, completePurchase} from './marketplace';

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

it('getAllItems returns success', async () => {
  const data = {response: true};

  const url = `${apiRouteMarketPlaceGetAllItems}`;
  mock.onGet(url).reply(200, data);

  const res = await getAllItems();
  expect(res).toEqual(data);
});

it('getItemById returns success', async () => {
  const data = {response: 'success'};
  const id = '1';
  const url = `${apiRouteMarketPlaceGetItemById}?id=${id}`;

  mock.onGet(url).reply(200, data);

  const res = await getItemById(id);
  expect(res).toEqual(data);
});

it('completePurchase returns success', async () => {
  const data = {response: true};
  const order: IOrder = {
    items: [
      {
        id: 'afd380c1-c643-4c6f-8454-60cb22585582',
        quantity: 1,
      },
    ],
    email: 'test@test.com',
    address: '123 Test St',
  };

  const url = `${apiRouteMarketPlaceCompletePurchase}`;
  mock.onPost(url).reply(200, data);

  const res = await completePurchase(order);
  expect(res).toEqual(data);
});
