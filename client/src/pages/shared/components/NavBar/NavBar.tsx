import {Menu, Search} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {AuthenticatedTemplate} from '@azure/msal-react';
import {SideBar} from '@shared/components/SideBar';

import {Notifications, ProfileMenu, SearchNavBar} from './components';

import {routeHome, routeMarket} from '@/pages/routes';

function NavBar() {
  const {t} = useTranslation();
  const [searchOpen, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();

  // All styling is done here with custom styling based on theme breakpoints and searchOpen state
  const theme = useTheme();

  const toolBarStyle = {
    id: 'main-navigation-bar',
    background: theme.interface.main,
    display: 'flex',
    justifyContent: 'space-between',
    color: 'text.primary',
  };

  const searchButtonStyle = {
    [theme.breakpoints.up('sm')]: {
      display: location.pathname === routeMarket ? 'block' : 'none',
    },
  };

  const rightNavBarProps = {
    alignItems: 'center',
    display: (searchOpen && 'none') || 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
  };

  // End of styling

  const openSearch = () => {
    setOpen(true);
  };

  const openMenu = () => {
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const companyName = 'Cryoto';
  const sampleSearchResults = "I'm a search result";

  const logoIcon = () => {
    const logoUrl =
      theme.palette.mode === 'dark'
        ? 'images/svgIcons/CryotoIconDark.svg'
        : 'images/svgIcons/CryotoIconLight.svg';
    return (
      <img
        src={logoUrl}
        alt={companyName}
        style={{
          height: '30px',
          verticalAlign: 'text-middle',
          marginRight: theme.margin.medium,
        }}
      />
    );
  };

  return (
    <AuthenticatedTemplate>
      <AppBar sx={{boxShadow: theme.interface.shadow}} position="sticky">
        <Toolbar sx={toolBarStyle}>
          <IconButton
            sx={{
              [theme.breakpoints.up('md')]: {
                display: 'none',
              },
            }}
            onClick={openMenu}
          >
            <Menu />
          </IconButton>
          <Link
            to={routeHome}
            style={{
              textDecoration: 'none',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                [theme.breakpoints.down('md')]: {
                  display: 'none',
                },
              }}
            >
              {logoIcon()}
              <Typography
                id="companyName"
                variant="h6"
                sx={{
                  color: theme.palette.text.primary,
                  lineHeight: 0,
                }}
              >
                {companyName}
              </Typography>
            </Box>
          </Link>
          <SearchNavBar searchOpen={searchOpen} setOpen={setOpen} />
          <Box sx={rightNavBarProps}>
            <IconButton
              aria-label={t('layout.search')}
              size="large"
              sx={searchButtonStyle}
              onClick={openSearch}
            >
              <Search sx={searchButtonStyle} />
            </IconButton>

            <Notifications />
            <ProfileMenu />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={menuOpen}
        PaperProps={{
          sx: {width: '300px'},
        }}
        ModalProps={{onBackdropClick: closeMenu}}
      >
        <SideBar />
      </Drawer>
    </AuthenticatedTemplate>
  );
}

export default NavBar;
