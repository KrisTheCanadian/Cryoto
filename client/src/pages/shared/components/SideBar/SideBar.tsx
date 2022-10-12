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
import {Home, Wallet} from '@mui/icons-material';

function SideBar() {
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
              <ListItemText primary="Home" />
            </ListItemButton>

            <ListItemButton
              component={NavLink}
              to="/wallet"
              selected={location.pathname === '/wallet'}
            >
              <ListItemIcon>
                <Wallet />
              </ListItemIcon>
              <ListItemText primary="Wallet" />
            </ListItemButton>
          </List>
        </nav>
      </Box>
    </Box>
  );
}
export default SideBar;
