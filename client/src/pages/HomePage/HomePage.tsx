/* eslint-disable react/no-array-index-key */
/* eslint-disable @shopify/jsx-no-hardcoded-content */

import {Alert, Box} from '@mui/material';
import {MiddleColumn} from '@shared/components/MiddleColumn';
import PageFrame from '@shared/components/PageFrame';
import {RightBar} from '@shared/components/RightBar';
import IPage from 'data/api/types/IPage';
import IPost from 'data/api/types/IPost';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useInfiniteQuery} from 'react-query';
import {useMsal} from '@azure/msal-react';

import {getNextPage} from '../../data/api/requests/posts';

import {Post} from './components';

function HomePage() {
  const {instance, accounts} = useMsal();
  const [postsPerLoad, setPostsPerLoad] = useState(10);
  const loader = useRef();

  const {data, status, fetchNextPage, hasNextPage, isFetchingNextPage} =
    useInfiniteQuery<IPage<IPost[]>, Error>(
      ['Posts'],
      ({pageParam = 1}) =>
        getNextPage(pageParam, postsPerLoad, accounts, instance),
      {
        getNextPageParam: (page) => {
          return page.page === page.totalPages ? undefined : page.page + 1;
        },
      },
    );

  const handleObserver = useCallback(
    (entries: any[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage],
  );

  useEffect(() => {
    const divElement = loader.current;
    const option = {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (divElement) observer.observe(divElement);
    return () => {
      if (divElement) observer.unobserve(divElement);
    };
  }, [loader, handleObserver, hasNextPage]);

  const rightBarContent = 'Right bar content';
  return (
    <PageFrame>
      <MiddleColumn>
        {status === 'error' && (
          <Alert key="connection error" severity="error">
            Unable to connect to back-end service.
          </Alert>
        )}
        {status === 'loading' &&
          Array.from(Array(12)).map(
            (_: any, index: React.Key | null | undefined) => (
              <Post
                key={`Skeleton-Card:${index}`}
                firstName=""
                recipient=""
                coinsGiven={0}
                tags={['']}
                message=""
                date=""
                loading
              />
            ),
          )}
        <>
          {status === 'success' &&
            data?.pages.map((page) =>
              page.data.map((post: IPost) => (
                <Post
                  key={post.id}
                  firstName={post.authorProfile.name}
                  recipient={post.recipientProfiles[0].name}
                  coinsGiven={post.coins}
                  tags={post.tags}
                  message={post.message}
                  date={post.createdDate}
                  loading={false}
                />
              )),
            )}
        </>
        <Box
          ref={loader}
          id="loader"
          sx={{display: `${hasNextPage ? 'hidden' : ''}`}}
        />
        {isFetchingNextPage &&
          Array.from(Array(1)).map(
            (_: any, index: React.Key | null | undefined) => (
              <Post
                key={`Skeleton-Card:${index}`}
                firstName=""
                recipient=""
                coinsGiven={0}
                tags={['']}
                message=""
                date=""
                loading
              />
            ),
          )}
        {!isFetchingNextPage && !hasNextPage && (
          <Box>
            <Alert key="no more posts" severity="info">
              No more posts to show!
            </Alert>
          </Box>
        )}
      </MiddleColumn>
      <RightBar>{rightBarContent}</RightBar>
    </PageFrame>
  );
}

export default HomePage;
