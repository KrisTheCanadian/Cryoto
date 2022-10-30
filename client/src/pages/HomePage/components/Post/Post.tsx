/* eslint-disable @shopify/jsx-no-complex-expressions */

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
  Skeleton,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {useTheme} from '@mui/material/styles';

import {LikeButtons} from '../LikeButtons';

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
  return (
    <Box sx={{width: '100%', display: 'flex', justifyContent: 'center'}}>
      <Card sx={{maxWidth: 600, mb: 2, flex: 1}}>
        <CardHeader
          avatar={
            loading ? (
              <Skeleton
                animation="wave"
                variant="circular"
                width={40}
                height={40}
              />
            ) : (
              <Avatar sx={{bgcolor: colors.red[500]}} aria-label="recipe">
                {firstName[0]}
              </Avatar>
            )
          }
          action={
            loading ? null : (
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            )
          }
          title={
            loading ? (
              <Skeleton
                animation="wave"
                height={10}
                width="80%"
                style={{marginBottom: 6}}
              />
            ) : (
              <>
                <b>{firstName}</b>
                {' gave '} <b>{recipient}</b>
                {` ${coinsGiven}`}
                {' coins'}
              </>
            )
          }
          subheader={
            loading ? (
              <Skeleton animation="wave" height={10} width="40%" />
            ) : (
              date
            )
          }
        />
        {loading ? (
          <Skeleton sx={{height: 190}} animation="wave" variant="rectangular" />
        ) : (
          imageURL && (
            <CardMedia
              component="img"
              height="194"
              image={imageURL}
              alt="Card Media"
            />
          )
        )}

        <CardContent>
          {loading ? (
            <>
              {' '}
              <Skeleton
                animation="wave"
                height={10}
                style={{marginBottom: 6}}
              />
              <Skeleton animation="wave" height={10} width="80%" />
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {message}
            </Typography>
          )}
          {!loading && (
            <Box sx={{marginTop: theme.spacing(1)}}>
              {tags?.map((tag) => (
                <Chip
                  clickable
                  key={tag}
                  label={tag}
                  sx={{marginRight: theme.spacing(1)}}
                />
              ))}
            </Box>
          )}
        </CardContent>
        <CardActions disableSpacing>{!loading && <LikeButtons />}</CardActions>
        <Box />
      </Card>
    </Box>
  );
}
export default Post;
