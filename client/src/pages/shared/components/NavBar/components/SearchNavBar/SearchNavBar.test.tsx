import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MockAppProviders} from '@shared/testing/mocks';

import SearchNavBar from './SearchNavBar';

describe('SearchNavBar component', () => {
  const props = {
    searchOpen: true,
    setOpen: jest.fn(),
  };

  it('should render without errors', () => {
    render(
      <MockAppProviders>
        <SearchNavBar {...props} />
      </MockAppProviders>,
    );
    expect(screen.getByTestId('searchBox')).toBeInTheDocument();
    expect(screen.getByTestId('search-field')).toBeInTheDocument();
  });

  it('should display the "No results" message when there are no search results', async () => {
    render(
      <MockAppProviders>
        <SearchNavBar {...props} />
      </MockAppProviders>,
    );
    const searchInput = screen.getByTestId('search-field');

    userEvent.type(searchInput, 'nonexistent user');
    await waitFor(() =>
      expect(screen.getByText('No results found')).toBeInTheDocument(),
    );
  });
});
