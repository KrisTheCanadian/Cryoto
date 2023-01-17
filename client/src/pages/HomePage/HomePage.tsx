/* eslint-disable react/no-array-index-key */

import {Box} from '@mui/material';
import {MiddleColumn} from '@shared/components/MiddleColumn';
import PageFrame from '@shared/components/PageFrame';
import {RightBar} from '@shared/components/RightBar';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useInfiniteQuery} from 'react-query';
import {useMsal, AuthenticatedTemplate} from '@azure/msal-react';
import {useAlertContext} from '@shared/hooks/Alerts/AlertContext';
import {useTranslation} from 'react-i18next';
import {useLocation} from 'react-router-dom';
import moment from 'moment';

import {getNextPage} from '../../data/api/requests/posts';

import {NewPost, Post} from './components';

import IPost from '@/data/api/types/IPost';
import IPage from '@/data/api/types/IPage';

export const postsQuery = ['posts-query'];

function HomePage() {
  const {accounts} = useMsal();
  const dispatchAlert = useAlertContext();
  const location = useLocation();
  const [bottom, setBottom] = useState(false);

  useEffect(() => {
    if (location.state !== null) {
      const err = location.state.error;
      dispatchAlert.error(err);
    }
  }, [dispatchAlert, location.state]);
  const [postsPerLoad, setPostsPerLoad] = useState(10);
  const loader = useRef();

  const {t, i18n} = useTranslation();

  const {data, status, fetchNextPage, hasNextPage, isFetchingNextPage} =
    useInfiniteQuery<IPage, Error>(
      postsQuery,
      ({pageParam = 1}) => getNextPage(pageParam, postsPerLoad),
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
    const lang = i18n.language.substring(0, 2);
    moment.locale(lang);
  }, [i18n.language]);

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

  useEffect(() => {
    if (!accounts) return;
    if (bottom) return;
    if (status === 'success' && !isFetchingNextPage && !hasNextPage) {
      dispatchAlert.info(t('errors.NoMorePosts'));
      setBottom(true);
      return;
    }
    if (status === 'error') {
      dispatchAlert.error(t('errors.BackendError'));
    }
  }, [
    isFetchingNextPage,
    hasNextPage,
    dispatchAlert,
    status,
    t,
    accounts,
    bottom,
  ]);

  return (
    <>
      <AuthenticatedTemplate>
        <PageFrame>
          <MiddleColumn>
            {status === 'success' && accounts && (
              <NewPost
                name={accounts[0].name}
                oId={accounts[0].idTokenClaims?.oid}
              />
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
                    authorId=""
                  />
                ),
              )}

            {status === 'success' &&
              data?.pages.map((page) =>
                page.data.map((post: IPost) => (
                  <Post
                    key={post?.id}
                    firstName={
                      post?.authorProfile?.name || 'Deleted Cryoto User'
                    }
                    recipient={
                      post?.recipientProfiles[0]?.name || 'Deleted Cryoto User'
                    }
                    coinsGiven={post?.coins}
                    tags={post?.tags}
                    message={post?.message}
                    date={post?.createdDate}
                    loading={false}
                    authorId={post?.authorProfile?.oId}
                  />
                )),
              )}
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
                    authorId=""
                  />
                ),
              )}
          </MiddleColumn>
          <RightBar>
            <></>
          </RightBar>
        </PageFrame>
      </AuthenticatedTemplate>
    </>
  );
}

export default HomePage;
