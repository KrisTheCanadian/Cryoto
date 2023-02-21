/* eslint-disable @shopify/jsx-no-complex-expressions */
/* eslint-disable id-length */
/* eslint-disable @shopify/jsx-no-hardcoded-content */
import {
  Box,
  CardMedia,
  Divider,
  IconButton,
  Typography,
  Grid,
  Badge,
} from '@mui/material';
import {useMarketplaceContext} from '@shared/hooks/MarketplaceContext';
import {Add, Clear, Remove} from '@mui/icons-material';
import {useTheme} from '@mui/material/styles';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';

interface ICartItemProps {
  id: string;
  image: any;
  title: string;
  points: number;
  size?: string;
  quantity: number;
  total: number;
  setTotal: any;
  checkout: boolean;
}

function CartItem(props: ICartItemProps) {
  const theme = useTheme();
  const {t} = useTranslation();
  const [quantity, setQuantity] = useState(props.quantity);
  const {
    updateCartItemQuantity,
    cartItems,
    setCartItems,
    cartItemsQuantity,
    setCartItemsQuantity,
  } = useMarketplaceContext();

  const deleteCartItem = () => {
    const index = cartItems.findIndex(
      (i) => i.id === props.id && i.size === props.size,
    );
    if (index >= 0) cartItems.splice(index, 1);
    setCartItems(cartItems);
    setCartItemsQuantity(cartItemsQuantity - quantity);
  };
  const titleStyle = {
    fontSize: 14,
    [theme.breakpoints.up('xl')]: {
      fontSize: 16,
    },
  };
  const buttonStyle = {
    fontSize: 12,
    [theme.breakpoints.up('xl')]: {
      fontSize: 17,
    },
  };

  return (
    <Box>
      <Grid container spacing={2} sx={{display: 'flex', alignItems: 'center'}}>
        <Grid
          item
          xs={props.checkout ? 3.5 : 2}
          sx={{m: 1, mb: props.checkout ? 2 : 0}}
        >
          <Badge
            badgeContent={props.checkout ? quantity : 0}
            color="primary"
            sx={{pb: -5}}
          >
            <CardMedia
              data-testid="itemImage"
              sx={{
                maxHeight: 75,
                maxWidth: 100,
                m: props.checkout ? 0 : 1,
                ml: props.checkout ? 1 : 2,
                [theme.breakpoints.down('sm')]: {
                  ml: 0,
                },
                borderRadius: 2,
              }}
              component="img"
              image={props.image}
            />
          </Badge>
        </Grid>
        <Grid
          item
          xs={props.checkout ? 5 : 3}
          sx={{
            ml: 2,
            [theme.breakpoints.down('sm')]: {
              ml: 0,
            },
          }}
        >
          <Typography sx={titleStyle}>{props.title}</Typography>
          {props.size && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                mt: props.checkout ? 0.5 : 0,
              }}
            >
              <Typography
                sx={{
                  fontSize: 13,
                  [theme.breakpoints.up('xl')]: {
                    fontSize: 15,
                  },
                  color: theme.interface.icon,
                }}
              >
                {t<string>('marketplace.sizes.size')}:{' '}
              </Typography>
              <Typography
                sx={{
                  fontSize: 13,
                  [theme.breakpoints.up('xl')]: {
                    fontSize: 15,
                  },
                  color: theme.interface.icon,
                  textTransform: 'uppercase',
                  ml: 0.5,
                }}
              >
                {t<string>(`marketplace.sizes.${props.size}`)}
              </Typography>
            </Box>
          )}
        </Grid>
        {!props.checkout && (
          <Grid item xs={3.5} sm={4}>
            <Box
              sx={{
                maxWidth: 80,
                mt: 0.5,
                ml: '25%',
                fontSize: 12,
                [theme.breakpoints.up('xl')]: {
                  fontSize: 14,
                },
                [theme.breakpoints.down('sm')]: {
                  ml: 0,
                },
                display: props.checkout ? 'none' : 'flex',
                alignItems: 'center',
              }}
            >
              <IconButton
                data-testid="remove"
                size="small"
                sx={{
                  backgroundColor: '#454ce129',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    color:
                      quantity === 1
                        ? theme.palette.common.black
                        : theme.palette.primary.main,
                  },
                }}
                onClick={() => {
                  if (quantity > 1) {
                    setQuantity(quantity - 1);
                    updateCartItemQuantity(props.id, 'minus', props.size);
                    props.setTotal(props.total - props.points);
                  }
                }}
              >
                <Remove sx={buttonStyle} />
              </IconButton>

              <Typography sx={{m: '15%', titleStyle}}>{quantity}</Typography>

              <IconButton
                data-testid="add"
                size="small"
                sx={{
                  backgroundColor: '#454ce129',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    color:
                      quantity === 10
                        ? theme.palette.common.black
                        : theme.palette.primary.main,
                  },
                }}
                onClick={() => {
                  if (quantity < 10) {
                    setQuantity(quantity + 1);
                    updateCartItemQuantity(props.id, 'add', props.size);
                    props.setTotal(props.total + props.points);
                  }
                }}
              >
                <Add sx={buttonStyle} />
              </IconButton>
            </Box>
          </Grid>
        )}
        <Grid item sm={1}>
          <Typography
            sx={{titleStyle, ml: props.checkout ? {md: 1, xl: 5} : 0}}
          >
            {props.points * quantity}
          </Typography>
        </Grid>
        {!props.checkout && (
          <Grid item xs={1} sx={{display: 'flex', justifyContent: 'flex-end'}}>
            <IconButton data-testid="clearButton" onClick={deleteCartItem}>
              <Clear
                sx={{
                  fontSize: 14,
                  [theme.breakpoints.up('xl')]: {
                    fontSize: 20,
                  },
                }}
              />
            </IconButton>
          </Grid>
        )}
      </Grid>
      {!props.checkout && <Divider sx={{ml: 1, mr: 2, mt: 0.5}} />}
    </Box>
  );
}

export default CartItem;
