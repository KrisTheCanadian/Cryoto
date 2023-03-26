import {render} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from 'react-query';
import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';

import CommentHolder from '.';
import IComment from '@/data/api/types/IComment';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
    },
  },
});

jest.mock('src/data/api/helpers/', () => {
  return {
    getAccessToken: jest.fn(() => {
      return 'access_token';
    }),
    getUserId: jest.fn(() => {
      return 'homeAccountId';
    }),
  };
});

describe('CommentHolder component', () => {
  it('renders the component with the correct text content', () => {
    const comment: IComment = {
      id: '1',
      message: 'Hello world',
      createdDate: new Date().toISOString(),
      imageUrl: '',
      usersWhoLiked: [],
      parentId: '',
      parentType: 'post',
      author: '123',
      replies: [],
      likes: 0,
      authorProfile: {
        oId: '123',
        name: 'John Smith',
      },
    };
    const {getByText} = render(
      <QueryClientProvider client={queryClient}>
        <ThemeContextProvider>
          <CommentHolder id="1" comment={comment} />
        </ThemeContextProvider>
      </QueryClientProvider>,
    );

    expect(getByText('John Smith')).toBeInTheDocument();
    expect(getByText('Hello world')).toBeInTheDocument();
  });
});
