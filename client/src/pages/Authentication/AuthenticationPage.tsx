import {FullWidthColumn} from '@shared/components/FullWidthColumn';
import PageFrame from '@shared/components/PageFrame';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';

import {SignInButton, SignOutButton, ProfileContent} from './components';

function Authentication() {
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
