/* eslint-disable react/no-array-index-key */
import {useCallback, useEffect, useRef, useState} from 'react';
import {useInfiniteQuery} from 'react-query';
import Box from '@mui/material/Box';
import {useAlertContext} from '@shared/hooks/Alerts';
import {useMsal} from '@azure/msal-react';
import {useTranslation} from 'react-i18next';
import moment from 'moment';

import {IPage, IPost} from '@/data/api/types';
import {Post} from '@/pages/HomePage/components';

interface PostsFeedProps {
  queryKey: string[];
  getNextPage: (
    page: number,
    postsPerLoad: number,
    userId: string,
  ) => Promise<IPage>;
  userId: string;
}

function PostsFeed(props: PostsFeedProps) {
  const {queryKey, getNextPage, userId} = props;
  const {accounts} = useMsal();
  const dispatchAlert = useAlertContext();
  const [postsPerLoad, setPostsPerLoad] = useState(10);
  const {t, i18n} = useTranslation();
  const loader = useRef();
  const [bottom, setBottom] = useState(false);

  // setup query
  const {data, status, fetchNextPage, hasNextPage, isFetchingNextPage} =
    useInfiniteQuery<IPage, Error>(
      queryKey,
      ({pageParam = 1}) => getNextPage(pageParam, postsPerLoad, userId),
      {
        getNextPageParam: (page) => {
          return page.page === page.totalPages ? undefined : page.page + 1;
        },
      },
    );

  // handle infinite scroll based on intersection observer
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

  useEffect(() => {
    const lang = i18n.language.substring(0, 2);
    moment.locale(lang);
  }, [i18n.language]);

  // handle errors
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
              imageUrl=""
              id=""
              hearts={[]}
              claps={[]}
              celebrations={[]}
            />
          ),
        )}

      {status === 'success' &&
        data?.pages.map((page) =>
          page.data.map((post: IPost) => (
            <Post
              key={post?.id}
              firstName={post?.authorProfile?.name || 'Deleted Cryoto User'}
              recipient={
                post?.recipientProfiles[0]?.name || 'Deleted Cryoto User'
              }
              coinsGiven={post?.coins}
              tags={post?.tags}
              message={post?.message}
              date={post?.createdDate}
              loading={false}
              authorId={post?.authorProfile?.oId}
              imageUrl={post?.imageUrl}
              id={post?.id}
              hearts={post?.hearts || []}
              claps={post?.claps || []}
              celebrations={post?.celebrations || []}
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
              imageUrl=""
              id=""
              hearts={[]}
              claps={[]}
              celebrations={[]}
            />
          ),
        )}
    </>
  );
}

export default PostsFeed;