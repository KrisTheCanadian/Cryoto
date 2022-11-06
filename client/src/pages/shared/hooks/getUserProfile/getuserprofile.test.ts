import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {apiRouteUserProfileGetUserProfile} from 'data/api/routes';

import getUserProfile from './getUserProfile';

const mock = new MockAdapter(axios);

it('getUserProfile should be successful', async () => {
  const data = {response: true};
  mock.onGet(apiRouteUserProfileGetUserProfile).reply(200, data);

  const accessToken = 'accessToken';
  const res = await getUserProfile(accessToken);

  expect(res).toEqual(data);
});
