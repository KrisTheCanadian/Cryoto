import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  apiRouteMarketPlaceGetAllItems,
  apiRouteMarketPlaceCompletePurchase,
} from '../routes';
import {IOrder} from '../types/ICart';

import {getAllItems, completePurchase} from './marketplace';

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

it('completePurchase returns success', async () => {
  const data = {response: true};
  const order: IOrder = {
    id: '1',
    items: [
      {
        id: 'afd380c1',
        quantity: 1,
      },
    ],
    email: 'test@test.com',
    shippingAddress: {
      id: 1,
      streetNumber: '20',
      street: 'Test Street',
      city: 'Test City',
      province: 'Test Province',
      country: 'Test Country',
      postalCode: 'Test Postal Code',
    },
    date: new Date(),
  };

  const url = `${apiRouteMarketPlaceCompletePurchase}`;
  mock.onPost(url).reply(200, data);

  const res = await completePurchase(order);
  expect(res).toEqual(data);
});
