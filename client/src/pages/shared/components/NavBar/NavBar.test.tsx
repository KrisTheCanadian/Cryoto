import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {MockAppProviders} from '@shared/testing/mocks';

import NavBar from './NavBar';

const toggleColorMode = jest.fn;

describe('Search functionality', () => {
  it('Should open the search box when search feild is focused', async () => {
    render(
      <MockAppProviders>
        <NavBar toggleColorMode={toggleColorMode} />
      </MockAppProviders>,
    );
    const searchInput = screen.getByPlaceholderText('Search');

    act(() => {
      searchInput.focus();
    });

    expect(screen.getByTestId('search-results')).toBeVisible();
  });

  it('Should close the search box when search feild is blurred', async () => {
    render(
      <MockAppProviders>
        <NavBar toggleColorMode={toggleColorMode} />
      </MockAppProviders>,
    );
    const searchInput = screen.getByPlaceholderText('Search');

    act(() => {
      searchInput.focus();
      searchInput.blur();
    });

    expect(screen.getByTestId('search-results')).not.toBeVisible();
  });
});
