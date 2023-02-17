import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {MockAppProviders} from '@shared/testing/mocks';

import {EditUserModal} from './EditUserModal';

import {IUser} from '@/data/api/types';

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
    const selectedUser: IUser = {
      oId: '123456',
      name: 'John Doe',
      email: 'johndoe@example.com',
      language: 'English',
      roles: ['Manager', 'Developer'],
      businessTitle: 'Software Engineer',
      city: 'New York',
      timeZone: 'EST',
      managerReference: '987654',
      recognitionsReceived: 0,
      recognitionsSent: 0,
      startDate: '2022-01-01',
      birthday: '1990-05-10',
    };

    await act(async () => {
      render(
        <MockAppProviders>
          <EditUserModal
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
