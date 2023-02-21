import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';
import {MarketplaceProvider} from '@shared/hooks/MarketplaceContext';
import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {I18nextProvider} from 'react-i18next';
import {MemoryRouter} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from 'react-query';

import ShoppingCart from './ShoppingCart';

import i18n from '@/i18n/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
    },
  },
});

describe('ShoppingCart', () => {
  it('renders shopping cart component', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <I18nextProvider i18n={i18n}>
            <QueryClientProvider client={queryClient}>
              <ThemeContextProvider>
                <MarketplaceProvider>
                  <ShoppingCart />
                </MarketplaceProvider>
              </ThemeContextProvider>
            </QueryClientProvider>
          </I18nextProvider>
        </MemoryRouter>,
      );
    });

    const cartComponent = screen.getByText('Your Cart');
    expect(cartComponent).toBeInTheDocument();
  });
});
