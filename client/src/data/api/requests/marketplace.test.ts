import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  apiRouteMarketPlaceCompletePurchase,
  apiRouteMarketPlaceGetAllItems,
} from '../routes';
import {IOrder} from '../types/ICart';

import {completePurchase, getAllItems} from './marketplace';

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

  const resp = await getAllItems();
  expect(resp).toEqual(data);
});

it('getAllItems returns error', async () => {
  const data = {response: false};

  const url = `${apiRouteMarketPlaceGetAllItems}`;
  mock.onGet(url).reply(400, data);

  getAllItems().catch((err) => {
    expect(err.response.data).toEqual(data);
  });
});

it('completePurchase returns success', async () => {
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
  mock.onPost(url).reply(200, order);

  const result = await completePurchase(order);

  const data = {
    id: order.id,
    items: order.items,
    email: order.email,
    shippingAddress: order.shippingAddress,
    date: new Date(order.date).toISOString(),
  };

  expect(result).toEqual(data);
});

it('completePurchase returns error', async () => {
  const data = {response: false};
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
  mock.onPost(url).reply(400, data);

  completePurchase(order).catch((err) => {
    expect(err.response.data).toEqual(data);
  });
});
