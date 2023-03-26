/* eslint-disable react-hooks/exhaustive-deps */
import {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';

import IMarketPlaceItem from '@/data/api/types/IMarketPlaceItem';
import {ICartItem, IItem} from '@/data/api/types/ICart';
import {getAllItems} from '@/data/api/requests/marketplace';

interface ILocalCartItem {
  id: string;
  size?: string;
  quantity: number;
}

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
  addCartItem: any;
  updateCartItem: any;
  deleteCartItem: any;
}

const MarketplaceContext = createContext({} as MarketplaceContextState);

function MarketplaceProvider(props: {children: any}) {
  const {i18n} = useTranslation();
  const lang = i18n.language.substring(0, 2);
  const itemsJsonTranslated: IItem[] = [];

  const {data, status} = useQuery<IMarketPlaceItem[]>(
    'getAllItems',
    getAllItems,
  );

  if (data && status === 'success') {
    data.forEach((item: IMarketPlaceItem) => {
      itemsJsonTranslated.push({
        id: item.id,
        image: item.image,
        title: lang === 'en' ? item.title_En : item.title_Fr,
        type: lang === 'en' ? item.type_En : item.type_Fr,
        description: lang === 'en' ? item.description_En : item.description_Fr,
        size: item.size,
        brand: item.brand,
        points: item.points,
        availability: item.availabilities,
      });
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

  // Retrieving Cart from Local Storage
  useEffect(() => {
    if (status === 'success') setItemsDisplayed([...allItems]);
    const storedCartItems = JSON.parse(
      localStorage.getItem('cartItems') || '[]',
    );
    if (storedCartItems.length > 0) {
      let quantity = 0;
      const itemsArray: ICartItem[] = [];
      storedCartItems.forEach((item: ICartItem) => {
        const cartItem = allItems.find((i) => i.id === item.id);
        if (cartItem)
          itemsArray.push({
            id: item.id,
            image: cartItem?.image,
            title: cartItem?.title,
            points: cartItem?.points,
            size: item.size,
            quantity: item.quantity,
          });
        quantity += item.quantity;
      });
      setCartItems(itemsArray);
    }
  }, [data]);

  const storeCartInLocal = () => {
    const localCartItems: ILocalCartItem[] = [];
    cartItems.forEach((item: ICartItem) => {
      localCartItems.push({
        id: item.id,
        quantity: item.quantity,
        size: item.size,
      });
    });
    localStorage.setItem('cartItems', JSON.stringify(localCartItems));
  };

  // Cart changes
  const addCartItem = (
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
      if (item) {
        item.quantity += quantity;
        setCartItems([...cartItems]);
      } else
        setCartItems([
          ...cartItems,
          {id, title, image, points, size, quantity},
        ]);
    }
    storeCartInLocal();
  };

  const updateCartItem = (id: string, operation: string, size?: number) => {
    const item = cartItems.find((i) => i.id === id && i.size === size);
    if (item && operation === 'add') {
      item.quantity += 1;
    } else if (item && operation === 'minus' && item.quantity !== 0) {
      item.quantity -= 1;
    }
    storeCartInLocal();
  };

  const deleteCartItem = (id?: string, size?: string) => {
    if (id) {
      const index = cartItems.findIndex((i) => i.id === id && i.size === size);
      if (index >= 0) cartItems.splice(index, 1);
      storeCartInLocal();
    } else {
      localStorage.setItem('cartItems', JSON.stringify([]));
    }
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
      cartItems,
      addCartItem,
      updateCartItem,
      deleteCartItem,
    };
  }, [
    addCartItem,
    allItems,
    itemsDisplayed,
    selectSort,
    selectedFilters,
    updateSortedItems,
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
