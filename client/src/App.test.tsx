import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {MemoryRouter} from 'react-router-dom';

import App from './App';

it('should load Main Page at /', async () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );
  const homeLink = screen.getByText('Home').closest('a');

  expect(homeLink).toHaveClass('Mui-selected');
});

it('should load wallet at /wallet', async () => {
  render(
    <MemoryRouter initialEntries={['/wallet']}>
      <App />
    </MemoryRouter>,
  );
  const homeLink = screen.getByText('Wallet').closest('a');

  expect(homeLink).toHaveClass('Mui-selected');
});

it('dark mode toggle should work', () => {
  render(
    <MemoryRouter initialEntries={['/wallet']}>
      <App />
    </MemoryRouter>,
  );
  const darkModeSwitch = screen.getByTestId('dark-mode-toggle');
  const bodyElement = darkModeSwitch.closest('header');
  const body = document.getElementsByTagName('body')[0];

  act(() => {
    darkModeSwitch.click();
  });

  expect(body).toHaveStyle('background-color: rgb(18, 18, 18)');
});
