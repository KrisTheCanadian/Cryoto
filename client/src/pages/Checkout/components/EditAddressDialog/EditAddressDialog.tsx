/* eslint-disable @shopify/jsx-no-hardcoded-content */
/* eslint-disable @shopify/jsx-no-complex-expressions */

import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useMutation} from 'react-query';

import IAddress, {IUpdateAddress} from '@/data/api/types/IAddress';
import {updateAddress} from '@/data/api/requests/address';

interface IEditAddressDialogProps {
  shippingAddress: IAddress;
  setShippingAddress: any;
  editAddressOpen: boolean;
  setEditAddressOpen: (editAddressOpen: boolean) => void;
}

function EditAddressDialog(props: IEditAddressDialogProps) {
  const {editAddressOpen, setEditAddressOpen} = props;
  const handleSelfEditAddressClose = () => setEditAddressOpen(false);

  const [saveAsDefault, setSaveAsDefault] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isAddressValid, setIsAddressValid] = useState(true);
  const [hasChanged, setHasChanged] = useState(false);
  const [updateShippingAddress, setUpdateShippingAddress] =
    useState<IUpdateAddress>();
  let toSaveShippingAddress: IUpdateAddress = {};

  const [shippingAddress, setShippingAddress] = useState<IAddress>();

  useEffect(() => {
    if (props.shippingAddress) setShippingAddress(props.shippingAddress);
  }, [props.shippingAddress]);

  const theme = useTheme();
  const {t} = useTranslation();

  const {mutate: mutateAddress} = useMutation(() =>
    updateAddress(props.shippingAddress.id, toSaveShippingAddress),
  );

  const validateShippingAddress = () => {
    if (!shippingAddress) {
      return false;
    }

    const requiredFields: (keyof IAddress)[] = [
      'streetNumber',
      'street',
      'city',
      'province',
      'country',
      'postalCode',
    ];

    return requiredFields.every((field) => Boolean(shippingAddress[field]));
  };

  const saveAddress = () => {
    setIsSaved(true);
    const isValid = validateShippingAddress();
    setIsAddressValid(isValid);
    if (isValid) {
      if (saveAsDefault) {
        if (updateShippingAddress)
          toSaveShippingAddress = updateShippingAddress;
        mutateAddress();
      }
      props.setShippingAddress(shippingAddress);
      setEditAddressOpen(false);
    }
  };

  const addressData = [
    {
      label: 'StreetNumber',
      name: 'streetNumber',
      defaultValue: props.shippingAddress?.streetNumber,
      optional: false,
      gridWidth: 3.3,
    },
    {
      label: 'Unit',
      name: 'apartment',
      defaultValue: props.shippingAddress?.apartment,
      optional: true,
      gridWidth: 3,
    },
    {
      label: 'Street',
      name: 'street',
      defaultValue: props.shippingAddress?.street,
      optional: false,
      gridWidth: 8,
    },
    {
      label: 'City',
      name: 'city',
      defaultValue: props.shippingAddress?.city,
      optional: false,
      gridWidth: 8,
    },
    {
      label: 'Province',
      name: 'province',
      defaultValue: props.shippingAddress?.province,
      optional: false,
      gridWidth: 8,
    },
    {
      label: 'Country',
      name: 'country',
      defaultValue: props.shippingAddress?.country,
      optional: false,
      gridWidth: 8,
    },
    {
      label: 'PostalCode',
      name: 'postalCode',
      defaultValue: props.shippingAddress?.postalCode,
      optional: false,
      gridWidth: 8,
    },
    {
      label: 'AdditionalInfo',
      name: 'additionalInfo',
      defaultValue: props.shippingAddress?.additionalInfo,
      optional: true,
      gridWidth: 8,
    },
  ];

  return (
    <Dialog
      data-testid="self-EditAddress-dialog"
      fullWidth
      open={editAddressOpen}
      onClose={handleSelfEditAddressClose}
      sx={{
        '& .MuiDialog-container': {
          '& .MuiPaper-root': {
            borderRadius: theme.borderRadius.medium,
            [theme.breakpoints.up('xs')]: {
              maxWidth: '50%',
            },
            [theme.breakpoints.down('sm')]: {
              maxWidth: '80%',
            },
          },
        },
      }}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle sx={{mt: 2, ml: 1}}>
        <Typography
          variant="h5"
          component="span"
          sx={{
            fontWeight: 600,
            ml: 1,
          }}
        >
          {t<string>('cart.ShippingAddress')}
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          marginLeft: theme.spacing(1),
          mt: 2,
        }}
      >
        <Grid
          container
          spacing={{
            sm: theme.spacing(0),
            md: theme.spacing(2),
          }}
          sx={{maxWidth: '100%', justifyContent: 'space-around'}}
        >
          {addressData.map((elem, index) => (
            <React.Fragment key={elem.label}>
              <Grid
                sx={{
                  display: 'flex',
                  justifyContent: 'left',
                  alignItems: 'center',
                  [theme.breakpoints.down('md')]: {
                    mt: 1,
                  },
                }}
                item
                xs={12}
                sm={elem.label === 'Unit' ? 0.5 : 3}
                ml={elem.label === 'Unit' ? 1 : 0}
              >
                <Box sx={{display: 'flex'}}>
                  <Typography
                    sx={{
                      fontSize: 15,
                      color: theme.interface.icon,
                    }}
                    variant="subtitle2"
                  >
                    {t<string>(`settings.${elem.label}`)}
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={elem.gridWidth}
                sx={{
                  [theme.breakpoints.down('md')]: {
                    mt: 1,
                  },
                }}
              >
                <TextField
                  data-testid={`${elem.name}Field`}
                  size="small"
                  sx={{
                    width: '100%',
                  }}
                  defaultValue={elem.defaultValue}
                  name={elem.name}
                  inputProps={{
                    'aria-label': elem.name,
                  }}
                  onChange={(event) => {
                    setHasChanged(true);
                    const {name, value} = event.target;
                    const newAddress = {
                      ...updateShippingAddress,
                      [name]: value,
                    };
                    setUpdateShippingAddress(newAddress);

                    if (shippingAddress) {
                      const newAddressShippingAddress = {
                        ...shippingAddress,
                        [name]: value,
                      };
                      setShippingAddress(newAddressShippingAddress);
                    }
                  }}
                  error={
                    isSaved &&
                    !elem.optional &&
                    shippingAddress &&
                    !shippingAddress[elem.name as keyof IAddress]
                  }
                />
              </Grid>
            </React.Fragment>
          ))}
          <Box
            sx={{
              display: isAddressValid ? 'none' : 'flex',
              justifyContent: 'center',
              mt: 3,
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                color: theme.palette.error.main,
              }}
            >
              Please fill out all required fields.
            </Typography>
          </Box>
        </Grid>
      </DialogContent>
      <Box sx={{ml: 5, mt: 1}}>
        <FormControlLabel
          control={
            <Checkbox
              data-testid="saveAsDefaultCheckbox"
              style={{
                transform: 'scale(0.8)',
              }}
              onChange={() => {
                setSaveAsDefault(!saveAsDefault);
              }}
            />
          }
          label={
            <Typography variant="body2" color="textSecondary">
              {t<string>('settings.SaveDefault')}
            </Typography>
          }
        />
      </Box>
      <DialogActions
        sx={{
          backgroundColor:
            theme.interface.type === 'light' ? '#f5f4f6' : '#a4a4a4',
          padding: theme.spacing(2),
          marginTop: theme.spacing(2),
        }}
      >
        <Box
          sx={{
            marginRight: theme.spacing(2),
          }}
        >
          <Button
            data-testid="saveButton"
            variant="contained"
            size="medium"
            disabled={!hasChanged}
            style={{textTransform: 'none'}}
            onClick={() => {
              saveAddress();
            }}
          >
            {t<string>('settings.Save')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default EditAddressDialog;
