import {useMutation, useQueryClient} from 'react-query';
import {useMsal} from '@azure/msal-react';
import {useAlertContext} from '@shared/hooks/Alerts';

import {INewPost} from '@/data/api/types/INewPost';
import IPost from '@/data/api/types/IPost';
import IPages from '@/data/api/types/IPages';
import {createPost} from '@/data/api/requests/posts';

const postsQuery = ['posts-query'];
const transactionsQuery = ['transactions'];
const walletsBalanceQuery = ['walletsBalance'];

interface Recipient {
  name: string;
  id: string;
}
const tempUserFields = {
  email: '',
  language: '',
  roles: [],
  businessTitle: '',
  city: '',
  timeZone: '',
  managerReference: '',
  startDate: '',
  birthday: '',
  recognitionsReceived: 0,
  recognitionsSent: 0,
};

export const useMutationCreatePost = (
  recipients: Recipient[],
  queryKey: string[],
) => {
  const {accounts} = useMsal();
  const queryClient = useQueryClient();
  const dispatchAlert = useAlertContext();

  const mutation = useMutation((post: INewPost) => createPost(post), {
    // When mutate is called:
    onMutate: async (post: INewPost) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(queryKey);
      // convert post to real post
      const newPost: IPost = {
        ...post,
        createdDate: post.createdDate.toISOString(),
        id: `temp-id-${Date.now()}`,
        author: '',
        imageUrl: post.imageUrl,
        authorProfile: {
          name: accounts[0].name || '',
          oId: accounts[0].idTokenClaims?.oid || '',
          ...tempUserFields,
        },
        recipientProfiles: post.tempRecipients.map((recipient) => {
          return {
            oId: recipient.id,
            name: recipient.name,
            ...tempUserFields,
          };
        }),
        hearts: [],
        claps: [],
        celebrations: [],
        commentIds: [],
        comments: [],
      };

      // Snapshot the previous value
      const prevData = queryClient.getQueryData(queryKey) as IPages;

      // Optimistically update to the new value
      if (prevData) {
        queryClient.setQueryData(queryKey, {
          ...prevData,
          pages: [
            {...prevData.pages[0], data: [newPost, ...prevData.pages[0].data]},
            ...prevData.pages,
          ],
        });
      }

      return {prevData};
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err: any, variables, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(queryKey, context.prevData);
        dispatchAlert.error(err.response.data);
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(queryKey);
      if (queryKey[0] !== 'posts-query') {
        queryClient.invalidateQueries(postsQuery);
      }
      queryClient.invalidateQueries(transactionsQuery);
      queryClient.invalidateQueries(walletsBalanceQuery);
    },
  });
  return mutation;
};
