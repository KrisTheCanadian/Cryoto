/* eslint-disable react-hooks/exhaustive-deps */
import {keyframes, useTheme} from '@mui/material/styles';
import {Box, Typography} from '@mui/material';
import {ReactNode, useEffect, useRef, useState} from 'react';
import {useMsal} from '@azure/msal-react';
import {AnimatePresence, motion} from 'framer-motion';

interface EmojiContainerProps {
  type: number;
  emoji: ReactNode;
  likes: string[];
  enabled: boolean;
  handleReactionClick: (type: number) => Promise<boolean | undefined>;
}

function EmojiContainer(props: EmojiContainerProps) {
  const {type, emoji, likes, enabled, handleReactionClick} = props;
  const {accounts} = useMsal();
  const theme = useTheme();
  const [showEmojiAnimation, setShowEmojiAnimation] = useState(false);
  const isLiked = likes.includes(accounts[0].localAccountId);

  const handleClick = async () => {
    if (enabled) {
      await handleReactionClick(type);
    }
  };

  const isMounted = useRef(false);
  // run when likes changes
  useEffect(() => {
    // delay this
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (isLiked) {
      setShowEmojiAnimation(true);
      setTimeout(() => {
        setShowEmojiAnimation(false);
      }, 800);
    }
  }, [likes, accounts]);

  useEffect(() => {
    if (isLiked) {
      isMounted.current = false;
    }
  }, []);

  // styles
  const emojiContainerStyles = {
    opacity: likes.length === 0 ? 0 : 1,
    position: likes.length === 0 ? 'absolute' : 'relative',
    minWidth: '54px',
    display: 'flex',
    border: isLiked
      ? `1.5px solid ${theme.palette.primary.light}`
      : `1.5px solid ${theme.palette.divider}`,
    borderRadius: '25%/50%',
    color: theme.palette.text.primary,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
    height: '32px',
    fontSize: '12px',
    cursor: enabled ? 'pointer' : 'default',
    marginRight: theme.spacing(0.5),
  };
  const emojiStyles = {
    fontSize: '16px',
    marginRight: '5px',
    userSelect: 'none',
    position: 'relative',
  };

  const shiftIn = keyframes`
      0% {
        top: 0;
        opacity: 1;
        left: 0;
      }
      30% {
        left:-5px;
      }
      50% {
        left: 5px;
      }
      60% {
        left:0px;
      }
      100% {
        left: 0;
        top: -150px;
        opacity: 0;
      }
    `;

  const emojiAnimateStyle = {
    position: 'absolute',
    top: '10px',
    animation: `${shiftIn} .75s ease-in-out forwards`,
  };

  return (
    <AnimatePresence mode="sync">
      <Box
        sx={{
          height: '40px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          key={`${type < 0 ? 'boost' : `reaction-${type}`}-{id}-{text}`}
          component={motion.div}
          whileHover={{scale: enabled ? 1.1 : 1}}
          whileTap={{scale: enabled ? 0.9 : 1}}
          onClick={handleClick}
          sx={emojiContainerStyles}
          layout
        >
          <Box component={motion.div} sx={emojiStyles}>
            {emoji}

            {showEmojiAnimation && (
              <Box component={motion.div} sx={emojiAnimateStyle}>
                {emoji}
              </Box>
            )}
          </Box>
          {likes.length > 0 && (
            <Typography
              component={motion.span}
              sx={{
                fontWeight: 600,
                fontSize: '.75rem',
              }}
              variant="body1"
            >
              {likes.length.toString()}
            </Typography>
          )}
        </Box>
      </Box>
    </AnimatePresence>
  );
}

export default EmojiContainer;
