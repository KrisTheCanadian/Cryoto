import {MockAppProviders} from '@shared/testing/mocks';
import {act, render, screen} from '@testing-library/react';

import ProfileMenu from './ProfileMenu';

test('Should display menu when clicked', () => {
  render(
    <MockAppProviders>
      <ProfileMenu />
    </MockAppProviders>,
  );
  const profileButton = screen.getByRole('button');
  act(() => {
    profileButton.click();
  });
  expect(screen.getByText('Logout')).toBeVisible();
});
