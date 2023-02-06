/* eslint-disable react-hooks/exhaustive-deps */
import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';

import IMarketPlaceItem from '@/data/api/types/IMarketPlaceItem';
import {getAllItems} from '@/data/api/requests/marketplace';

interface Filter {
  filter: string;
  type: number;
  min?: number;
  max?: number;
}

interface Item {
  id: string;
  image: any;
  title: string;
  type: string;
  size?: string[];
  brand: string;
  points: number;
  description?: string;
}

interface CartItem {
  id: string;
  image: any;
  title: string;
  points: number;
  size?: string;
  quantity: number;
}

interface MarketplaceContextState {
  allItems: Item[];
  selectedFilters: Filter[];
  setSelectedFilters: any;
  selectSort: string;
  setSelectSort: any;
  itemsDisplayed: Item[];
  setItemsDisplayed: any;
  updateSortedItems: boolean;
  setUpdateSortedItems: any;
  addCartItems: any;
  cartItemsQuantity: number;
}

const MarketplaceContext = createContext({} as MarketplaceContextState);

function MarketplaceProvider(props: {children: any}) {
  const {t, i18n} = useTranslation();
  const lang = i18n.language.substring(0, 2);
  const itemsJsonTranslated: Item[] = [];

  const {data, status} = useQuery<IMarketPlaceItem[]>(
    'getAllItems',
    getAllItems,
  );

  if (data && status === 'success') {
    data.forEach((item: IMarketPlaceItem) => {
      if (item?.availabilities !== 0) {
        itemsJsonTranslated.push({
          id: item.id,
          image: item.image,
          title: lang === 'en' ? item.title_En : item.title_Fr,
          type: lang === 'en' ? item.type_En : item.type_Fr,
          description:
            lang === 'en' ? item.description_En : item.description_Fr,
          size: item.size,
          brand: item.brand,
          points: item.points,
        });
      }
    });
  }

  itemsJsonTranslated.sort((item1, item2) =>
    item1.title.localeCompare(item2.title),
  );
  itemsJsonTranslated.sort((item1, item2) => item1.points - item2.points);

  const allItems = itemsJsonTranslated;
  const [itemsDisplayed, setItemsDisplayed] = useState<Item[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Filter[]>([]);
  const [updateSortedItems, setUpdateSortedItems] = useState(false);
  const [selectSort, setSelectSort] = useState<string>('');

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartItemsQuantity, setCartItemsQuantity] = useState(0);

  useEffect(() => {
    if (status === 'success') setItemsDisplayed([...allItems]);
  }, [data]);

  const addCartItems = (
    id: string,
    title: string,
    image: string,
    points: number,
    size: string,
    quantity: number,
  ) => {
    if (size === '') {
      const item = cartItems.find((i) => i.id === id);
      if (item) item.quantity += quantity;
      else setCartItems([...cartItems, {id, title, image, points, quantity}]);
    } else {
      const item = cartItems.find((i) => i.id === id && i.size === size);
      if (item) item.quantity += quantity;
      else
        setCartItems([
          ...cartItems,
          {id, title, image, points, size, quantity},
        ]);
    }
    setCartItemsQuantity(cartItemsQuantity + quantity);
  };

  const values = useMemo(() => {
    return {
      allItems,
      itemsDisplayed,
      setItemsDisplayed,
      selectedFilters,
      setSelectedFilters,
      selectSort,
      setSelectSort,
      updateSortedItems,
      setUpdateSortedItems,
      addCartItems,
      cartItemsQuantity,
    };
  }, [
    addCartItems,
    allItems,
    itemsDisplayed,
    selectSort,
    selectedFilters,
    updateSortedItems,
    cartItemsQuantity,
  ]);

  return (
    <MarketplaceContext.Provider value={values}>
      {props.children}
    </MarketplaceContext.Provider>
  );
}

const useMarketplaceContext = () => {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error(
      'useMarketplaceMenuContext must be used within a CountProvider',
    );
  }
  return context;
};

export {MarketplaceProvider, useMarketplaceContext};
