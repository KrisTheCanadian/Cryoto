import {MockAppProviders} from '@shared/testing/mocks';
import {act, render, screen} from '@testing-library/react';

import ProfileMenu from './ProfileMenu';

it('Should display menu when clicked', async () => {
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

it('dark mode toggle should work', async () => {
  await act(async () => {
    const profileMenu = render(
      <MockAppProviders>
        <ProfileMenu />
      </MockAppProviders>,
    );
  });
  const profileButton = screen.getByRole('button');

  act(() => {
    profileButton.click();
  });

  const darkModeSwitch = screen.getByTestId('dark-mode-toggle');

  act(() => {
    darkModeSwitch.click();
  });
  const brightnessIcon = screen.getByTestId('Brightness7Icon');
  expect(brightnessIcon).toBeTruthy();
});
