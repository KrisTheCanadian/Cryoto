import {Search, Menu} from '@mui/icons-material';
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Box,
  BoxProps,
  Drawer,
} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {memo, useRef, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {AuthenticatedTemplate} from '@azure/msal-react';
import {SideBar} from '@shared/components/SideBar';

import {RoundedInput} from '../interface-elements/RoundedInput';

import {Notifications, ProfileMenu} from './components';

import {routeHome, routeMarket} from '@/pages/routes';

const ProfileMenuMemo = memo(ProfileMenu);

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

  const searchBoxStyle = {
    padding: theme.spacing(1),
    minWidth: '300px',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(1.5),
    },
    boxShadow: (searchOpen && '0px -15px 20px 9px rgba(0,0,0,0.08)') || 'none',
    background:
      (searchOpen && theme.interface.offBackground) || theme.interface.main,
    position: 'relative',

    // changed code for marketplace
    display: location.pathname === routeMarket ? 'none' : 'block',
    width: '40%',
    ...(searchOpen &&
      location.pathname === routeMarket && {
        display: 'block',
      }),

    [theme.breakpoints.down('sm')]: {
      display: 'none',
      width: '70%',
      ...(searchOpen && {
        [theme.breakpoints.down('sm')]: {
          display: 'block',
        },
      }),
    },
  };

  const searchResultsStyle = {
    padding: theme.spacing(2.5),
    position: 'absolute',
    background: theme.interface.offBackground,
    boxShadow: (searchOpen && '0px 15px 12px 4px rgb(0 0 0 / 8%)') || '0',
    boxSizing: 'border-box',
    width: '100%',
    borderBottomLeftRadius: theme.borderRadius.large,
    borderBottomRightRadius: theme.borderRadius.large,
    marginLeft: theme.spacing(-1),
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(-1.5),
    },
    display: (searchOpen && 'block') || 'none',
    color: theme.palette.text.primary,
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

  const inputFieldRef = useRef<HTMLDivElement>(null);

  const openSearch = () => {
    setOpen(true);
    // fix to allow input field to be visible before focus
    setTimeout(() => {
      inputFieldRef.current?.focus();
    }, 1);
  };

  const closeSearch = () => {
    setOpen(false);
  };

  const openMenu = () => {
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const companyName = 'Cryoto';
  const sampleSearchResults = "I'm a search result";

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
            <Typography
              id="companyName"
              variant="h6"
              sx={{
                color: theme.palette.text.primary,
                [theme.breakpoints.down('md')]: {
                  display: 'none',
                },
              }}
            >
              {companyName}
            </Typography>
          </Link>
          <Box sx={searchBoxStyle} data-testid="searchBox">
            <RoundedInput>
              <Search
                sx={{
                  color: theme.palette.action.active,
                  ml: theme.spacing(0.5),
                }}
              />
              <InputBase
                id="searchInput"
                placeholder={t('layout.Search')}
                data-testid="search-field"
                inputRef={inputFieldRef}
                onBlur={closeSearch}
                onFocus={openSearch}
                sx={{width: '100%', ml: theme.spacing(0.5)}}
              />
            </RoundedInput>

            <Box sx={searchResultsStyle} data-testid="search-results">
              {sampleSearchResults}
            </Box>
          </Box>
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
