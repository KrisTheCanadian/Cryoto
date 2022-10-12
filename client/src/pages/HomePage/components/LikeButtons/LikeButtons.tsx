/* eslint-disable @typescript-eslint/naming-convention */
import {useTheme} from '@mui/material/styles';
import {Box, IconButton} from '@mui/material';
import {ReactNode} from 'react';
import AddReactionIcon from '@mui/icons-material/AddReaction';

interface EmojiContainerProps {
  children: ReactNode;
}

const emojiContainerStyles = {
  display: 'flex',
  flexDirection: 'row',
  '&:hover': {
    '& .emojiContainer': {
      marginLeft: '2px',
    },
  },
};

function EmojiContainer(props: EmojiContainerProps) {
  const theme = useTheme();
  const emojiStyles = {
    background: theme.interface.main,
    border: '1px solid',
    borderColor: theme.palette.divider,
    borderRadius: '50%',
    height: ' 35px',
    transition: 'all 0.3s ease',
    fontSize: '20px',
    width: '35px',
    display: 'flex',
    flexDirection: 'row',
    cursor: 'pointer',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '-5px',
    '&:first-of-type': {
      marginLeft: '0px',
    },
    '&:last-of-type': {
      marginRight: theme.spacing(1),
    },
  };
  return (
    <Box className="emojiContainer" sx={emojiStyles}>
      {props.children}
    </Box>
  );
}

function LikeButtons() {
  const likes = 6;
  return (
    <Box sx={{display: 'flex', alignItems: 'center'}}>
      <IconButton aria-label="add to favorites">
        <AddReactionIcon />
      </IconButton>
      <Box sx={emojiContainerStyles}>
        <EmojiContainer>
          <>❤️</>
        </EmojiContainer>
        <EmojiContainer>
          <>👏</>
        </EmojiContainer>
        <EmojiContainer>
          <>🎉</>
        </EmojiContainer>
      </Box>
      {likes}
    </Box>
  );
}

export default LikeButtons;
