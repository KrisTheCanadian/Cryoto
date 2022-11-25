import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {MockAppProviders} from '@shared/testing/mocks';

import NewPostDialog from './NewPostDialog';

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

describe('Form Validation', () => {
  it('Should display validation text when submit empty form', async () => {
    await act(async () => {
      render(
        <MockAppProviders>
          <NewPostDialog
            dialogOpen
            setDialogOpen={function (dialogOpen: boolean): void {
              throw new Error('Function not implemented.');
            }}
          />
        </MockAppProviders>,
      );
    });
    const newPostField = screen.getByText('Post');

    act(() => {
      newPostField.click();
    });

    expect(
      screen.getByText('Please select at least one recipient'),
    ).toBeVisible();
  });
});
