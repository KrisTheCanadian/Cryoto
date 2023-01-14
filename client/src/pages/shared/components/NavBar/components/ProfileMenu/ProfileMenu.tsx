/* eslint-disable @shopify/jsx-no-complex-expressions */
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import {AccountCircle} from '@mui/icons-material';
import {useTranslation} from 'react-i18next';
import {NavLink, useLocation} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {useMsal} from '@azure/msal-react';

import {getUserId, getUserProfilePhoto} from '@/data/api/helpers';

function ProfileMenu() {
  const {instance} = useMsal();
  const location = useLocation();
  const {t} = useTranslation();
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

  return (
    <>
      <IconButton
        onClick={handleClick}
        data-testid="profileButton"
        size="small"
        sx={{ml: 2}}
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
          to="/profile"
          selected={location.pathname === '/profile'}
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
          component={NavLink}
          to="/settings"
          selected={location.pathname === '/settings'}
        >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          {t('layout.Settings')}
        </MenuItem>
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
