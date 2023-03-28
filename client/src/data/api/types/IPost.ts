import {PostType} from '../enums';

import IComment from './IComment';
import {IUserMinimal} from './IUser';

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
  recipientProfiles: IUserMinimal[];
  authorProfile: IUserMinimal;
  imageUrl: string;
  hearts: string[];
  claps: string[];
  celebrations: string[];
  commentIds: string[];
  comments: IComment[];
  boosts: string[];
  boostProfiles: IUserMinimal[];
}

export default IPost;
