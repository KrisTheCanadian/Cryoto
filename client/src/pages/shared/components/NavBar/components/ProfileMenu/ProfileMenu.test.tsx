import {MockAppProviders} from '@shared/testing/mocks';
import {act, render, screen} from '@testing-library/react';

import ProfileMenu from './ProfileMenu';

test('Should display menu when clicked', async () => {
  await act(async () => {
    render(
      <MockAppProviders>
        <ProfileMenu />
      </MockAppProviders>,
    );
  });
  const profileButton = screen.getByRole('button');
  await act(async () => {
    profileButton.click();
  });
  expect(screen.getByText('Logout')).toBeVisible();
});
