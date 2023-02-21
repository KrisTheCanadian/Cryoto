/* eslint-disable id-length */
import {Badge, BadgeProps, IconButton} from '@mui/material';
import {ShoppingCart} from '@mui/icons-material';
import {styled, useTheme} from '@mui/material/styles';
import {useNavigate} from 'react-router-dom';
import {useMarketplaceContext} from '@shared/hooks/MarketplaceContext';

import {routeShoppingCart} from '../../../routes';

function CartButton() {
  const theme = useTheme();
  const {cartItemsQuantity} = useMarketplaceContext();
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
