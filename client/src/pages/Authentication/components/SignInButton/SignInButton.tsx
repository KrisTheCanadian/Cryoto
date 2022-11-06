import React from 'react';
import {useMsal} from '@azure/msal-react';
import {Button} from '@mui/material';
import {IPublicClientApplication} from '@azure/msal-browser';
import {useTranslation} from 'react-i18next';

import {loginRequest} from '../../authConfig';

function handleLogin(instance: IPublicClientApplication) {
  instance.loginRedirect(loginRequest);
}

function SignInButton() {
  const {instance} = useMsal();
  const {t} = useTranslation();
  return (
    <Button
      id="sign-in-button"
      variant="outlined"
      onClick={() => handleLogin(instance)}
    >
      {t('landingPage.SignIn')}
    </Button>
  );
}
export default SignInButton;
