import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';
import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {I18nextProvider} from 'react-i18next';
import {MemoryRouter} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from 'react-query';

import MarketPlace from './MarketPlace';

import i18n from '@/i18n/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
    },
  },
});

it('MarketPlace page renders', async () => {
  const MarketPlaceRoute = 'Marketplace Route';

  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={queryClient}>
            <ThemeContextProvider>
              <MarketPlace />
            </ThemeContextProvider>
          </QueryClientProvider>
        </I18nextProvider>
      </MemoryRouter>,
    );
  });

  expect(screen.getByText(MarketPlaceRoute)).toBeInTheDocument();
});
