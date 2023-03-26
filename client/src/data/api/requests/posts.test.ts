import {AccountInfo} from '@azure/msal-browser';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {INewPost, IPost} from '../types';
import {PostType} from '../enums';

import {
  boostPost,
  commentOnPost,
  createPost,
  getNextPage,
  getNextPageUserProfile,
  reactPost,
} from './posts';

import {
  apiRoutePostsBoostPost,
  apiRoutePostsCommentOnPost,
  apiRoutePostsCreatePost,
  apiRoutePostsGetUserFeed,
  apiRoutePostsGetUserProfileFeed,
  apiRoutePostsReactPost,
  apiRouteUserProfileGetUserProfile,
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
  const data = {response: true};
  mock.onGet(apiRouteUserProfileGetUserProfile).reply(200, data);

  const page = 1;
  const pageSize = 10;
  const accounts: AccountInfo[] = [
    {
      environment: 'environment',
      homeAccountId: 'homeAccountId',
      localAccountId: 'localAccountId',
      tenantId: 'tenantId',
      username: 'username',
    },
  ];

  const url = `${apiRoutePostsGetUserFeed}?userId=${accounts[0].homeAccountId}&page=${page}&pageSize=${pageSize}`;

  mock.onGet(url).reply(200, data);

  const res = await getNextPage(page, pageSize, accounts[0].homeAccountId);

  expect(res).toEqual(data);
});

it('GetNextPageUserProfile returns success', async () => {
  const data = {response: true};
  mock.onGet(apiRouteUserProfileGetUserProfile).reply(200, data);

  const page = 1;
  const pageSize = 10;
  const accounts: AccountInfo[] = [
    {
      environment: 'environment',
      homeAccountId: 'homeAccountId',
      localAccountId: 'localAccountId',
      tenantId: 'tenantId',
      username: 'username',
    },
  ];

  const url = `${apiRoutePostsGetUserProfileFeed}?userId=${accounts[0].homeAccountId}&page=${page}&pageSize=${pageSize}`;

  mock.onGet(url).reply(200, data);

  const res = await getNextPageUserProfile(
    page,
    pageSize,
    accounts[0].homeAccountId,
  );

  expect(res).toEqual(data);
});

it('CreatePost returns success', async () => {
  const data = {response: true};

  const post: INewPost = {
    message: 'test',
    recipients: [],
    tags: [],
    createdDate: new Date(),
    postType: PostType.General,
    isTransactable: true,
    coins: 4,
    tempRecipients: [{name: 'name', id: '1'}],
    imageUrl: '',
  };

  const url = apiRoutePostsCreatePost;

  mock.onPost(url).reply(200, data);

  const res = await createPost(post);

  expect(res).toEqual(data);
});

it('ReactPost returns success', async () => {
  const type = 0;
  const postId = '1';

  const post: IPost = {
    id: '1',
    message: 'test',
    recipients: [],
    author: 'author',
    tags: [],
    createdDate: 'date',
    postType: PostType.General,
    isTransactable: true,
    coins: 4,
    recipientProfiles: [],
    authorProfile: {
      oId: '1',
      name: 'name',
    },
    imageUrl: '',
    comments: [],
    celebrations: [],
    commentIds: [],
    boosts: [],
    hearts: [],
    claps: [],
  };

  const url = `${apiRoutePostsReactPost}?type=${type}&guid=${postId}`;

  mock.onPost(url).reply(200, post);

  const res = await reactPost(type, postId);

  expect(res).toEqual(post);
});

it('CommentPost returns success', async () => {
  const message = 'message';
  const postId = '1';
  const imageUrl = 'imageUrl';

  const post: IPost = {
    id: '1',
    message: 'message',
    recipients: [],
    author: 'author',
    tags: [],
    createdDate: 'date',
    postType: PostType.General,
    isTransactable: true,
    coins: 4,
    recipientProfiles: [],
    authorProfile: {
      oId: '1',
      name: 'name',
    },
    imageUrl: 'imageUrl',
    comments: [],
    celebrations: [],
    commentIds: [],
    boosts: [],
    hearts: [],
    claps: [],
  };

  const url = `${apiRoutePostsCommentOnPost}/${postId}`;

  mock.onPost(url).reply(200, post);

  const res = await commentOnPost(postId, message, imageUrl);

  expect(res).toEqual(post);
});

it('BoostPost returns success', async () => {
  const postId = '1';

  const post: IPost = {
    id: '1',
    message: 'message',
    recipients: [],
    author: 'author',
    tags: [],
    createdDate: 'date',
    postType: PostType.General,
    isTransactable: true,
    coins: 4,
    recipientProfiles: [],
    authorProfile: {
      oId: '1',
      name: 'name',
    },
    imageUrl: 'imageUrl',
    comments: [],
    celebrations: [],
    commentIds: [],
    boosts: [],
    hearts: [],
    claps: [],
  };

  const url = `${apiRoutePostsBoostPost}?guid=${postId}`;

  mock.onPost(url).reply(200, post);

  const res = await boostPost(postId);

  expect(res).toEqual(post);
});
