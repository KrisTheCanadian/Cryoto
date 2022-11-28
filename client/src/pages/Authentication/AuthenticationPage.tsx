/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable promise/catch-or-return */
import {FullWidthColumn} from '@shared/components/FullWidthColumn';
import {useMsal} from '@azure/msal-react';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {InteractionStatus} from '@azure/msal-browser';

import {LandingPage} from '../LandingPage';

import {routeHome} from '@/pages/routes';
import {getUserProfile} from '@/data/api/requests/users';

function Authentication() {
  const [userProfileData, setUserProfileData] = useState();
  const {inProgress} = useMsal();

  const loadUserProfile = async () => {
    if (inProgress === InteractionStatus.None) {
      getUserProfile().then((response: any) => setUserProfileData(response));
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    loadUserProfile();
  }, [inProgress]);

  useEffect(() => {
    if (userProfileData) navigate(routeHome);
  }, [userProfileData]);
  return (
    <>
      <FullWidthColumn>
        <LandingPage isRedirecting />
      </FullWidthColumn>
    </>
  );
}

export default Authentication;
