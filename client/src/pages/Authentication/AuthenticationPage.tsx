import {FullWidthColumn} from '@shared/components/FullWidthColumn';
import PageFrame from '@shared/components/PageFrame';
import {
  useIsAuthenticated,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';

import {SignInButton, SignOutButton, ProfileContent} from './components';

function Authentication() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <PageFrame>
      <FullWidthColumn>
        <UnauthenticatedTemplate>
          <SignInButton />
        </UnauthenticatedTemplate>
        <AuthenticatedTemplate>
          <SignOutButton />
          <ProfileContent />
        </AuthenticatedTemplate>
      </FullWidthColumn>
    </PageFrame>
  );
}

export default Authentication;
