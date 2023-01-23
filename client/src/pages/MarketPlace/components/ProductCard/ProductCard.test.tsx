import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {MockAppProviders} from '@shared/testing/mocks';
import {MarketplaceProvider} from '@shared/hooks/MarketplaceContext';

import ProductCard from './ProductCard';

describe('Product Card', () => {
  it('Renders the right sections and child components', async () => {
    const Title = 'Test title';
    const Coins = '1000 coins';
    await act(async () => {
      render(
        <MockAppProviders>
          <MarketplaceProvider>
            <ProductCard
              id="test-id"
              image={undefined}
              title="Test title"
              points={1000}
              addToCart={undefined}
            />
          </MarketplaceProvider>
        </MockAppProviders>,
      );
    });
    expect(screen.getByText(Title)).toBeInTheDocument();
    expect(screen.getByText(Coins)).toBeInTheDocument();
  });
});
