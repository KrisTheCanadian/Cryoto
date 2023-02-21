import IAddress from './IAddress';

export interface IItem {
  id: string;
  image: any;
  title: string;
  type: string;
  size?: string[];
  brand: string;
  points: number;
  description?: string;
}

export interface ICartItem {
  id: string;
  image: any;
  title: string;
  points: number;
  size?: string;
  quantity: number;
}

export interface IOrderItem {
  id: string;
  quantity: number;
  size?: string;
}

export interface IOrder {
  id: string;
  email: string;
  shippingAddress: IAddress;
  items: IOrderItem[];
  date: Date;
}
