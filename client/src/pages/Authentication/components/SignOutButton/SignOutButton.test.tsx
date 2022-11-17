import {render, screen} from '@testing-library/react';
import {I18nextProvider} from 'react-i18next';
import {MemoryRouter} from 'react-router-dom';

import SignOutButton from './SignOutButton';

import i18n from '@/i18n/i18n';

it('Sign out button should render', async () => {
  render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <SignOutButton />
      </MemoryRouter>
    </I18nextProvider>,
  );
  expect(screen.getByText('Sign out')).toBeInTheDocument();
});
