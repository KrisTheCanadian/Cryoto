import {Alert, Slide, SlideProps, Snackbar} from '@mui/material';
import {useContext, useEffect, useState} from 'react';

import {AlertType} from './AlertType';
import {AlertContext} from './AlertContext';

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
    alertContext.clear();
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  if (alertContext.alertType !== AlertType.NONE) {
    return (
      <Snackbar
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
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
