import {PublicClientApplication} from '@azure/msal-browser';
import axios from 'axios';

import {
  graphRequest,
  loginRequest,
  msalConfig,
} from '@/pages/Authentication/authConfig';
// This should be the same instance you pass to MsalProvider
const msalInstance = new PublicClientApplication(msalConfig);

const getAccessToken = async () => {
  // This will only return a non-null value if you have logic somewhere else that calls the setActiveAccount API
  const activeAccount = msalInstance.getActiveAccount();
  const accounts = msalInstance.getAllAccounts();

  if (!activeAccount && accounts.length === 0) {
    /*
     * User is not signed in. Throw error or wait for user to login.
     * Do not attempt to log a user in outside of the context of MsalProvider
     */
    return null;
  }
  const request = {
    scopes: loginRequest.scopes,
    account: activeAccount || accounts[0],
  };

  const authResult = await msalInstance.acquireTokenSilent(request);

  return authResult.accessToken;
};

const getGraphAccessToken = async () => {
  // This will only return a non-null value if you have logic somewhere else that calls the setActiveAccount API
  const activeAccount = msalInstance.getActiveAccount();
  const accounts = msalInstance.getAllAccounts();

  if (!activeAccount && accounts.length === 0) {
    /*
     * User is not signed in. Throw error or wait for user to login.
     * Do not attempt to log a user in outside of the context of MsalProvider
     */
    return null;
  }
  const request = {
    scopes: graphRequest.scopes,
    account: activeAccount || accounts[0],
  };

  const authResult = await msalInstance.acquireTokenSilent(request);

  return authResult.accessToken;
};

const getUserId = async () => {
  // This will only return a non-null value if you have logic somewhere else that calls the setActiveAccount API
  const activeAccount = msalInstance.getActiveAccount();
  const accounts = msalInstance.getAllAccounts();

  return activeAccount?.idTokenClaims?.oid || accounts[0].idTokenClaims?.oid;
};

const getUserProfilePhoto = async (oId: string): Promise<string | null> => {
  const activeAccount = msalInstance.getActiveAccount();
  const accounts = msalInstance.getAllAccounts();
  const request = {
    scopes: graphRequest.scopes,
    account: activeAccount || accounts[0],
  };

  const authResult = await msalInstance.acquireTokenSilent(request);

  const accessToken = authResult.accessToken;
  const bearer = `Bearer ${accessToken}`;
  if (oId === null || oId.length < 10) return null;

  const response = await axios
    .get(`https://graph.microsoft.com/v1.0/users/${oId}/photo/$value`, {
      headers: {
        Authorization: bearer,
      },
      responseType: 'blob',
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      const mute = err;
    });
  if (response === undefined) return null;
  const url = window.URL || window.webkitURL;
  const imageUrl = url.createObjectURL(response.data);
  return imageUrl;
};

export {getAccessToken, getUserId, getUserProfilePhoto};
