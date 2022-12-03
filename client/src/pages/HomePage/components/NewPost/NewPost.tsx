/* eslint-disable @shopify/jsx-no-complex-expressions */
import {
  Card,
  CardContent,
  Box,
  InputBase,
  styled,
  Avatar,
  ListItemAvatar,
} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {RoundedInput} from '@shared/components/interface-elements/RoundedInput';
import {t} from 'i18next';
import {useEffect, useState} from 'react';

import {NewPostDialog} from './components';

import {getUserProfilePhoto} from '@/data/api/helpers';

interface NewPostProps {
  name: string | undefined;
  oId: string | undefined;
}

function NewPost(props: NewPostProps) {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);

  // get initials from name
  const initials = props.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  function handleDialogOpen() {
    setDialogOpen(true);
  }

  const StyledInput = styled(InputBase)(({theme}) => ({
    width: '100%',
    marginLeft: theme.spacing(1),
    '& .MuiInputBase-input': {
      cursor: 'pointer',
    },
  }));

  const [userProfilePhoto, setUserProfilePhoto] = useState<string | null>(null);

  useEffect(() => {
    getUserProfilePhoto(props.oId!)
      .then((response) => {
        setUserProfilePhoto(response);
      })
      .catch((err) => {});
  }, [props.oId]);

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
    <>
      {dialogOpen && (
        <NewPostDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
      )}
      <Box sx={{width: '100%', display: 'flex', justifyContent: 'center'}}>
        <Card sx={{maxWidth: 600, mb: 2, flex: 1}}>
          <CardContent>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <ListItemAvatar>
                {userProfilePhoto ? (
                  <Avatar src={userProfilePhoto} />
                ) : (
                  <Avatar {...stringAvatar(props.name || 'Cryoto')} />
                )}
              </ListItemAvatar>
              <RoundedInput>
                <StyledInput
                  id="new-post-input"
                  onClick={handleDialogOpen}
                  placeholder={t('homePage.NewPost')}
                />
              </RoundedInput>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
export default NewPost;
