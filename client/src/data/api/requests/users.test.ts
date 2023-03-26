import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  apiRouteUserProfileGetTopRecognizers,
  apiRouteUserProfileGetUpcomingAnniversaries,
  apiRouteUserProfileGetUserProfile,
  apiRouteUserProfileUpdate,
  apiRouteUserSearch,
} from '../routes';
import {ITopRecognizer} from '../types/ITopRecognizer';
import IUser, {
  IUpdateUserProfile,
  IUserProfile,
  IUserWithDate,
} from '../types/IUser';

import {
  getTopRecognizers,
  getUpcomingAnniversaries,
  getUserProfile,
  searchUsers,
  updateUserProfile,
} from './users';

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

it('SearchUsers returns success', async () => {
  const data: IUserWithDate[] = [
    {
      oId: 'test',
      name: 'test',
      startDate: 'test',
      businessTitle: 'test',
    },
  ];

  const param = 'test';
  const url = `${apiRouteUserSearch}?keywords=${param}`;
  mock.onGet(url).reply(200, data);

  const res = await searchUsers(param);
  expect(res).toEqual(data);
});

it('GetUserProfile returns success', async () => {
  const data: IUser = {
    oId: 'test',
    name: 'test',
    startDate: 'test',
    businessTitle: 'test',
    email: '',
    language: '',
    roles: [],
    city: '',
    timeZone: '',
    managerReference: '',
    recognitionsReceived: 0,
    recognitionsSent: 0,
    birthday: '',
  };

  const url = apiRouteUserProfileGetUserProfile;
  mock.onGet(url).reply(200, data);

  const res = await getUserProfile();
  expect(res).toEqual(data);
});

it('GetUpcomingAnniversaries returns success', async () => {
  const data: IUserWithDate[] = [
    {
      oId: 'test',
      name: 'test',
      startDate: 'test',
      businessTitle: 'test',
    },
  ];

  const url = apiRouteUserProfileGetUpcomingAnniversaries;
  mock.onGet(url).reply(200, data);

  const res = await getUpcomingAnniversaries();
  expect(res).toEqual(data);
});

it('GetTopRecognizers returns success', async () => {
  const data: ITopRecognizer[] = [
    {
      count: 1,
      userProfile: {
        oId: 'test',
        name: 'test',
        startDate: 'test',
        businessTitle: 'test',
      },
    },
    {
      count: 2,
      userProfile: {
        oId: 'test',
        name: 'test',
        startDate: 'test',
        businessTitle: 'test',
      },
    },
  ];

  const url = apiRouteUserProfileGetTopRecognizers;
  mock.onGet(url).reply(200, data);

  const res = await getTopRecognizers();
  expect(res).toEqual(data);
});

it('UpdateUserProfile returns success', async () => {
  const param: IUpdateUserProfile = {
    name: 'new name',
  };

  const data: IUserProfile = {
    email: 'test',
    language: 'test',
    name: 'new name',
    oId: 'test',
    emailNotifications: true,
  };

  const url = apiRouteUserProfileUpdate;
  mock.onPut(url).reply(200, data);

  const res = await updateUserProfile(param);
  expect(res).toEqual(data);
});
