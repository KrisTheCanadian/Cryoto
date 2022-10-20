/* eslint-disable no-process-env */

async function getUserProfile(accessToken: any) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers,
  };
  return fetch(`${process.env.VITE_API_BASE_URL}/userProfile`, options).then(
    (response) => response.json(),
  );
}
export default getUserProfile;
