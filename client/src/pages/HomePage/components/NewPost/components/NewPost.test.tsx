import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {MockAppProviders} from '@shared/testing/mocks';

import NewPost from '../NewPost';

jest.mock('@azure/msal-react', () => {
  return {
    useMsal: jest.fn(() => {
      return {
        instance: {
          acquireTokenSilent: jest.fn(),
        },
        accounts: [
          {
            name: 'test',
            homeAccountId: 'test',
          },
        ],
        getAllAccounts: jest.fn(() => [{homeAccountId: '123'}]),
      };
    }),
  };
});
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

describe('Search functionality', () => {
  it('Should open the new post form when search field is focused', async () => {
    await act(async () => {
      render(
        <MockAppProviders>
          <NewPost name="Test Name" />
        </MockAppProviders>,
      );
    });
    const newPostField = screen.getByPlaceholderText('New Post');

    act(() => {
      newPostField.click();
    });

    expect(screen.getByTestId('new-post-dialog')).toBeVisible();
  });
});
