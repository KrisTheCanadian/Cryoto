import {apiRouteUserProfileGetUserProfile} from '../../../../data/api/routes';

async function getUserProfile(accessToken: any) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers,
  };
  return fetch(apiRouteUserProfileGetUserProfile, options).then((response) =>
    response.json(),
  );
}
export default getUserProfile;
