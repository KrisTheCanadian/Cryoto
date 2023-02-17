import IUser from './IUser';

interface IComment {
  id: string;
  author: string;
  message: string;
  imageUrl: string;
  likes: number;
  usersWhoLiked: string[];
  createdDate: string;
  parentId: string;
  parentType: string;
  replies: IComment[];
  authorProfile: IUser | null;
}

export default IComment;
