import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {MockAppProviders} from '@shared/testing/mocks';

import NewPost from '../NewPost';

describe('Search functionality', () => {
  it('Should open the search box when search feild is focused', async () => {
    await act(async () => {
      render(
        <MockAppProviders>
          <NewPost addPost={jest.fn()} />
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
