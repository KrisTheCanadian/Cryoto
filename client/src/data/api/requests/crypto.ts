import axios from 'axios';

import {getAccessToken} from '../helpers';
import {apiEndpoint, apiRouteCryptoSelfTransferTokens} from '../routes';

async function selfTransferTokens(amount: number) {
  const accessToken = await getAccessToken();
  const url = `${apiRouteCryptoSelfTransferTokens}?amount=${amount}`;
  const response = await axios.post(url, null, {
    // add CORS headers to request
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'Access-Control-Allow-Origin': `${apiEndpoint}`,
    },
  });
  return response.data;
}
export {selfTransferTokens};
