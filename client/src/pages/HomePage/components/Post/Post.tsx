import {
  Card,
  CardHeader,
  Avatar,
  IconButton,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Box,
  colors,
  Chip,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {useTheme} from '@mui/material/styles';
import {t} from 'i18next';

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
  return (
    <Box sx={{width: '100%', display: 'flex', justifyContent: 'center'}}>
      <Card sx={{maxWidth: 600, mb: 2, flex: 1}}>
        <CardHeader
          avatar={
            <Avatar sx={{bgcolor: colors.red[500]}} aria-label="recipe">
              {firstName[0]}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={
            <>
              <b>{firstName}</b>
              {' gave '} <b>{recipient}</b>
              {` ${coinsGiven}`}
              {' coins'}
            </>
          }
          subheader={date}
        />
        {imageURL && (
          <CardMedia
            component="img"
            height="194"
            image={imageURL}
            alt="Card Media"
          />
        )}

        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
          <Box sx={{marginTop: theme.spacing(1)}}>
            {tags?.map((tag) => (
              <Chip
                clickable
                key={tag}
                label={t<string>(`values.${tag}`)}
                sx={{marginRight: theme.spacing(1)}}
              />
            ))}
          </Box>
        </CardContent>
        <CardActions disableSpacing>
          <LikeButtons />
        </CardActions>
        <Box />
      </Card>
    </Box>
  );
}
export default Post;
