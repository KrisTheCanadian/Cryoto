import React from 'react';
import {useMsal} from '@azure/msal-react';
import {Button} from '@mui/material';
import {InteractionStatus, IPublicClientApplication} from '@azure/msal-browser';
import {useTranslation} from 'react-i18next';

import {loginRequest} from '../../authConfig';

async function handleLogin(
  instance: IPublicClientApplication,
  inProgress: InteractionStatus,
) {
  if (inProgress === InteractionStatus.None) {
    await instance.loginRedirect(loginRequest);
  }
  // await instance.loginRedirect(loginRequest);
}

function SignInButton() {
  const {instance, inProgress} = useMsal();
  const {t} = useTranslation();
  return (
    <Button
      id="sign-in-button"
      variant="outlined"
      // eslint-disable-next-line no-return-await
      onClick={async () => await handleLogin(instance, inProgress)}
    >
      {t('landingPage.SignIn')}
    </Button>
  );
}
export default SignInButton;
