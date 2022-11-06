/* eslint-disable react/no-children-prop */
import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';
import {render, screen} from '@testing-library/react';
import i18n from 'i18n/i18n';
import {act} from 'react-dom/test-utils';
import {I18nextProvider} from 'react-i18next';
import {QueryClient, QueryClientProvider} from 'react-query';
import {MemoryRouter} from 'react-router-dom';

import RightBar from './RightBar';

it('Render Right Bar', async () => {
  const children = 'children';
  const component: React.ReactElement = (
    <I18nextProvider i18n={i18n}>
      <ThemeContextProvider>
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter>
            <RightBar children={children} />
          </MemoryRouter>
        </QueryClientProvider>
      </ThemeContextProvider>
    </I18nextProvider>
  );

  await act(async () => {
    render(component);
  });

  expect(screen.queryByText(children)).toBeInTheDocument();
});
