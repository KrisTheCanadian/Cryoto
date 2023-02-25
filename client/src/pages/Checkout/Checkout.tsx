/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @shopify/strict-component-boundaries */
/* eslint-disable @shopify/jsx-no-hardcoded-content */
/* eslint-disable id-length */
import {
  Box,
  Divider,
  IconButton,
  Typography,
  Paper,
  Button,
  TextField,
} from '@mui/material';
import {Check, CheckCircle, Edit, ArrowBackIosNew} from '@mui/icons-material';
import {useMarketplaceContext} from '@shared/hooks/MarketplaceContext';
import {useTheme} from '@mui/material/styles';
import {useTranslation} from 'react-i18next';
import {useContext, useEffect, useState} from 'react';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import PageFrame from '@shared/components/PageFrame';
import {useMsal} from '@azure/msal-react';
import {useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import {AlertContext} from '@shared/hooks/Alerts/AlertContext';

import {Cart} from '../ShoppingCart/components/Cart';
import {routeMarket, routeShoppingCart} from '../routes';

import {EditAddressDialog} from './components';

import {completePurchase} from '@/data/api/requests/marketplace';
import IAddress from '@/data/api/types/IAddress';
import {ICartItem, IOrder, IOrderItem} from '@/data/api/types/ICart';
import {getDefaultAddress} from '@/data/api/requests/address';
import {getUserProfile} from '@/data/api/requests/users';
import {IUserProfile} from '@/data/api/types/IUser';

function Checkout() {
  const theme = useTheme();
  const {t} = useTranslation();
  const dispatch = useContext(AlertContext);
  const queryClient = useQueryClient();
  const {accounts} = useMsal();
  const username = accounts[0] && accounts[0].name;

  const [email, setEmail] = useState('');
  const [editEmail, setEditEmail] = useState(false);
  const [editAddressOpen, setEditAddressOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<IAddress>();
  const [emailAddress, setEmailAddress] = useState<string>();
  const {cartItems} = useMarketplaceContext();
  const [total, setTotal] = useState<number>(0);
  const [order, setOrder] = useState<IOrder>();
  const items: IOrderItem[] = [];

  const handleEditAddressOpen = () => setEditAddressOpen(true);

  useEffect(() => {
    let coins = 0;
    cartItems.forEach((item: any) => {
      coins += item.points * item.quantity;
    });
    setTotal(coins);
  }, [cartItems]);

  const {data: defaultAddressData, status: defaultAddressStatus} =
    useQuery<IAddress>('defaultAddress', getDefaultAddress);

  useEffect(() => {
    if (defaultAddressStatus === 'success')
      setShippingAddress(defaultAddressData);
  }, [defaultAddressData, defaultAddressStatus]);

  const {data: userProfileData, status: userProfileStatus} =
    useQuery<IUserProfile>('userprofile', getUserProfile);

  useEffect(() => {
    if (userProfileStatus === 'success') {
      setEmailAddress(userProfileData?.email);
      setEmail(userProfileData?.email);
    }
  }, [userProfileData, userProfileStatus]);

  const navigate = useNavigate();
  const routeChange = () => {
    navigate(routeShoppingCart);
  };

  const routeChangeMarket = () => {
    navigate(routeMarket);
  };

  const generateRandomNumber = () => {
    return (Math.floor(Math.random() * 9000000000) + 1000000000).toString();
  };

  const placeOrder = () => {
    cartItems.forEach((item: ICartItem) => {
      items.push({id: item.id, quantity: item.quantity, size: item.size});
    });

    if (emailAddress && shippingAddress) {
      const orderId = generateRandomNumber();
      setOrder({
        id: orderId,
        email: emailAddress,
        shippingAddress,
        items,
        date: new Date(),
      });
    }
  };

  const {mutate: buyItems} = useMutation(
    (order: IOrder) => completePurchase(order),
    {
      onSuccess() {
        if (order) {
          navigate(`/orders/${order.id}`, {state: {data: order}});
        }
      },
      onError: (err: any) => {
        dispatch.error(err.response.data);
      },
      onSettled: () => {
        queryClient.invalidateQueries(['transactions']);
        queryClient.invalidateQueries(['walletsBalance']);
      },
    },
  );

  useEffect(() => {
    if (order) {
      buyItems(order);
    }
  }, [order]);

  const checkoutBoxStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '55%',
    mt: 2,
    pt: 2,
    ml: 3,
    mb: 2,
    [theme.breakpoints.up('xl')]: {
      pt: 4,
    },
  };

  const boxStyle = {
    display: 'flex',
    border: 1,
    borderColor: theme.palette.primary.main,
    borderRadius: 2,
    m: 2,
  };

  const headingStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
  };

  const headingLineStyle = {
    display: 'flex',
    alignItems: 'center',
    ml: 2,
    mt: 2,
    width: '90%',
  };

  const titleStyle = {
    fontSize: 13,
    [theme.breakpoints.up('xl')]: {
      fontSize: 15,
    },
  };

  return (
    <PageFrame>
      <Box flex={8} p={0} sx={{ml: '0!important'}}>
        <Box
          p={2}
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: {
                xs: 'none',
                sm: 'none',
                md: 'none',
                lg: 'flex',
              },
              width: '40%',
            }}
          >
            <motion.div
              initial={{opacity: 0, x: 80}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.5}}
            >
              <Cart checkout />
            </motion.div>
          </Box>
          <Box
            sx={{
              width: {
                xs: '95%',
                sm: '70%',
                lg: '45%',
                xl: '40%',
              },
            }}
          >
            <motion.div
              initial={{opacity: 0, x: -80}}
              animate={{opacity: 1, x: 0}}
              transition={{duration: 0.5}}
            >
              <Paper
                sx={{
                  mr: 1,
                  pb: 2,
                  mt: {xs: 1, sm: 4},
                }}
              >
                <Box sx={checkoutBoxStyle}>
                  <IconButton
                    data-testid="ToShoppingCartButton"
                    sx={{
                      border: 1,
                      borderColor: '#eeeeee',

                      display: {
                        md: 'flex',
                        lg: 'none',
                      },
                    }}
                    onClick={routeChange}
                  >
                    <ArrowBackIosNew
                      sx={{
                        fontSize: 15,
                        color: theme.interface.icon,
                      }}
                    />
                  </IconButton>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      ml: {
                        md: 0,
                        lg: 1,
                      },
                    }}
                  >
                    {t<string>('cart.Checkout')}
                  </Typography>
                </Box>
                <Box sx={{p: 3, pt: 0}}>
                  <Divider sx={{ml: 1, mr: 2, mt: 1}} />
                  <Box sx={boxStyle}>
                    <Box
                      sx={{
                        backgroundColor: theme.palette.primary.light,
                        borderTopLeftRadius: 6,
                        borderBottomLeftRadius: 6,
                        minWidth: 10,
                        height: editEmail ? 120 : 100,
                        float: 'left',
                      }}
                    />
                    <Box sx={headingStyle}>
                      <Box sx={headingLineStyle}>
                        <CheckCircle color="primary" fontSize="small" />
                        <Typography
                          variant="subtitle1"
                          sx={{ml: 2, fontWeight: 500, flexGrow: 1}}
                        >
                          1. {t<string>('settings.Email')}
                        </Typography>

                        <IconButton
                          data-testid="editEmailButton"
                          onClick={() => {
                            setEditEmail(true);
                          }}
                          sx={{display: editEmail ? 'none' : 'inherit'}}
                        >
                          <Edit
                            sx={{
                              fontSize: 15,
                              color: theme.interface.icon,
                            }}
                          />
                        </IconButton>

                        <IconButton
                          data-testid="saveEmailButton"
                          sx={{
                            display: editEmail ? 'inherit' : 'none',
                            borderRadius: 2,
                          }}
                          onClick={() => {
                            setEmailAddress(email);
                            setEditEmail(false);
                          }}
                        >
                          <Check
                            sx={{
                              fontSize: 17,
                            }}
                          />
                        </IconButton>
                      </Box>

                      <Typography
                        sx={{
                          display: editEmail ? 'none' : 'inherit',
                          fontSize: 13,
                          [theme.breakpoints.up('xl')]: {
                            fontSize: 15.5,
                          },
                          ml: 7,
                          mt: 1,
                          mb: 2,
                          [theme.breakpoints.between(1200, 1250)]: {
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            maxWidth: 200,
                          },
                          [theme.breakpoints.down(450)]: {
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            maxWidth: 150,
                          },
                        }}
                      >
                        {emailAddress}
                      </Typography>

                      <Box
                        sx={{
                          display: editEmail ? 'inherit' : 'none',
                          ml: {xs: 3, sm: 7},
                          mb: 3,
                          mt: 1,
                        }}
                      >
                        <TextField
                          data-testid="editEmailField"
                          size="small"
                          inputProps={{style: {fontSize: 15}}}
                          sx={{minWidth: '90%'}}
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                        />
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={boxStyle}>
                    <Box
                      sx={{
                        backgroundColor: theme.palette.primary.light,
                        borderTopLeftRadius: 6,
                        borderBottomLeftRadius: 6,
                        minWidth: 10,
                        height: 160,
                        [theme.breakpoints.up('xl')]: {
                          height: 170,
                        },
                        [theme.breakpoints.down(450)]: {
                          height: 210,
                        },
                        float: 'left',
                      }}
                    />
                    <Box sx={headingStyle}>
                      <Box sx={headingLineStyle}>
                        <CheckCircle color="primary" fontSize="small" />
                        <Typography
                          variant="subtitle1"
                          sx={{ml: 2, fontWeight: 500, flexGrow: 1}}
                        >
                          2. {t<string>('cart.ShippingAddress')}
                        </Typography>
                        <IconButton
                          data-testid="editAddress"
                          onClick={handleEditAddressOpen}
                        >
                          <Edit
                            sx={{
                              fontSize: 15,
                              color: theme.interface.icon,
                            }}
                          />
                        </IconButton>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          m: 2,
                          ml: 7,
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              fontSize: 13,
                              [theme.breakpoints.up('xl')]: {
                                fontSize: 15,
                              },
                              fontWeight: 500,
                            }}
                          >
                            {username}
                          </Typography>
                          <Typography sx={titleStyle}>
                            {shippingAddress?.streetNumber}{' '}
                            {shippingAddress?.street}
                            {shippingAddress?.apartment &&
                              `, Unit ${shippingAddress?.apartment}`}
                            <br />
                            {shippingAddress?.city} {shippingAddress?.province},{' '}
                            {shippingAddress?.postalCode}
                            <br />
                            {shippingAddress?.country}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ml: 1, mr: 2, mt: 1}} />
                  <Box sx={{ml: 4, mr: 5, mt: 2, mb: 2}}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle2">
                        {t<string>('cart.Total')}
                      </Typography>
                      <Typography sx={{fontWeight: 500}}>
                        {total} {t<string>('marketplace.Coins')}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{color: theme.interface.icon}}
                    >
                      {cartItems.length > 0 && t<string>('cart.TermsCondition')}
                      {cartItems.length === 0 &&
                        t<string>('cart.EmptyCartCheckoutMessage')}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: cartItems.length > 0 ? 'flex' : 'none',
                      justifyContent: 'center',
                    }}
                  >
                    <Button
                      data-testid="placeOrder"
                      variant="contained"
                      sx={{
                        mr: 2,
                        fontSize: 13,
                        [theme.breakpoints.up('xl')]: {
                          fontSize: 15,
                        },
                        width: '95%',
                        ml: 2,
                      }}
                      onClick={placeOrder}
                    >
                      {t<string>('cart.PlaceOrder')}
                    </Button>
                  </Box>

                  <Box
                    sx={{
                      display: cartItems.length === 0 ? 'flex' : 'none',
                      justifyContent: 'right',
                    }}
                  >
                    <Button
                      data-testid="continueShopping"
                      variant="outlined"
                      sx={{
                        fontSize: 13,
                        [theme.breakpoints.up('xl')]: {
                          fontSize: 15,
                        },
                      }}
                      onClick={() => {
                        routeChangeMarket();
                      }}
                    >
                      {t<string>('cart.ContinueShopping')}
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Box>
        </Box>
        <EditAddressDialog
          shippingAddress={shippingAddress}
          setShippingAddress={setShippingAddress}
          editAddressOpen={editAddressOpen}
          setEditAddressOpen={setEditAddressOpen}
        />
      </Box>
    </PageFrame>
  );
}

export default Checkout;
