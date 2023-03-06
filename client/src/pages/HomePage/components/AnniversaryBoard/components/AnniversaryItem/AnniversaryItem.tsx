/* eslint-disable @shopify/jsx-no-hardcoded-content */
/* eslint-disable @shopify/jsx-no-complex-expressions */
import {
  Avatar,
  Badge,
  BadgeProps,
  CardMedia,
  Grid,
  ListItemAvatar,
  Typography,
} from '@mui/material';
import {useTheme, styled} from '@mui/material/styles';
import {useEffect, useState} from 'react';
import {stringAvatar} from '@shared/utils/colorUtils';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import moment from 'moment';

import {getUserProfilePhoto} from '@/data/api/requests/users';

interface AnniversaryItemProps {
  oId: string;
  name: string;
  startDate: string;
}
const StyledBadge = styled(Badge)<BadgeProps>(({theme}) => ({
  '& .MuiBadge-badge': {
    right: -4,
    top: 17,
    border: `1.5px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

export default function AnniversaryItem(props: AnniversaryItemProps) {
  const theme = useTheme();
  const avatarSize = {width: 35, height: 35};
  const [userProfilePhoto, setUserProfilePhoto] = useState<string | null>(null);
  const startDate = new Date(props.startDate);

  const {t, i18n} = useTranslation();
  const lang = i18n.language.substring(0, 2);
  moment.locale(lang);
  let monthName = moment(startDate).locale(t('locale')).format('MMMM');
  monthName = monthName[0].toUpperCase() + monthName.substring(1);
  const startYear = startDate.getFullYear();
  const currentYear = new Date().getFullYear();
  const anniversaryYears = currentYear - startYear;

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
    <Grid
      sx={{
        display: 'flex',
        margin: 1,
        alignItems: 'center',
        ml: 3,
      }}
    >
      <Grid
        item
        xs={2}
        sx={{
          display: 'flex',
          [theme.breakpoints.down(1260)]: {
            display: 'none',
          },
        }}
      >
        <ListItemAvatar sx={{minWidth: 0}} onClick={handleProfileClick}>
          {userProfilePhoto ? (
            <Avatar sx={avatarSize} src={userProfilePhoto} />
          ) : (
            <Avatar
              {...stringAvatar(props.name || 'Cryoto', avatarSize)}
              onClick={handleProfileClick}
            />
          )}
        </ListItemAvatar>
      </Grid>
      <Grid item xs={8}>
        <Typography
          sx={{fontSize: 15, fontWeight: 500}}
          onClick={handleProfileClick}
        >
          {props.name}
        </Typography>
        <Typography
          sx={{fontSize: 13, fontWeight: 500, color: theme.interface.icon}}
          onClick={handleProfileClick}
        >
          {monthName} {startDate.getDate()}, {currentYear}
        </Typography>
      </Grid>
      <Grid item xs={2}>
        <StyledBadge badgeContent={anniversaryYears} color="primary">
          <CardMedia
            sx={{
              height: 25,
              width: 25,
            }}
            data-testid="cardMediaPic"
            component="img"
            image="https://em-content.zobj.net/source/microsoft-teams/337/birthday-cake_1f382.png"
          />
        </StyledBadge>
      </Grid>
    </Grid>
  );
}
