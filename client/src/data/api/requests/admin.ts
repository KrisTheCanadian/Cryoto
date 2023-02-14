import axios from 'axios';

import {
  apiEndpoint,
  apiRouteAdminUserProfileGetAllUsers,
  apiRouteAdminUserProfileGetUserByID,
  apiRouteAdminUserProfileUpdateUserRoles,
} from '../routes';
import {getAccessToken} from '../helpers';
import {IUser} from '../types';

export async function getAllUsers(): Promise<IUser[]> {
  const accessToken = await getAccessToken();

  const response = await axios.get(apiRouteAdminUserProfileGetAllUsers, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
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

  const url = `${apiRouteAdminUserProfileUpdateUserRoles}?oId=${oId}`;
  const response = await axios.put<boolean>(url, JSON.stringify(roles), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
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
