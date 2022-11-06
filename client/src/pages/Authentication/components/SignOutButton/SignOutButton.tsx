import React from 'react';
import {useMsal} from '@azure/msal-react';
import Button from 'react-bootstrap/Button';
import {IPublicClientApplication} from '@azure/msal-browser';

function handleLogout(instance: IPublicClientApplication) {
  instance.logoutRedirect();
}

function SignOutButton() {
  const {instance} = useMsal();
  const signOut = 'Sign out';
  return (
    <Button
      id="signOutButton"
      variant="secondary"
      className="ml-auto"
      onClick={() => handleLogout(instance)}
    >
      {signOut}
    </Button>
  );
}

export default SignOutButton;
