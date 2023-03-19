interface IMarketPlaceItem {
  id: string;
  title_En: string;
  title_Fr: string;
  type_En: string;
  type_Fr: string;
  brand: string;
  image: string;
  points: number;
  availabilities: number;
  description_En: string;
  description_Fr: string;
  size?: string[];
}

export default IMarketPlaceItem;
