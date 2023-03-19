import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {MockAppProviders} from '@shared/testing/mocks';

import TransactionTable from './TransactionTable';

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

const Transaction = 'Transaction';
const Date = 'Date';
const Wallet = 'Wallet';
const Amount = 'Amount';

describe('Transaction Table', () => {
  it('Renders the right columns', async () => {
    await act(async () => {
      render(
        <MockAppProviders>
          <TransactionTable />
        </MockAppProviders>,
      );
    });

    expect(screen.getByText(Transaction)).toBeInTheDocument();
    expect(screen.getByText(Date)).toBeInTheDocument();
    expect(screen.getByText(Wallet)).toBeInTheDocument();
    expect(screen.getByText(Amount)).toBeInTheDocument();
  });
});
