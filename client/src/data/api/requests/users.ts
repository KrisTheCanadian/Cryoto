import axios from 'axios';

import {getAccessToken} from '../helpers';
import {apiEndpoint, apiRouteUserSearch} from '../routes';
import IUser from '../types/IUser';

export async function searchUsers(searchTerms: string): Promise<IUser[]> {
  // get access token
  const accessToken = await getAccessToken();

  // decode access token to grab user id
  // in the future, this should be available in the auth context or data store
  const url = `${apiRouteUserSearch}?keywords=${searchTerms}`;
  const response = await axios.get<IUser[]>(url, {
    // add CORS headers to request
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Access-Control-Allow-Origin': `${apiEndpoint}`,
    },
  });
  return response.data;
}
