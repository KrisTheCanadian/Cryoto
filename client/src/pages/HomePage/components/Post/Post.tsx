import {Avatar, Typography, Box, colors, Chip, Stack} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import TollIcon from '@mui/icons-material/Toll';
import moment from 'moment';
import {useTranslation} from 'react-i18next';

import {LikeButtons} from '../LikeButtons';

import {LoadingPostSkeleton} from './components';

interface PostProps {
  firstName: string;
  date: string;
  imageURL?: string;
  recipient: string;
  message: string;
  coinsGiven: number;
  tags?: string[];
  loading: boolean;
}

function Post(props: PostProps) {
  const theme = useTheme();
  const {t} = useTranslation();

  const {
    firstName,
    recipient,
    message,
    imageURL,
    tags,
    date,
    coinsGiven,
    loading,
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
          <Avatar
            sx={{bgcolor: colors.red[500], width: '55px', height: '55px'}}
            aria-label="recipe"
          >
            {firstName[0]}
          </Avatar>
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
        <LikeButtons />
      </Box>
    </Box>
  );
}
export default Post;
