import {act, render, screen} from '@testing-library/react';
import {MockAppProviders} from '@shared/testing/mocks';
import {QueryClient, QueryClientProvider} from 'react-query';

import CartItem from './CartItem';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
    },
  },
});

const props = {
  id: '1',
  image: 'image.png',
  title: 'Product Title',
  points: 10,
  size: 'S',
  quantity: 1,
  total: 10,
  setTotal: jest.fn(),
  checkout: false,
};

function renderCartItems() {
  render(
    <MockAppProviders>
      <QueryClientProvider client={queryClient}>
        <CartItem {...props} />
      </QueryClientProvider>
    </MockAppProviders>,
  );
}

describe('CartItem', () => {
  it('renders product title and size', async () => {
    const intersectionObserverMock = () => ({
      observe: () => null,
      unobserve: (el: any) => null,
    });

    window.IntersectionObserver = jest
      .fn()
      .mockImplementation(intersectionObserverMock);

    await act(async () => {
      renderCartItems();
    });

    expect(screen.getByText('Product Title')).toBeInTheDocument();
    expect(screen.getByText('Size:')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });
});
