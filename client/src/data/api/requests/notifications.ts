import axios from 'axios';

import {getAccessToken} from '../helpers';
import {
  apiEndpoint,
  apiRouteNotificationsGetNotificationsPaginated,
  apiRouteNotificationsReadNotification,
} from '../routes';
import INotificationPage from '../types/INotificationPage';

export async function getNextPage(
  page: number,
  pageSize: number,
): Promise<INotificationPage> {
  // get access token
  const accessToken = await getAccessToken();

  // decode access token to grab user id
  // in the future, this should be available in the auth context or data store
  const url = `${apiRouteNotificationsGetNotificationsPaginated}?page=${page}&pageSize=${pageSize}`;
  const response = await axios.get<INotificationPage>(url, {
    // add CORS headers to request
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Access-Control-Allow-Origin': `${apiEndpoint}`,
    },
  });
  return response.data;
}

export async function markNotificationAsRead(
  notificationId: string,
): Promise<void> {
  // get access token
  const accessToken = await getAccessToken();

  // decode access token to grab user id
  // in the future, this should be available in the auth context or data store
  const url = `${apiRouteNotificationsReadNotification}?id=${notificationId}`;
  await axios.post(url, null, {
    // add CORS headers to request
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Access-Control-Allow-Origin': `${apiEndpoint}`,
    },
  });
}
