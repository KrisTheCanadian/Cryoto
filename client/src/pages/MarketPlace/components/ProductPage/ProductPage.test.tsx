import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';
import {MarketplaceProvider} from '@shared/hooks/MarketplaceContext';
import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {I18nextProvider} from 'react-i18next';
import {MemoryRouter} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from 'react-query';

import ProductPage from './ProductPage';

import i18n from '@/i18n/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
    },
  },
});

describe('Product Page', () => {
  it('Renders the right sections and child components', async () => {
    const Quantity = 'Quantity';
    const AddToCart = 'Add To Cart';

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <I18nextProvider i18n={i18n}>
            <QueryClientProvider client={queryClient}>
              <ThemeContextProvider>
                <MarketplaceProvider>
                  <ProductPage />
                </MarketplaceProvider>
              </ThemeContextProvider>
            </QueryClientProvider>
          </I18nextProvider>
        </MemoryRouter>,
      );
    });

    expect(screen.getByText(Quantity)).toBeInTheDocument();
    expect(screen.getByText(AddToCart)).toBeInTheDocument();
  });
});
