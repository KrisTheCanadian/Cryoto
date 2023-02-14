/* eslint-disable @shopify/jsx-no-hardcoded-content */
/* eslint-disable @shopify/jsx-no-complex-expressions */
import * as React from 'react';
import {
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  IconButton,
} from '@mui/material';
import {
  AccountCircle,
  Brightness4,
  Brightness7,
  Settings,
  Logout,
  AdminPanelSettings,
} from '@mui/icons-material';
import {useTranslation} from 'react-i18next';
import {NavLink, useLocation} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {useMsal} from '@azure/msal-react';
import {useThemeModeContext} from '@shared/hooks/ThemeContextProvider';
import {useTheme} from '@mui/material/styles';

import {getUserId} from '@/data/api/helpers';
import {getUserProfilePhoto} from '@/data/api/requests/users';
import {routeAdmin, routeProfile, routeSettings} from '@/pages/routes';
import Role from '@/pages/roles';

function ProfileMenu() {
  const {colorMode} = useThemeModeContext();
  const theme = useTheme();
  const {accounts} = useMsal();
  const location = useLocation();
  const {t} = useTranslation();
  const {instance} = useMsal();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  const paperProps = {
    elevation: 0,
    sx: {
      overflow: 'visible',
      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
      mt: 1.5,
      '& .MuiAvatar-root': {
        width: 32,
        height: 32,
        ml: -0.5,
        mr: 1,
      },
      '&:before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        top: 0,
        right: 14,
        width: 10,
        height: 10,
        bgcolor: 'background.paper',
        transform: 'translateY(-50%) rotate(45deg)',
        zIndex: 0,
      },
    },
  };

  const [userProfilePhoto, setUserProfilePhoto] = useState();
  const [oId, setOId] = useState();

  useEffect(() => {
    getUserId()
      .then((response: any) => setOId(response))
      .catch((err) => {});
  }, []);

  useEffect(() => {
    getUserProfilePhoto(oId!)
      .then((response: any) => setUserProfilePhoto(response))
      .catch((err) => {});
  }, [oId]);

  const mode =
    theme.palette.mode === 'dark'
      ? t('layout.LightMode')
      : t('layout.DarkMode');

  const brightnessIcon = () => {
    return theme.palette.mode === 'dark' ? (
      <Brightness7 sx={{height: 20, width: 20}} />
    ) : (
      <Brightness4 sx={{height: 20, width: 20}} />
    );
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        data-testid="profileButton"
        size="large"
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        {userProfilePhoto === null ||
        userProfilePhoto === undefined ||
        userProfilePhoto === '' ? (
          <AccountCircle />
        ) : (
          <Avatar src={userProfilePhoto} />
        )}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={paperProps}
        transformOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
      >
        <MenuItem
          component={NavLink}
          to={`/profile/${oId}`}
          selected={location.pathname === `/profile/${oId}}`}
        >
          {userProfilePhoto === null ||
          userProfilePhoto === undefined ||
          userProfilePhoto === '' ? (
            <Avatar />
          ) : (
            <Avatar src={userProfilePhoto} />
          )}
          {t('layout.Profile')}
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={colorMode.toggleColorMode}
          data-testid="dark-mode-toggle"
        >
          <ListItemIcon>{brightnessIcon()}</ListItemIcon>
          {mode}
        </MenuItem>
        <MenuItem
          component={NavLink}
          to={routeSettings}
          selected={location.pathname === '/settings'}
        >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          {t('layout.Settings')}
        </MenuItem>
        {accounts[0]?.idTokenClaims?.roles?.includes(Role.Admin) && (
          <MenuItem
            component={NavLink}
            to={routeAdmin}
            selected={location.pathname === '/admin'}
          >
            <ListItemIcon>
              <AdminPanelSettings fontSize="small" />
            </ListItemIcon>
            {t('adminDashboard.pageTitle')}
          </MenuItem>
        )}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {t('layout.Logout')}
        </MenuItem>
      </Menu>
    </>
  );
}

export default ProfileMenu;
