import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';
import {act, render, screen} from '@testing-library/react';
import {I18nextProvider} from 'react-i18next';
import {MemoryRouter} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from 'react-query';

import Orders from './Orders';

import i18n from '@/i18n/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
    },
  },
});

describe('Orders component', () => {
  const order = {
    id: '123',
    email: 'example@example.com',
    shippingAddress: {
      streetNumber: '123',
      street: 'Example St.',
      apartment: '456',
      city: 'Example City',
      province: 'Example Province',
      postalCode: '12345',
    },
    items: [
      {id: 'item1', quantity: 1, size: 'medium'},
      {id: 'item2', quantity: 2},
    ],
    date: new Date('2023-02-17T20:15:00Z'),
  };

  const mockUseLocationValue = {
    pathname: `/orders/${order.id}`,
    search: '',
    hash: '',
    state: {data: order},
  };

  it('should render the component with order details', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={[mockUseLocationValue]}>
          <QueryClientProvider client={queryClient}>
            <I18nextProvider i18n={i18n}>
              <ThemeContextProvider>
                <Orders />
              </ThemeContextProvider>
            </I18nextProvider>
          </QueryClientProvider>
        </MemoryRouter>,
      );
    });

    expect(
      screen.getByText('Your order has been received.'),
    ).toBeInTheDocument();
    expect(screen.getByText('example@example.com')).toBeInTheDocument();
    expect(screen.getByText('Order Date')).toBeInTheDocument();
    expect(screen.getByText('February 17, 2023')).toBeInTheDocument();
    expect(screen.getByText('Order #')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
    expect(screen.getByText('Shipping Address')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      'images/jpgImages/orderCompleted.jpg',
    );
  });
});
