import {render, screen} from '@testing-library/react';
import {MockAppProviders} from '@shared/testing/mocks';
import {QueryClient, QueryClientProvider} from 'react-query';

import AnniversaryItem from './AnniversaryItem';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
    },
  },
});

const props = {
  oId: '1',
  name: 'John Doe',
  startDate: '2020-03-08T13:35:59.026Z',
};

function renderAnniversaryItem() {
  render(
    <MockAppProviders>
      <QueryClientProvider client={queryClient}>
        <AnniversaryItem {...props} />
      </QueryClientProvider>
    </MockAppProviders>,
  );
}

describe('AnniversaryItem', () => {
  it('renders the name and start date', () => {
    renderAnniversaryItem();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('March 8, 2023')).toBeInTheDocument();
  });

  it('renders the anniversary years as a badge', () => {
    renderAnniversaryItem();

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders the correct image', () => {
    renderAnniversaryItem();

    expect(screen.getByTestId('cardMediaPic')).toHaveAttribute(
      'src',
      'https://em-content.zobj.net/source/microsoft-teams/337/birthday-cake_1f382.png',
    );
  });
});
