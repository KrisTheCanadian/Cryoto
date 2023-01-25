import {ThemeContextProvider} from '@shared/hooks/ThemeContextProvider';
import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';
import {I18nextProvider} from 'react-i18next';
import {MemoryRouter} from 'react-router-dom';

import Post from './Post';

import i18n from '@/i18n/i18n';

it('should render Posts', async () => {
  interface PostProps {
    firstName: string;
    date: string;
    imageURL?: string;
    recipient: string;
    message: string;
    coinsGiven: number;
    tags?: string[];
    loading: boolean;
    authorId: string;
  }

  const postProps: PostProps = {
    firstName: 'test first name',
    date: 'today',
    imageURL: '',
    recipient: 'test recipient',
    message: 'message',
    coinsGiven: 100,
    tags: [],
    loading: false,
    authorId: 'authorId',
  };

  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <I18nextProvider i18n={i18n}>
          <ThemeContextProvider>
            <Post
              id=""
              hearts={[]}
              claps={[]}
              celebrations={[]}
              {...postProps}
            />
          </ThemeContextProvider>
        </I18nextProvider>
      </MemoryRouter>,
    );
  });

  expect(screen.getByText(postProps.firstName)).toBeInTheDocument();
  expect(screen.getByText(postProps.recipient)).toBeInTheDocument();
  expect(screen.getByText(postProps.message)).toBeInTheDocument();
});