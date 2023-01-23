import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {Search} from '@mui/icons-material';
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Box,
} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {memo, useRef, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useThemeModeContext} from '@shared/hooks/ThemeContextProvider';
import {AuthenticatedTemplate} from '@azure/msal-react';

import {RoundedInput} from '../interface-elements/RoundedInput';

import {Notifications, ProfileMenu} from './components';

import {routeMarket} from '@/pages/routes';

const ProfileMenuMemo = memo(ProfileMenu);

function NavBar() {
  const {colorMode} = useThemeModeContext();
  const {t} = useTranslation();
  const [searchOpen, setOpen] = useState(false);

  const location = useLocation();

  // All styling is done here with custom styling based on theme breakpoints and searchOpen state
  const theme = useTheme();
  const toggleColorMode = colorMode.toggleColorMode;

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
    marginLeft: theme.spacing(-1.5),

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

  function openSearch() {
    setOpen(true);
    // fix to allow input field to be visible before focus
    setTimeout(() => {
      inputFieldRef.current?.focus();
    }, 1);
  }

  function closeSearch() {
    setOpen(false);
  }

  const brightnessIcon = () => {
    return theme.palette.mode === 'dark' ? (
      <Brightness7Icon />
    ) : (
      <Brightness4Icon />
    );
  };
  const companyName = 'Cryoto';
  const sampleSearchResults = "I'm a search result";

  return (
    <>
      <AuthenticatedTemplate>
        <AppBar sx={{boxShadow: theme.interface.shadow}} position="sticky">
          <Toolbar sx={toolBarStyle}>
            <Link to="/" style={{textDecoration: 'none'}}>
              <Typography
                id="companyName"
                variant="h6"
                sx={{color: theme.palette.text.primary}}
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
              <IconButton
                sx={{py: 1}}
                onClick={toggleColorMode}
                data-testid="dark-mode-toggle"
              >
                {brightnessIcon()}
              </IconButton>
              <Notifications />
              <ProfileMenuMemo />
            </Box>
          </Toolbar>
        </AppBar>
      </AuthenticatedTemplate>
    </>
  );
}
export default NavBar;
