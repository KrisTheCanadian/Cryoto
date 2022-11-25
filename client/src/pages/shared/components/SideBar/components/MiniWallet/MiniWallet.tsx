/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @shopify/jsx-no-complex-expressions */

import {useTranslation} from 'react-i18next';
import {useEffect, useState} from 'react';
import {useMsal, useIsAuthenticated} from '@azure/msal-react';
import {useTheme} from '@mui/material/styles';
import {getTokenBalance} from '@shared/hooks/getTokenBalance';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  CardContent,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import {InteractionStatus} from '@azure/msal-browser';

import {loginRequest} from '@/pages/Authentication/authConfig';
import {getAccessToken} from '@/data/api/helpers';

function MiniWallet() {
  const theme = useTheme();
  const isAuthenticated = useIsAuthenticated();
  const {instance, accounts, inProgress} = useMsal();
  const [toSpendCoins, setToSpendCoins] = useState('-');
  const [toAwardCoins, setToAwardCoins] = useState('-');
  const {t} = useTranslation();

  const loadToAwardCoins = async () => {
    if (inProgress === InteractionStatus.None) {
      const accessToken = await getAccessToken();
      getTokenBalance('toAward', accessToken)
        .then((response: any) => setToAwardCoins(response))
        .catch(() => setToAwardCoins('-'));
    }
  };
  const loadToSpendCoins = async () => {
    const accessToken = await getAccessToken();

    getTokenBalance('toSpend', accessToken)
      .then((response: any) => setToSpendCoins(response))
      .catch(() => setToSpendCoins('-'));
  };

  useEffect(() => {
    if (isAuthenticated && toAwardCoins === '-') loadToAwardCoins();
    if (toAwardCoins !== '-') loadToSpendCoins();
  }, [inProgress, isAuthenticated, toAwardCoins]);

  const subtitleStyle: {[key: string]: 'h7' | number} = {
    variant: 'h7',
    mb: -3,
    ml: -1,
  };
  const amountStyle: {[key: string]: 'center' | 'h3' | 'bold'} = {
    align: 'center',
    variant: 'h3',
    fontWeight: 'bold',
  };

  return (
    <Card
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: theme.palette.primary.light,
        color: theme.palette.getContrastText(theme.palette.primary.light),
        mt: 2,
        mb: 2,
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div" align="center">
          {t('layout.MyBalance')}
        </Typography>
        <List dense sx={{margin: 0, padding: 0}}>
          <ListItem>
            <ListItemText
              primary={t('layout.ToSpend')}
              primaryTypographyProps={subtitleStyle}
            />
          </ListItem>
          <ListItem>
            {toSpendCoins === '-' ? (
              <CircularProgress
                data-testid="spendCircularProgress"
                size="2rem"
              />
            ) : (
              <ListItemText
                primary={toSpendCoins}
                primaryTypographyProps={amountStyle}
              />
            )}
          </ListItem>

          <ListItem>
            <ListItemText
              primary={t('layout.ToAward')}
              primaryTypographyProps={subtitleStyle}
            />
          </ListItem>
          <ListItem>
            {toAwardCoins === '-' ? (
              <CircularProgress
                data-testid="awardCircularProgress"
                size="2rem"
              />
            ) : (
              <ListItemText
                primary={toAwardCoins}
                primaryTypographyProps={amountStyle}
              />
            )}
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}

export default MiniWallet;
