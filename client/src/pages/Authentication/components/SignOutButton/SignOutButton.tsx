import {useMsal} from '@azure/msal-react';
import Button from 'react-bootstrap/Button';
import {IPublicClientApplication} from '@azure/msal-browser';
import {useTranslation} from 'react-i18next';

function SignOutButton() {
  const {instance} = useMsal();
  const {t} = useTranslation();

  const handleLogout = async (instance: IPublicClientApplication) => {
    instance.logoutRedirect();
  };
  return (
    <Button
      id="signOutButton"
      variant="secondary"
      className="ml-auto"
      onClick={() => handleLogout(instance)}
    >
      {t('layout.Logout')}
    </Button>
  );
}

export default SignOutButton;
