import {render, fireEvent, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {QueryClient, QueryClientProvider} from 'react-query';
import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';
import {act} from 'react-dom/test-utils';

import NewComment from './NewComment';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
    },
  },
});

describe('NewComment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const props = {
    postid: '1234',
    name: 'Test User',
    oId: '5678',
  };

  test('renders the component without errors', async () => {
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <ThemeContextProvider>
            <NewComment {...props} />
          </ThemeContextProvider>
        </QueryClientProvider>,
      );
    });
    expect(screen.getByPlaceholderText('Add a comment...')).toBeInTheDocument();
  });

  test('updates the comment message as the user types', async () => {
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <ThemeContextProvider>
            <NewComment {...props} />
          </ThemeContextProvider>
        </QueryClientProvider>,
      );
    });
    const inputElement = screen.getByPlaceholderText('Add a comment...');

    await userEvent.type(inputElement, 'Test comment message');
    expect(inputElement).toHaveValue('Test comment message');
  });

  test('calls handleCommentSubmit when user presses Enter key', async () => {
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <ThemeContextProvider>
            <NewComment {...props} />
          </ThemeContextProvider>
        </QueryClientProvider>,
      );
    });
    const inputElement = screen.getByPlaceholderText('Add a comment...');
    fireEvent.change(inputElement, {target: {value: 'test comment'}});
    fireEvent.keyDown(inputElement, {key: 'Enter', code: 'Enter'});
  });
});
