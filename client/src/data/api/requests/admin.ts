import axios from 'axios';

import {
  apiEndpoint,
  apiRouteAdminUserProfileGetAllUsersRoles,
  apiRouteAdminUserProfileGetUserByID,
  apiRouteAdminUserProfileUpdateUserRoles,
} from '../routes';
import {getAccessToken, getGraphAccessToken} from '../helpers';
import {IUser} from '../types';

export async function getAllUsersRoles(): Promise<IUser[]> {
  const accessToken = await getAccessToken();
  const graphAccessToken = await getGraphAccessToken();
  const bearer = `Bearer ${accessToken}`;
  const graphBearer = `${graphAccessToken}`;

  const response = await axios.get(apiRouteAdminUserProfileGetAllUsersRoles, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
      MSGraphAccessToken: graphBearer,
      'Access-Control-Allow-Origin': `${apiEndpoint}`,
    },
  });
  return response.data;
}

export async function updateUserRoles(
  roles: string[],
  oId: string,
): Promise<boolean> {
  const accessToken = await getAccessToken();
  const graphAccessToken = await getGraphAccessToken();
  const bearer = `Bearer ${accessToken}`;
  const graphBearer = `${graphAccessToken}`;

  const url = `${apiRouteAdminUserProfileUpdateUserRoles}?oId=${oId}`;
  const response = await axios.put<boolean>(url, JSON.stringify(roles), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearer,
      MSGraphAccessToken: graphBearer,
      'Access-Control-Allow-Origin': `${apiEndpoint}`,
    },
  });

  return response.data;
}

export async function getUserById(userId: string): Promise<IUser> {
  const accessToken = await getAccessToken();
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  // convert fetch to axios for consistency
  const response = await axios.get(
    `${apiRouteAdminUserProfileGetUserByID}?userId=${userId}`,
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
