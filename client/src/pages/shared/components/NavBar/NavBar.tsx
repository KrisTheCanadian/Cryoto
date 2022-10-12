/* eslint-disable @typescript-eslint/naming-convention */
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {AccountCircle, Search} from '@mui/icons-material';
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

interface Props {
  toggleColorMode: () => void;
}

function NavBar(props: Props) {
  const [searchOpen, setOpen] = useState(false);

  // All styling is done here with custom styling based on theme breakpoints and searchOpen state
  const theme = useTheme();
  const toggleColorMode = props.toggleColorMode;

  const MainNavigationBar = styled(Toolbar)(({theme}) => ({
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
        <Typography variant="h6" sx={{color: theme.palette.text.primary}}>
          {companyName}
        </Typography>
        <Box sx={searchBoxStyle} data-testid="searchBox">
          <Box sx={searchInputStyle}>
            <Search
              sx={{color: theme.palette.action.active, ml: theme.spacing(0.5)}}
            />
            <InputBase
              placeholder="Search"
              inputRef={inputFieldRef}
              onBlur={closeSearch}
              onFocus={openSearch}
              sx={{width: '100%', ml: theme.spacing(0.5)}}
            />
          </Box>
          <Box sx={searchResultsStyle} data-testid="search-results">
            {sampleSearchResults}
          </Box>
        </Box>
        <RightNavBarSection>
          <IconButton
            aria-label="search"
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
          <IconButton aria-label="account" size="large">
            <AccountCircle />
          </IconButton>
        </RightNavBarSection>
      </MainNavigationBar>
    </AppBar>
  );
}
export default NavBar;
