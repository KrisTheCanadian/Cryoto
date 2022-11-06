import {render, screen} from '@testing-library/react';
import i18n from 'i18n/i18n';
import {I18nextProvider} from 'react-i18next';
import {MemoryRouter} from 'react-router-dom';

import ProfileContent from './ProfileContent';

it('profile content should render', async () => {
  render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <ProfileContent />
      </MemoryRouter>
    </I18nextProvider>,
  );

  expect(screen.getByText('Request Profile Information')).toBeInTheDocument();
});
