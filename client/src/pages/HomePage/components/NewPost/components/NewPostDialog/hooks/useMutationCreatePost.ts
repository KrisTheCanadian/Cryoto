import {useMutation, useQueryClient} from 'react-query';
import {useMsal} from '@azure/msal-react';
import {useAlertContext} from '@shared/hooks/Alerts';

import {INewPost} from '@/data/api/types/INewPost';
import IPost from '@/data/api/types/IPost';
import IPages from '@/data/api/types/IPages';
import {createPost} from '@/data/api/requests/posts';

const postsQuery = ['posts-query'];
const transactionsQuery = ['transactions'];

interface Recipient {
  name: string;
  id: string;
}

export const useMutationCreatePost = (recipients: Recipient[]) => {
  const {accounts} = useMsal();
  const queryClient = useQueryClient();
  const dispatchAlert = useAlertContext();

  const mutation = useMutation((post: INewPost) => createPost(post), {
    // When mutate is called:
    onMutate: async (post: INewPost) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(postsQuery);
      // convert post to real post
      const newPost: IPost = {
        ...post,
        createdDate: post.createdDate.toISOString(),
        id: `temp-id-${Date.now()}`,
        author: '',
        authorProfile: {
          name: accounts[0].name || '',
          oId: '',
          email: '',
          language: '',
          role: [],
        },
        recipientProfiles: post.tempRecipients.map((recipient) => {
          return {
            oId: recipient.id,
            name: recipient.name,
            email: '',
            language: '',
            roles: [],
            wallets: null,
            role: [],
          };
        }),
      };

      // Snapshot the previous value
      const prevData = queryClient.getQueryData(postsQuery) as IPages;

      // Optimistically update to the new value
      if (prevData) {
        queryClient.setQueryData(postsQuery, {
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
        queryClient.setQueryData(postsQuery, context.prevData);
        dispatchAlert.error(err.response.data);
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(postsQuery);
      queryClient.invalidateQueries(transactionsQuery);
    },
  });
  return mutation;
};
