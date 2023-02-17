/* eslint-disable @shopify/jsx-no-complex-expressions */
import {Avatar, Box, InputBase, ListItemAvatar, styled} from '@mui/material';
import {RoundedInput} from '@shared/components/interface-elements/RoundedInput';
import {t} from 'i18next';
import React, {useEffect, useState} from 'react';
import {useQueryClient} from 'react-query';
import {useAlertContext} from '@shared/hooks/Alerts';
import {stringAvatar} from '@shared/utils/colorUtils';

import {getUserProfilePhoto} from '@/data/api/requests/users';
import {commentOnPost} from '@/data/api/requests/posts';

interface NewCommentProps {
  postid: string;
  name: string | undefined;
  oId: string | undefined;
}

const StyledInput = styled(InputBase)(({theme}) => ({
  width: '75%',
  height: '75%',
  marginLeft: theme.spacing(1),
  '& .MuiInputBase-input': {
    cursor: 'pointer',
  },
}));

const NewComment = (props: NewCommentProps) => {
  const avatarSize = {width: 32, height: 32};

  const [userProfilePhoto, setUserProfilePhoto] = useState<string | null>(null);
  const [commentMessage, setCommentMessage] = useState<string>('');
  const dispatchAlert = useAlertContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    getUserProfilePhoto(props.oId!)
      .then((response) => {
        setUserProfilePhoto(response);
      })
      .catch((err) => {});
  }, [props.oId]);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setCommentMessage(value);
  };

  const handleCommentSubmit = async (message: string) => {
    const res = await commentOnPost(props.postid, message, '');

    if (!res) {
      dispatchAlert.error(t('errors.BackendError'));
    }
    queryClient.invalidateQueries();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (commentMessage.trim() === '') {
      return;
    }

    if (event.key === 'Enter') {
      handleCommentSubmit(commentMessage);

      setCommentMessage('');
    }
  };

  return (
    <>
      <Box sx={{display: 'flex', alignItems: 'center', marginY: 2}}>
        <RoundedInput>
          <ListItemAvatar sx={{minWidth: 0}}>
            {userProfilePhoto ? (
              <Avatar sx={avatarSize} src={userProfilePhoto} />
            ) : (
              <Avatar {...stringAvatar(props.name || 'Cryoto', avatarSize)} />
            )}
          </ListItemAvatar>
          <StyledInput
            onKeyDown={handleKeyDown}
            onChange={handleOnChange}
            id="new-comment-input"
            placeholder="Add a comment..."
            value={commentMessage}
          />
        </RoundedInput>
      </Box>
    </>
  );
};

export default NewComment;
