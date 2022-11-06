/* eslint-disable @shopify/strict-component-boundaries */
/* eslint-disable @typescript-eslint/naming-convention */
import {AccountInfo, IPublicClientApplication} from '@azure/msal-browser';
import axios from 'axios';

import {loginRequest} from '../../../pages/Authentication/authConfig';
import {apiEndpoint, apiRouteUserSearch} from '../routes';
import IUser from '../types/IUser';

export async function searchUsers(
  searchTerms: string,
  accounts: AccountInfo[],
  instance: IPublicClientApplication,
): Promise<IUser[]> {
  // get access token
  const res = await instance.acquireTokenSilent({
    account: accounts[0],
    scopes: loginRequest.scopes,
  });

  // decode access token to grab user id
  // in the future, this should be available in the auth context or data store
  const url = `${apiRouteUserSearch}?keywords=${searchTerms}`;
  const response = await axios.get<IUser[]>(url, {
    // add CORS headers to request
    headers: {
      Authorization: `Bearer ${res.accessToken}`,
      'Access-Control-Allow-Origin': `${apiEndpoint}`,
    },
  });
  return response.data;
}
