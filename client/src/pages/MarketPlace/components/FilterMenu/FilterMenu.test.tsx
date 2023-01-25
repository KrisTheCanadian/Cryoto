import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {MockAppProviders} from '@shared/testing/mocks';
import {MarketplaceProvider} from '@shared/hooks/MarketplaceContext';

import FilterMenu from './FilterMenu';

jest.mock('react-query', () => {
  return {
    useQuery: jest.fn(() => {
      return {
        invalidateQueries: jest.fn(),
      };
    }),
  };
});

describe('Filter Menu', () => {
  it('Renders the right sections and child components', async () => {
    const Filter = 'Filter';
    const Type = 'Type';
    const Brand = 'Brand';
    const Price = 'Price';
    await act(async () => {
      render(
        <MockAppProviders>
          <MarketplaceProvider>
            <FilterMenu />
          </MarketplaceProvider>
        </MockAppProviders>,
      );
    });
    expect(screen.getAllByText(Filter)[0]).toBeInTheDocument();
    expect(screen.getByText(Type)).toBeInTheDocument();
    expect(screen.getByText(Brand)).toBeInTheDocument();
    expect(screen.getByText(Price)).toBeInTheDocument();
  });
  it('Should open dialog when price button is clicked', async () => {
    const priceOption = 'Under 150 coins';

    await act(() => {
      render(
        <MockAppProviders>
          <MarketplaceProvider>
            <FilterMenu />
          </MarketplaceProvider>
        </MockAppProviders>,
      );
    });
    const priceButton = screen.getByTestId('price-button');

    act(() => {
      priceButton.click();
    });

    expect(screen.getByText(priceOption)).toBeInTheDocument();
  });
});
