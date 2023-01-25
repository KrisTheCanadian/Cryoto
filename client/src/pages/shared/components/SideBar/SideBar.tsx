import {
  Box,
  List,
  Typography,
  useTheme,
  styled,
  ListSubheader,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material';
import {Home, Wallet, Storefront, LocalShipping} from '@mui/icons-material';
import {NavLink, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';

import {MenuItem} from './components';

import {getTokenBalance} from '@/data/api/requests/wallet';
import IWalletsBalance from '@/data/api/types/IWalletsBalance';
import {routeHome, routeMarket, routeOrders, routeWallet} from '@/pages/routes';

export const walletBalanceQuery = 'walletsBalance';

const StyledMenuBox = styled(Box)(({theme}) => ({
  width: '100%',
  boxSizing: 'border-box',
  padding: theme.spacing(2),
}));

function SideBar() {
  const {t} = useTranslation();
  const location = useLocation();
  const theme = useTheme();

  const {data, status} = useQuery<IWalletsBalance>(
    'walletsBalance',
    getTokenBalance,
  );

  const sideBarStyle = {
    // to adjust to the navbar height
    maxHeight: 0,
    position: 'sticky',
    minHeight: 'calc(100vh - 56px)',
    flex: 2,

    [theme.breakpoints.up('xs')]: {
      '@media (orientation: landscape)': {
        top: 48,
        minHeight: 'calc(100vh - 48px)',
      },
    },
    [theme.breakpoints.up('sm')]: {
      top: 64,
      minHeight: 'calc(100vh - 64px)',
    },
  };

  return (
    <Box sx={sideBarStyle}>
      <StyledMenuBox>
        <nav aria-label={t('sideBar.navTitle')}>
          <List
            sx={{
              textDecoration: 'none',
              borderRadius: theme.borderRadius.default,
              backgroundColor: theme.interface.main,
              boxShadow: 1,
            }}
            subheader={
              <ListSubheader
                sx={{
                  backgroundColor: theme.interface.border,
                  borderRadius: '4px 4px 0px 0px',
                  padding: theme.spacing(1.5),
                  paddingLeft: theme.spacing(2.5),
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={theme.typography.fontWeightBold}
                  color={theme.palette.text.primary}
                >
                  {t('layout.Menu')}
                </Typography>
              </ListSubheader>
            }
          >
            <MenuItem to={routeHome} icon={<Home />} text="layout.Home" />
            <MenuItem
              to={routeMarket}
              icon={<Storefront />}
              text="layout.MarketPlace"
            />
            <MenuItem
              to={routeOrders}
              icon={<LocalShipping />}
              text="layout.Orders"
            />
            <MenuItem to={routeWallet} icon={<Wallet />} text="layout.Wallet" />
          </List>
        </nav>
      </StyledMenuBox>
      <StyledMenuBox>
        {location.pathname !== routeWallet && (
          <nav aria-label={t('sideBar.navTitle')}>
            <List
              sx={{
                textDecoration: 'none',
                borderRadius: theme.borderRadius.default,
                backgroundColor: theme.interface.main,
                boxShadow: 1,
              }}
              subheader={
                <ListSubheader
                  sx={{
                    backgroundColor: theme.interface.border,
                    borderRadius: '4px 4px 0px 0px',
                    padding: theme.spacing(1.5),
                    paddingLeft: theme.spacing(2.5),
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={theme.typography.fontWeightBold}
                    color={theme.palette.text.primary}
                  >
                    {t('layout.MyBalance')}
                  </Typography>
                </ListSubheader>
              }
            >
              <ListItemButton component={NavLink} to={routeWallet}>
                <ListItemIcon sx={{width: 100}}>
                  {t('layout.ToSpend')}
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: '18px',
                    fontWeight: theme.typography.fontWeightMedium,
                  }}
                  primary={data?.toSpendBalance}
                />
              </ListItemButton>
              <Divider variant="middle" />
              <ListItemButton component={NavLink} to={routeWallet}>
                <ListItemIcon sx={{width: 100}}>
                  {t('layout.ToAward')}
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: '18px',
                    fontWeight: theme.typography.fontWeightMedium,
                  }}
                  primary={data?.toAwardBalance}
                />
              </ListItemButton>
            </List>
          </nav>
        )}
      </StyledMenuBox>
    </Box>
  );
}

export default SideBar;
