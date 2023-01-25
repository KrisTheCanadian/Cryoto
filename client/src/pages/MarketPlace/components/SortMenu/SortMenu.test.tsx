import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {MockAppProviders} from '@shared/testing/mocks';
import {MarketplaceProvider} from '@shared/hooks/MarketplaceContext';

import SortMenu from './SortMenu';

jest.mock('react-query', () => {
  return {
    useQuery: jest.fn(() => {
      return {
        invalidateQueries: jest.fn(),
      };
    }),
  };
});

describe('Sort Menu', () => {
  it('Renders the right sections and child components', async () => {
    const Sort = 'Sort';
    await act(async () => {
      render(
        <MockAppProviders>
          <MarketplaceProvider>
            <SortMenu />
          </MarketplaceProvider>
        </MockAppProviders>,
      );
    });
    expect(screen.getAllByText(Sort)[0]).toBeInTheDocument();
  });

  it('Should open dialog when icon button is clicked', async () => {
    const priceOption = 'Price Low to High';
    const brandOption = 'Brand A to Z';

    await act(() => {
      render(
        <MockAppProviders>
          <MarketplaceProvider>
            <SortMenu />
          </MarketplaceProvider>
        </MockAppProviders>,
      );
    });
    const sortButton = screen.getByTestId('sort-button');

    act(() => {
      sortButton.click();
    });

    expect(screen.getAllByText(priceOption)[0]).toBeInTheDocument();
    expect(screen.getAllByText(brandOption)[0]).toBeInTheDocument();
  });
});
