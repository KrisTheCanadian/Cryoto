import {render, screen} from '@testing-library/react';
import i18n from 'i18n/i18n';
import {act} from 'react-dom/test-utils';
import {I18nextProvider} from 'react-i18next';
import {MemoryRouter} from 'react-router-dom';

// eslint-disable-next-line @shopify/images-no-direct-imports
import recognitionImage from '../../assets/LandingPageImages/1.svg';
// eslint-disable-next-line @shopify/images-no-direct-imports
import celebrationImage from '../../assets/LandingPageImages/2.svg';
// eslint-disable-next-line @shopify/images-no-direct-imports
import cryptoImage from '../../assets/LandingPageImages/3.svg';

import LandingPage from './LandingPage';

it('Landing page renders', async () => {
  const SignIn = 'Sign In';

  // mock image imports
  jest.mock('../../assets/LandingPageImages/1.svg', () => 'recognitionImage');
  jest.mock('../../assets/LandingPageImages/2.svg', () => 'celebrationImage');
  jest.mock('../../assets/LandingPageImages/3.svg', () => 'cryptoImage');

  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <I18nextProvider i18n={i18n}>
          <LandingPage />
        </I18nextProvider>
      </MemoryRouter>,
    );
  });

  expect(screen.getByText(SignIn)).toBeInTheDocument();
});
