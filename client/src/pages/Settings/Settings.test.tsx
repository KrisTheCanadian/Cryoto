import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';
import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {I18nextProvider} from 'react-i18next';
import {MemoryRouter} from 'react-router-dom';
import {QueryClient, QueryClientProvider} from 'react-query';

import Settings from './Settings';

import i18n from '@/i18n/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
    },
  },
});

it('Should render settings in English', async () => {
  const settingsRoute = 'Settings Route';
  const SelectLanguageEn = 'Select Language';

  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <ThemeContextProvider>
              <Settings />
            </ThemeContextProvider>
          </I18nextProvider>
        </QueryClientProvider>
      </MemoryRouter>,
    );
  });

  expect(screen.getByText(settingsRoute)).toBeInTheDocument();
  expect(screen.getByText(SelectLanguageEn)).toBeInTheDocument();
  expect(screen.getByTestId('language-selector')).toBeInTheDocument();
});
