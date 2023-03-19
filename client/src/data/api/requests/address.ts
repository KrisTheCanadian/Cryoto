import axios from 'axios';

import {
  apiEndpoint,
  apiRouteAddressAdd,
  apiRouteAddressGetDefaultAddress,
  apiRouteAddressGetDefaultAddressOrCreate,
  apiRouteAddressUpdate,
} from '../routes';
import IAddress, {IAddAddress, IUpdateAddress} from '../types/IAddress';

import {getAccessToken} from '@/data/api/helpers';

export async function getDefaultAddress(): Promise<IAddress> {
  const accessToken = await getAccessToken();

  const response = await axios.get<IAddress>(apiRouteAddressGetDefaultAddress, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
}

export async function getDefaultAddressOrCreate(): Promise<IAddress> {
  const accessToken = await getAccessToken();

  const response = await axios.get<IAddress>(
    apiRouteAddressGetDefaultAddressOrCreate,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

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

export async function addAddress(
  addressData: IAddAddress,
): Promise<IAddAddress> {
  const accessToken = await getAccessToken();
  const response = await axios.post<IAddAddress>(
    apiRouteAddressAdd,
    addressData,
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
