import {useTheme} from '@mui/material/styles';
import {Box, IconButton} from '@mui/material';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StarBorderRounded} from '@mui/icons-material';
import {AnimatePresence, motion} from 'framer-motion';
import {useAlertContext} from '@shared/hooks/Alerts';
import {useQueryClient} from 'react-query';

import {EmojiContainer} from '../shared/EmojiContainer';

import {boostPost} from '@/data/api/requests/posts';

interface IBoostButtonProps {
  postId: string;
  userId: string;
  interactionEnabled: boolean;
  boosts: string[];
  onBoost: () => void;
  onFail: () => void;
}

function BoostButton(props: IBoostButtonProps) {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const {t} = useTranslation();

  const dispatchAlert = useAlertContext();

  const {postId, userId, interactionEnabled, boosts, onBoost, onFail} = props;

  const [boostsCount, setBoostsCount] = useState(boosts);

  const canBoost = () => interactionEnabled && !boostsCount.includes(userId);

  const handleReactionClick = async (type: number) => {
    if (type !== -1) {
      return false;
    }
    setBoostsCount([...boostsCount, userId]);
    onBoost();
    try {
      const res = await boostPost(postId);
      if (!res) {
        // display error message
        dispatchAlert.error(t('errors.BackendError'));
        setBoostsCount([...boostsCount].filter((id) => id !== userId));
        onFail();
        return false;
      }
    } catch (error: any) {
      dispatchAlert.error(error.response.data);
      setBoostsCount([...boostsCount].filter((id) => id !== userId));
      onFail();
      return false;
    }
    await queryClient.invalidateQueries();
    return true;
  };

  return (
    <Box sx={{position: 'relative'}}>
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
            whileHover={{scale: 1.2}}
            whileTap={{scale: 0.9}}
            sx={{marginRight: '10px'}}
            layout
          >
            {canBoost() && boostsCount.length === 0 && (
              <IconButton
                sx={{
                  marginRight: 0.5,
                  color: theme.interface.icon,
                }}
                onClick={() => handleReactionClick(-1)}
              >
                <StarBorderRounded component={motion.svg} />
              </IconButton>
            )}
          </Box>

          <EmojiContainer
            likes={boostsCount}
            type={-1}
            emoji={<>&#x2B50;</>}
            enabled={canBoost()}
            handleReactionClick={handleReactionClick}
          />
        </Box>
      </AnimatePresence>
    </Box>
  );
}

export default BoostButton;
