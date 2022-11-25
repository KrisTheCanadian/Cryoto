/* eslint-disable id-length */

import {
  Card,
  Avatar,
  CardContent,
  Box,
  colors,
  InputBase,
  styled,
} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {RoundedInput} from '@shared/components/interface-elements/RoundedInput';
import {t} from 'i18next';
import {useState} from 'react';

import {NewPostDialog} from './components';

interface NewPostProps {
  name: string | undefined;
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

  return (
    <>
      {dialogOpen && (
        <NewPostDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
      )}
      <Box sx={{width: '100%', display: 'flex', justifyContent: 'center'}}>
        <Card sx={{maxWidth: 600, mb: 2, flex: 1}}>
          <CardContent>
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <Avatar
                sx={{bgcolor: colors.deepPurple[500], mr: theme.spacing(1)}}
                aria-label="recipe"
              >
                {initials}
              </Avatar>
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
