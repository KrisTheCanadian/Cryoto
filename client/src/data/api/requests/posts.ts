import axios, {AxiosError} from 'axios';

import {getAccessToken, getUserId} from '../helpers';
import {
  apiEndpoint,
  apiRoutePostsBoostPost,
  apiRoutePostsCommentOnPost,
  apiRoutePostsCreatePost,
  apiRoutePostsGetUserFeed,
  apiRoutePostsGetUserProfileFeed,
  apiRoutePostsReactPost,
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

async function reactPost(
  type: number,
  postId: string,
): Promise<IPost | AxiosError> {
  const accessToken = await getAccessToken();
  const url = `${apiRoutePostsReactPost}?type=${type}&guid=${postId}`;

  const response = await axios.post<IPost>(
    url,
    {},
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

async function commentOnPost(
  postId: string,
  message: string,
  imageUrl: string,
): Promise<IPost | AxiosError> {
  const accessToken = await getAccessToken();
  const url = `${apiRoutePostsCommentOnPost}/${postId}`;

  const response = await axios.post<IPost>(
    url,
    {
      message,
      imageUrl,
    },
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

async function boostPost(postId: string): Promise<IPost | AxiosError> {
  const accessToken = await getAccessToken();
  const url = `${apiRoutePostsBoostPost}?guid=${postId}`;

  const response = await axios.post<IPost>(
    url,
    {},
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

export {
  commentOnPost,
  getNextPage,
  createPost,
  getNextPageUserProfile,
  reactPost,
  boostPost,
};
