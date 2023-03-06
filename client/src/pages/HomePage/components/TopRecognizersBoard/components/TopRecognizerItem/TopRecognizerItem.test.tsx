import {MockAppProviders} from '@shared/testing/mocks';
import {render, screen} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from 'react-query';

import TopRecognizerItem from './TopRecognizerItem';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
    },
  },
});

interface TopRecognizerItemProps {
  oId: string;
  name: string;
  businessTitle: string | undefined;
  count: number;
  position: number;
}

const mockProps: TopRecognizerItemProps = {
  oId: '12345',
  name: 'John Doe',
  businessTitle: 'Developer',
  count: 5,
  position: 1,
};

// Render the component with mock context values and a router
function renderTopRecognizerItem() {
  render(
    <MockAppProviders>
      <QueryClientProvider client={queryClient}>
        <TopRecognizerItem {...mockProps} />
      </QueryClientProvider>
    </MockAppProviders>,
  );
}

jest.mock('@shared/utils/colorUtils', () => ({
  stringAvatar: jest.fn(() => ({'data-testid': 'string-avatar'})),
}));

describe('TopRecognizerItem', () => {
  it('should render with correct props', () => {
    renderTopRecognizerItem();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should render avatar with string avatar', async () => {
    renderTopRecognizerItem();
    await screen.findByTestId('string-avatar');
    expect(screen.getByTestId('string-avatar')).toBeInTheDocument();
  });
});
