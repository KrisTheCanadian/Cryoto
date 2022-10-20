import React from 'react';
import {useMsal} from '@azure/msal-react';
import Button from 'react-bootstrap/Button';
import {IPublicClientApplication} from '@azure/msal-browser';

import {loginRequest} from '../../authConfig';

function handleLogin(instance: IPublicClientApplication) {
  instance.loginRedirect(loginRequest);
}

function SignInButton() {
  const {instance} = useMsal();
  const singIn = 'Sign in';
  return (
    <Button
      variant="secondary"
      className="ml-auto"
      onClick={() => handleLogin(instance)}
    >
      {singIn}
    </Button>
  );
}
export default SignInButton;
