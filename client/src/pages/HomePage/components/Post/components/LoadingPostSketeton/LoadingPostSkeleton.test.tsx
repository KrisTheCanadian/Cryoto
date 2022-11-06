import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';
import {render, screen} from '@testing-library/react';
import i18n from 'i18n/i18n';
import {act} from 'react-dom/test-utils';
import {I18nextProvider} from 'react-i18next';
import {QueryClient, QueryClientProvider} from 'react-query';
import {MemoryRouter} from 'react-router-dom';

import LoadingPostSkeleton from './LoadingPostSkeleton';

it('Render Post Skeleton', async () => {
  const component: React.ReactElement = (
    <I18nextProvider i18n={i18n}>
      <ThemeContextProvider>
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter>
            <LoadingPostSkeleton />
          </MemoryRouter>
        </QueryClientProvider>
      </ThemeContextProvider>
    </I18nextProvider>
  );

  await act(async () => {
    render(component);
  });

  expect(screen.queryByText('Cryoto')).not.toBeInTheDocument();
});
