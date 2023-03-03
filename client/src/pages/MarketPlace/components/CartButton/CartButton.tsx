/* eslint-disable id-length */
import {Badge, BadgeProps, IconButton} from '@mui/material';
import {ShoppingCart} from '@mui/icons-material';
import {styled, useTheme} from '@mui/material/styles';
import {useNavigate} from 'react-router-dom';
import {useMarketplaceContext} from '@shared/hooks/MarketplaceContext';
import {useEffect, useState} from 'react';

import {routeShoppingCart} from '../../../routes';

import {ICartItem} from '@/data/api/types/ICart';

function CartButton() {
  const theme = useTheme();
  const {cartItems} = useMarketplaceContext();
  const [cartItemsQuantity, setCartItemsQuantity] = useState(0);

  const StyledBadge = styled(Badge)<BadgeProps>(({theme}) => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
  }));

  const navigate = useNavigate();
  const routeChange = () => {
    navigate(routeShoppingCart);
  };

  useEffect(() => {
    if (cartItems.length > 0) {
      let quantity = 0;
      cartItems.forEach((item: ICartItem) => {
        quantity += item.quantity;
      });
      setCartItemsQuantity(quantity);
    }
  }, [cartItems]);

  return (
    <IconButton
      sx={{
        width: 25,
        height: 25,
        p: 2.2,
        border: 1,
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.interface.main,
        mr: '10%',
      }}
      onClick={routeChange}
      data-testid="cartButton"
    >
      <StyledBadge badgeContent={cartItemsQuantity} color="primary">
        <ShoppingCart sx={{color: theme.interface.icon, fontSize: 20, p: 0}} />
      </StyledBadge>
    </IconButton>
  );
}

export default CartButton;
