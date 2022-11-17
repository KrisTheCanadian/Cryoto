import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';
import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {I18nextProvider} from 'react-i18next';
import {MemoryRouter} from 'react-router-dom';

import Orders from './Orders';

import i18n from '@/i18n/i18n';

it('Orders page renders', async () => {
  const OrdersRoute = 'Orders Route';

  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <I18nextProvider i18n={i18n}>
          <ThemeContextProvider>
            <Orders />
          </ThemeContextProvider>
        </I18nextProvider>
      </MemoryRouter>,
    );
  });

  expect(screen.getByText(OrdersRoute)).toBeInTheDocument();
});
