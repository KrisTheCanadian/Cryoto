import {IUserMinimal} from './IUser';

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
  authorProfile: IUserMinimal | null;
}

export default IComment;
