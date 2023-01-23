/* eslint-disable id-length */
/* eslint-disable @shopify/jsx-prefer-fragment-wrappers */
import {Search} from '@mui/icons-material';
import {
  Box,
  InputBase,
  IconButton,
  Paper,
  Divider,
  Typography,
  ListItem,
} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';

function MarketSearch() {
  const theme = useTheme();
  const {t} = useTranslation();
  const [searchOpen, setOpen] = useState(false);
  const sampleSearchResults = [
    'Search result 1',
    'Search result 2',
    'Search result 3',
  ];

  const searchResultsStyle = {
    padding: theme.spacing(1.5),
    position: 'absolute',
    background: theme.interface.offBackground,
    boxShadow: searchOpen ? 3 : 0,
    boxSizing: 'border-box',
    borderRadius: 4,
    mt: 0.5,
    ml: 1.5,
    width: {
      xs: 210,
      sm: 220,
      md: 290,
    },
    display: (searchOpen && 'block') || 'none',
    color: theme.palette.text.primary,
  };

  const inputFieldRef = useRef<HTMLDivElement>(null);

  function openSearch() {
    setOpen(true);
    setTimeout(() => {
      inputFieldRef.current?.focus();
    }, 1);
  }

  function closeSearch() {
    setOpen(false);
  }

  return (
    <div>
      <Box
        sx={{
          width: {
            xs: 215,
            sm: 230,
            md: 300,
          },
        }}
      >
        <Paper
          component="form"
          sx={{
            p: {
              xs: '2px 5px',
              sm: '0.5px 5px',
              md: '2px 5px',
            },
            ml: {sm: 1},
            display: 'flex',
            alignItems: 'center',
            backgroundColor: theme.interface.offBackground,
            borderRadius: 5,
          }}
        >
          <IconButton type="button" sx={{p: '7px'}} aria-label="search">
            <Search sx={{color: theme.palette.primary.main}} />
          </IconButton>
          <InputBase
            sx={{ml: 1, flex: 1}}
            placeholder={t('marketplace.Search')}
            inputRef={inputFieldRef}
            onBlur={closeSearch}
            onFocus={openSearch}
          />
        </Paper>
        <Box sx={searchResultsStyle} data-testid="search-results">
          {sampleSearchResults.map((i) => (
            <div key={i}>
              <ListItem>
                <Search
                  fontSize="small"
                  sx={{color: theme.interface.icon, mr: 2}}
                />
                <Typography>{i}</Typography>
              </ListItem>
              {i !== sampleSearchResults[sampleSearchResults.length - 1] && (
                <Divider />
              )}
            </div>
          ))}
        </Box>
      </Box>
    </div>
  );
}

export default MarketSearch;
