/* eslint-disable no-nested-ternary */
/* eslint-disable @shopify/jsx-no-complex-expressions */
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
  Grid,
  CircularProgress,
} from '@mui/material';
import {Check, CheckCircle, Edit, ArrowBackIosNew} from '@mui/icons-material';
import {useMarketplaceContext} from '@shared/hooks/MarketplaceContext';
import {useTheme} from '@mui/material/styles';
import {Trans, useTranslation} from 'react-i18next';
import React, {useContext, useEffect, useState} from 'react';
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
import IAddress, {IAddAddress} from '@/data/api/types/IAddress';
import {ICartItem, IOrder, IOrderItem} from '@/data/api/types/ICart';
import {getDefaultAddress, addAddress} from '@/data/api/requests/address';
import {getUserProfile} from '@/data/api/requests/users';
import {IUserProfile} from '@/data/api/types/IUser';
import {getTokenBalance} from '@/data/api/requests/wallet';
import IWalletsBalance from '@/data/api/types/IWalletsBalance';

const addressData = [
  {
    label: 'StreetNumber',
    name: 'streetNumber',
    optional: false,
    gridWidth: 3.3,
  },
  {
    label: 'Unit',
    name: 'apartment',
    optional: true,
    gridWidth: 3,
  },
  {
    label: 'Street',
    name: 'street',
    optional: false,
    gridWidth: 8,
  },
  {
    label: 'City',
    name: 'city',
    optional: false,
    gridWidth: 8,
  },
  {
    label: 'Province',
    name: 'province',
    optional: false,
    gridWidth: 8,
  },
  {
    label: 'Country',
    name: 'country',
    optional: false,
    gridWidth: 8,
  },
  {
    label: 'PostalCode',
    name: 'postalCode',
    optional: false,
    gridWidth: 8,
  },
];

function Checkout() {
  const theme = useTheme();
  const {t} = useTranslation();
  const dispatch = useContext(AlertContext);
  const queryClient = useQueryClient();
  const {accounts} = useMsal();
  const username = accounts[0] && accounts[0].name;
  const [inProgress, setInProgress] = useState(false);
  const [email, setEmail] = useState('');
  const [editEmail, setEditEmail] = useState(false);
  const [editAddressOpen, setEditAddressOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState<string>();
  const {cartItems, deleteCartItem} = useMarketplaceContext();
  const [total, setTotal] = useState<number>(0);
  const [order, setOrder] = useState<IOrder>();
  const [isAddressEmpty, setIsAddressEmpty] = useState<boolean>();
  const [isSaved, setIsSaved] = useState(false);
  const [isAddressValid, setIsAddressValid] = useState(true);
  const items: IOrderItem[] = [];
  const [shippingAddress, setShippingAddress] = useState<IAddress>({
    id: 0,
    streetNumber: '',
    street: '',
    city: '',
    province: '',
    country: '',
    postalCode: '',
  });

  let toSaveShippingAddress: IAddAddress = {
    id: '0',
    streetNumber: '',
    street: '',
    city: '',
    province: '',
    country: '',
    postalCode: '',
  };

  const handleEditAddressOpen = () => setEditAddressOpen(true);

  const {data, status} = useQuery<IWalletsBalance>(
    'walletsBalance',
    getTokenBalance,
  );

  // Get Cart Total
  useEffect(() => {
    let coins = 0;
    cartItems.forEach((item: any) => {
      coins += item.points * item.quantity;
    });
    setTotal(coins);
  }, [cartItems]);

  // Initalizing data
  useEffect(() => {
    queryClient.invalidateQueries('defaultAddress');
  }, []);

  const {data: defaultAddressData, status: defaultAddressStatus} =
    useQuery<IAddress>('defaultAddress', getDefaultAddress);

  useEffect(() => {
    if (defaultAddressStatus === 'success') {
      // eslint-disable-next-line no-negated-condition
      if (!defaultAddressData) setIsAddressEmpty(true);
      else {
        setIsAddressEmpty(false);
        setShippingAddress(defaultAddressData);
      }
    }
  }, [defaultAddressData, defaultAddressStatus]);

  const {data: userProfileData, status: userProfileStatus} =
    useQuery<IUserProfile>('userprofile', getUserProfile);

  useEffect(() => {
    if (userProfileStatus === 'success') {
      setEmailAddress(userProfileData?.email);
      setEmail(userProfileData?.email);
    }
  }, [userProfileData, userProfileStatus]);

  // Route Changes
  const navigate = useNavigate();
  const routeChange = () => {
    navigate(routeShoppingCart);
  };

  const routeChangeMarket = () => {
    navigate(routeMarket);
  };

  // Order Processing
  const generateRandomNumber = () => {
    return (Math.floor(Math.random() * 9000000000) + 1000000000).toString();
  };

  const placeOrder = () => {
    cartItems.forEach((item: ICartItem) => {
      items.push({id: item.id, quantity: item.quantity, size: item.size});
    });

    if (emailAddress && shippingAddress && !inProgress) {
      const orderId = generateRandomNumber();
      setOrder({
        id: orderId,
        email: emailAddress,
        shippingAddress,
        items,
        date: new Date(),
      });
      setInProgress(true);
    }
  };

  const {mutate: buyItems} = useMutation(
    (order: IOrder) => completePurchase(order),
    {
      onSuccess() {
        if (order) {
          setInProgress(false);
          deleteCartItem();
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

  // Save Address
  const {mutate: mutateAddress} = useMutation(
    () => addAddress(toSaveShippingAddress),
    {
      onSettled: () => {
        queryClient.invalidateQueries('defaultAddress');
      },
    },
  );

  const validateShippingAddress = () => {
    if (!shippingAddress) {
      return false;
    }

    const requiredFields: (keyof IAddress)[] = [
      'streetNumber',
      'street',
      'city',
      'province',
      'country',
      'postalCode',
    ];

    return requiredFields.every((field) => Boolean(shippingAddress[field]));
  };

  const saveAddress = () => {
    setIsSaved(true);
    const isValid = validateShippingAddress();
    setIsAddressValid(isValid);
    if (isValid && shippingAddress) {
      toSaveShippingAddress = {
        id: '0',
        streetNumber: shippingAddress.streetNumber,
        apartment: shippingAddress.apartment,
        street: shippingAddress.street,
        city: shippingAddress.city,
        province: shippingAddress.province,
        country: shippingAddress.country,
        postalCode: shippingAddress.postalCode,
        isDefault: true,
      };
      mutateAddress();
      setIsAddressEmpty(false);
      setIsSaved(false);
    }
  };

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

  const centerBoxStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: inProgress ? 'flex' : 'none',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const height = isAddressEmpty ? (isAddressValid ? 485 : 500) : 160;
  const heightXl = isAddressEmpty ? (isAddressValid ? 465 : 470) : 170;
  const height600 = isAddressEmpty ? (isAddressValid ? 705 : 715) : height;

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
          {!isAddressEmpty && (
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
          )}
          <Box
            sx={{
              width: {
                xs: '95%',
                sm: isAddressEmpty ? '85%' : '70%',
                lg: isAddressEmpty ? '70%' : '45%',
                xl: isAddressEmpty ? '70%' : '40%',
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
                        lg: isAddressEmpty ? 'flex' : 'none',
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
                        height: {
                          xs: height,
                          xl: heightXl,
                        },
                        [theme.breakpoints.down(600)]: {
                          height: height600,
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
                          sx={{display: isAddressEmpty ? 'none' : 'inherit'}}
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
                          ml: isAddressEmpty ? 5 : 7,
                        }}
                      >
                        <Box
                          sx={{
                            display: isAddressEmpty ? 'flex' : 'none',
                            flexDirection: 'column',
                          }}
                        >
                          <Grid
                            container
                            spacing={{
                              sm: theme.spacing(0),
                              md: theme.spacing(2),
                            }}
                            sx={{
                              mt: 1,
                              maxWidth: '100%',
                              justifyContent: 'space-around',
                            }}
                          >
                            {addressData.map((elem, index) => (
                              <React.Fragment key={elem.label}>
                                <Grid
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'left',
                                    alignItems: 'center',
                                    [theme.breakpoints.down('md')]: {
                                      mt: 1,
                                    },
                                  }}
                                  item
                                  xs={12}
                                  sm={elem.label === 'Unit' ? 0.5 : 3}
                                >
                                  <Box sx={{display: 'flex'}}>
                                    <Typography
                                      sx={{
                                        fontSize: 12,
                                        color: theme.interface.icon,
                                      }}
                                      variant="subtitle2"
                                    >
                                      {t<string>(`settings.${elem.label}`)}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  sm={elem.gridWidth}
                                  sx={{
                                    [theme.breakpoints.down('md')]: {
                                      mt: 1,
                                    },
                                  }}
                                >
                                  <TextField
                                    data-testid={`${elem.name}Field`}
                                    size="small"
                                    sx={{
                                      width: '100%',
                                    }}
                                    name={elem.name}
                                    inputProps={{
                                      'aria-label': elem.name,
                                    }}
                                    onChange={(event) => {
                                      const {name, value} = event.target;

                                      if (shippingAddress) {
                                        const newAddressShippingAddress = {
                                          ...shippingAddress,
                                          [name]: value,
                                        };
                                        setShippingAddress(
                                          newAddressShippingAddress,
                                        );
                                      }
                                    }}
                                    error={
                                      isSaved &&
                                      !elem.optional &&
                                      shippingAddress &&
                                      !shippingAddress[
                                        elem.name as keyof IAddress
                                      ]
                                    }
                                  />
                                </Grid>
                              </React.Fragment>
                            ))}
                          </Grid>

                          <Box
                            sx={{
                              display: isAddressValid ? 'none' : 'flex',
                              justifyContent: 'center',
                              mt: 3,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: 14,
                                color: theme.palette.error.main,
                              }}
                            >
                              {t<string>('cart.FillOutFields')}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              mt: 3,
                              mr: 1,
                            }}
                          >
                            <Button
                              data-testid="saveButton"
                              variant="contained"
                              size="small"
                              style={{fontSize: 13}}
                              onClick={() => {
                                saveAddress();
                              }}
                            >
                              {t<string>('settings.Save')}
                            </Button>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: isAddressEmpty ? 'none' : 'flex',
                            flexDirection: 'column',
                          }}
                        >
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
                      disabled={
                        isAddressEmpty ||
                        data?.toSpendBalance === undefined ||
                        data?.toSpendBalance < total
                      }
                    >
                      {t<string>('cart.PlaceOrder')}
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      display:
                        data?.toSpendBalance === undefined ||
                        data?.toSpendBalance >= total
                          ? 'none'
                          : 'flex',
                      justifyContent: 'center',
                      mt: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 14,
                        color: theme.palette.error.main,
                      }}
                    >
                      <Trans
                        i18nKey="cart.NoFunds"
                        components={{italic: <i />}}
                      />
                    </Typography>
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
        {shippingAddress && (
          <EditAddressDialog
            shippingAddress={shippingAddress}
            setShippingAddress={setShippingAddress}
            editAddressOpen={editAddressOpen}
            setEditAddressOpen={setEditAddressOpen}
          />
        )}
      </Box>
      <Box sx={centerBoxStyle}>
        <Typography variant="h5" gutterBottom>
          {t<string>('order.ProcessOrder')}
        </Typography>
        <CircularProgress data-testid="CircularProgress" size="5rem" />
      </Box>
    </PageFrame>
  );
}

export default Checkout;
