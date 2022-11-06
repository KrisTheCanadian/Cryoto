import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {MemoryRouter} from 'react-router-dom';
import {I18nextProvider} from 'react-i18next';
import AlertSystem from '@shared/hooks/Alerts/AlertSystem';
import {StyleGuide} from 'pages/StyleGuide';
import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';

import i18n from './i18n/i18n';
import App from './App';

const SignIn = 'Sign In';

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
  expect(screen.queryByText(SignIn)).toBeInTheDocument();
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

it('should load styleguide at /style-guide', async () => {
  render(
    <I18nextProvider i18n={i18n}>
      <ThemeContextProvider>
        <MemoryRouter initialEntries={['/style-guide']}>
          <StyleGuide />
        </MemoryRouter>
      </ThemeContextProvider>
    </I18nextProvider>,
  );

  expect(screen.getByText('Style Guide')).toBeInTheDocument();
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
