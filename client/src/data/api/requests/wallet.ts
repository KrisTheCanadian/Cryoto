import axios from 'axios';

import IWalletsBalance from '../types/IWalletsBalance';
import {getAccessToken} from '../helpers';
import {
  apiEndpoint,
  apiRouteCryptoSelfTransferTokens,
  apiRouteCryptoGetTokenBalance,
} from '../routes';

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

async function getTokenBalance(): Promise<IWalletsBalance> {
  const accessToken = await getAccessToken();

  // convert fetch to axios for consistency
  const response = await axios.get<IWalletsBalance>(
    apiRouteCryptoGetTokenBalance,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Access-Control-Allow-Origin': `${apiEndpoint}`,
      },
    },
  );
  return response.data;
}

export {selfTransferTokens, getTokenBalance};
