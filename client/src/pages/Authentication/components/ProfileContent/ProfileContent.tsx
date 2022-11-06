/* eslint-disable @shopify/jsx-no-complex-expressions */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/catch-or-return */
import {useMsal} from '@azure/msal-react';
import {useState} from 'react';
import Button from 'react-bootstrap/Button';
import {getUserProfile} from '@shared/hooks/getUserProfile';

import {ProfileData} from '../ProfileData';
import {loginRequest} from '../../authConfig';

function ProfileContent() {
  const {instance, accounts} = useMsal();
  const [userProfileData, setUserProfileData] = useState();
  const name = accounts[0] && accounts[0].name;

  const welcome = 'Welcome ';
  const request = 'Request Profile Information';

  function RequestProfileData() {
    const request = {
      ...loginRequest,
      account: accounts[0],
    };

    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    instance
      .acquireTokenSilent(request)
      .then((response) => {
        getUserProfile(response.accessToken).then((response: any) =>
          setUserProfileData(response),
        );
      })
      .catch(() => {
        instance.acquireTokenPopup(request).then((response) => {
          getUserProfile(response.accessToken).then((response: any) =>
            setUserProfileData(response),
          );
        });
      });
  }

  return (
    <>
      <h5 className="card-title">
        {welcome} {name}
      </h5>
      {userProfileData ? (
        <ProfileData userProfileData={userProfileData} />
      ) : (
        <Button
          id="RequestProfile"
          variant="secondary"
          onClick={RequestProfileData}
        >
          {request}
        </Button>
      )}
    </>
  );
}
export default ProfileContent;
