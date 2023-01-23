/* eslint-disable @shopify/jsx-no-hardcoded-content */
import {Card, Box, Grid, Typography} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import {useMsal} from '@azure/msal-react';

import {getTokenBalance} from '@/data/api/requests/wallet';
import IWalletsBalance from '@/data/api/types/IWalletsBalance';

function CreditCard() {
  const theme = useTheme();
  const {t} = useTranslation();

  const {accounts} = useMsal();
  const username = accounts[0] && accounts[0].name;

  const {data, status} = useQuery<IWalletsBalance>(
    'walletsBalance',
    getTokenBalance,
  );

  return (
    <Card
      sx={{
        maxWidth: 325,
        minHeight: 200,
        borderRadius: 3,
        boxShadow: 3,
        backgroundImage: `url(${'images/svgIcons/CreditCardDesign.svg'})`,
      }}
    >
      <Box pl={3} pt={2} pr={1}>
        <Grid container spacing={1}>
          <Grid item xs={12} sx={{display: 'flex', justifyContent: 'flex-end'}}>
            <img src="images/svgIcons/CreditCardLogo.svg" alt="logo" />
            <Typography
              id="brand-name"
              variant="subtitle1"
              sx={{
                fontStyle: 'italic',
                fontWeight: 'bold',
                color: theme.palette.common.white,
                paddingLeft: 0.5,
              }}
            >
              Cryoto
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography
              id="balance"
              variant="h6"
              sx={{
                fontWeight: 'medium',
                color: theme.palette.common.white,
                letterSpacing: '0.08em',
              }}
            >
              {t<string>('wallet.creditCard.Balance')}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{display: 'flex', justifyContent: 'space-evenly'}}>
              <Grid item xs={6} sx={{display: 'flex', flexDirection: 'column'}}>
                <Typography
                  id="to-award"
                  variant="body1"
                  sx={{
                    color: theme.palette.common.white,
                    letterSpacing: '0.05em',
                    fontWeight: 'light',
                  }}
                >
                  {t<string>('wallet.toAward')}
                </Typography>
                <Typography
                  id="to-award-balance"
                  variant="body1"
                  sx={{color: theme.palette.common.white, fontWeight: 'light'}}
                >
                  $ {data?.toAwardBalance.toFixed(2)}
                </Typography>
              </Grid>

              <Grid item xs={6} sx={{display: 'flex', flexDirection: 'column'}}>
                <Typography
                  id="to-spend"
                  variant="body1"
                  sx={{
                    color: theme.palette.common.white,
                    letterSpacing: '0.05em',
                    fontWeight: 'light',
                  }}
                >
                  {t<string>('wallet.toSpend')}
                </Typography>
                <Typography
                  id="to-spend-balance"
                  variant="body1"
                  sx={{color: theme.palette.common.white, fontWeight: 'light'}}
                >
                  $ {data?.toSpendBalance.toFixed(2)}
                </Typography>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography
              id="name"
              variant="subtitle1"
              pt={1}
              sx={{letterSpacing: '0.08em', color: theme.palette.common.white}}
            >
              {username}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}

export default CreditCard;
