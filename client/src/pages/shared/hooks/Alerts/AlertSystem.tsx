import {Alert, Slide, SlideProps, Snackbar} from '@mui/material';
import {useContext, useEffect, useState} from 'react';

import AlertContext from './AlertContext';
import {AlertType} from './AlertType';

const AlertSystem = () => {
  const alertContext = useContext(AlertContext);
  const [open, setOpen] = useState(false);

  function SlideTransition(props: SlideProps) {
    return <Slide {...props} direction="up" />;
  }
  useEffect(() => {
    if (alertContext.alertType !== AlertType.NONE) {
      setOpen(true);
    }
  }, [alertContext]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  if (alertContext.alertType !== AlertType.NONE) {
    return (
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
      >
        <Alert onClose={handleClose} severity={alertContext.alertType}>
          {alertContext.alertText}
        </Alert>
      </Snackbar>
    );
  }
  return <></>;
};

export default AlertSystem;
