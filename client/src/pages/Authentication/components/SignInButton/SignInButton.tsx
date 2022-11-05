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
  const signIn = 'Sign in';
  return (
    <Button
      id="sign-in-button"
      variant="secondary"
      className="ml-auto"
      onClick={() => handleLogin(instance)}
    >
      {signIn}
    </Button>
  );
}
export default SignInButton;
