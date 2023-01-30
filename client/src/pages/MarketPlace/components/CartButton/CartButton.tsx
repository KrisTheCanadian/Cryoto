/* eslint-disable id-length */
import {Badge, BadgeProps, IconButton} from '@mui/material';
import {ShoppingCart} from '@mui/icons-material';
import {styled, useTheme} from '@mui/material/styles';
import {useState} from 'react';

interface CartItem {
  id: string;
  image: any;
  title: string;
  points: number;
  size?: string;
  quantity: number;
}

interface ICartButtonProps {
  cartItemsQuantity: number;
}

function CartButton(props: ICartButtonProps) {
  const theme = useTheme();
  const StyledBadge = styled(Badge)<BadgeProps>(({theme}) => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
  }));

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
      data-testid="cartButton"
    >
      <StyledBadge badgeContent={props.cartItemsQuantity} color="primary">
        <ShoppingCart sx={{color: theme.interface.icon, fontSize: 20, p: 0}} />
      </StyledBadge>
    </IconButton>
  );
}

export default CartButton;
