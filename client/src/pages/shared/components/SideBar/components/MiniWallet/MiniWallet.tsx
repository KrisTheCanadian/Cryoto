/* eslint-disable @shopify/jsx-no-complex-expressions */

import {useTranslation} from 'react-i18next';
import {useMsal} from '@azure/msal-react';
import {useTheme} from '@mui/material/styles';
import {getTokenBalance} from '@shared/hooks/getTokenBalance';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {InteractionStatus} from '@azure/msal-browser';
import {useQuery} from 'react-query';

export const toSpendQuery = 'tospend';
export const toAwardQuery = 'toaward';

function MiniWallet() {
  const theme = useTheme();
  const {inProgress} = useMsal();
  const {t} = useTranslation();

  const loadToAwardCoins = async () => {
    if (inProgress === InteractionStatus.None) {
      return getTokenBalance('toAward');
    }
  };

  const {data: toAwardCoins, status: awardStatus} = useQuery(
    toAwardQuery,
    loadToAwardCoins,
  );

  const loadToSpendCoins = async () => {
    return getTokenBalance('toSpend');
  };

  const {data: toSpendCoins, status: spendStatus} = useQuery(
    toSpendQuery,
    loadToSpendCoins,
  );

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
            {spendStatus === 'loading' ? (
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
            {awardStatus === 'loading' ? (
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
