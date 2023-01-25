/* eslint-disable id-length */
import {
  Box,
  Button,
  CardMedia,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import {Add, Remove} from '@mui/icons-material';
import PageFrame from '@shared/components/PageFrame';
import {useTheme} from '@mui/material/styles';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {useMarketplaceContext} from '@shared/hooks/MarketplaceContext';

import {CartButton} from '../CartButton';

function ProductPage() {
  const theme = useTheme();
  const {t} = useTranslation();

  const {id} = useParams();
  const [quantity, setQuantity] = useState<number>(1);
  const {allItems, addCartItems, cartItemsQuantity} = useMarketplaceContext();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [addCartValidity, setAddCartValidity] = useState(true);

  const item = allItems.find((i) => i.id === id);

  const addToCart = () => {
    if ((item?.size && selectedSize) || item?.size === null) {
      addCartItems(
        item?.id,
        item?.title,
        item?.image,
        item?.points,
        selectedSize,
        quantity,
      );
      setSelectedSize('');
    } else {
      setAddCartValidity(false);
    }
  };

  return (
    <PageFrame>
      <Box flex={8} p={0} sx={{ml: '0!important'}}>
        <Box p={2} display="flex" alignItems="center" flexDirection="column">
          <Box
            width="100%"
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mb: 4,
              [theme.breakpoints.down('lg')]: {
                mr: 0,
              },
              [theme.breakpoints.down('md')]: {
                pl: 25,
              },
              mr: '10%',
            }}
          >
            <CartButton cartItemsQuantity={cartItemsQuantity} />
          </Box>
          <Paper
            sx={{
              width: '80%',
              [theme.breakpoints.up('lg')]: {
                width: '70%',
                minHeight: 400,
              },
              [theme.breakpoints.down(800)]: {
                width: '90%',
                display: 'flex',
                flexDirection: 'column',
                height: '40%',
                pt: 3,
              },
              display: 'flex',
              alignItems: 'center',
              pl: 3,
              pr: 2,
            }}
          >
            <Box
              sx={{
                minWidth: '40%',
                m: 2,
              }}
            >
              <CardMedia
                sx={{
                  maxHeight: 250,
                  borderRadius: 2,
                  boxShadow: 7,
                }}
                component="img"
                image={item?.image}
              />
            </Box>
            <Box
              sx={{
                m: 2,
                minHeight: 300,
                [theme.breakpoints.up('lg')]: {
                  mt: 5,
                },
                [theme.breakpoints.between('md', 'lg')]: {
                  mt: 3,
                  mb: 3,
                },
              }}
            >
              <Typography variant="h5">{item?.title}</Typography>
              <Typography
                variant="body1"
                sx={{fontSize: 17, fontWeight: 500, color: '#0000009c'}}
              >
                {item?.points} {t<string>('marketplace.Coins')}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: item?.description === undefined ? 6 : 3,
                  mb: 4,
                  color: '#0000009c',
                }}
              >
                {item?.description?.replace('&apos;', "'")}
              </Typography>

              {item?.size && (
                <Box>
                  <Typography variant="subtitle2" sx={{mt: 2, fontSize: 15}}>
                    {t<string>('marketplace.sizes.size')}
                  </Typography>
                  <Box>
                    {item?.size.map((i) => (
                      <Button
                        variant="outlined"
                        size="small"
                        className="hidden-button"
                        sx={{
                          fontSize: 11,
                          mt: 1,
                          minHeight: '33px !important',
                          minWidth: '33px !important',
                          borderRadius: 30,
                          mr: 1,
                          backgroundColor:
                            selectedSize === i
                              ? theme.palette.primary.main
                              : theme.interface.main,
                          color:
                            selectedSize === i
                              ? theme.interface.main
                              : theme.palette.primary.main,
                          '&:hover': {
                            color:
                              selectedSize === i
                                ? theme.interface.main
                                : theme.palette.primary.main,
                            backgroundColor:
                              selectedSize === i
                                ? theme.palette.primary.main
                                : theme.interface.main,
                          },
                        }}
                        key={i}
                        onClick={() => {
                          if (selectedSize === i) setSelectedSize('');
                          else setSelectedSize(i);
                          setAddCartValidity(true);
                        }}
                      >
                        {t<string>(`marketplace.sizes.${i}`)}
                      </Button>
                    ))}
                  </Box>
                  {!addCartValidity && (
                    <Box>
                      <Typography
                        className="hidden-button"
                        sx={{
                          fontSize: 13,
                          mt: 1,
                          color: theme.palette.error.dark,
                        }}
                      >
                        {t<string>('marketplace.sizes.selectSize')}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              <Typography variant="subtitle2" sx={{mt: 2, fontSize: 15}}>
                {t<string>('marketplace.Quantity')}
              </Typography>
              <Box
                sx={{
                  maxWidth: 80,
                  marginTop: 0.5,
                  fontSize: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <IconButton
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
                    if (quantity > 1) setQuantity(quantity - 1);
                  }}
                >
                  <Remove sx={{fontSize: 15}} />
                </IconButton>
                <Typography sx={{m: 0.4}}>{quantity}</Typography>
                <IconButton
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
                    if (quantity < 10) setQuantity(quantity + 1);
                  }}
                >
                  <Add sx={{fontSize: 15}} />
                </IconButton>
              </Box>
              <Button
                size="large"
                variant="outlined"
                className="hidden-button"
                sx={{mt: 2, mb: 1, pt: 0.6, pb: 0.6, fontSize: 14}}
                onClick={() => addToCart()}
              >
                {t<string>('marketplace.AddToCart')}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </PageFrame>
  );
}

export default ProductPage;
