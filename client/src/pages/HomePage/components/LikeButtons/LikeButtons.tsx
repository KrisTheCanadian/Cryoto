/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable @shopify/jsx-no-hardcoded-content */
import {useTheme} from '@mui/material/styles';
import {Box, ClickAwayListener, IconButton, Typography} from '@mui/material';
import {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {AddReaction, AddReactionOutlined} from '@mui/icons-material';
import {useMsal} from '@azure/msal-react';
import {AnimatePresence, motion} from 'framer-motion';
import {useAlertContext} from '@shared/hooks/Alerts';

import {EmojiContainer} from '../shared/EmojiContainer';

import {reactPost} from '@/data/api/requests/posts';

interface ILikeButtonsProps {
  id: string;
  hearts: string[];
  claps: string[];
  celebrations: string[];
}

function LikeButtons(props: ILikeButtonsProps) {
  const {accounts} = useMsal();
  const theme = useTheme();
  const {t} = useTranslation();

  const dispatchAlert = useAlertContext();

  const {id, hearts, claps, celebrations} = props;

  const [heartsCount, setHeartsCount] = useState(hearts);
  const [clapsCount, setClapsCount] = useState(claps);
  const [celebrationsCount, setCelebrationsCount] = useState(celebrations);
  const [showReactions, setShowReactions] = useState(false);
  const [mainLikeButtonClicked, setMainLikeButtonClicked] = useState(false);
  const showReactionTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const hideReactionTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const reactionVariance = {
    visible: {
      opacity: 1,
    },
    hidden: {
      opacity: 0,
    },
  };

  const handleMouseOver = () => {
    if (mainLikeButtonClicked) {
      clearTimeout(showReactionTimeout.current!);
      return;
    }
    showReactionTimeout.current = setTimeout(() => {
      setShowReactions(true);
    }, 500);
  };

  const handleMouseOut = () => {
    clearTimeout(showReactionTimeout.current!);
    setMainLikeButtonClicked(false);
    hideReactionTimeout.current = setTimeout(() => {
      setShowReactions(false);
    }, 200);
  };

  const handleReactionsMouseEnter = () => {
    clearTimeout(hideReactionTimeout.current);
    setShowReactions(true);
  };

  const handleLikeButtonClick = () => {
    setMainLikeButtonClicked(true);
    if (isPostLiked()) {
      // remove user reaction from all reactions
      if (heartsCount.includes(accounts[0].localAccountId)) {
        handleReactionClick(0);
      }
      if (clapsCount.includes(accounts[0].localAccountId)) {
        handleReactionClick(1);
      }
      if (celebrationsCount.includes(accounts[0].localAccountId)) {
        handleReactionClick(2);
      }
    } else {
      handleReactionClick(0);
    }
  };

  const emojiContainerReactionStyles = {
    background: theme.interface.contrastMain,
    border: theme.border.default,
    borderWidth: '1.5px',
    borderColor: theme.palette.divider,
    borderRadius: '25%/50%',
    width: 'fit-content',
    display: 'flex',
    top: '-60px',
    padding: '5px',
    paddingLeft: '10px',
    paddingRight: '8px',
    marginLeft: '-32px',
    position: 'absolute',
  };

  const emojiReactionStyles = {
    fontSize: '25px',
    marginRight: '5px',
    userSelect: 'none',
    cursor: 'pointer',
  };

  const handleReactionServer = async (type: number) => {
    const res = await reactPost(type, id);
    // check if res is undefined
    if (!res) {
      // display error message
      dispatchAlert.error(t('errors.BackendError'));
    }
  };

  const isPostLiked = () => {
    return (
      heartsCount.includes(accounts[0].localAccountId) ||
      clapsCount.includes(accounts[0].localAccountId) ||
      celebrationsCount.includes(accounts[0].localAccountId)
    );
  };

  const handleReactionClick = async (type: number) => {
    // check if user is logged in
    if (!accounts.length) {
      return;
    }
    let isRemoved = false;

    switch (type) {
      case 0:
        isRemoved = updateEmotion(heartsCount, setHeartsCount);
        break;
      case 1:
        isRemoved = updateEmotion(clapsCount, setClapsCount);
        break;
      case 2:
        isRemoved = updateEmotion(celebrationsCount, setCelebrationsCount);
        break;
      default:
        break;
    }

    handleReactionServer(type);
    return isRemoved;
  };

  const updateEmotion = (
    emotionCount: string[],
    setEmotionCount: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    const emotionIndex = emotionCount.indexOf(accounts[0].localAccountId);
    const newEmotionCount = [...emotionCount];
    if (emotionIndex > -1) {
      newEmotionCount.splice(emotionIndex, 1);
      setEmotionCount(newEmotionCount);
      return true;
    }
    setEmotionCount([...newEmotionCount, accounts[0].localAccountId]);
    return false;
  };

  return (
    <Box sx={{position: 'relative'}}>
      <AnimatePresence mode="sync">
        {showReactions && (
          <ClickAwayListener
            onClickAway={() => setShowReactions(!showReactions)}
          >
            <Box
              onMouseEnter={handleReactionsMouseEnter}
              key={`reaction-container-${id}`}
              component={motion.div}
              sx={emojiContainerReactionStyles}
              variants={reactionVariance}
              initial={{y: 10, opacity: 0}}
              animate={{y: 0, opacity: 1}}
              exit={{y: -10, opacity: 0}}
            >
              <Typography
                key={`reaction-heart-${id}`}
                sx={emojiReactionStyles}
                component={motion.div}
                whileHover={{scale: 1.2}}
                whileTap={{scale: 0.9}}
                onClick={() => handleReactionClick(0)}
                onMouseOver={() => setShowReactions(true)}
                onMouseOut={() => setShowReactions(false)}
                layout
              >
                &#x1F49C;
              </Typography>
              <Typography
                key={`reaction-clap-${id}`}
                sx={emojiReactionStyles}
                component={motion.div}
                whileHover={{scale: 1.5}}
                whileTap={{scale: 0.9}}
                onClick={() => handleReactionClick(1)}
                onMouseOver={() => setShowReactions(true)}
                onMouseOut={() => setShowReactions(false)}
                layout
              >
                &#x1f44f;
              </Typography>
              <Typography
                key={`reaction-celebrate-${id}`}
                sx={emojiReactionStyles}
                component={motion.div}
                whileHover={{scale: 1.5}}
                whileTap={{scale: 0.9}}
                onClick={() => handleReactionClick(2)}
                onMouseOver={() => setShowReactions(true)}
                onMouseOut={() => setShowReactions(false)}
                layout
              >
                &#x1f389;
              </Typography>
            </Box>
          </ClickAwayListener>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <Box
          component={motion.div}
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            component={motion.div}
            whileHover={{scale: 1.1}}
            whileTap={{scale: 0.9}}
            sx={{marginRight: '5px'}}
            onClick={() => setShowReactions(!showReactions)}
            layout
          >
            <IconButton
              data-testid="post-like-button"
              sx={{
                color: theme.interface.icon,
              }}
              onClick={handleLikeButtonClick}
              onMouseEnter={() => handleMouseOver()}
              onMouseLeave={() => handleMouseOut()}
            >
              <img
                src="images/svgIcons/addEmoji.svg"
                alt="Filter"
                style={{
                  width: '25px',
                  height: '25px',
                }}
              />
            </IconButton>
          </Box>

          <EmojiContainer
            likes={heartsCount}
            type={0}
            emoji={<>&#x1F49C;</>}
            enabled
            handleReactionClick={handleReactionClick}
          />

          <EmojiContainer
            likes={clapsCount}
            type={1}
            emoji={<>&#x1f44f;</>}
            enabled
            handleReactionClick={handleReactionClick}
          />
          <EmojiContainer
            likes={celebrationsCount}
            type={2}
            emoji={<>&#x1f389;</>}
            enabled
            handleReactionClick={handleReactionClick}
          />
        </Box>
      </AnimatePresence>
    </Box>
  );
}

export default LikeButtons;
