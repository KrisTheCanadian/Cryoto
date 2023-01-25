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
  if (accessToken == null) {
    return nullAddress;
  }
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const res = await axios.get<IAddress>(apiRouteAddressGetDefaultAddress, {
    headers: {
      Authorization: bearer,
    },
  });
  return res.data;
}

export async function updateAddress(
  id: number,
  updateAddressData: IUpdateAddress,
): Promise<IAddress> {
  const accessToken = await getAccessToken();
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const res = await axios.put<IAddress>(
    `${apiRouteAddressUpdate}?id=${id}`,
    JSON.stringify(updateAddressData),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: bearer,
        'Access-Control-Allow-Origin': `${apiEndpoint}`,
      },
    },
  );

  return res.data;
}
