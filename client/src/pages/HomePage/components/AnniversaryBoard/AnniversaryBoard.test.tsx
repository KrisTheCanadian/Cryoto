import {render, screen} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from 'react-query';
import {MockAppProviders} from '@shared/testing/mocks';

import AnniversaryBoard from './AnniversaryBoard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
    },
  },
});

describe('AnniversaryBoard', () => {
  it('renders without errors', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MockAppProviders>
          <AnniversaryBoard />
        </MockAppProviders>
      </QueryClientProvider>,
    );

    expect(screen.getByText('Celebrations')).toBeInTheDocument();
  });
});
