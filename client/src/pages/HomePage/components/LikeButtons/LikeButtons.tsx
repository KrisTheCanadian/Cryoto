/* eslint-disable @shopify/jsx-no-complex-expressions */
/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable @shopify/jsx-no-hardcoded-content */
import {useTheme} from '@mui/material/styles';
import {Box, ClickAwayListener, IconButton, Typography} from '@mui/material';
import {ReactNode, useState} from 'react';
import {useTranslation} from 'react-i18next';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import {useMsal} from '@azure/msal-react';
import {motion, AnimatePresence} from 'framer-motion';
import {useAlertContext} from '@shared/hooks/Alerts';

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
  const [postsPerLoad, setPostsPerLoad] = useState(10);

  const [heartsCount, setHeartsCount] = useState(hearts);
  const [clapsCount, setClapsCount] = useState(claps);
  const [celebrationsCount, setCelebrationsCount] = useState(celebrations);

  const [showReactions, setShowReactions] = useState(false);

  const reactionVariance = {
    visible: {
      opacity: 1,
    },
    hidden: {
      opacity: 0,
    },
  };

  interface EmojiContainerProps {
    type: number;
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

  const EmojiContainerReactionStyles = {
    background: theme.interface.contrastMain,
    border: theme.border.default,
    borderRadius: '25%/50%',
    width: 'fit-content',
    display: 'flex',
    top: '-60px',
    padding: '5px',
    marginLeft: '-32px',
    position: 'absolute',
  };

  const EmojiReactionStyles = {
    fontSize: '25px',
    marginRight: '5px',
    userSelect: 'none',
  };

  const EmojiStyles = {
    fontSize: '20px',
    marginRight: '5px',
    userSelect: 'none',
  };

  async function handleReactionServer(type: number) {
    const res = await reactPost(type, id);
    // check if res is undefined
    if (!res) {
      // display error message
      dispatchAlert.error(t('error'));
    }
  }

  async function handleReactionClick(type: number) {
    // check if user is logged in
    if (!accounts.length) {
      return;
    }
    let isRemoved = false;

    switch (type) {
      case 0:
        isRemoved = updateHeart();
        break;
      case 1:
        isRemoved = updateClaps();
        break;
      case 2:
        isRemoved = updateCelebrations();
        break;
      default:
        break;
    }

    setShowReactions(false);
    handleReactionServer(type);
    return isRemoved;
  }

  function updateHeart() {
    const heartIndex = heartsCount.indexOf(accounts[0].localAccountId);
    const newHeartsCount = [...heartsCount];
    if (heartIndex > -1) {
      newHeartsCount.splice(heartIndex, 1);
      setHeartsCount(newHeartsCount);
      return true;
    }
    setHeartsCount([...newHeartsCount, accounts[0].localAccountId]);

    return false;
  }

  function updateClaps() {
    const clapIndex = clapsCount.indexOf(accounts[0].localAccountId);
    const newClapsCount = [...clapsCount];
    if (clapIndex > -1) {
      newClapsCount.splice(clapIndex, 1);
      setClapsCount(newClapsCount);
      return true;
    }
    setClapsCount([...newClapsCount, accounts[0].localAccountId]);
    return false;
  }

  function updateCelebrations() {
    const celebrationIndex = celebrationsCount.indexOf(
      accounts[0].localAccountId,
    );
    const newCelebrationsCount = [...celebrationsCount];
    if (celebrationIndex > -1) {
      newCelebrationsCount.splice(celebrationIndex, 1);
      setCelebrationsCount(newCelebrationsCount);
      return true;
    }
    setCelebrationsCount([...newCelebrationsCount, accounts[0].localAccountId]);
    return false;
  }

  const EmojiContainer = (props: EmojiContainerProps) => {
    const {type, emoji, text} = props;

    return (
      <AnimatePresence mode="sync">
        <Box
          key={`reaction-${type}-{id}-{text}`}
          component={motion.div}
          whileHover={{scale: 1.2}}
          whileTap={{scale: 0.9}}
          onClick={() => handleReactionClick(type)}
          sx={EmojiContainerStyles}
          layout
        >
          <Box component={motion.div} sx={EmojiStyles}>
            {emoji}
          </Box>
          {text.length > 0 && (
            <Typography
              component={motion.span}
              sx={{fontWeight: theme.typography.fontWeightMedium}}
              variant="body1"
            >
              {text}
            </Typography>
          )}
        </Box>
      </AnimatePresence>
    );
  };

  return (
    <Box sx={{position: 'relative'}}>
      <AnimatePresence mode="sync">
        {showReactions && (
          <ClickAwayListener
            onClickAway={() => setShowReactions(!showReactions)}
          >
            <Box
              key={`reaction-container-${id}`}
              component={motion.div}
              sx={EmojiContainerReactionStyles}
              variants={reactionVariance}
              initial="hidden"
              animate={showReactions ? 'visible' : 'hidden'}
              exit="hidden"
            >
              <Typography
                key={`reaction-heart-${id}`}
                sx={EmojiReactionStyles}
                component={motion.div}
                whileHover={{scale: 1.2}}
                whileTap={{scale: 0.9}}
                onClick={() => handleReactionClick(0)}
                onMouseOver={() => setShowReactions(true)}
                onMouseOut={() => setShowReactions(false)}
                layout
              >
                ❤️
              </Typography>
              <Typography
                key={`reaction-clap-${id}`}
                sx={EmojiReactionStyles}
                component={motion.div}
                whileHover={{scale: 1.5}}
                whileTap={{scale: 0.9}}
                onClick={() => handleReactionClick(1)}
                onMouseOver={() => setShowReactions(true)}
                onMouseOut={() => setShowReactions(false)}
                layout
              >
                👏
              </Typography>
              <Typography
                key={`reaction-celebrate-${id}`}
                sx={EmojiReactionStyles}
                component={motion.div}
                whileHover={{scale: 1.5}}
                whileTap={{scale: 0.9}}
                onClick={() => handleReactionClick(2)}
                onMouseOver={() => setShowReactions(true)}
                onMouseOut={() => setShowReactions(false)}
                layout
              >
                🎉
              </Typography>
            </Box>
          </ClickAwayListener>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <Box
          component={motion.div}
          sx={{display: 'flex', alignItems: 'center'}}
        >
          <Box
            component={motion.div}
            whileHover={{scale: 1.2}}
            whileTap={{scale: 0.9}}
            sx={{marginRight: '10px'}}
            onClick={() => setShowReactions(!showReactions)}
            onMouseOver={() => setShowReactions(true)}
            onMouseOut={() => setShowReactions(false)}
            layout
          >
            <IconButton sx={{marginRight: 0.5}}>
              <AddReactionIcon component={motion.svg} />
            </IconButton>
          </Box>

          {heartsCount.length > 0 && (
            <EmojiContainer
              type={0}
              emoji={<>❤️</>}
              text={heartsCount.length.toString()}
            />
          )}
          {clapsCount.length > 0 && (
            <EmojiContainer
              type={1}
              emoji={<>👏</>}
              text={clapsCount.length.toString()}
            />
          )}
          {celebrationsCount.length > 0 && (
            <EmojiContainer
              type={2}
              emoji={<>🎉</>}
              text={celebrationsCount.length.toString()}
            />
          )}
        </Box>
      </AnimatePresence>
    </Box>
  );
}

export default LikeButtons;
