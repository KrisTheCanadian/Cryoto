/* eslint-disable @typescript-eslint/naming-convention */
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
  BoxProps,
} from '@mui/material';
import {styled, useTheme} from '@mui/material/styles';
import {useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useThemeModeContext} from '@shared/hooks/ThemeContextProvider';

import {RoundedInput} from '../interface-elements/RoundedInput';

import {ProfileMenu} from './components';

function NavBar() {
  const {colorMode} = useThemeModeContext();
  const {t} = useTranslation();
  const [searchOpen, setOpen] = useState(false);

  // All styling is done here with custom styling based on theme breakpoints and searchOpen state
  const theme = useTheme();
  const toggleColorMode = colorMode.toggleColorMode;

  const MainNavigationBar = styled(Toolbar)(({theme}) => ({
    id: 'main-navigation-bar',
    background: theme.interface.main,
    display: 'flex',
    justifyContent: 'space-between',
    color: 'text.primary',
  }));

  const searchBoxStyle = {
    padding: theme.spacing(1),
    minWidth: '300px',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(1.5),
    },
    boxShadow: (searchOpen && '0px -15px 20px 9px rgba(0,0,0,0.08)') || 'none',
    background:
      (searchOpen && theme.interface.offBackground) || theme.interface.main,
    display: 'block',
    width: '40%',
    position: 'relative',
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

  const searchInputStyle = {
    padding: theme.spacing(0.5),
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.interface.contrastMain,
    '&:hover': {
      backgroundColor: theme.interface.contrastMain,
    },
    borderRadius: theme.shape.borderRadius,
    width: '100%',
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
      display: 'none',
    },
  };

  const RightNavBarSection = styled(Box)<BoxProps>(({theme}) => ({
    alignItems: 'center',
    display: (searchOpen && 'none') || 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
  }));

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
    <AppBar sx={{boxShadow: theme.interface.shadow}} position="sticky">
      <MainNavigationBar>
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
              sx={{color: theme.palette.action.active, ml: theme.spacing(0.5)}}
            />
            <InputBase
              placeholder={t('layout.Search')}
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
        <RightNavBarSection>
          <IconButton
            aria-label={t('layout.search')}
            size="large"
            sx={searchButtonStyle}
            onClick={openSearch}
          >
            <Search sx={searchButtonStyle} />
          </IconButton>
          <IconButton
            sx={{}}
            onClick={toggleColorMode}
            data-testid="dark-mode-toggle"
          >
            {brightnessIcon()}
          </IconButton>
          <ProfileMenu />
        </RightNavBarSection>
      </MainNavigationBar>
    </AppBar>
  );
}
export default NavBar;
