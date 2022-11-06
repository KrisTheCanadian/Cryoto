import {apiRouteCryptoGetTokenBalance} from '../../../../data/api/routes';

async function getTokenBalance(walletType = 'toSpend', accessToken: any) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers,
  };
  return fetch(
    `${apiRouteCryptoGetTokenBalance}?walletType=${walletType}`,
    options,
  ).then((response) => response.text());
}
export default getTokenBalance;
