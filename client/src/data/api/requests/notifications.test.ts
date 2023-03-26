import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import INotificationPage from '../types/INotificationPage';

import {getNextPage, markNotificationAsRead} from './notifications';

import {
  apiRouteNotificationsGetNotificationsPaginated,
  apiRouteNotificationsReadNotification,
} from '@/data/api/routes';

const mock = new MockAdapter(axios);

jest.mock('../helpers', () => {
  return {
    getAccessToken: jest.fn(() => {
      return 'access_token';
    }),
    getUserId: jest.fn(() => {
      return 'homeAccountId';
    }),
  };
});

it('GetNextPage returns success', async () => {
  const data: INotificationPage = {
    data: [],
    page: 1,
    itemsPerPage: 10,
    totalPages: 1,
  };

  const page = 1;
  const pageSize = 10;

  const url = `${apiRouteNotificationsGetNotificationsPaginated}?page=${page}&pageSize=${pageSize}`;

  mock.onGet(url).reply(200, data);

  const res = await getNextPage(page, pageSize);

  expect(res).toEqual(data);
});

it('MarkNotificationAsRead returns success', async () => {
  const notificationId = 'notificationId';
  const url = `${apiRouteNotificationsReadNotification}?id=${notificationId}`;
  mock.onPost(url).reply(200);

  const res = await markNotificationAsRead(notificationId);

  expect(res).not.toBeDefined();
});
