/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @shopify/jsx-no-hardcoded-content */
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {NavLink, useLocation} from 'react-router-dom';
import {Home, Wallet, Login} from '@mui/icons-material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import {useTranslation} from 'react-i18next';

import {
  routeAuthentication,
  routeMarket,
  routeOrders,
  routeWallet,
} from '../../../routes';

function SideBar() {
  const {t} = useTranslation();
  const location = useLocation();
  const theme = useTheme();

  const sideBarStyle = {
    // to adjust to the navbar height
    top: 56,
    maxHeight: 0,
    position: 'sticky',
    minHeight: 'calc(100vh - 56px)',
    flex: 2,

    [theme.breakpoints.up('xs')]: {
      '@media (orientation: landscape)': {
        top: 48,
        minHeight: 'calc(100vh - 48px)',
      },
    },
    [theme.breakpoints.up('sm')]: {
      top: 64,
      minHeight: 'calc(100vh - 64px)',
    },
    display: {xs: 'none', sm: 'block'},
    overflowY: 'hidden',
    overFlowAnchor: 'none',
  };
  return (
    <Box sx={sideBarStyle}>
      <Box>
        <nav aria-label="main mailbox folders" style={{textDecoration: 'none'}}>
          <List>
            <ListItemButton
              component={NavLink}
              to="/"
              selected={location.pathname === '/'}
            >
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary={t('layout.Home')} />
            </ListItemButton>

            <ListItemButton
              component={NavLink}
              to={routeMarket}
              selected={location.pathname === routeMarket}
            >
              <ListItemIcon>
                <StorefrontIcon />
              </ListItemIcon>
              <ListItemText primary={t('layout.MarketPlace')} />
            </ListItemButton>

            <ListItemButton
              component={NavLink}
              to={routeOrders}
              selected={location.pathname === routeOrders}
            >
              <ListItemIcon>
                <LocalShippingIcon />
              </ListItemIcon>
              <ListItemText primary={t('layout.Orders')} />
            </ListItemButton>

            <ListItemButton
              component={NavLink}
              to={routeWallet}
              selected={location.pathname === routeWallet}
            >
              <ListItemIcon>
                <Wallet />
              </ListItemIcon>
              <ListItemText primary={t('layout.Wallet')} />
            </ListItemButton>

            <ListItemButton
              component={NavLink}
              to={routeAuthentication}
              selected={location.pathname === routeAuthentication}
            >
              <ListItemIcon>
                <Login />
              </ListItemIcon>
              <ListItemText primary="Authentication" />
            </ListItemButton>
          </List>
        </nav>
      </Box>
    </Box>
  );
}
export default SideBar;