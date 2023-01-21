/* eslint-disable no-negated-condition */
/* eslint-disable @shopify/jsx-no-hardcoded-content */
/* eslint-disable @shopify/jsx-no-complex-expressions */
/* eslint-disable react-hooks/rules-of-hooks */
import {Avatar, Typography, Box, colors, Chip, Stack} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import TollIcon from '@mui/icons-material/Toll';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import {useEffect, useState} from 'react';

import {LikeButtons} from '../LikeButtons';

import {LoadingPostSkeleton} from './components';

import {getUserProfilePhoto} from '@/data/api/requests/users';

interface PostProps {
  firstName: string;
  date: string;
  imageUrl?: string;
  recipient: string;
  message: string;
  coinsGiven: number;
  tags?: string[];
  loading: boolean;
  authorId: string;
}

function Post(props: PostProps) {
  const theme = useTheme();
  const {t} = useTranslation();

  const {
    firstName,
    recipient,
    message,
    imageUrl,
    tags,
    date,
    coinsGiven,
    loading,
    authorId,
  } = props;
  if (loading) {
    return <LoadingPostSkeleton />;
  }

  const ChipStyles = {
    backgroundColor: theme.interface.contrastMain,
    border: theme.border.default,
    fontSize: '1rem',
    fontWeight: theme.typography.fontWeightMedium,
    marginRight: theme.spacing(1),
  };

  const timeAgo = moment.utc(date).local().startOf('seconds').fromNow();

  const [userProfilePhoto, setUserProfilePhoto] = useState<string | null>(null);

  useEffect(() => {
    getUserProfilePhoto(authorId)
      .then((response) => {
        setUserProfilePhoto(response);
      })
      .catch((err) => {});
  }, [authorId]);

  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}`,
    };
  }

  function stringToColor(string: string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          maxWidth: 600,
          mb: theme.margin.default,
          flex: 1,
          border: theme.border.default,
          backgroundColor: theme.interface.main,
          padding: theme.padding.default,
          borderRadius: theme.borderRadius.default,
        }}
      >
        <Stack direction="row">
          {userProfilePhoto ? (
            <Avatar src={userProfilePhoto} />
          ) : (
            <Avatar {...stringAvatar(firstName[0] || 'Cryoto')} />
          )}

          <Stack sx={{ml: 2}}>
            <Typography variant="body1">
              <b>{firstName}</b>
              {t('homePage.Recognized')}
              <b>{recipient}</b>
            </Typography>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <Chip
                sx={ChipStyles}
                icon={<TollIcon style={{fill: theme.palette.text.primary}} />}
                key={coinsGiven}
                label={coinsGiven.toString()}
              />
              {tags?.map((tag) => (
                <Chip sx={ChipStyles} clickable key={tag} label={tag} />
              ))}
            </Box>
            <Typography
              variant="body2"
              sx={{color: theme.palette.text.disabled}}
            >
              {timeAgo}
            </Typography>
          </Stack>
        </Stack>
        <Typography
          variant="body1"
          sx={{marginTop: theme.spacing(2), marginBottom: theme.spacing(2)}}
        >
          {message}
        </Typography>
        {imageUrl !== '' ? (
          <img
            src={imageUrl}
            alt="imageUrl"
            width="100%"
            style={{marginBottom: theme.spacing(1)}}
          />
        ) : null}
        <LikeButtons />
      </Box>
    </Box>
  );
}
export default Post;
