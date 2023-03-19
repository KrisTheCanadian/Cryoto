/* eslint-disable promise/catch-or-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @shopify/jsx-no-hardcoded-content */

/* eslint-disable @shopify/jsx-no-complex-expressions */

import * as React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {NotificationsNone, VolunteerActivism} from '@mui/icons-material';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import {useTranslation} from 'react-i18next';
import {
  Avatar,
  Badge,
  Box,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import {useMsal} from '@azure/msal-react';
import {useNotificationSignalRContext} from '@shared/hooks/NotificationSignalRContext/NotificationSignalRContext';
import {useInfiniteQuery, useMutation, useQueryClient} from 'react-query';
import {useAlertContext} from '@shared/hooks/Alerts';
import moment from 'moment';
import {walletBalanceQuery} from '@shared/components/SideBar/SideBar';
import {stringAvatar} from '@shared/utils/colorUtils';
import {useTheme} from '@mui/material/styles';

import INotification from '@/data/api/types/INotification';
import {
  getNextPage,
  markNotificationAsRead,
} from '@/data/api/requests/notifications';
import INotificationPage from '@/data/api/types/INotificationPage';
import {postsQuery} from '@/pages/HomePage/HomePage';
import {getUserProfilePhoto} from '@/data/api/requests/users';

function Notifications() {
  const theme = useTheme();
  const {t} = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const loader = useRef();

  const queryClient = useQueryClient();
  const dispatchAlert = useAlertContext();

  const [notificationsPerLoad, setNotificationsPerLoad] = useState(5);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const notificationsQuery = ['notifications-query'];

  const {data, status, fetchNextPage, hasNextPage, isFetchingNextPage} =
    useInfiniteQuery<INotificationPage, Error>(
      notificationsQuery,
      ({pageParam = 1}) => getNextPage(pageParam, notificationsPerLoad),
      {
        getNextPageParam: (page) => {
          return page.page === page.totalPages ? undefined : page.page + 1;
        },
      },
    );

  const handleObserver = useCallback(
    (entries: any[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        fetchNextPage();
      }
    },
    [fetchNextPage],
  );

  useEffect(() => {
    const divElement = loader.current;
    const option = {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (divElement) observer.observe(divElement);
    return () => {
      if (divElement) observer.unobserve(divElement);
    };
  }, [loader, handleObserver, hasNextPage]);

  useEffect(() => {
    if (status === 'error') {
      dispatchAlert.error(t('errors.BackendError'));
    }
  }, [isFetchingNextPage, hasNextPage, dispatchAlert, status, t]);

  const {accounts} = useMsal();
  const connection = useNotificationSignalRContext();
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const mutation = useMutation(
    (notification: INotification) => markNotificationAsRead(notification.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(notificationsQuery);
      },
    },
  );

  useEffect(() => {
    const unreadNotifications = () => {
      const newNotifications = new Map<string, boolean>();

      if (data && status === 'success') {
        data.pages.forEach((page: INotificationPage) => {
          page.data.forEach((n: INotification) => {
            if (!n.seen) {
              newNotifications.set(n.id, true);
            }
          });
        });
      }

      notifications.forEach((n) => {
        if (!n.seen) {
          newNotifications.set(n.id, true);
        }
      });

      setNotificationsCount(newNotifications.size);
    };

    if (data && status === 'success') {
      data.pages.forEach((page: INotificationPage) => {
        page.data.forEach((n: INotification) => {
          if (n.senderPhotoUrl === undefined)
            getUserProfilePhoto(n.senderId).then((response) => {
              n.senderPhotoUrl = response;
            });
        });
      });
    }

    // set notifications count
    unreadNotifications();
  }, [data, notifications, status]);

  useEffect(() => {
    const handleConnectionStart = async () => {
      if (connection?.state === 'Disconnected' && accounts[0]) {
        connection
          .start()
          .then(() => {
            connection.invoke(
              'SubscribeToNotifications',
              accounts[0].localAccountId,
            );
          })
          .catch((err) =>
            // eslint-disable-next-line no-console
            console.log(`Error while starting connection: ${err}`),
          );
      }
    };

    const handleNotification = async (notification: INotification) => {
      notifications.map(
        async (n) =>
          // eslint-disable-next-line no-return-await
          await getUserProfilePhoto(n.senderId).then((response) => {
            n.senderPhotoUrl = response;
          }),
      );
      setNotifications((prev) => [notification, ...prev]);
      // invalidate queries in homepage
      queryClient.invalidateQueries(postsQuery);
      queryClient.invalidateQueries(walletBalanceQuery);
    };

    const fetchNotifications = async () => {
      // make sure the user is logged in and connection is active
      if (connection && accounts[0]) {
        connection.on('ReceiveNotification', handleNotification);
      }
    };

    handleConnectionStart();
    fetchNotifications();

    return () => {
      connection?.off('ReceiveNotification', handleNotification);
    };
  }, [accounts, connection, queryClient]);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if ((data && data?.pages[0].data.length > 0) || notifications.length > 0) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleRead = async () => {
    notifications.forEach((n) => {
      mutation.mutate(n);
    });

    if (data) {
      data.pages.forEach((page: INotificationPage) => {
        page.data.forEach((n: INotification) => {
          if (!n.seen) {
            mutation.mutate(n);
          }
        });
      });
    }
  };

  const handleClose = () => {
    // reset the notifications
    setAnchorEl(null);
    handleRead();

    setNotifications([]);
    setNotificationsCount(0);
  };

  const paperProps = {
    elevation: 0,
    sx: {
      borderRadius: theme.borderRadius.default,
      overflow: 'visible',
      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
      mt: 1.5,
      '& .MuiAvatar-root': {
        width: 32,
        height: 32,
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

  return (
    <>
      <IconButton
        onClick={handleClick}
        data-testid="NotificationsButton"
        size="small"
        sx={{ml: 2}}
        aria-controls={open ? 'notification-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Badge color="secondary" badgeContent={notificationsCount}>
          <NotificationsNone />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={paperProps}
        transformOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
      >
        <Paper elevation={0} style={{maxHeight: '30vh', overflow: 'auto'}}>
          <List style={{maxHeight: '100%', overflow: 'auto'}}>
            <>
              {notifications.map((n) => (
                <ListItem alignItems="flex-start" key={n.id}>
                  <ListItemAvatar>
                    {n.senderPhotoUrl ? (
                      <Avatar src={n.senderPhotoUrl} />
                    ) : (
                      <Avatar {...stringAvatar(n.senderName || 'Cryoto')} />
                    )}
                  </ListItemAvatar>
                  <Box>
                    <ListItemText sx={{display: 'flex'}} primary={n.message} />
                    <Box>
                      <Typography
                        sx={{display: 'inline'}}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {`${n.senderName || 'Cryoto'} - \n${moment
                          .utc(n.created)
                          .local()
                          .startOf('seconds')
                          .fromNow()}`}
                      </Typography>
                    </Box>
                    {n.amount !== null && (
                      <Chip
                        icon={<VolunteerActivism />}
                        label={n.amount.toString()}
                      />
                    )}
                  </Box>
                </ListItem>
              ))}
              {notifications.length !== 0 && (
                <Divider variant="inset" component="li" />
              )}
            </>

            <>
              {data &&
                data.pages.map((page: INotificationPage) => (
                  <React.Fragment key={page.page}>
                    {page.data.map((n: INotification) => (
                      <ListItem alignItems="flex-start" key={n.id}>
                        <ListItemAvatar>
                          {n.senderPhotoUrl ? (
                            <Avatar src={n.senderPhotoUrl} />
                          ) : (
                            <Avatar
                              {...stringAvatar(n.senderName || 'Cryoto')}
                            />
                          )}
                        </ListItemAvatar>
                        <Box>
                          <ListItemText
                            sx={{display: 'flex'}}
                            primary={n.message}
                          />
                          <Box>
                            <Typography
                              sx={{display: 'inline'}}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {`${n.senderName || 'Cryoto'} - \n${moment
                                .utc(n.created)
                                .local()
                                .startOf('seconds')
                                .fromNow()}`}
                            </Typography>
                          </Box>
                          {n.amount !== null && (
                            <Chip
                              sx={{
                                backgroundColor: theme.interface.contrastMain,
                                border: '3px solid',
                                borderColor: theme.palette.primary.main,
                                fontSize: '1rem',
                                fontWeight: theme.typography.fontWeightMedium,
                                marginRight: theme.spacing(1),
                                '& .MuiChip-label': {
                                  color: theme.palette.primary.main,
                                },
                              }}
                              icon={
                                <VolunteerActivism
                                  style={{
                                    fill: theme.palette.primary.main,
                                    fontSize: '1.2rem',
                                    marginLeft: '10px',
                                  }}
                                />
                              }
                              label={n.amount.toString()}
                            />
                          )}
                        </Box>
                      </ListItem>
                    ))}
                  </React.Fragment>
                ))}
            </>
            <Box ref={loader} />
          </List>
        </Paper>
      </Menu>
    </>
  );
}

export default Notifications;
