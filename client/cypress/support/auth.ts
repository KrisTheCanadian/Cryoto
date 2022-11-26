/* eslint-disable id-length */
/* eslint-disable promise/catch-or-return */

/* eslint-disable no-negated-condition */
/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="cypress" />

import {decode, JwtPayload} from 'jsonwebtoken';

const authority = `https://login.microsoftonline.com/${Cypress.env(
  'AUTHORITY',
)}`;

const clientId = Cypress.env('CLIENT_ID');
const clientSecret = Cypress.env('CLIENT_SECRET');
const environment = 'login.windows.net';
const username = Cypress.env('USERNAME');
const password = Cypress.env('PASSWORD');
const apiScopes = [`${Cypress.env('SCOPE')}`];

const buildAccountEntity = (
  homeAccountId: string,
  realm: any,
  localAccountId: any,
  username: any,
  name: any,
) => {
  return {
    authorityType: 'MSSTS',
    // This could be filled in but it involves a bit of custom base64 encoding
    // and would make this sample more complicated.
    // This value does not seem to get used, so we can leave it out.
    clientInfo: '',
    homeAccountId,
    environment,
    realm,
    localAccountId,
    username,
    name,
  };
};

const buildIdTokenEntity = (
  homeAccountId: string,
  idToken: any,
  realm: any,
) => {
  return {
    credentialType: 'IdToken',
    homeAccountId,
    environment,
    clientId,
    secret: idToken,
    realm,
  };
};

const buildAccessTokenEntity = (
  homeAccountId: string,
  accessToken: any,
  expiresIn: number,
  extExpiresIn: number,
  realm: any,
  scopes: any[],
) => {
  const now = Math.floor(Date.now() / 1000);
  return {
    homeAccountId,
    credentialType: 'AccessToken',
    secret: accessToken,
    cachedAt: now.toString(),
    expiresOn: (now + expiresIn).toString(),
    extendedExpiresOn: (now + extExpiresIn).toString(),
    environment,
    clientId,
    realm,
    target: scopes.map((s: string) => s.toLowerCase()).join(' '),
    // Scopes _must_ be lowercase or the token won't be found
  };
};

const injectTokens = (tokenResponse: {
  id_token: string;
  access_token: any;
  expires_in: any;
  ext_expires_in: any;
}) => {
  const idToken = decode(tokenResponse.access_token);
  if (!idToken) {
    throw new Error('idToken is null');
  }
  const idTokenClaims = idToken as JwtPayload;
  const localAccountId = idTokenClaims.oid || idTokenClaims.sid;
  const realm = idTokenClaims.tid;
  const homeAccountId = `${localAccountId}.${realm}`;
  const username = idTokenClaims.preferred_username;
  const name = idTokenClaims.name;

  const accountKey = `${homeAccountId}-${environment}-${realm}`;
  const accountEntity = buildAccountEntity(
    homeAccountId,
    realm,
    localAccountId,
    username,
    name,
  );

  const idTokenKey = `${homeAccountId}-${environment}-idtoken-${clientId}-${realm}-`;
  const idTokenEntity = buildIdTokenEntity(
    homeAccountId,
    tokenResponse.id_token,
    realm,
  );

  const accessTokenKey = `${homeAccountId}-${environment}-accesstoken-${clientId}-${realm}-${apiScopes.join(
    ' ',
  )}`;
  const accessTokenEntity = buildAccessTokenEntity(
    homeAccountId,
    tokenResponse.access_token,
    tokenResponse.expires_in,
    tokenResponse.ext_expires_in,
    realm,
    apiScopes,
  );

  localStorage.setItem(accountKey, JSON.stringify(accountEntity));
  localStorage.setItem(idTokenKey, JSON.stringify(idTokenEntity));
  localStorage.setItem(accessTokenKey, JSON.stringify(accessTokenEntity));
};

export const login = (cachedTokenResponse: any) => {
  let tokenResponse = null;
  let chainable = cy.visit('/');

  if (!cachedTokenResponse) {
    chainable = chainable.request({
      url: `${authority}/oauth2/v2.0/token`,
      method: 'POST',
      body: {
        grant_type: 'password',
        client_id: clientId,
        client_secret: clientSecret,
        scope: `${Cypress.env('SCOPE')}`,
        username,
        password,
      },
      form: true,
    });
  } else {
    chainable = chainable.then(() => {
      return {
        body: cachedTokenResponse,
      };
    });
  }

  chainable
    .then((response) => {
      injectTokens(response.body);
      tokenResponse = response.body;
    })
    .reload()
    .then(() => {
      return tokenResponse;
    });

  return chainable;
};
