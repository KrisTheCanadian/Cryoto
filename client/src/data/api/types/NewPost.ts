import PostType from '../enums/PostTypes';

interface NewPostType {
  message: string;
  recipients: string[];
  tags: string[];
  createdDate: Date;
  postType: PostType;
  isTransactable: boolean;
  coins: number;
  tempRecipients: {name: string; id: string}[];
}

export type {NewPostType};
