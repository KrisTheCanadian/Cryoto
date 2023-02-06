import axios from 'axios';

import {
  apiEndpoint,
  apiRouteTransactionsGetTransactionsByReceiverOId,
  apiRouteTransactionsGetTransactionsBySenderOId,
} from '../routes';
import {getAccessToken, getUserId} from '../helpers';
import ITransaction from '../types/ITransaction';

async function getTransactions(): Promise<ITransaction[]> {
  const userId = await getUserId();
  const accessToken = await getAccessToken();

  const sender_url = `${apiRouteTransactionsGetTransactionsBySenderOId}?senderOId=${userId}`;

  const sender_response = await axios.get<ITransaction[]>(sender_url, {
    // add CORS headers to request
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Access-Control-Allow-Origin': `${apiEndpoint}`,
    },
  });

  const receiver_url = `${apiRouteTransactionsGetTransactionsByReceiverOId}?receiverOId=${userId}`;

  const receiver_response = await axios.get<ITransaction[]>(receiver_url, {
    // add CORS headers to request
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Access-Control-Allow-Origin': `${apiEndpoint}`,
    },
  });

  const response: ITransaction[] = sender_response.data.concat(
    receiver_response.data,
  );

  return response;
}

export default getTransactions;
