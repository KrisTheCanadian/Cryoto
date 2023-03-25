/* eslint-disable @shopify/jsx-no-hardcoded-content */
/* eslint-disable @shopify/jsx-no-complex-expressions */
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from '@mui/material';
import {useEffect, useState} from 'react';
import moment from 'moment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {useQueryClient} from 'react-query';
import {useTranslation} from 'react-i18next';
import {stringAvatar} from '@shared/utils/colorUtils';

import {getUserProfilePhoto} from '@/data/api/requests/users';
import IComment from '@/data/api/types/IComment';
import i18n from '@/i18n/i18n';
import {getUserId} from '@/data/api/helpers';
import {deleteComment} from '@/data/api/requests/comment';

interface CommentHolderProps {
  id: string;
  comment: IComment;
}

function CommentHolder(props: CommentHolderProps) {
  const avatarSize = {width: 32, height: 32};

  const [userProfilePhoto, setUserProfilePhoto] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isAuthor, setIsAuthor] = useState(false);

  const queryClient = useQueryClient();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const {t} = useTranslation();
  const theme = useTheme();

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      const userId = await getUserId();
      if (props.comment.author === userId) {
        setIsAuthor(true);
      }
    };
    getUserProfilePhoto(props.comment.author)
      .then((response) => {
        setUserProfilePhoto(response);
      })
      .catch((err) => {});
    fetchDetails();
  }, [props.comment.author]);

  const commentStyle = {
    padding: 0,
    marginY: 1,
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.interface.contrastMain,
    '&:hover': {
      backgroundColor: theme.interface.contrastMain,
    },
    borderRadius: theme.shape.borderRadius,
    width: '100%',
    paddingLeft: 1,
  };

  useEffect(() => {
    const lang = i18n.language.substring(0, 2);
    moment.locale(lang);
  }, []);

  const handleDelete = async () => {
    handleClose();
    await deleteComment(props.comment.id);
    queryClient.invalidateQueries();
  };

  return (
    <>
      <ListItem key={props.comment.id} sx={commentStyle}>
        {userProfilePhoto ? (
          <Avatar sx={avatarSize} src={userProfilePhoto} />
        ) : (
          <Avatar
            {...stringAvatar(
              props.comment?.authorProfile?.name || 'Cryoto User',
              {avatarSize},
            )}
          />
        )}
        <ListItemText
          sx={{paddingLeft: 1}}
          primary={
            <>
              <Typography
                sx={{display: 'inline'}}
                component="span"
                variant="body1"
                fontSize={14}
                color="text.primary"
              >
                {`${props.comment?.authorProfile?.name} ` || 'Cryoto User '}
              </Typography>
              <Typography
                sx={{display: 'inline-block'}}
                component="span"
                variant="body1"
                fontSize={12}
                color="text.secondary"
              >
                {`   -   ${moment
                  .utc(props.comment.createdDate)
                  .local()
                  .startOf('seconds')
                  .fromNow()}`}
              </Typography>
            </>
          }
          secondary={
            <>
              <Typography
                sx={{display: 'inline-block'}}
                component="span"
                variant="body1"
                fontSize={14}
                fontWeight={0}
                color="text.primary"
              >
                {props.comment.message}
              </Typography>
            </>
          }
        />
        <Box>
          {isAuthor && (
            <>
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ml: 2}}
                aria-controls="edit-delete-menu"
                aria-haspopup="true"
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="edit-delete-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleDelete}>
                  {t('comments.Delete')}
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
        <Box />
      </ListItem>
    </>
  );
}

export default CommentHolder;
