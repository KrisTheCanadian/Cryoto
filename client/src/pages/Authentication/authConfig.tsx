/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

export const msalConfig = {
  auth: {
    clientId: '751147b8-8f35-402c-a1ac-8f775f5baae9',
    authority:
      'https://login.microsoftonline.com/4ccf6cd1-34c6-4c18-9976-d94ae43d0f65',
  },
  cache: {
    // This configures where your cache will be stored
    cacheLocation: 'sessionStorage',
    // Set this to "true" if you are having issues on IE11 or Edge
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ['api://751147b8-8f35-402c-a1ac-8f775f5baae9/AdminAccess'],
};