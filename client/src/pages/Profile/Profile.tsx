import PageFrame from '@shared/components/PageFrame';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {MiddleColumn} from '@shared/components/MiddleColumn';
import {RightBar} from '@shared/components/RightBar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import OutboxIcon from '@mui/icons-material/Outbox';
import CakeIcon from '@mui/icons-material/Cake';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  List,
  ListItem,
  Typography,
  useTheme,
} from '@mui/material';
import {PostsFeed} from '@shared/components/PostsFeed';
import {useMsal} from '@azure/msal-react';
import {useTranslation} from 'react-i18next';
import moment from 'moment';

import {NewPostDialog} from '../HomePage/components/NewPost/components';

import {getUserById, getUserProfilePhoto} from '@/data/api/requests/users';
import {IUser} from '@/data/api/types';
import {getNextPageUserProfile} from '@/data/api/requests/posts';
import i18n from '@/i18n/i18n';

function Profile() {
  const {id} = useParams();
  const [userProfilePhoto, setUserProfilePhoto] = useState();
  const [userProfile, setUserProfile] = useState<IUser>();
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const {accounts} = useMsal();
  const {t} = useTranslation();

  useEffect(() => {
    const lang = i18n.language.substring(0, 2);
    moment.locale(lang);
  }, []);

  function handleDialogOpen() {
    setDialogOpen(true);
  }

  useEffect(() => {
    setUserProfile(undefined);
    getUserProfilePhoto(id!)
      .then((response: any) => setUserProfilePhoto(response))
      .catch((err) => {});
  }, [id]);

  useEffect(() => {
    setUserProfilePhoto(undefined);
    getUserById(id!)
      .then((res) => {
        setUserProfile(res);
      })
      .catch((err) => {});
  }, [id]);

  const ProfilePhoto = () => {
    return userProfilePhoto ? (
      <Avatar sx={{width: 75, height: 75}} src={userProfilePhoto} />
    ) : (
      <Avatar sx={{width: 75, height: 75}} />
    );
  };

  const iconStyle = {
    marginRight: theme.spacing(0.8),
  };

  return (
    <PageFrame>
      {userProfile?.name && (
        <NewPostDialog
          dialogOpen={dialogOpen}
          queryKey={[`profile-${id}`]}
          setDialogOpen={setDialogOpen}
          initialRecipients={[{id: userProfile?.oId, name: userProfile?.name}]}
        />
      )}
      <MiddleColumn>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            maxWidth: 600,
          }}
        >
          <Card sx={{maxWidth: 600, mb: 2, flex: 1}} data-testid="profile-card">
            <CardHeader
              sx={{alignItems: 'flex-start'}}
              avatar={ProfilePhoto()}
              title={
                <Typography gutterBottom variant="h5">
                  {userProfile?.name}
                </Typography>
              }
              subheader={
                <>
                  <List>
                    <ListItem>
                      <WorkOutlineIcon sx={iconStyle} />
                      {userProfile?.businessTitle}
                    </ListItem>
                    <ListItem>
                      <LocationCityIcon sx={iconStyle} />
                      {userProfile?.city}
                    </ListItem>
                    <ListItem>
                      <AccessTimeIcon sx={iconStyle} />
                      {userProfile?.timeZone}
                    </ListItem>
                    <ListItem>
                      <CalendarMonthIcon sx={iconStyle} />
                      {t('profilePage.joinedIn')}
                      {moment(userProfile?.startDate).format('MMMM YYYY')}
                    </ListItem>
                    <ListItem>
                      <CakeIcon sx={iconStyle} />
                      {moment(userProfile?.startDate).format('DD MMMM')}
                    </ListItem>
                    <ListItem>
                      <OutboxIcon sx={iconStyle} />
                      <Typography variant="body1" mr={0.5}>
                        <b>{userProfile?.recognitionsSent}</b>
                      </Typography>
                      {t('profilePage.recognitionsSent')}
                    </ListItem>
                    <ListItem>
                      <MoveToInboxIcon sx={iconStyle} />
                      <Typography variant="body1" mr={0.5}>
                        <b>{userProfile?.recognitionsReceived}</b>
                      </Typography>
                      {t('profilePage.recognitionsReceived')}
                    </ListItem>
                  </List>
                </>
              }
              action={
                accounts[0].idTokenClaims?.oid !== id && (
                  <Button
                    aria-label="settings"
                    variant="outlined"
                    sx={iconStyle}
                    onClick={handleDialogOpen}
                  >
                    {t('profilePage.recognize')}
                  </Button>
                )
              }
            />
          </Card>
          <Typography gutterBottom variant="h5" color={theme.palette.grey[700]}>
            {t('profilePage.recognitions')}
          </Typography>
          <PostsFeed
            queryKey={[`profile-${id}`]}
            getNextPage={getNextPageUserProfile}
            userId={id!}
          />
        </Box>
      </MiddleColumn>
      <RightBar>
        <></>
      </RightBar>
    </PageFrame>
  );
}

export default Profile;
