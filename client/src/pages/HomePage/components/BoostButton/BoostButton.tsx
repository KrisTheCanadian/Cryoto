import {useTheme} from '@mui/material/styles';
import {Box, IconButton} from '@mui/material';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StarBorderRounded} from '@mui/icons-material';
import {useMsal} from '@azure/msal-react';
import {motion, AnimatePresence} from 'framer-motion';
import {useAlertContext} from '@shared/hooks/Alerts';
import {useQuery, useQueryClient} from 'react-query';
import {InteractionStatus} from '@azure/msal-browser';
import {walletBalanceQuery} from '@shared/components/SideBar/SideBar';

import {EmojiContainer} from '../shared/EmojiContainer';

import {boostPost} from '@/data/api/requests/posts';
import IUser from '@/data/api/types/IUser';
import {getUserProfile} from '@/data/api/requests/users';

interface IBoostButtonProps {
  id: string;
  boosts: string[];
}

const MAX_QUERY_REFETCH = 10;
let queryRefetchCounter = 0;

function BoostButton(props: IBoostButtonProps) {
  const queryClient = useQueryClient();
  const {inProgress} = useMsal();
  const theme = useTheme();
  const {t} = useTranslation();

  const dispatchAlert = useAlertContext();

  const {id, boosts} = props;

  const [boostsCount, setBoostsCount] = useState(boosts);
  const [userProfileState, setUserProfileState] = useState<IUser>();

  // eslint-disable-next-line no-warning-comments
  // TODO: Once we have roles properly, replace following code responsible of getting roles through profile fetch by using useMsal()

  const loadUserProfile = async () => {
    if (inProgress === InteractionStatus.None) {
      return getUserProfile();
    }
  };

  const {status: userProfileStatus, refetch: refetchUserProfile} = useQuery(
    ['userprofile'],
    loadUserProfile,
    {
      onSuccess: (userProfile) => {
        setUserProfileState(userProfile);
      },
    },
  );

  useEffect(() => {
    if (userProfileState !== undefined && userProfileStatus === 'success') {
      // case: useQuery finishes sucessfully and returns valid data
      queryRefetchCounter = 0;
    } else if (
      userProfileState === undefined &&
      userProfileStatus === 'success'
    ) {
      // case: useQuery finishes sucessfully but return blank user profile data
      queryRefetchCounter++;
      if (queryRefetchCounter < MAX_QUERY_REFETCH) {
        refetchUserProfile();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfileState, userProfileStatus]);

  const canBoost = () => {
    if (
      userProfileState === undefined ||
      boostsCount.includes(userProfileState.oId)
    ) {
      return false;
    }
    const roles = userProfileState.roles;
    const acceptedRoles = ['Partner', 'Senior Partner'];
    let hasRole = false;
    for (const role of roles) {
      if (acceptedRoles.includes(role)) {
        hasRole = true;
        break;
      }
    }
    return hasRole;
  };

  const handleReactionClick = async (type: number) => {
    if (userProfileState === undefined || type !== -1) {
      return false;
    }
    setBoostsCount([...boostsCount, userProfileState.oId]);
    try {
      const res = await boostPost(id);
      if (!res) {
        // display error message
        dispatchAlert.error(t('errors.BackendError'));
        setBoostsCount(
          [...boostsCount].filter((id) => id !== userProfileState.oId),
        );
        return false;
      }
    } catch (error: any) {
      dispatchAlert.error(error.response.data);
      setBoostsCount(
        [...boostsCount].filter((id) => id !== userProfileState.oId),
      );
      return false;
    }
    queryClient.invalidateQueries(walletBalanceQuery);
    return true;
  };

  return (
    <Box sx={{position: 'relative'}}>
      <AnimatePresence mode="wait">
        <Box
          component={motion.div}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            component={motion.div}
            whileHover={{scale: 1.2}}
            whileTap={{scale: 0.9}}
            sx={{marginRight: '10px'}}
            layout
          >
            {canBoost() && boostsCount.length === 0 && (
              <IconButton
                sx={{
                  marginRight: 0.5,
                  color: theme.interface.icon,
                }}
                onClick={() => handleReactionClick(-1)}
              >
                <StarBorderRounded component={motion.svg} />
              </IconButton>
            )}
          </Box>

          <EmojiContainer
            likes={boostsCount}
            type={-1}
            emoji={<>&#x2B50;</>}
            enabled={canBoost()}
            handleReactionClick={handleReactionClick}
          />
        </Box>
      </AnimatePresence>
    </Box>
  );
}

export default BoostButton;
