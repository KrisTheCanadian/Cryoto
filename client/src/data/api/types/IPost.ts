import {PostType} from '../enums';

import IComment from './IComment';
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
  imageUrl: string;
  hearts: string[];
  claps: string[];
  celebrations: string[];
  commentIds: string[];
  comments: IComment[];
}

export default IPost;
