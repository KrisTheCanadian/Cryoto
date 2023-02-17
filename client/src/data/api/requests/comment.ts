import axios, {AxiosError} from 'axios';

import {getAccessToken} from '../helpers';
import {IPost} from '../types';
import {apiEndpoint, apiRouteCommentsDelete} from '../routes';

async function deleteComment(commentId: string): Promise<IPost | AxiosError> {
  const accessToken = await getAccessToken();
  const url = `${apiRouteCommentsDelete}/${commentId}`;

  const response = await axios.delete<IPost>(url, {
    // add CORS headers to request
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'Access-Control-Allow-Origin': `${apiEndpoint}`,
    },
  });

  return response.data;
}

export {deleteComment};
