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
import {Home, Wallet, Logout} from '@mui/icons-material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import {useTranslation} from 'react-i18next';
import {useMsal} from '@azure/msal-react';
import {IPublicClientApplication} from '@azure/msal-browser';
import {MiniWallet} from '@shared/components/SideBar/components/MiniWallet';

import {routeHome, routeMarket, routeOrders, routeWallet} from '@/pages/routes';

function handleLogout(instance: IPublicClientApplication) {
  instance.logoutRedirect();
}

function SideBar() {
  const {t} = useTranslation();
  const location = useLocation();
  const theme = useTheme();
  const {instance} = useMsal();

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
              to={routeHome}
              selected={location.pathname === routeHome}
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
              <ListItemText primary={t('layout.Wallet')} data-testid="wallet-sidebar" />
            </ListItemButton>

            <ListItemButton onClick={() => handleLogout(instance)}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </nav>
      </Box>
      {location.pathname !== routeWallet && <MiniWallet />}
    </Box>
  );
}
export default SideBar;
