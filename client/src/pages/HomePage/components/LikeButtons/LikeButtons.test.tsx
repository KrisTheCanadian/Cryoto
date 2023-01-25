import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';
import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {I18nextProvider} from 'react-i18next';
import {MemoryRouter} from 'react-router-dom';

import LikeButtons from './LikeButtons';

import i18n from '@/i18n/i18n';

it('Render homepage', async () => {
  const intersectionObserverMock = () => ({
    observe: () => null,
    unobserve: (el: any) => null,
  });
  window.IntersectionObserver = jest
    .fn()
    .mockImplementation(intersectionObserverMock);
  await act(() => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <ThemeContextProvider>
            <LikeButtons id="" hearts={[]} claps={[]} celebrations={[]} />
          </ThemeContextProvider>
        </MemoryRouter>
      </I18nextProvider>,
    );
  });
  expect(screen.getByText('React')).toBeInTheDocument();
});
