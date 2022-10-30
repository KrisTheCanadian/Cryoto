/* eslint-disable @typescript-eslint/naming-convention */

import PostType from '../enums/PostTypes';

import IUser from './IUser';

interface IPost {
  id: string;
  author: string;
  message: string;
  recipients: string[];
  tags: string[];
  createdDate: string;
  postType: PostType;
  isTransactable: boolean;
  coins: number;
  recipientProfiles: IUser[];
  authorProfile: IUser;
}

export default IPost;