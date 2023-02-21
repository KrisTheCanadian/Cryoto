/* eslint-disable react-hooks/exhaustive-deps */

import {
  Box,
  useTheme,
  Button,
  Menu,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  MenuItem,
  Badge,
} from '@mui/material';
import {Sort, KeyboardArrowUp, KeyboardArrowDown} from '@mui/icons-material';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useMarketplaceContext} from '@shared/hooks/MarketplaceContext';

function SortMenuItems() {
  const {t} = useTranslation();
  const {selectSort, setSelectSort} = useMarketplaceContext();

  const handleClick = (event: any) => {
    if (event.target.value === selectSort) {
      setSelectSort('');
    } else {
      setSelectSort(event.target.value);
    }
  };
  return (
    <FormControl sx={{ml: 2, mr: 2}}>
      <RadioGroup name="radio-buttons-group" value={selectSort}>
        <FormControlLabel
          value="LowToHigh"
          control={<Radio onClick={handleClick} />}
          label={t<string>('marketplace.sort.lowtohigh')}
        />
        <FormControlLabel
          value="HighToLow"
          control={<Radio onClick={handleClick} />}
          label={t<string>('marketplace.sort.hightolow')}
        />
        <FormControlLabel
          value="AToZ"
          control={<Radio onClick={handleClick} />}
          label={t<string>('marketplace.sort.AtoZ')}
        />
        <FormControlLabel
          value="ZToA"
          control={<Radio onClick={handleClick} />}
          label={t<string>('marketplace.sort.ZtoA')}
        />
      </RadioGroup>
    </FormControl>
  );
}
function SortMenu() {
  const theme = useTheme();
  const {t} = useTranslation();
  const [openSortMenu, setOpenSortMenu] = useState(null);
  const [openSortMobileMenu, setOpenSortMobileMenu] = useState(false);

  const {
    selectSort,
    itemsDisplayed,
    setItemsDisplayed,
    updateSortedItems,
    setUpdateSortedItems,
  } = useMarketplaceContext();

  const handleSortButtonClick = (event: any) => {
    setOpenSortMenu(event.currentTarget);
  };

  const handleSortButtonMobileClick = (openSortMobileMenu: boolean) => {
    setOpenSortMobileMenu(openSortMobileMenu);
  };

  const handleSortClose = () => {
    setOpenSortMenu(null);
  };

  useEffect(() => {
    handleSort();
  }, [selectSort]);

  useEffect(() => {
    if (updateSortedItems && selectSort) {
      handleSort();
    }
    setUpdateSortedItems(Boolean(false));
  }, [updateSortedItems]);

  const isSelected = () => {
    if (selectSort) return 1;
    else return 0;
  };

  const handleSort = () => {
    switch (selectSort) {
      case 'LowToHigh':
        itemsDisplayed.sort((item1, item2) =>
          item1.brand.localeCompare(item2.brand),
        );
        itemsDisplayed.sort((item1, item2) => item1.points - item2.points);
        break;
      case 'HighToLow':
        itemsDisplayed.sort((item1, item2) =>
          item1.brand.localeCompare(item2.brand),
        );
        itemsDisplayed.sort((item1, item2) => item2.points - item1.points);
        break;
      case 'AToZ':
        itemsDisplayed.sort((item1, item2) => item1.points - item2.points);
        itemsDisplayed.sort((item1, item2) =>
          item1.brand.localeCompare(item2.brand),
        );
        break;
      case 'ZToA':
        itemsDisplayed.sort((item1, item2) => item1.points - item2.points);
        itemsDisplayed.sort((item1, item2) =>
          item2.brand.localeCompare(item1.brand),
        );
        break;
    }
    if (selectSort) setItemsDisplayed([...itemsDisplayed]);
  };

  return (
    <Box>
      <Button
        onClick={handleSortButtonClick}
        sx={{
          mr: 1,
          borderRadius: 5,
          backgroundColor:
            selectSort === ''
              ? theme.interface.main
              : theme.palette.primary.main,
          color:
            selectSort === ''
              ? theme.palette.primary.main
              : theme.interface.main,
          '&:hover': {
            color: theme.palette.primary.main,
          },
          display: {
            xs: 'none',
            sm: 'none',
            md: 'flex',
          },
        }}
        variant="outlined"
      >
        <Sort sx={{mr: 1}} /> {t<string>('marketplace.sort.sort')}
      </Button>
      <MenuItem
        data-testid="sort-button"
        onClick={() => handleSortButtonMobileClick(!openSortMobileMenu)}
        sx={{
          justifyContent: 'space-between',
          display: {
            xs: 'flex',
            sm: 'flex',
            md: 'none',
          },
        }}
      >
        <Badge badgeContent={isSelected()} color="primary">
          <Sort sx={{mr: 1}} />
        </Badge>
        {t<string>('marketplace.sort.sort')}
        {!openSortMobileMenu && <KeyboardArrowDown fontSize="small" />}
        {openSortMobileMenu && <KeyboardArrowUp fontSize="small" />}
      </MenuItem>
      {openSortMobileMenu && (
        <Box
          sx={{
            display: {
              xs: 'flex',
              sm: 'flex',
              md: 'none',
            },
            flexDirection: 'column',
          }}
        >
          <SortMenuItems />
        </Box>
      )}
      <Menu
        id="simple-menu"
        anchorEl={openSortMenu}
        keepMounted
        open={Boolean(openSortMenu)}
        onClose={handleSortClose}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        transformOrigin={{vertical: -2, horizontal: 50}}
        PaperProps={{
          style: {
            minWidth: 150,
          },
        }}
        sx={{
          display: {
            xs: 'none',
            sm: 'none',
            md: 'flex',
          },
        }}
      >
        <SortMenuItems />
      </Menu>
    </Box>
  );
}

export default SortMenu;
