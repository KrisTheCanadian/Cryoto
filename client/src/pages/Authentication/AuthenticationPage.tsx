/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable promise/catch-or-return */
import {FullWidthColumn} from '@shared/components/FullWidthColumn';
import {useMsal} from '@azure/msal-react';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {InteractionStatus} from '@azure/msal-browser';
import {Box, CircularProgress, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';

import {routeHome} from '@/pages/routes';
import {getUserProfile} from '@/data/api/requests/users';

function Authentication() {
  const {t} = useTranslation();
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

  // position center on screen
  const centerBoxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  return (
    <Box sx={centerBoxStyle}>
      <Typography variant="h4" gutterBottom>
        {t('authenticationPage.loading')}
      </Typography>
      <CircularProgress data-testid="CircularProgress" size="5rem" />
    </Box>
  );
}

export default Authentication;
