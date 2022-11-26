import INotification from './INotification';

interface INotificationPage {
  data: INotification[];
  page: number;
  itemsPerPage: number;
  totalPages: number;
}

export default INotificationPage;
