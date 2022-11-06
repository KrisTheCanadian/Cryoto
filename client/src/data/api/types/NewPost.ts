interface NewPostType {
  message: string;
  recipients: string[];
  tags: string[];
  createdDate: Date;
  postType: string;
  isTransactable: boolean;
  coins: number;
}

export type {NewPostType};
