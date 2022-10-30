/* eslint-disable @typescript-eslint/naming-convention */

interface IPage<Type> {
  data: Type;
  page: number;
  itemsPerPage: number;
  totalPages: number;
}

export default IPage;
