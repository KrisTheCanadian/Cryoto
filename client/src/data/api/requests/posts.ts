import axios, {AxiosError} from 'axios';

import {getAccessToken, getUserId} from '../helpers';
import {
  apiEndpoint,
  apiRoutePostsCreatePost,
  apiRoutePostsGetUserFeed,
  apiRoutePostsGetUserProfileFeed,
} from '../routes';
import IPage from '../types/IPage';
import IPost from '../types/IPost';
import {INewPost} from '../types/INewPost';

async function getNextPage(
  page: number,
  pageSize: number,
  userId: string,
): Promise<IPage> {
  // get access token
  const accessToken = await getAccessToken();

  // decode access token to grab user id
  // in the future, this should be available in the auth context or data store
  const url = `${apiRoutePostsGetUserFeed}?userId=${userId}&page=${page}&pageSize=${pageSize}`;
  const response = await axios.get<IPage>(url, {
    // add CORS headers to request
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Access-Control-Allow-Origin': `${apiEndpoint}`,
    },
  });
  return response.data;
}

async function getNextPageUserProfile(
  page: number,
  pageSize: number,
  userId: string,
): Promise<IPage> {
  // get access token
  const accessToken = await getAccessToken();

  // decode access token to grab user id
  // in the future, this should be available in the auth context or data store
  const url = `${apiRoutePostsGetUserProfileFeed}?userId=${userId}&page=${page}&pageSize=${pageSize}`;
  const response = await axios.get<IPage>(url, {
    // add CORS headers to request
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Access-Control-Allow-Origin': `${apiEndpoint}`,
    },
  });
  console.log(response.data);
  return response.data;
}

async function createPost(post: INewPost): Promise<IPost | AxiosError> {
  const accessToken = await getAccessToken();
  const response = await axios.post<IPost>(
    apiRoutePostsCreatePost,
    JSON.stringify(post),
    {
      // add CORS headers to request
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Access-Control-Allow-Origin': `${apiEndpoint}`,
      },
    },
  );

  return response.data;
}

export {getNextPage, createPost, getNextPageUserProfile};
