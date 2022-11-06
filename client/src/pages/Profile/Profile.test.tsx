import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';
import {render, screen} from '@testing-library/react';
import i18n from 'i18n/i18n';
import {act} from 'react-dom/test-utils';
import {I18nextProvider} from 'react-i18next';
import {MemoryRouter} from 'react-router-dom';

import Profile from './Profile';

it('Profile page renders', async () => {
  const ProfileRoute = 'Profile Route';

  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <I18nextProvider i18n={i18n}>
          <ThemeContextProvider>
            <Profile />
          </ThemeContextProvider>
        </I18nextProvider>
      </MemoryRouter>,
    );
  });

  expect(screen.getByText(ProfileRoute)).toBeInTheDocument();
});
