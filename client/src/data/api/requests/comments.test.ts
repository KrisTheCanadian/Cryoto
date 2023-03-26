import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {IPost} from '../types';
import {PostType} from '../enums';

import {deleteComment} from './comment';

import {apiRouteCommentsDelete} from '@/data/api/routes';

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

it('DeleteComment returns success', async () => {
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

  const commentId = 'commentId';

  const url = `${apiRouteCommentsDelete}/${commentId}`;
  mock.onDelete(url).reply(200, post);

  const res = await deleteComment(commentId);

  expect(res).toEqual(post);
});
