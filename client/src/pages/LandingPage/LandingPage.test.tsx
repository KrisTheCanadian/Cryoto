import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {I18nextProvider} from 'react-i18next';
import {MemoryRouter} from 'react-router-dom';
import {ThemeProvider} from '@mui/styles';

import LandingPage from './LandingPage';

import i18n from '@/i18n/i18n';

jest.mock('../../theme', () => ({
  margin: {
    medium: 16,
  },
}));

it('Landing page renders', async () => {
  const SignIn = 'Sign In';

  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider theme={{margin: {medium: 16}}}>
            <LandingPage />
          </ThemeProvider>
        </I18nextProvider>
      </MemoryRouter>,
    );
  });

  expect(screen.getByText(SignIn)).toBeInTheDocument();
});
