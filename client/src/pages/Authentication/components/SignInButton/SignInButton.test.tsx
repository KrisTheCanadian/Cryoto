import {render, screen} from '@testing-library/react';
import i18n from 'i18n/i18n';
import {I18nextProvider} from 'react-i18next';
import {MemoryRouter} from 'react-router-dom';

import SignInButton from './SignInButton';

it('Sign in button should render', async () => {
  render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <SignInButton />
      </MemoryRouter>
    </I18nextProvider>,
  );
  expect(screen.getByText('Sign In')).toBeInTheDocument();
});
