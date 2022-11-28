import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {QueryClient, QueryClientProvider} from 'react-query';
import {MemoryRouter} from 'react-router-dom';
import {I18nextProvider} from 'react-i18next';
import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';

import Wallet from './Wallet';

import i18n from '@/i18n/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
    },
  },
});

describe('Wallet Page', () => {
  it('Render Wallet Page and Child Componetns', async () => {
    const transactionTable = 'Transaction History';
    const creditCard = 'Balance';

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
                <Wallet />
              </ThemeContextProvider>
            </QueryClientProvider>
          </MemoryRouter>
        </I18nextProvider>,
      );
    });
    expect(screen.getByText(transactionTable)).toBeInTheDocument();
    expect(screen.getByText(creditCard)).toBeInTheDocument();
  });

  it('Should open dialog when icon button is clicked', async () => {
    const title = 'Transfer Coins';

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
                <Wallet />
              </ThemeContextProvider>
            </QueryClientProvider>
          </MemoryRouter>
        </I18nextProvider>,
      );
    });
    const transferButton = screen.getByTestId('self-transfer-button');

    act(() => {
      transferButton.click();
    });

    expect(screen.getByText(title)).toBeInTheDocument();
  });
});
