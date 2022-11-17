/* eslint-disable promise/no-nesting */
/* eslint-disable promise/catch-or-return */
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
} from '@mui/material';

import {loginRequest} from '@/pages/Authentication/authConfig';

function MiniWallet() {
  const theme = useTheme();
  const isAuthenticated = useIsAuthenticated();
  const {instance, accounts} = useMsal();
  const [toSpendCoins, setToSpendCoins] = useState('-');
  const [toAwardCoins, setToAwardCoins] = useState('-');
  const {t} = useTranslation();

  useEffect(() => {
    if (!isAuthenticated) return;

    const request = {
      ...loginRequest,
      account: accounts[0],
    };

    // Silently acquires an access token which is then attached to a request for Microsoft Graph data
    instance
      .acquireTokenSilent(request)
      .then((response) => {
        getTokenBalance('toSpend', response.accessToken)
          .then((response: any) => setToSpendCoins(response))
          .catch(() => setToSpendCoins('-'));
        getTokenBalance('toAward', response.accessToken)
          .then((response: any) => setToAwardCoins(response))
          .catch(() => setToAwardCoins('-'));
      })
      .catch(() => {
        instance.acquireTokenPopup(request).then((response) => {
          getTokenBalance('toSpend', response.accessToken)
            .then((response: any) => setToSpendCoins(response))
            .catch(() => setToSpendCoins('-'));
          getTokenBalance('toAward', response.accessToken)
            .then((response: any) => setToAwardCoins(response))
            .catch(() => setToAwardCoins('-'));
        });
      });
  }, [accounts, instance, isAuthenticated]);

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
            <ListItemText
              primary={toSpendCoins}
              primaryTypographyProps={amountStyle}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={t('layout.ToAward')}
              primaryTypographyProps={subtitleStyle}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={toAwardCoins}
              primaryTypographyProps={amountStyle}
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}

export default MiniWallet;
