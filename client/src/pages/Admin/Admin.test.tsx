import {MockAppProviders} from '@shared/testing/mocks';
import {act, render, screen} from '@testing-library/react';

import Admin from './Admin';

jest.mock('react-query', () => {
  return {
    useQuery: jest.fn(() => {
      return {
        invalidateQueries: jest.fn(),
      };
    }),
    useMutation: jest.fn(() => {
      return {
        mutate: jest.fn(),
      };
    }),
  };
});

describe('Admin component', () => {
  it('renders the page title', async () => {
    await act(async () => {
      render(
        <MockAppProviders>
          <Admin />
        </MockAppProviders>,
      );
    });
    const pageTitle = screen.getByText('Admin Dashboard');
    expect(pageTitle).toBeInTheDocument();
  });

  it('renders the user table', async () => {
    await act(async () => {
      render(
        <MockAppProviders>
          <Admin />
        </MockAppProviders>,
      );
    });

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });
});
