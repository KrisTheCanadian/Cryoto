/* eslint-disable @shopify/jsx-no-hardcoded-content */

import {useTheme} from '@mui/material/styles';
import {Box, CardMedia, Grid, Paper, Typography} from '@mui/material';
import PageFrame from '@shared/components/PageFrame';
import {useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {motion} from 'framer-motion';
import moment from 'moment';

import {IOrder} from '@/data/api/types/ICart';

function Orders() {
  const theme = useTheme();
  const {t, i18n} = useTranslation();
  const location = useLocation();
  const order: IOrder = location.state?.data;

  const lang = i18n.language.substring(0, 2);
  moment.locale(lang);
  const monthName = moment(order.date).locale(t('locale')).format('MMMM');

  const boxStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const paperStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '80%',
    [theme.breakpoints.down('sm')]: {
      width: '97.5%',
    },
    [theme.breakpoints.up('xl')]: {
      width: '60%',
    },
    pb: 2,
  };

  return (
    <PageFrame>
      <Box flex={8} p={0} sx={{ml: '0!important'}}>
        <motion.div
          initial={{opacity: 0, y: -80}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.5}}
        >
          <Box p={2} display="flex" alignItems="center" flexDirection="column">
            <Paper sx={paperStyle}>
              <Box
                sx={{
                  width: '80%',
                  [theme.breakpoints.up('xl')]: {
                    width: '70%',
                  },
                  [theme.breakpoints.down('sm')]: {
                    width: '95%',
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <CardMedia
                  data-testid="orderReceivedImage"
                  sx={{
                    mt: 2.5,
                    maxHeight: 400,
                    maxWidth: 400,
                  }}
                  component="img"
                  image="images/jpgImages/orderCompleted.jpg"
                />
                <Typography variant="h4" sx={{textAlign: 'center'}}>
                  {t<string>('order.OrderReceived')}
                </Typography>

                <Typography sx={{textAlign: 'center', mt: 2}}>
                  {t<string>('order.ThankYou')}
                  <Box component="span" fontWeight="fontWeightMedium">
                    {order.email}
                  </Box>
                  .
                </Typography>

                <Grid container sx={{mt: 5, mb: 3}}>
                  <Grid item xs={6} md={6} lg>
                    <Box sx={boxStyle}>
                      <Typography variant="subtitle2" sx={{fontSize: 17}}>
                        {t<string>('order.OrderDate')}
                      </Typography>
                      <Typography
                        data-testid="orderDate"
                        sx={{textTransform: 'capitalize'}}
                      >
                        {monthName} {order.date.getDate()},{' '}
                        {order.date.getFullYear()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={6} lg>
                    <Box sx={boxStyle}>
                      <Typography
                        data-testid="orderNumber"
                        variant="subtitle2"
                        sx={{fontSize: 17}}
                      >
                        {t<string>('order.OrderNumber')}
                      </Typography>
                      <Typography>{order.id}</Typography>
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={16}
                    md={16}
                    lg
                    sx={{order: 4, mt: {xs: 3, md: 3, lg: 0}}}
                  >
                    <Box sx={boxStyle}>
                      <Typography
                        data-testid="shippingAddress"
                        variant="subtitle2"
                        sx={{
                          fontSize: 17,
                          [theme.breakpoints.up('md')]: {
                            textAlign: 'center',
                          },
                        }}
                      >
                        {t<string>('cart.ShippingAddress')}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 15,
                          [theme.breakpoints.up('md')]: {
                            textAlign: 'center',
                          },
                        }}
                      >
                        {order.shippingAddress.streetNumber}{' '}
                        {order.shippingAddress.street}
                        {order.shippingAddress.apartment &&
                          `, ${t<string>('settings.Unit')} ${
                            order.shippingAddress.apartment
                          }`}
                        <br />
                        {order.shippingAddress.city}{' '}
                        {order.shippingAddress.province},{' '}
                        {order.shippingAddress.postalCode}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Box>
        </motion.div>
      </Box>
    </PageFrame>
  );
}

export default Orders;
