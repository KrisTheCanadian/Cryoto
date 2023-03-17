import {Avatar, Box, InputBase, useTheme} from '@mui/material';
import {RoundedInput} from '@shared/components/interface-elements/RoundedInput';
import {useEffect, useRef, useState} from 'react';
import {Search} from '@mui/icons-material';
import {useTranslation} from 'react-i18next';
import {useMsal} from '@azure/msal-react';
import {Link, useNavigate} from 'react-router-dom';
import {stringAvatar} from '@shared/utils/colorUtils';

import {routeMarket, routeProfile} from '@/pages/routes';
import {searchUsers} from '@/data/api/requests/users';
import {IUserWithDate} from '@/data/api/types/IUser';

interface SearchNavBarProps {
  searchOpen: boolean;
  setOpen: (open: boolean) => void;
}

function SearchNavBar(props: SearchNavBarProps) {
  const {searchOpen, setOpen} = props;
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<IUserWithDate[]>([]);
  const [searching, setSearching] = useState(false);

  const theme = useTheme();
  const {t} = useTranslation();

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

  const inputFieldRef = useRef<HTMLDivElement>(null);

  const showPreviousRecipents = () => {
    searchUsers('')
      .then((users) => {
        users.length = 5;
        setSearchResults(users);
        setTimeout(() => {
          setSearching(false);
        }, 500);
      })
      .catch((err) => {
        setSearching(false);
      });
  };

  const openSearch = () => {
    setOpen(true);

    // Show the previous recipients by default (search history)
    if (searchValue.length === 0) {
      showPreviousRecipents();
    }

    // fix to allow input field to be visible before focus
    setTimeout(() => {
      inputFieldRef.current?.focus();
    }, 1);
  };

  const closeSearch = () => {
    setTimeout(() => {
      setOpen(false);
    }, 100);
  };

  const inputTimeout = useRef<NodeJS.Timeout>();
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearching(true);
    setSearchValue(event.target.value);
    clearTimeout(inputTimeout.current);
    inputTimeout.current = setTimeout(() => {
      if (!event.target.value || event.target.value.length === 0) {
        setSearchResults([]);
        showPreviousRecipents();
        return;
      }

      searchUsers(event.target.value)
        .then((users) => {
          // limit to 5 results
          users.length = 5;
          setSearchResults(users);
          setTimeout(() => {
            setSearching(false);
          }, 500);
        })
        .catch((err) => {
          setSearching(false);
        });
    }, 200);
  };

  useEffect(() => {
    if (searchOpen) {
      inputFieldRef.current?.focus();
    }
  }, [searchOpen]);

  return (
    <Box sx={searchBoxStyle} data-testid="searchBox">
      <RoundedInput>
        <Search
          sx={{
            color: theme.palette.action.active,
            ml: theme.spacing(0.5),
          }}
        />
        <InputBase
          autoComplete="off"
          id="searchInput"
          placeholder={t('layout.Search')}
          data-testid="search-field"
          inputRef={inputFieldRef}
          onBlur={closeSearch}
          onFocus={openSearch}
          onChange={handleInput}
          sx={{width: '100%', ml: theme.spacing(0.5)}}
        />
      </RoundedInput>

      <Box sx={searchResultsStyle} data-testid="search-results">
        {searchOpen &&
          !searching &&
          searchResults.length === 0 &&
          searchValue.length === 0 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: theme.spacing(1),
                color: theme.palette.text.secondary,
              }}
            >
              {t('navBar.searchPlaceholder')}
            </Box>
          )}
        {searchOpen &&
          !searching &&
          searchValue.length > 0 &&
          // List of size 5 is not null but might be empty
          searchResults.every((result) => !result) && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: theme.spacing(1),
                color: theme.palette.text.secondary,
              }}
            >
              {t('navBar.searchNoResults')}
            </Box>
          )}
        {searchResults.map((user, index) => {
          const nonNullsearchResults = searchResults.filter(
            (user) => user !== null,
          );
          const isLastItem = index === nonNullsearchResults.length - 1;
          return (
            <Link
              to={`/profile/${user.oId}`}
              key={user.oId}
              style={{textDecoration: 'none', color: 'inherit'}}
              data-testid="search-result"
            >
              <Box
                key={user.oId}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: theme.spacing(1),
                  borderBottom: isLastItem
                    ? 'none'
                    : `1px solid ${theme.palette.divider}`,

                  ':hover': {
                    background: theme.interface.contrastMain,
                  },
                }}
              >
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                  <Box mr={2}>
                    <Avatar {...stringAvatar(user.name || 'Cryoto')} />
                  </Box>
                  <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <Box sx={{fontSize: '16px', fontWeight: 'bold'}}>
                      {user.name}
                    </Box>
                    <Box
                      sx={{
                        fontSize: '14px',
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {user.businessTitle}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Link>
          );
        })}
      </Box>
    </Box>
  );
}

export default SearchNavBar;
