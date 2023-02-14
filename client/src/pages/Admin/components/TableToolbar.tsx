/* eslint-disable @shopify/jsx-no-hardcoded-content */
import {InputAdornment, TextField, Toolbar, Typography} from '@mui/material';
import {useTranslation} from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';

export function TableToolbar(props: any) {
  const {onSearch} = props;

  const {t} = useTranslation();
  return (
    <Toolbar
      sx={{
        pl: {sm: 2},
        pr: {xs: 1, sm: 1},
      }}
    >
      <Typography
        sx={{flex: '1 1 100%'}}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        <TextField
          sx={{marginTop: '15px', marginBottom: '15px'}}
          id="outlined-basic"
          label={t<string>(`layout.Search`)}
          variant="standard"
          onChange={(event: any) => onSearch(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Typography>
    </Toolbar>
  );
}
