/* eslint-disable @shopify/jsx-no-complex-expressions */
import {useTranslation} from 'react-i18next';
import {useTheme} from '@mui/material/styles';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {useQuery} from 'react-query';

import {getTokenBalance} from '@/data/api/requests/wallet';
import IWalletsBalance from '@/data/api/types/IWalletsBalance';

export const walletBalanceQuery = 'walletsBalance';

function MiniWallet() {
  const theme = useTheme();
  const {t} = useTranslation();

  const {data, status} = useQuery<IWalletsBalance>(
    'walletsBalance',
    getTokenBalance,
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
            {status === 'loading' ? (
              <CircularProgress
                data-testid="spendCircularProgress"
                size="2rem"
              />
            ) : (
              <ListItemText
                primary={data?.toSpendBalance}
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
            {status === 'loading' ? (
              <CircularProgress
                data-testid="awardCircularProgress"
                size="2rem"
              />
            ) : (
              <ListItemText
                primary={data?.toAwardBalance}
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
