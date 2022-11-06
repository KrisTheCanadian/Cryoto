import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';
import {render, screen} from '@testing-library/react';
import i18n from 'i18n/i18n';
import {act} from 'react-dom/test-utils';
import {I18nextProvider} from 'react-i18next';
import {QueryClient, QueryClientProvider} from 'react-query';
import {MemoryRouter} from 'react-router-dom';

import HomePage from './HomePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
    },
  },
});

it('Render homepage', async () => {
  const title = 'Cryoto';

  const intersectionObserverMock = () => ({
    observe: () => null,
    unobserve: (el: any) => null,
  });
  window.IntersectionObserver = jest
    .fn()
    .mockImplementation(intersectionObserverMock);
  await act(() => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <ThemeContextProvider>
              <HomePage />
            </ThemeContextProvider>
          </QueryClientProvider>
        </MemoryRouter>
      </I18nextProvider>,
    );
  });
  expect(screen.getByText(title)).toBeInTheDocument();
});
