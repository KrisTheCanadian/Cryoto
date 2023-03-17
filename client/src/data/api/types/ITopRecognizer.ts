import {IUserMinimal, IUserWithDate} from './IUser';

export interface ITopRecognizer {
  count: number;
  userProfile: IUserWithDate;
}
