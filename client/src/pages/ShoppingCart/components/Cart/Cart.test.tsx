import {MockAppProviders} from '@shared/testing/mocks';
import {MarketplaceContext} from '@shared/hooks/MarketplaceContext';
import {act, render, screen} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from 'react-query';

import Cart from './Cart';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
    },
  },
});

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

// Render the component with mock context values and a router
function renderCart(checkout = false) {
  render(
    <MockAppProviders>
      <QueryClientProvider client={queryClient}>
        <MarketplaceContext.Provider value={mockMarketplaceContext}>
          <Cart checkout={checkout} />
        </MarketplaceContext.Provider>
      </QueryClientProvider>
    </MockAppProviders>,
  );
}

describe('Cart', () => {
  it('displays the correct title depending on the "checkout" prop', () => {
    renderCart();
    expect(screen.getByText('Your Cart')).toBeInTheDocument();
    renderCart(true);
    expect(screen.getByText('Order Summary')).toBeInTheDocument();
  });

  it('displays the cart items', () => {
    renderCart(false);
    expect(screen.getByText('Example Product')).toBeInTheDocument();
    expect(screen.getByText('Another Example Product')).toBeInTheDocument();
  });

  it('updates the total when the cart items change', () => {
    renderCart();
    expect(screen.getByText('25 coins')).toBeInTheDocument();

    mockMarketplaceContext.cartItems[0].quantity = 3;
    mockMarketplaceContext.cartItems.push({
      id: '3',
      image: 'https://example.com/image3.jpg',
      title: 'Third Example Product',
      points: 15,
      quantity: 2,
    });

    renderCart();
    expect(screen.getByText('65 coins')).toBeInTheDocument();
  });

  it('navigates to the checkout page when the "Checkout" button is clicked', () => {
    renderCart();
    const checkoutButton = screen.getByTestId('proceed-checkout');

    act(() => {
      checkoutButton.click();
    });

    expect(screen.getByText('Order Summary')).toBeInTheDocument();
  });
});
