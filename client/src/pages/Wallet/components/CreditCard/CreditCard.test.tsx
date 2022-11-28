import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {MockAppProviders} from '@shared/testing/mocks';

import CreditCard from './CreditCard';

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
const Balance = 'Balance';
const ToAward = 'To Award';
const ToSpend = 'To Spend';

describe('Credit Card', () => {
  it('Renders the right sections', async () => {
    await act(async () => {
      render(
        <MockAppProviders>
          <CreditCard />
        </MockAppProviders>,
      );
    });

    expect(screen.getByText(Balance)).toBeInTheDocument();
    expect(screen.getByText(ToAward)).toBeInTheDocument();
    expect(screen.getByText(ToSpend)).toBeInTheDocument();
  });
});
