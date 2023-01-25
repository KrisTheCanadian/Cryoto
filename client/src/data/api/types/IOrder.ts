import IOrderItem from './IOrderItem';

interface IOrder {
  items: IOrderItem[];
  email: string;
  address: string;
}
export default IOrder;
