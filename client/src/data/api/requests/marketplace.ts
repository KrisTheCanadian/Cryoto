import axios from 'axios';

import {
  apiEndpoint,
  apiRouteMarketPlaceCompletePurchase,
  apiRouteMarketPlaceGetAllItems,
} from '../routes';
import {getAccessToken} from '../helpers';
import IMarketPlaceItem from '../types/IMarketPlaceItem';
import {IOrder} from '../types/ICart';

export async function getAllItems(): Promise<IMarketPlaceItem[]> {
  const accessToken = await getAccessToken();

  const url = `${apiRouteMarketPlaceGetAllItems}`;
  const response = await axios.get<IMarketPlaceItem[]>(url, {
    // add CORS headers to request
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Access-Control-Allow-Origin': `${apiEndpoint}`,
    },
  });
  return response.data;
}

export async function completePurchase(order: IOrder): Promise<IOrder> {
  const accessToken = await getAccessToken();
  const response = await axios.post<IOrder>(
    apiRouteMarketPlaceCompletePurchase,
    order,
    {
      // add CORS headers to request
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Access-Control-Allow-Origin': `${apiEndpoint}`,
      },
    },
  );
  return response.data;
}
