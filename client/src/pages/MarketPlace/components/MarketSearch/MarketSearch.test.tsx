import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {MockAppProviders} from '@shared/testing/mocks';
import {MarketplaceProvider} from '@shared/hooks/MarketplaceContext';

import MarketSearch from './MarketSearch';

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

describe('Search MarketPlace', () => {
  it('Renders the right sections', async () => {
    await act(async () => {
      render(
        <MockAppProviders>
          <MarketplaceProvider>
            <MarketSearch />
          </MarketplaceProvider>
        </MockAppProviders>,
      );
    });
    expect(
      screen.queryByPlaceholderText(/Search Marketplace/i),
    ).toBeInTheDocument();
  });
});
