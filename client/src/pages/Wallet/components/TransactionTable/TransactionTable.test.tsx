import {fireEvent, render, screen} from '@testing-library/react';
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
    fireEvent.click(screen.getByText(Transaction));

    expect(screen.getByText(Date)).toBeInTheDocument();
    fireEvent.click(screen.getByText(Date));

    expect(screen.getByText(Wallet)).toBeInTheDocument();
    fireEvent.click(screen.getByText(Wallet));

    expect(screen.getByText(Amount)).toBeInTheDocument();
    fireEvent.click(screen.getByText(Amount));
  });
});
