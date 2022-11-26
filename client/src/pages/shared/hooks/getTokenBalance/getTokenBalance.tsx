import axios from 'axios';

import {apiRouteCryptoGetTokenBalance} from '../../../../data/api/routes';

import {getAccessToken} from '@/data/api/helpers';

async function getTokenBalance(walletType = 'toSpend') {
  const accessToken = await getAccessToken();
  if (accessToken == null) {
    return null;
  }
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  // convert fetch to axios for consistency
  const res = await axios.get(apiRouteCryptoGetTokenBalance, {
    params: {
      walletType,
    },
    headers: {
      Authorization: bearer,
    },
  });
  return res.data;
}
export default getTokenBalance;
