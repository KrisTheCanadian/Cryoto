/* eslint-disable @shopify/jsx-no-complex-expressions */
import {
  Avatar,
  Grid,
  IconButton,
  ListItemAvatar,
  Typography,
} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {stringAvatar} from '@shared/utils/colorUtils';

import {getUserProfilePhoto} from '@/data/api/requests/users';

interface TopRecognizerItemProps {
  oId: string;
  name: string;
  businessTitle: string | undefined;
  count: number;
  position: number;
}

export default function TopRecognizerItem(props: TopRecognizerItemProps) {
  const theme = useTheme();
  const avatarSize = {width: 35, height: 35};
  const [userProfilePhoto, setUserProfilePhoto] = useState<string | null>(null);

  useEffect(() => {
    getUserProfilePhoto(props.oId!)
      .then((response) => {
        setUserProfilePhoto(response);
      })
      .catch((err) => {});
  }, [props.oId]);

  const navigate = useNavigate();
  const handleProfileClick = () => {
    navigate(`/profile/${props.oId}`);
  };

  return (
    <Grid sx={{display: 'flex', margin: 1, alignItems: 'center'}}>
      <Grid item md={3.5} lg={2}>
        <IconButton
          sx={{backgroundColor: '#454ce129', width: 22, height: 22, ml: 1}}
        >
          <Typography sx={{fontSize: 15}}>{props.position}</Typography>
        </IconButton>
      </Grid>
      <Grid
        item
        xs={2}
        sx={{
          display: 'flex',
          [theme.breakpoints.down(1250)]: {
            display: 'none',
          },
        }}
      >
        <ListItemAvatar sx={{minWidth: 0}}>
          {userProfilePhoto ? (
            <Avatar
              sx={avatarSize}
              src={userProfilePhoto}
              onClick={handleProfileClick}
            />
          ) : (
            <Avatar
              {...stringAvatar(props.name || 'Cryoto', avatarSize)}
              onClick={handleProfileClick}
            />
          )}
        </ListItemAvatar>
      </Grid>
      <Grid item xs={7}>
        <Typography
          sx={{fontSize: 15, fontWeight: 500}}
          onClick={handleProfileClick}
        >
          {props.name}
        </Typography>
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 500,
            color: theme.interface.icon,
            display: {md: 'none', lg: 'flex'},
          }}
          onClick={handleProfileClick}
        >
          {props.businessTitle}
        </Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography>{props.count}</Typography>
      </Grid>
    </Grid>
  );
}
