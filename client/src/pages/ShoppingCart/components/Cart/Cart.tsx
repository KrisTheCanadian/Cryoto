/* eslint-disable id-length */
/* eslint-disable @shopify/jsx-no-hardcoded-content */

import {
  Box,
  Divider,
  Paper,
  Typography,
  Grid,
  Button,
  CardMedia,
} from '@mui/material';
import {useMarketplaceContext} from '@shared/hooks/MarketplaceContext';
import {useTheme} from '@mui/material/styles';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

import {CartItem} from '../components';
import {routeCheckout, routeMarket} from '../../../routes';

import {ICartItem} from '@/data/api/types/ICart';

interface ICartProps {
  checkout: boolean;
}

function Cart(props: ICartProps) {
  const theme = useTheme();
  const {t} = useTranslation();
  const {cartItems} = useMarketplaceContext();
  const [total, setTotal] = useState<number>(0);
  const [checkout, setCheckout] = useState(props.checkout);

  useEffect(() => {
    let coins = 0;
    cartItems.forEach((item: ICartItem) => {
      coins += item.points * item.quantity;
    });
    setTotal(coins);
  }, [cartItems]);

  const navigate = useNavigate();
  const routeChangeCheckout = () => {
    navigate(routeCheckout);
  };
  const routeChangeMarket = () => {
    navigate(routeMarket);
  };

  const paperStyle = {
    width: '80%',
    mb: 3,

    [theme.breakpoints.down('md')]: {
      width: '85%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    [theme.breakpoints.up('lg')]: {
      width: checkout ? '90%' : '75%',
    },
    [theme.breakpoints.up('xl')]: {
      width: checkout ? '90%' : '65%',
      p: 2,
    },
    pb: checkout ? 4 : 0,
    diplay: 'flex',
    justifyContent: 'center',
  };

  const titleStyle = {
    fontSize: 14,
    [theme.breakpoints.up('lg')]: {
      fontSize: 16,
    },
  };

  return (
    <Box
      flex={8}
      p={0}
      sx={{ml: '0!important'}}
      display="flex"
      alignItems="center"
      flexDirection="column"
    >
      <Box p={2} />
      <Paper sx={paperStyle}>
        <Typography
          variant="subtitle2"
          sx={{
            mt: 2,
            ml: 3,
            mb: 2,
            [theme.breakpoints.up('lg')]: {
              mb: checkout ? 0 : 3,
            },
          }}
        >
          {!checkout && t<string>('cart.Cart')}
          {checkout && t<string>('cart.OrderSummary')}
        </Typography>

        <Box
          sx={{
            m: 1,
            [theme.breakpoints.up('lg')]: {
              m: 2,
            },
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{
              display: !checkout && cartItems.length > 0 ? 'flex' : 'none',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Grid item xs={5} sm={6}>
              <Typography sx={titleStyle}>
                {t<string>('cart.ItemDescription')}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={titleStyle}>
                {t<string>('cart.Quantity')}
              </Typography>
            </Grid>
            <Grid item xs={2} xl={2.5}>
              <Typography sx={titleStyle}>{t<string>('cart.Price')}</Typography>
            </Grid>
          </Grid>

          <Divider sx={{ml: 1, mr: 2, mt: 1, mb: checkout ? 1 : 0}} />

          {cartItems?.map((i: ICartItem) => (
            <CartItem
              key={String(i.id) + i.size}
              id={i.id}
              image={i.image}
              title={i.title}
              points={i.points}
              size={i.size}
              quantity={i.quantity}
              total={total}
              setTotal={setTotal}
              checkout={checkout}
            />
          ))}

          <Box
            sx={{
              m: 3,
              display: cartItems.length === 0 ? 'flex' : 'none',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <CardMedia
              data-testid="itemImage"
              sx={{
                maxHeight: 300,
                maxWidth: 300,
              }}
              component="img"
              image="images/jpgImages/Cart.jpg"
            />
            <Typography variant="h6"> {t<string>('cart.EmptyCart')}</Typography>
            <Typography sx={{mt: 2, textAlign: 'center'}}>
              {t<string>('cart.EmptyCartLongMessage')}
            </Typography>
          </Box>

          <Grid container spacing={2} columns={16}>
            {!checkout && cartItems.length > 0 && (
              <>
                <Grid
                  item
                  xs={10}
                  sm={12}
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Typography
                    data-testid="total"
                    sx={{titleStyle, mt: 2, ml: 2}}
                  >
                    {t<string>('cart.Total')}:
                  </Typography>
                </Grid>
                <Grid item sm={4}>
                  <Typography sx={{titleStyle, fontWeight: 500, mt: 2, ml: 2}}>
                    {total} {t<string>('marketplace.Coins')}
                  </Typography>
                </Grid>
              </>
            )}

            <Grid
              item
              xs={15}
              sx={{
                mt: 1,
                [theme.breakpoints.up('lg')]: {
                  mt: 3,
                },
                mb: 3,
                display: checkout ? 'none' : 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                data-testid="continue-shopping"
                variant="outlined"
                sx={{
                  fontSize: 13,
                  [theme.breakpoints.up('lg')]: {
                    fontSize: 15,
                  },
                }}
                onClick={() => {
                  routeChangeMarket();
                }}
              >
                {t<string>('cart.ContinueShopping')}
              </Button>

              <Button
                data-testid="proceed-checkout"
                variant="contained"
                sx={{
                  display: cartItems.length > 0 ? 'inherit' : 'none',
                  ml: 2,
                  fontSize: 13,
                  [theme.breakpoints.up('lg')]: {
                    fontSize: 15,
                  },
                }}
                onClick={() => {
                  setCheckout(true);
                  routeChangeCheckout();
                }}
              >
                {t<string>('cart.ProceedCheckout')}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

export default Cart;
