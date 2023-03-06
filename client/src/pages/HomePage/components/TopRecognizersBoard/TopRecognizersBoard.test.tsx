import {act, render, screen} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from 'react-query';
import {MockAppProviders} from '@shared/testing/mocks';

import TopRecognizersBoard from './TopRecognizersBoard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
    },
  },
});

describe('TopRecognizerBoard', () => {
  it('renders the TopRecognizerBoard component', async () => {
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MockAppProviders>
            <TopRecognizersBoard />
          </MockAppProviders>
        </QueryClientProvider>,
      );
    });

    const title = screen.getByText('Top Recognizers of the Month');
    expect(title).toBeInTheDocument();
  });
});
