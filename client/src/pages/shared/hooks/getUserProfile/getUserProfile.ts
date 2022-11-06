import axios from 'axios';

import {apiRouteUserProfileGetUserProfile} from '../../../../data/api/routes';

async function getUserProfile(accessToken: any) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  // convert fetch to axios for consistency
  const res = await axios.get(apiRouteUserProfileGetUserProfile, {
    headers: {
      Authorization: bearer,
    },
  });

  return res.data;
}
export default getUserProfile;
