import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';
import {
  MarketplaceContext,
  MarketplaceProvider,
} from '@shared/hooks/MarketplaceContext';
import {fireEvent, render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {I18nextProvider} from 'react-i18next';
import {MemoryRouter} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from 'react-query';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Checkout from './Checkout';

import i18n from '@/i18n/i18n';
import {apiRouteMarketPlaceCompletePurchase} from '@/data/api/routes';
import {IOrder} from '@/data/api/types/ICart';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
    },
  },
});

const mockedUsedNavigate = jest.fn();
const mock = new MockAdapter(axios);

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock('src/data/api/helpers/', () => {
  return {
    getAccessToken: jest.fn(() => {
      return 'access_token';
    }),
    getUserId: jest.fn(() => {
      return 'homeAccountId';
    }),
  };
});

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
  act(() => {
    renderCheckout();
  });

  expect(screen.getByText('Order Summary')).toBeInTheDocument();
  expect(screen.getByText('Checkout')).toBeInTheDocument();
  expect(screen.getByText('1. Email')).toBeInTheDocument();
  expect(screen.getByText('2. Shipping Address')).toBeInTheDocument();
  expect(screen.getByText('Total')).toBeInTheDocument();
});

test('opens EditAddressDialog when Edit button is clicked', () => {
  act(() => {
    renderCheckout();
  });
  const editAddressButton = screen.getByTestId('editAddress');

  act(() => {
    editAddressButton.click();
  });

  expect(
    screen.getByRole('heading', {name: /shipping address/i}),
  ).toBeInTheDocument();

  expect(
    screen.getByRole('textbox', {name: 'streetNumber'}),
  ).toBeInTheDocument();

  expect(screen.getByRole('textbox', {name: 'apartment'})).toBeInTheDocument();
  expect(screen.getByRole('textbox', {name: 'street'})).toBeInTheDocument();
  expect(screen.getByRole('textbox', {name: 'city'})).toBeInTheDocument();
  expect(screen.getByRole('textbox', {name: 'province'})).toBeInTheDocument();
  expect(screen.getByRole('textbox', {name: 'country'})).toBeInTheDocument();
  expect(screen.getByRole('textbox', {name: 'postalCode'})).toBeInTheDocument();
  expect(
    screen.getByRole('textbox', {name: 'additionalInfo'}),
  ).toBeInTheDocument();

  const saveButton = screen.getByRole('button', {name: 'Save'});
  expect(saveButton).toBeDisabled();
});

test('Address changes correctly', () => {
  act(() => {
    renderCheckout();
  });

  const editAddressButton = screen.getByTestId('editAddress');

  act(() => {
    editAddressButton.click();
  });

  expect(
    screen.getByRole('heading', {name: /shipping address/i}),
  ).toBeInTheDocument();

  // change street number
  const streetNumberInput = screen.getByRole('textbox', {
    name: 'streetNumber',
  });
  act(() => {
    fireEvent.change(streetNumberInput, {target: {value: '456'}});
  });
  expect(streetNumberInput).toHaveValue('456');

  // change street
  const streetInput = screen.getByRole('textbox', {
    name: 'street',
  });
  act(() => {
    fireEvent.change(streetInput, {target: {value: 'Test Street'}});
  });
  expect(streetInput).toHaveValue('Test Street');

  // change city
  const cityInput = screen.getByRole('textbox', {
    name: 'city',
  });
  act(() => {
    fireEvent.change(cityInput, {target: {value: 'City'}});
  });
  expect(cityInput).toHaveValue('City');

  // change province
  const provinceInput = screen.getByRole('textbox', {
    name: 'province',
  });
  act(() => {
    fireEvent.change(provinceInput, {target: {value: 'province'}});
  });
  expect(provinceInput).toHaveValue('province');

  // change country
  const countryInput = screen.getByRole('textbox', {
    name: 'country',
  });
  act(() => {
    fireEvent.change(countryInput, {target: {value: 'country'}});
  });
  expect(countryInput).toHaveValue('country');

  // change postal code
  const postalCodeInput = screen.getByRole('textbox', {
    name: 'postalCode',
  });
  act(() => {
    fireEvent.change(postalCodeInput, {target: {value: 'postal code'}});
  });
  expect(postalCodeInput).toHaveValue('postal code');

  const saveButton = screen.getByRole('button', {name: 'Save'});
  expect(saveButton).toBeEnabled();

  act(() => {
    saveButton.click();
  });
});

test('navigates to shopping cart page when Back button is clicked', () => {
  act(() => {
    renderCheckout();
  });

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
    addCartItem: jest.fn(),
    updateCartItem: jest.fn(),
    deleteCartItem: jest.fn(),
  };

  const order: IOrder = {
    id: '1',
    items: [
      {
        id: 'afd380c1',
        quantity: 1,
      },
    ],
    email: 'test@test.com',
    shippingAddress: {
      id: 1,
      streetNumber: '20',
      street: 'Test Street',
      city: 'Test City',
      province: 'Test Province',
      country: 'Test Country',
      postalCode: 'Test Postal Code',
    },
    date: new Date(),
  };

  const url = `${apiRouteMarketPlaceCompletePurchase}`;
  mock.onPost(url).reply(200, order);

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
  act(() => {
    screen.getByTestId('placeOrder').click();
  });
});
