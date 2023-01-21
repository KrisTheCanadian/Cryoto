import {PostType} from '../enums';

interface INewPost {
  message: string;
  recipients: string[];
  tags: string[];
  createdDate: Date;
  postType: PostType;
  isTransactable: boolean;
  coins: number;
  tempRecipients: {name: string; id: string}[];
  imageUrl: string;
}

export type {INewPost};
