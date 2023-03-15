import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {MockAppProviders} from '@shared/testing/mocks';

import {EditUserRolesModal} from './EditUserRolesModal';

import IUserRoles from '@/data/api/types/IUserRoles';

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

const johnDoeRegex = /John\sDoe/;

describe('EditUserModal', () => {
  it('Renders the Edit User Modal for the selected user', async () => {
    const selectedUser: IUserRoles = {
      oId: '123456',
      name: 'John Doe',
      roles: ['Manager', 'Developer'],
    };

    await act(async () => {
      render(
        <MockAppProviders>
          <EditUserRolesModal
            handleClose={function (): void {
              throw new Error('Function not implemented.');
            }}
            selectedUser={selectedUser}
            retrieveUsers={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
        </MockAppProviders>,
      );
    });

    expect(screen.getByText(johnDoeRegex)).toBeInTheDocument();
  });
});
