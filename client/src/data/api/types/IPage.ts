import IPost from './IPost';

interface IPage {
  data: IPost[];
  page: number;
  itemsPerPage: number;
  totalPages: number;
}

export default IPage;
