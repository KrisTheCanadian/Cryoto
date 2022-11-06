/* eslint-disable @shopify/strict-component-boundaries */
/* eslint-disable @typescript-eslint/naming-convention */
import {AccountInfo, IPublicClientApplication} from '@azure/msal-browser';
import {useMsal} from '@azure/msal-react';
import axios from 'axios';

import {loginRequest} from '../../../pages/Authentication/authConfig';
import {
  apiEndpoint,
  apiRoutePostsCreatePost,
  apiRoutePostsGetUserFeed,
} from '../routes';
import IPage from '../types/IPage';
import IPost from '../types/IPost';
import {NewPostType} from '../types/NewPost';

export async function getNextPage(
  page: number,
  pageSize: number,
  accounts: AccountInfo[],
  instance: IPublicClientApplication,
): Promise<IPage> {
  const userId = accounts[0].homeAccountId;

  // get access token
  const res = await instance.acquireTokenSilent({
    account: accounts[0],
    scopes: loginRequest.scopes,
  });

  // decode access token to grab user id
  // in the future, this should be available in the auth context or data store
  const url = `${apiRoutePostsGetUserFeed}?userId=${userId}&page=${page}&pageSize=${pageSize}`;
  const response = await axios.get<IPage>(url, {
    // add CORS headers to request
    headers: {
      Authorization: `Bearer ${res.accessToken}`,
      'Access-Control-Allow-Origin': `${apiEndpoint}`,
    },
  });
  return response.data;
}
export async function createPost(
  post: NewPostType,
  instance: IPublicClientApplication,
  accounts: AccountInfo[],
): Promise<IPost> {
  const res = await instance.acquireTokenSilent({
    account: accounts[0],
    scopes: loginRequest.scopes,
  });
  const response = await axios.post(
    apiRoutePostsCreatePost,
    JSON.stringify(post),
    {
      // add CORS headers to request
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${res.accessToken}`,
        'Access-Control-Allow-Origin': `${apiEndpoint}`,
      },
    },
  );

  return response.data;
}
