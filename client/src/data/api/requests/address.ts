import axios from 'axios';

import {
  apiEndpoint,
  apiRouteAddressGetDefaultAddress,
  apiRouteAddressUpdate,
} from '../routes';
import IAddress, {IUpdateAddress} from '../types/IAddress';

import {getAccessToken} from '@/data/api/helpers';

export async function getDefaultAddress(): Promise<IAddress> {
  const nullAddress: IAddress = {
    city: '',
    country: '',
    id: -1,
    postalCode: '',
    province: '',
    street: '',
    streetNumber: '',
  };
  const accessToken = await getAccessToken();

  const response = await axios.get<IAddress>(apiRouteAddressGetDefaultAddress, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
}

export async function updateAddress(
  id: number,
  updateAddressData: IUpdateAddress,
): Promise<IAddress> {
  const accessToken = await getAccessToken();

  const url = `${apiRouteAddressUpdate}?id=${id}`;
  const response = await axios.put<IAddress>(
    url,
    JSON.stringify(updateAddressData),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Access-Control-Allow-Origin': `${apiEndpoint}`,
      },
    },
  );

  return response.data;
}
