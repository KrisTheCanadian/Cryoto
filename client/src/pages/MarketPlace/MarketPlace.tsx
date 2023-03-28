/* eslint-disable @shopify/jsx-no-hardcoded-content */

/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Pagination,
  useTheme,
} from '@mui/material';
import {Close} from '@mui/icons-material';
import PageFrame from '@shared/components/PageFrame';
import {useEffect, useState} from 'react';
import {useMarketplaceContext} from '@shared/hooks/MarketplaceContext';

import {
  CartButton,
  FilterMenu,
  MarketSearch,
  ProductCard,
  SortMenu,
} from './components';

import {IItem} from '@/data/api/types/ICart';

function MarketPlace() {
  const theme = useTheme();
  const {itemsDisplayed} = useMarketplaceContext();

  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [itemsDisplayedInPage, setItemsDisplayedInPage] = useState<IItem[]>([]);

  useEffect(() => {
    setItemsDisplayedInPage(
      itemsDisplayed.slice(
        (page - 1) * itemsPerPage,
        (page - 1) * itemsPerPage + itemsPerPage,
      ),
    );
  }, [page, itemsDisplayed]);

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const [open, setState] = useState(false);
  const toggleDrawer = (open: any) => (event: any) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setState(open);
  };

  const gridStyle1 = {
    [theme.breakpoints.down('lg')]: {
      width: '100%',
    },
    [theme.breakpoints.up('lg')]: {
      width: '95%',
    },
    [theme.breakpoints.up('xl')]: {
      width: '72%',
    },
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    mb: 2.5,
  };

  const gridStyle2 = {
    [theme.breakpoints.down('lg')]: {
      width: '100%',
    },
    [theme.breakpoints.up('lg')]: {
      width: '95%',
    },
    [theme.breakpoints.up('xl')]: {
      width: '80%',
    },
    display: 'flex',
    justifyContent: 'center',
  };

  return (
    <PageFrame>
      <Box data-testid="marketBox" flex={8} p={0} sx={{ml: '0!important'}}>
        <Box
          data-testid="innermarketBox"
          p={2}
          display="flex"
          alignItems="center"
          flexDirection="column"
        >
          <Grid
            data-testid="marketGrid"
            container
            spacing={2}
            sx={{
              justifyContent: 'center',
            }}
          >
            <Grid item sx={gridStyle1} data-testid="marketInnderGrid1">
              <Grid
                data-testid="marketInnderGrid2"
                item
                xs={12}
                sm={1}
                sx={{
                  display: {
                    sm: 'flex',
                    md: 'none',
                  },
                }}
              >
                <IconButton
                  edge="start"
                  data-testid="filterButton"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={toggleDrawer(true)}
                  sx={{
                    ml: 0.5,
                    mr: 2,
                  }}
                >
                  <img
                    src="images/svgIcons/FilterIcon.svg"
                    alt="Filter"
                    style={{
                      filter:
                        theme.interface.type === 'dark'
                          ? 'brightness(27.5%) saturate(50%)'
                          : 'brightness(30%) saturate(50%)',
                    }}
                  />
                </IconButton>
              </Grid>
              <Grid
                item
                xs={4}
                sx={{
                  display: {
                    xs: 'none',
                    sm: 'none',
                    md: 'flex',
                  },
                }}
              >
                <FilterMenu />
                <SortMenu />
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  justifyContent: 'center',
                  display: {
                    xs: 'none',
                    sm: 'flex',
                  },
                }}
              >
                <MarketSearch />
              </Grid>
              <Grid
                item
                xs={3}
                sx={{display: 'flex', justifyContent: 'flex-end'}}
              >
                <CartButton />
              </Grid>
            </Grid>
          </Grid>
          <Drawer
            data-testid="drawer"
            anchor="right"
            open={open}
            onClose={toggleDrawer(false)}
            sx={{
              display: {
                xs: 'flex',
                sm: 'flex',
                md: 'none',
              },
            }}
            PaperProps={{
              sx: {
                backgroundColor:
                  theme.interface.type === 'light'
                    ? theme.interface.contrastMain
                    : theme.interface.main,
              },
            }}
          >
            <Box
              sx={{
                p: 2,
                height: 1,
                minWidth: 275,
              }}
            >
              <IconButton onClick={toggleDrawer(false)} sx={{mb: 2}}>
                <Close />
              </IconButton>

              <Divider sx={{mb: 2}} />

              <Box sx={{mb: 2}}>
                <FilterMenu />
                <Divider sx={{m: 1}} />
                <SortMenu />
                <Divider sx={{m: 1}} />
                <Box
                  sx={{
                    m: 1,
                    display: {
                      xs: 'flex',
                      sm: 'none',
                    },
                  }}
                >
                  <MarketSearch />
                </Box>
              </Box>
            </Box>
          </Drawer>

          <Grid
            data-testid="displayGrid"
            container
            spacing={{xs: 2, md: 2}}
            columns={{xs: 4, sm: 14, md: 16, xl: 22}}
            sx={gridStyle2}
          >
            {itemsDisplayedInPage.map((i) => (
              <Grid item xs={2} sm={4} md={4} key={`${i.title} ${i.points}`}>
                <ProductCard
                  id={i.id}
                  image={i.image}
                  title={i.title}
                  points={i.points}
                  size={i?.size}
                  availability={i.availability}
                />
              </Grid>
            ))}
          </Grid>

          <Pagination
            data-testid="pagination"
            count={Math.ceil(itemsDisplayed.length / itemsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
            sx={{mt: 3}}
          />
        </Box>
      </Box>
    </PageFrame>
  );
}

export default MarketPlace;
