/* eslint-disable @shopify/strict-component-boundaries */
/* eslint-disable @typescript-eslint/naming-convention */
import {AccountInfo, IPublicClientApplication} from '@azure/msal-browser';
import axios from 'axios';

import {loginRequest} from '../../../pages/Authentication/authConfig';
import {apiEndpoint, apiRoutePostsGetUserFeed} from '../routes';
import IPage from '../types/IPage';
import IPost from '../types/IPost';

export async function getNextPage(
  page: number,
  pageSize: number,
  accounts: AccountInfo[],
  instance: IPublicClientApplication,
): Promise<IPage<IPost[]>> {
  const userId = accounts[0].homeAccountId;

  // get access token
  const res = await instance.acquireTokenSilent({
    account: accounts[0],
    scopes: loginRequest.scopes,
  });

  // decode access token to grab user id
  // in the future, this should be available in the auth context or data store
  const url = `${apiRoutePostsGetUserFeed}?userId=${userId}&page=${page}&pageSize=${pageSize}`;
  const response = await axios.get<IPage<IPost[]>>(url, {
    // add CORS headers to request
    headers: {
      Authorization: `Bearer ${res.accessToken}`,
      'Access-Control-Allow-Origin': `${apiEndpoint}`,
    },
  });
  return response.data;
}
