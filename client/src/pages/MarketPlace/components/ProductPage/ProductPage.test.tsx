import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';
import {MarketplaceContext} from '@shared/hooks/MarketplaceContext';
import {fireEvent, render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {I18nextProvider} from 'react-i18next';
import {MemoryRouter} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from 'react-query';

import ProductPage from './ProductPage';

import i18n from '@/i18n/i18n';
import {IItem} from '@/data/api/types/ICart';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
    },
  },
});

const items: IItem[] = [
  {
    id: '1',
    title: 'Product 1',
    image: 'image_url',
    points: 100,
    size: ['S', 'M', 'L'],
    brand: 'brand',
    type: 'type1',
    availability: 5,
  },
];

const mockMarketplaceContext = {
  allItems: items,
  selectedFilters: [],
  setSelectedFilters: jest.fn(),
  selectSort: '',
  setSelectSort: jest.fn(),
  itemsDisplayed: [],
  setItemsDisplayed: jest.fn(),
  updateSortedItems: false,
  setUpdateSortedItems: jest.fn(),
  cartItems: [],
  addCartItem: jest.fn(),
  updateCartItem: jest.fn(),
  deleteCartItem: jest.fn(),
};

describe('Product Page', () => {
  it('Renders Product page and corresponding titles', async () => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({
        id: '1',
      }),
    }));

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/1']}>
          <I18nextProvider i18n={i18n}>
            <QueryClientProvider client={queryClient}>
              <ThemeContextProvider>
                <MarketplaceContext.Provider value={mockMarketplaceContext}>
                  <ProductPage />
                </MarketplaceContext.Provider>
              </ThemeContextProvider>
            </QueryClientProvider>
          </I18nextProvider>
        </MemoryRouter>,
      );
    });

    expect(screen.getByText('coins')).toBeInTheDocument();
    expect(screen.getByText('Quantity')).toBeInTheDocument();
    expect(screen.getByTestId('addToCart')).toBeInTheDocument();
  });
});
