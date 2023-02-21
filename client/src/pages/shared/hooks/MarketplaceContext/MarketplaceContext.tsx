/* eslint-disable react-hooks/exhaustive-deps */
import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';

import IMarketPlaceItem from '@/data/api/types/IMarketPlaceItem';
import {ICartItem, IItem} from '@/data/api/types/ICart';
import {getAllItems} from '@/data/api/requests/marketplace';

interface Filter {
  filter: string;
  type: number;
  min?: number;
  max?: number;
}
interface MarketplaceContextState {
  allItems: IItem[];
  selectedFilters: Filter[];
  setSelectedFilters: any;
  selectSort: string;
  setSelectSort: any;
  itemsDisplayed: IItem[];
  setItemsDisplayed: any;
  updateSortedItems: boolean;
  setUpdateSortedItems: any;
  cartItems: ICartItem[];
  setCartItems: any;
  addCartItems: any;
  setCartItemsQuantity: any;
  cartItemsQuantity: number;
  updateCartItemQuantity: any;
}

const MarketplaceContext = createContext({} as MarketplaceContextState);

function MarketplaceProvider(props: {children: any}) {
  const {t, i18n} = useTranslation();
  const lang = i18n.language.substring(0, 2);
  const itemsJsonTranslated: IItem[] = [];

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
  const [itemsDisplayed, setItemsDisplayed] = useState<IItem[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Filter[]>([]);
  const [updateSortedItems, setUpdateSortedItems] = useState(false);
  const [selectSort, setSelectSort] = useState<string>('');

  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [cartItemsQuantity, setCartItemsQuantity] = useState(0);

  useEffect(() => {
    if (status === 'success') setItemsDisplayed([...allItems]);
    const storedCartItems = JSON.parse(
      localStorage.getItem('cartItems') || '[]',
    );
    if (storedCartItems.length > 0) {
      setCartItems(storedCartItems);
      let quantity = 0;
      cartItems.forEach((item: ICartItem) => {
        quantity += item.quantity;
      });
      setCartItemsQuantity(quantity);
    }
  }, [data]);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems, cartItemsQuantity]);

  const updateCartItemQuantity = (
    id: string,
    operation: string,
    size?: number,
  ) => {
    const item = cartItems.find((i) => i.id === id && i.size === size);
    if (item && operation === 'add') {
      item.quantity += 1;
      setCartItemsQuantity(cartItemsQuantity + 1);
    } else if (item && operation === 'minus') {
      item.quantity -= 1;
      setCartItemsQuantity(cartItemsQuantity - 1);
    }
  };

  const addCartItems = (
    id: string,
    title: string,
    image: string,
    points: number,
    size: string,
    quantity: number,
  ) => {
    if (cartItems.length === 0) {
      setCartItems([{id, title, image, points, size, quantity}]);
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
      setCartItems,
      cartItems,
      setCartItemsQuantity,
      updateCartItemQuantity,
    };
  }, [
    addCartItems,
    allItems,
    itemsDisplayed,
    selectSort,
    selectedFilters,
    updateSortedItems,
    cartItemsQuantity,
    cartItems,
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

export {MarketplaceProvider, MarketplaceContext, useMarketplaceContext};
