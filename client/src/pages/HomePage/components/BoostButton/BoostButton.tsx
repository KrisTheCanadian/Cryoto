/* eslint-disable @shopify/jsx-no-complex-expressions */
import {useTheme} from '@mui/material/styles';
import {Box, Button, Tooltip} from '@mui/material';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAlertContext} from '@shared/hooks/Alerts';
import {useQueryClient} from 'react-query';
import {useMsal} from '@azure/msal-react';

import {IUserMinimal} from '@/data/api/types/IUser';
import {boostPost} from '@/data/api/requests/posts';

interface IBoostButtonProps {
  postId: string;
  userId: string;
  boosts: string[];
  boostProfiles: IUserMinimal[];
  recipients: string[];
  handleBoost: () => void;
}

function BoostButton(props: IBoostButtonProps) {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const {t} = useTranslation();
  const dispatchAlert = useAlertContext();

  const {postId, userId, recipients, boosts, boostProfiles, handleBoost} =
    props;
  const [boostsCount, setBoostsCount] = useState<string[]>(boosts);

  const {accounts} = useMsal();

  const getBoosters = () => {
    let boostString = '';
    boostProfiles.map((i: IUserMinimal) => {
      if (boostProfiles.length === 1) boostString = `${i.name}`;
      else boostString = `${boostString} ${i.name}, `;
    });

    if (boostProfiles.length > 0) return `Boosted by \n${boostString}`;
    else return '';
  };

  const canBoost = () => {
    const userRoles = accounts[0]?.idTokenClaims?.roles ?? [];
    const isRecipient = recipients.includes(userId) && recipients.length === 1;
    const hasAcceptedRole = userRoles.some((role) =>
      ['Partner', 'SeniorPartner'].includes(role),
    );
    const hasBoosted = boostsCount.includes(userId);
    return !isRecipient && hasAcceptedRole && !hasBoosted;
  };

  const handleBoostPost = async () => {
    if (canBoost()) {
      setBoostsCount([...boostsCount, userId]);
      try {
        await boostPost(postId);
      } catch (error: any) {
        dispatchAlert.error(error.response.data);
        setBoostsCount([...boostsCount].filter((id) => id !== userId));
        return false;
      }
      queryClient.invalidateQueries('walletsBalance');
      handleBoost();
    }
  };

  return (
    <Box sx={{position: 'relative'}}>
      {(boostsCount.length > 0 || canBoost()) && (
        <Tooltip
          title={getBoosters()}
          placement="top"
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: theme.palette.primary.light,
                maxWidth: 200,
              },
            },
          }}
        >
          <Box>
            <Button
              data-testid="boost-button"
              variant={canBoost() ? 'outlined' : 'contained'}
              disabled={!canBoost()}
              sx={{
                borderRadius: '12px',
                height: '32px',
                '&:disabled': {
                  opacity: 1,
                  color: 'white',
                  background: theme.palette.primary.main,
                  cursor: 'not-allowed',
                },
              }}
              onClick={handleBoostPost}
            >
              {canBoost() ? t<string>('Boost') : t<string>('Boosted')}
              <> &#x2B50;</>
            </Button>
          </Box>
        </Tooltip>
      )}
    </Box>
  );
}

export default BoostButton;
