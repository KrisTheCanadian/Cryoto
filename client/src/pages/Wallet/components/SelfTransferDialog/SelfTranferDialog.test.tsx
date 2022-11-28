import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {MockAppProviders} from '@shared/testing/mocks';

import SelfTransferDialog from './SelfTransferDialog';

jest.mock('react-query', () => {
  return {
    useQueryClient: jest.fn(() => {
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
const TransferCoins = 'Transfer Coins';

describe('Self Transfer Dialog', () => {
  it('Renders the right sections', async () => {
    await act(async () => {
      render(
        <MockAppProviders>
          <SelfTransferDialog
            selfTransferOpen
            setSelfTransferOpen={function (selfTransferOpen: boolean): void {
              throw new Error('Function not implemented.');
            }}
          />
        </MockAppProviders>,
      );
    });

    expect(screen.getByText(TransferCoins)).toBeInTheDocument();
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('To')).toBeInTheDocument();
  });
  it('Error message displayed', async () => {
    await act(async () => {
      render(
        <MockAppProviders>
          <SelfTransferDialog
            selfTransferOpen
            setSelfTransferOpen={function (selfTransferOpen: boolean): void {
              throw new Error('Function not implemented.');
            }}
          />
        </MockAppProviders>,
      );
    });

    const newTransfer = screen.getByText('Transfer');

    act(() => {
      newTransfer.click();
    });

    expect(screen.getByText('Please enter an amount')).toBeVisible();
  });
});
