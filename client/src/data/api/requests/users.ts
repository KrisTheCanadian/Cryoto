import axios from 'axios';

import {getAccessToken, getGraphAccessToken} from '../helpers';
import {
  apiEndpoint,
  apiRouteUserSearch,
  apiRouteUserProfileGetUserProfile,
  apiRouteUserProfileGetUserProfilePhoto,
} from '../routes';
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

export async function getUserProfile() {
  const accessToken = await getAccessToken();
  const bearer = `Bearer ${accessToken}`;

  // convert fetch to axios for consistency
  const res = await axios.get(apiRouteUserProfileGetUserProfile, {
    headers: {
      Authorization: bearer,
    },
  });
  return res.data;
}

export async function getUserProfilePhoto(oId: string) {
  if (!oId) return null;
  const accessToken = await getAccessToken();
  const graphAccessToken = await getGraphAccessToken();
  const bearer = `Bearer ${accessToken}`;
  const graphBearer = `${graphAccessToken}`;

  // convert fetch to axios for consistency
  const res = await axios.get(apiRouteUserProfileGetUserProfilePhoto, {
    headers: {
      Authorization: bearer,
      MSGraphAccessToken: graphBearer,
      userOId: oId,
    },
  });

  return res.data;
}
