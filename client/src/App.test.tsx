import {MockAppProviders} from '@shared/testing/mocks';
import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {MemoryRouter} from 'react-router-dom';
import {I18nextProvider} from 'react-i18next';
import AlertSystem from '@shared/hooks/Alerts/AlertSystem';

import i18n from './i18n/i18n';
import App from './App';

it('should load Main Page at /', async () => {
  const intersectionObserverMock = () => ({
    observe: () => null,
  });
  window.IntersectionObserver = jest
    .fn()
    .mockImplementation(intersectionObserverMock);

  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <I18nextProvider i18n={i18n}>
          <AlertSystem />
          <App />
        </I18nextProvider>
      </MemoryRouter>,
    );
  });
  const homeLink = screen.getByText('Home').closest('a');

  expect(homeLink).toHaveClass('Mui-selected');
});

it('should load wallet at /wallet', async () => {
  render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={['/wallet']}>
        <AlertSystem />
        <App />
      </MemoryRouter>
    </I18nextProvider>,
  );
  const homeLink = screen.getByText('Wallet').closest('a');

  expect(homeLink).toHaveClass('Mui-selected');
});

it('dark mode toggle should work', () => {
  render(
    <MemoryRouter initialEntries={['/wallet']}>
      <AlertSystem />
      <App />
    </MemoryRouter>,
  );
  const darkModeSwitch = screen.getByTestId('dark-mode-toggle');
  const body = document.getElementsByTagName('body')[0];

  act(() => {
    darkModeSwitch.click();
  });

  expect(body).toHaveStyle('background-color: rgb(18, 18, 18)');
});
