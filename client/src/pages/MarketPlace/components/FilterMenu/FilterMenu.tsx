/* eslint-disable react-hooks/exhaustive-deps */

import {
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Clear,
  FilterList,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useMarketplaceContext} from '@shared/hooks/MarketplaceContext';

interface Item {
  image: any;
  title: string;
  type: string;
  brand: string;
  points: number;
}

function FilterMenuItems() {
  const theme = useTheme();
  const {t} = useTranslation();
  const {allItems} = useMarketplaceContext();
  const types = [...new Set(allItems.map((item) => item.type))];
  const brands = [...new Set(allItems.map((item) => item.brand))];
  brands.sort((item1, item2) => item1.localeCompare(item2));
  const points = [
    {label: 'marketplace.filter.price.under150', min: 0, max: 150},
    {label: 'marketplace.filter.price.between150to250', min: 150, max: 250},
    {label: 'marketplace.filter.price.between250to500', min: 250, max: 500},
    {label: 'marketplace.filter.price.between500to1000', min: 500, max: 1000},
    {label: 'marketplace.filter.price.over1000', min: 1000, max: 1.0 / 0.0},
  ];

  const [openType, setOpenType] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);
  const {selectedFilters, setSelectedFilters, setItemsDisplayed} =
    useMarketplaceContext();

  const isSelectedFilter = (filter: string) => {
    return selectedFilters.some((f) => f.filter === filter);
  };

  const handleSelectedFilterChange = (
    filter: string,
    type: number,
    min?: number,
    max?: number,
  ) => {
    if (isSelectedFilter(filter)) removeFilter(filter);
    else {
      setSelectedFilters([...selectedFilters, {filter, type, min, max}]);
    }
  };

  const removeFilter = (filter: string) => {
    setSelectedFilters(
      selectedFilters.filter((item) => item.filter !== filter),
    );
  };

  const removeAllFilters = () => {
    setSelectedFilters([]);
    setOpenType(false);
    setOpenBrand(false);
    setOpenPrice(false);
    setItemsDisplayed(allItems);
  };

  return (
    <Box>
      {selectedFilters.length !== 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mr: 1,
          }}
        >
          <Button
            data-testid="remove-all-filters"
            sx={{fontSize: 11}}
            style={{textTransform: 'none'}}
            onClick={() => {
              removeAllFilters();
            }}
          >
            {t<string>('marketplace.filter.clearAll')}
          </Button>
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          ml: 2,
          mr: 1,
          flexWrap: 'wrap',
          maxWidth: 300,
        }}
      >
        {selectedFilters.map((f) => (
          <Box
            key={f.filter}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.interface.main,
              borderRadius: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 30,
              padding: 1,
              mb: 1,
              mr: 1,
            }}
          >
            <Typography sx={{fontSize: 13.5, mr: 0.4}}>
              {t<string>(f.filter)}
            </Typography>
            <IconButton
              sx={{padding: '1px'}}
              onClick={() => {
                removeFilter(f.filter);
              }}
            >
              <Clear sx={{fontSize: 13, color: theme.interface.main}} />
            </IconButton>
          </Box>
        ))}
      </Box>
      {selectedFilters.length !== 0 && <Divider sx={{ml: 2, mr: 2, mb: 1}} />}
      <MenuItem
        data-testid="type-button"
        onClick={() => setOpenType(!openType)}
        sx={{diplay: 'flex', justifyContent: 'space-between'}}
      >
        {t<string>('marketplace.filter.type')}
        {openType && <KeyboardArrowUp fontSize="small" />}
        {!openType && <KeyboardArrowDown fontSize="small" />}
      </MenuItem>

      {openType && (
        <FormControl component="fieldset" variant="standard" sx={{ml: 3}}>
          <FormGroup>
            {types.map((t) => (
              <FormControlLabel
                key={t}
                control={
                  <Checkbox
                    // id={"types-"+t}
                    name={t}
                    onChange={() => handleSelectedFilterChange(t, 2)}
                    checked={isSelectedFilter(t)}
                    sx={{transform: 'scale(0.9)'}}
                  />
                }
                label={t}
              />
            ))}
          </FormGroup>
        </FormControl>
      )}
      <Divider sx={{ml: 2, mr: 2}} />
      <MenuItem
        data-testid="brand-button"
        onClick={() => setOpenBrand(!openBrand)}
        sx={{display: 'flex', justifyContent: 'space-between'}}
      >
        {t<string>('marketplace.filter.brand')}
        {openBrand && <KeyboardArrowUp fontSize="small" />}
        {!openBrand && <KeyboardArrowDown fontSize="small" />}
      </MenuItem>

      {openBrand && (
        <FormControl
          component="fieldset"
          variant="standard"
          sx={{
            ml: 3,
          }}
        >
          <FormGroup>
            {brands.map((b) => (
              <FormControlLabel
                key={b}
                control={
                  <Checkbox
                    id={`checkbox-${b}`}
                    name={b}
                    onChange={() => handleSelectedFilterChange(b, 1)}
                    checked={isSelectedFilter(b)}
                    sx={{transform: 'scale(0.9)'}}
                  />
                }
                label={b}
              />
            ))}
          </FormGroup>
        </FormControl>
      )}
      <Divider sx={{ml: 2, mr: 2}} />
      <MenuItem
        data-testid="price-button"
        onClick={() => setOpenPrice(!openPrice)}
        sx={{diplay: 'flex', justifyContent: 'space-between'}}
      >
        {t<string>('marketplace.filter.price.price')}
        {openPrice && <KeyboardArrowUp fontSize="small" />}
        {!openPrice && <KeyboardArrowDown fontSize="small" />}
      </MenuItem>
      {openPrice && (
        <FormControl component="fieldset" variant="standard" sx={{ml: 3}}>
          <FormGroup>
            {points.map((p) => (
              <FormControlLabel
                key={p.label}
                control={
                  <Checkbox
                    name={p.label}
                    onChange={() =>
                      handleSelectedFilterChange(p.label, 3, p.min, p.max)
                    }
                    checked={isSelectedFilter(p.label)}
                    sx={{transform: 'scale(0.9)'}}
                  />
                }
                label={t<string>(p.label)}
              />
            ))}
          </FormGroup>
        </FormControl>
      )}
    </Box>
  );
}

function FilterMenu() {
  const theme = useTheme();
  const {t} = useTranslation();

  const [openFilterMenu, setOpenFilterMenu] = useState(null);
  const [openFilterMobileMenu, setOpenFilterMobileMenu] = useState(false);
  const {allItems, selectedFilters, setItemsDisplayed, setUpdateSortedItems} =
    useMarketplaceContext();

  useEffect(() => {
    if (selectedFilters?.length > 0) {
      const filteredArray = filterProducts();
      setItemsDisplayed(filteredArray);
    } else {
      setItemsDisplayed(allItems);
    }
    setUpdateSortedItems(Boolean(true));
  }, [selectedFilters]);

  const handleFilterButtonClick = (event: any) => {
    setOpenFilterMenu(event.currentTarget);
  };

  const handleFilterButtonMobileClick = (openFilterMenu: boolean) => {
    setOpenFilterMobileMenu(openFilterMenu);
  };

  const handleFilterClose = () => {
    setOpenFilterMenu(null);
  };

  const filterProducts = () => {
    let tempArr: Item[] = [];
    let filteredArr: Item[] = [];

    let setTempTypeArr = true;
    let setTempPointsArr = true;
    selectedFilters.sort((a, b) => a.type - b.type);

    selectedFilters.forEach((f) => {
      if (f.type === 1) {
        tempArr = allItems.filter((item) => item.brand === f.filter);
        filteredArr = filteredArr.concat(tempArr);
      }

      if (f.type === 2) {
        if (setTempTypeArr) {
          tempArr = filteredArr.length > 0 ? filteredArr : allItems;
          if (filteredArr.length > 0) filteredArr = [];
          setTempTypeArr = false;
        }

        filteredArr = filteredArr.concat(
          tempArr.filter((item) => item.type === f.filter),
        );
      }

      if (f.type === 3) {
        if (setTempPointsArr) {
          tempArr = filteredArr.length > 0 ? filteredArr : allItems;
          if (filteredArr.length > 0) filteredArr = [];
          setTempPointsArr = false;
        }
        if (f.min !== undefined && f.max !== undefined) {
          const min = f.min;
          const max = f.max;
          filteredArr = filteredArr.concat(
            tempArr.filter((item) => item.points >= min && item.points <= max),
          );
        }
      }
    });
    filteredArr.sort((item1, item2) => item1.brand.localeCompare(item2.brand));
    return filteredArr;
  };
  return (
    <Box>
      <Button
        data-testid="mFilterButton"
        onClick={handleFilterButtonClick}
        sx={{
          mr: 1,
          borderRadius: 5,
          backgroundColor:
            selectedFilters?.length === 0
              ? theme.interface.main
              : theme.palette.primary.main,
          color:
            selectedFilters?.length === 0
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
        <FilterList sx={{mr: 1}} />
        {t<string>('marketplace.filter.filter')}
      </Button>
      <MenuItem
        onClick={() => handleFilterButtonMobileClick(!openFilterMobileMenu)}
        sx={{
          justifyContent: 'space-between',
          display: {
            xs: 'flex',
            sm: 'flex',
            md: 'none',
          },
        }}
      >
        <Badge badgeContent={selectedFilters?.length} color="primary">
          <FilterList sx={{mr: 1}} />
        </Badge>
        {t<string>('marketplace.filter.filter')}
        {!openFilterMobileMenu && <KeyboardArrowDown fontSize="small" />}
        {openFilterMobileMenu && <KeyboardArrowUp fontSize="small" />}
      </MenuItem>
      {openFilterMobileMenu && (
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
          <FilterMenuItems />
        </Box>
      )}
      <Menu
        anchorEl={openFilterMenu}
        keepMounted
        open={Boolean(openFilterMenu)}
        onClose={handleFilterClose}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        transformOrigin={{vertical: -2, horizontal: 50}}
        PaperProps={{
          style: {
            minWidth: 200,
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
        <Box sx={{maxHeight: 500, overflow: 'auto', width: '100%'}}>
          <FilterMenuItems />
        </Box>
      </Menu>
    </Box>
  );
}

export default FilterMenu;
