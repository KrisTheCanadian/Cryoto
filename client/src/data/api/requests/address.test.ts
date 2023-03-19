import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  apiRouteAddressAdd,
  apiRouteAddressGetDefaultAddress,
  apiRouteAddressGetDefaultAddressOrCreate,
  apiRouteAddressUpdate,
} from '../routes';
import {IAddAddress, IUpdateAddress} from '../types/IAddress';

import {
  addAddress,
  getDefaultAddress,
  getDefaultAddressOrCreate,
  updateAddress,
} from './address';

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

it('getDefaultAddress returns success', async () => {
  const data = {response: true};

  const url = `${apiRouteAddressGetDefaultAddress}`;
  mock.onGet(url).reply(200, data);

  const res = await getDefaultAddress();
  expect(res).toEqual(data);
});

it('getDefaultAddressOrCreate returns success', async () => {
  const data = {response: true};

  const url = `${apiRouteAddressGetDefaultAddressOrCreate}`;
  mock.onGet(url).reply(200, data);

  const res = await getDefaultAddressOrCreate();
  expect(res).toEqual(data);
});

it('addAddress returns success', async () => {
  const data = {response: true};
  const mockAddressData: IAddAddress = {
    id: '0',
    streetNumber: '123',
    street: 'Main St',
    city: 'Anytown',
    province: 'Any Province',
    country: 'Canada',
    postalCode: 'A1B 2C3',
  };

  const url = `${apiRouteAddressAdd}`;
  mock.onPost(url).reply(200, data);

  const res = await addAddress(mockAddressData);
  expect(res).toEqual(data);
});

it('updateAddress returns success', async () => {
  const data = {response: true};
  const updateData: IUpdateAddress = {
    streetNumber: '456',
    street: 'New St',
    city: 'Newtown',
    province: 'New Province',
    postalCode: 'X1Y 2Z3',
  };

  const url = `${apiRouteAddressUpdate}?id=${1}`;
  mock.onPut(url).reply(200, data);

  const res = await updateAddress(1 as number, updateData);
  expect(res).toEqual(data);
});
