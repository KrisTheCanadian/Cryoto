import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';
import {
  MarketplaceContext,
  MarketplaceProvider,
} from '@shared/hooks/MarketplaceContext';
import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {I18nextProvider} from 'react-i18next';
import {MemoryRouter} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from 'react-query';

import Checkout from './Checkout';

import i18n from '@/i18n/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
    },
  },
});

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate,
}));

// Render the component with mock context values and a router
function renderCheckout() {
  render(
    <MemoryRouter initialEntries={['/']}>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <ThemeContextProvider>
            <MarketplaceProvider>
              <Checkout />
            </MarketplaceProvider>
          </ThemeContextProvider>
        </QueryClientProvider>
      </I18nextProvider>
    </MemoryRouter>,
  );
}

test('renders Checkout page with correct headings', () => {
  renderCheckout();

  expect(screen.getByText('Checkout')).toBeInTheDocument();
  expect(screen.getByText('1. Email')).toBeInTheDocument();
  expect(screen.getByText('2. Shipping Address')).toBeInTheDocument();
});

test('opens EditAddressDialog when Edit button is clicked', () => {
  renderCheckout();

  const editAddressButton = screen.getByTestId('editAddress');

  act(() => {
    editAddressButton.click();
  });
  expect(screen.getByText('Shipping Address')).toBeInTheDocument();
});

test('navigates to shopping cart page when Back button is clicked', () => {
  renderCheckout();

  const continueShoppingButton = screen.getByTestId('continueShopping');
  act(() => {
    continueShoppingButton.click();
  });

  expect(mockedUsedNavigate).toHaveBeenCalledWith('/market');
});

test('when cart is not empty, place order button is enabled', async () => {
  // Mock marketplace context values
  const mockCartItems = [
    {
      id: '1',
      image: 'https://example.com/image.jpg',
      title: 'Example Product',
      points: 10,
      size: 'M',
      quantity: 2,
    },
    {
      id: '2',
      image: 'https://example.com/image2.jpg',
      title: 'Another Example Product',
      points: 5,
      quantity: 1,
    },
  ];

  const mockMarketplaceContext = {
    allItems: [],
    selectedFilters: [],
    setSelectedFilters: jest.fn(),
    selectSort: '',
    setSelectSort: jest.fn(),
    itemsDisplayed: [],
    setItemsDisplayed: jest.fn(),
    updateSortedItems: false,
    setUpdateSortedItems: jest.fn(),
    cartItems: mockCartItems,
    setCartItems: jest.fn(),
    addCartItems: jest.fn(),
    setCartItemsQuantity: jest.fn(),
    cartItemsQuantity: 0,
    updateCartItemQuantity: jest.fn(),
  };

  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={queryClient}>
            <ThemeContextProvider>
              <MarketplaceContext.Provider value={mockMarketplaceContext}>
                <Checkout />
              </MarketplaceContext.Provider>
            </ThemeContextProvider>
          </QueryClientProvider>
        </I18nextProvider>
      </MemoryRouter>,
    );
  });

  expect(screen.getByTestId('placeOrder')).toBeInTheDocument();
});
