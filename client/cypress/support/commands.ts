/* eslint-disable @typescript-eslint/triple-slash-reference */
// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />

import {login} from './auth';

let cachedTokenExpiryTime = new Date().getTime();
let cachedTokenResponse: any = null;

Cypress.Commands.add('login', () => {
  // Clear our cache if tokens are expired
  if (cachedTokenExpiryTime <= new Date().getTime()) {
    cachedTokenResponse = null;
  }

  return login(cachedTokenResponse).then((tokenResponse) => {
    cachedTokenResponse = tokenResponse;
    // Set expiry time to 50 minutes from now
    cachedTokenExpiryTime = new Date().getTime() + 50 * 60 * 1000;
  });
});

export {};
