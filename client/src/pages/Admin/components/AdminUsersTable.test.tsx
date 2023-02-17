import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {MockAppProviders} from '@shared/testing/mocks';

import AdminUsersTable from './AdminUsersTable';

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

const userId = 'User ID';
const username = 'User Name';
const userRoles = 'User Roles';
const modify = 'Modify';

describe('AdminUsersTable', () => {
  it('Renders the right columns', async () => {
    await act(async () => {
      render(
        <MockAppProviders>
          <AdminUsersTable />
        </MockAppProviders>,
      );
    });

    expect(screen.getByText(userId)).toBeInTheDocument();
    expect(screen.getByText(username)).toBeInTheDocument();
    expect(screen.getByText(userRoles)).toBeInTheDocument();
    expect(screen.getByText(modify)).toBeInTheDocument();
  });
});
