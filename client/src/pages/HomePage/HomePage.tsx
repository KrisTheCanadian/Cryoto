/* eslint-disable react/no-array-index-key */

import {Alert, Box} from '@mui/material';
import {MiddleColumn} from '@shared/components/MiddleColumn';
import PageFrame from '@shared/components/PageFrame';
import {RightBar} from '@shared/components/RightBar';
import IPage from 'data/api/types/IPage';
import IPost from 'data/api/types/IPost';
import {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {useInfiniteQuery} from 'react-query';
import {useMsal} from '@azure/msal-react';
import AlertContext from '@shared/hooks/Alerts/AlertContext';
import {useTranslation} from 'react-i18next';

import {getNextPage} from '../../data/api/requests/posts';

import {Post} from './components';

function HomePage() {
  const {instance, accounts} = useMsal();
  const [postsPerLoad, setPostsPerLoad] = useState(10);
  const loader = useRef();
  const dispatch = useContext(AlertContext);
  const {t} = useTranslation();

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

  useEffect(() => {
    if (status === 'success' && !isFetchingNextPage && !hasNextPage) {
      dispatch.info(t('errors.NoMorePosts'));
    }
  }, [isFetchingNextPage, hasNextPage, dispatch, status, t]);

  useEffect(() => {
    if (status === 'error') {
      dispatch.error(t('errors.BackendError'));
    }
  }, [isFetchingNextPage, hasNextPage, dispatch, status, t]);

  return (
    <PageFrame>
      <MiddleColumn>
        {status === 'error' && (
          <Alert severity="error">{t('errors.BackendError')}</Alert>
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
              {t('errors.NoMorePosts')}
            </Alert>
          </Box>
        )}
      </MiddleColumn>
      <RightBar>{rightBarContent}</RightBar>
    </PageFrame>
  );
}

export default HomePage;
