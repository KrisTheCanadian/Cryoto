import axios from 'axios';

import {getAccessToken, getGraphAccessToken} from '../helpers';
import {
  apiEndpoint,
  apiRouteUserSearch,
  apiRouteUserProfileGetUserProfile,
  apiRouteUserProfileGetUserProfilePhoto,
  apiRouteUserProfileUpdate,
  apiRouteUserProfileGetUpcomingAnniversaries,
  apiRouteUserProfileGetTopRecognizers,
} from '../routes';
import {ITopRecognizer} from '../types/ITopRecognizer';
import IUser, {
  IUserProfile,
  IUpdateUserProfile,
  IUserWithDate,
} from '../types/IUser';

export async function searchUsers(
  searchTerms: string,
): Promise<IUserWithDate[]> {
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
  const response = await axios.get(apiRouteUserProfileGetUserProfile, {
    headers: {
      Authorization: bearer,
    },
  });
  return response.data;
}

export async function getUserProfilePhoto(oId: string) {
  if (!oId) return null;
  const accessToken = await getAccessToken();
  const graphAccessToken = await getGraphAccessToken();
  const bearer = `Bearer ${accessToken}`;
  const graphBearer = `${graphAccessToken}`;

  // convert fetch to axios for consistency
  const response = await axios.get(apiRouteUserProfileGetUserProfilePhoto, {
    headers: {
      Authorization: bearer,
      MSGraphAccessToken: graphBearer,
      userOId: oId,
    },
  });

  return response.data;
}

export async function getUpcomingAnniversaries() {
  const accessToken = await getAccessToken();

  // convert fetch to axios for consistency
  const response = await axios.get<IUserWithDate[]>(
    apiRouteUserProfileGetUpcomingAnniversaries,
    {
      // add CORS headers to request
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Access-Control-Allow-Origin': `${apiEndpoint}`,
      },
    },
  );
  return response.data;
}

export async function getTopRecognizers() {
  const accessToken = await getAccessToken();

  // convert fetch to axios for consistency
  const response = await axios.get<ITopRecognizer[]>(
    apiRouteUserProfileGetTopRecognizers,
    {
      // add CORS headers to request
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Access-Control-Allow-Origin': `${apiEndpoint}`,
      },
    },
  );
  return response.data;
}

export async function updateUserProfile(
  updateUserProfileData: IUpdateUserProfile,
): Promise<IUserProfile> {
  const accessToken = await getAccessToken();
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  // convert fetch to axios for consistency
  const response = await axios.put<IUserProfile>(
    apiRouteUserProfileUpdate,
    JSON.stringify(updateUserProfileData),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: bearer,
        'Access-Control-Allow-Origin': `${apiEndpoint}`,
      },
    },
  );

  return response.data;
}
