import {useTheme} from '@mui/material/styles';
import {Box, Typography} from '@mui/material';
import {ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import AddReactionIcon from '@mui/icons-material/AddReaction';

function LikeButtons() {
  const theme = useTheme();
  const {t} = useTranslation();

  const likes = 6;
  interface EmojiContainerProps {
    emoji: ReactNode;
    text: string;
  }

  const EmojiContainerStyles = {
    background: theme.interface.contrastMain,
    border: theme.border.default,
    borderRadius: '25%/50%',
    display: 'flex',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    alignItems: 'center',
    height: '30px',
    marginRight: theme.spacing(0.5),
  };

  const EmojiStyles = {
    fontSize: '20px',
    marginRight: '5px',
  };

  const EmojiContainer = (props: EmojiContainerProps) => {
    return (
      <Box sx={EmojiContainerStyles}>
        <Box sx={EmojiStyles}>{props.emoji}</Box>
        <Typography
          sx={{fontWeight: theme.typography.fontWeightMedium}}
          variant="body1"
        >
          {props.text}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{display: 'flex', alignItems: 'center'}}>
      <Box sx={EmojiContainerStyles} style={{borderRadius: '15%/50%'}}>
        <AddReactionIcon style={{marginRight: '5px'}} />
        <Typography
          sx={{fontWeight: theme.typography.fontWeightMedium}}
          variant="body1"
        >
          {t('homePage.React')}
        </Typography>
      </Box>
      <EmojiContainer emoji={<>❤️</>} text={likes.toString()} />
      <EmojiContainer emoji={<>👏</>} text={likes.toString()} />
      <EmojiContainer emoji={<>🎉</>} text={likes.toString()} />
    </Box>
  );
}

export default LikeButtons;
