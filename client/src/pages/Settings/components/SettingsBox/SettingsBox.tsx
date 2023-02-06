import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  MenuItem,
  Modal,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {useTheme} from '@mui/material/styles';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';

export const enum SettingsElementInputType {
  TextField,
  TextArea,
  AddressFields,
  LanguageSelect,
  SwitchButton,
}

const gridLeftColStyle = {
  display: 'flex',
  justifyContent: {xs: 'left', sm: 'left', md: 'right'},
  alignItems: 'center',
};

interface GenericSettingsElement {
  key?: string;
  value?: string[];
}

interface AddressSettingsElement {
  streetNumber?: string;
  street?: string;
  unit?: string;
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
  additionalInfo?: string;
  isDefualt?: boolean;
  value?: string[];
}

interface SwitchableSettingsElement {
  key?: string;
  value?: boolean[];
}

interface SettingsElement {
  name: string;
  data:
    | GenericSettingsElement
    | AddressSettingsElement
    | SwitchableSettingsElement;
  inputType: SettingsElementInputType;
  callback: any | undefined;
}

export interface SettingsBoxProps {
  title: string;
  elements: SettingsElement[];
}

interface TextFieldInputProps {
  title: string;
  value: string;
  updateCallback: any;
  multiline: boolean;
}

interface LanguageSelectProps {
  title: string;
  value: string;
  updateCallback: any;
}

interface AddressFieldsProps {
  title: string;
  value: string[];
  updateCallback: any;
}

function TextFieldInput(props: TextFieldInputProps) {
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const theme = useTheme();
  const {t} = useTranslation();

  interface ValidateResult {
    result: boolean;
    message: string;
  }

  const validateJobTitle = (newJobTitle: string): ValidateResult => {
    if (newJobTitle.length <= 0) {
      return {
        result: false,
        message: 'settings.ErrorEmptyJobTitle',
      };
    }
    return {
      result: true,
      message: '',
    };
  };

  const validate = (
    newValue: string,
    textFieldInputProps: TextFieldInputProps,
  ): string => {
    let validationResult: ValidateResult = {result: true, message: ''};
    switch (textFieldInputProps.title) {
      case t<string>('settings.JobTitle'):
        validationResult = validateJobTitle(newValue);
    }
    setError(!validationResult.result);
    setErrorMessage(t<string>(validationResult.message));
    return validationResult.result ? newValue : textFieldInputProps.value;
  };
  return (
    <Grid container spacing={theme.spacing(2)}>
      <Grid sx={gridLeftColStyle} item xs={12} sm={12} md={2}>
        <Typography sx={{textAlign: 'right'}} variant="subtitle2">
          {props.title}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={10}>
        <TextField
          sx={{width: '100%'}}
          error={error}
          helperText={errorMessage}
          multiline={props.multiline}
          defaultValue={props.value}
          onChange={(event) =>
            props.updateCallback([validate(event.target.value, props)])
          }
        />
      </Grid>
    </Grid>
  );
}

function LanguageSelect(props: LanguageSelectProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(props.value);
  const theme = useTheme();
  const {t} = useTranslation();
  return (
    <Grid container spacing={theme.spacing(2)}>
      <Grid sx={gridLeftColStyle} item xs={12} sm={12} md={2}>
        <Typography sx={{textAlign: 'right'}} variant="subtitle2">
          {props.title}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={10}>
        <Select
          sx={{width: '100%'}}
          value={selectedLanguage}
          onChange={(event) => {
            setSelectedLanguage(event.target.value);
            props.updateCallback(event.target.value);
          }}
        >
          <MenuItem value="en">{t<string>('layout.English')}</MenuItem>
          <MenuItem value="fr">{t<string>('layout.French')}</MenuItem>
        </Select>
      </Grid>
    </Grid>
  );
}

function AddressFields(props: AddressFieldsProps) {
  const [value, setValue] = useState<string[]>(props.value);
  const theme = useTheme();
  const {t} = useTranslation();

  const updateArray = (
    array: string[],
    index: number,
    newElementValue: string,
  ): string[] => {
    const newArray: string[] = [...array];
    newArray[index] = newElementValue;
    setValue(newArray);
    return newArray;
  };

  const addressData = [
    {
      label: 'StreetNumber',
      defaultValue: props.value[0],
      gridWidth: 4,
    },
    {
      label: 'Unit',
      defaultValue: props.value[1],
      gridWidth: 4,
    },
    {
      label: 'Street',
      defaultValue: props.value[2],
      gridWidth: 10,
    },
    {
      label: 'City',
      defaultValue: props.value[3],
      gridWidth: 10,
    },
    {
      label: 'Province',
      defaultValue: props.value[4],
      gridWidth: 10,
    },
    {
      label: 'Country',
      defaultValue: props.value[5],
      gridWidth: 10,
    },
    {
      label: 'PostalCode',
      defaultValue: props.value[6],
      gridWidth: 10,
    },
    {
      label: 'AdditionalInfo',
      defaultValue: props.value[7],
      gridWidth: 10,
    },
  ];
  return (
    <>
      <Typography sx={{mb: theme.spacing(3)}} variant="h5">
        {props.title}
      </Typography>
      <Grid container spacing={{sm: theme.spacing(0), md: theme.spacing(2)}}>
        {addressData.map((elem, index) => (
          <React.Fragment key={elem.label}>
            <Grid sx={gridLeftColStyle} item xs={12} sm={12} md={2}>
              <Typography sx={{textAlign: 'right'}} variant="subtitle2">
                {t<string>(`settings.${elem.label}`)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={elem.gridWidth}>
              <TextField
                sx={{width: '100%'}}
                defaultValue={elem.defaultValue}
                onChange={(event) =>
                  props.updateCallback(
                    updateArray(value, index, event.target.value),
                  )
                }
              />
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </>
  );
}

function SettingsBox(props: SettingsBoxProps) {
  const theme = useTheme();
  const {t} = useTranslation();
  const [open, setOpen] = useState(false);
  const emptySettingsElement: SettingsElement = {
    name: '',
    data: {},
    inputType: -1,
    callback: undefined,
  };
  const [modalSettingsElement, setModalSettingsElement] =
    useState<SettingsElement>(emptySettingsElement);
  const [modalNewValue, setModalNewValue] = useState<(string | boolean)[]>();
  const [modalSaveButtonDisabled, setModalSaveButtonDisabled] =
    useState<boolean>(false);

  const formatAddress = (data: AddressSettingsElement): string[] => {
    const l1 = `${data.unit && data.streetNumber ? `${data.unit}-` : ''}${
      data.streetNumber ? `${data.streetNumber} ` : ''
    }${data.street}`;
    const l2 = `${data.city ? `${data.city}` : ''}${
      data.city && (data.province || data.postalCode) ? ', ' : ''
    }${data.province ? `${data.province}` : ''}${
      data.province && data.postalCode ? ', ' : ''
    }${data.postalCode ? `${data.postalCode}` : ''}`;
    const l3 = data.country ? `${data.country}` : '';
    const l4 = data.additionalInfo ? `${data.additionalInfo}` : '';
    return [l1, l2, l3, l4];
  };

  const addressToArray = (data: AddressSettingsElement): string[] => {
    const address: string[] = [
      data.streetNumber ?? '',
      data.unit ?? '',
      data.street ?? '',
      data.city ?? '',
      data.province ?? '',
      data.country ?? '',
      data.postalCode ?? '',
      data.additionalInfo ?? '',
    ];
    return address;
  };

  const arrayToAddress = (addressArray: (string | undefined)[]) => {
    return {
      streetNumber: addressArray[0],
      apartment: addressArray[1],
      street: addressArray[2],
      city: addressArray[3],
      province: addressArray[4],
      country: addressArray[5],
      postalCode: addressArray[6],
      additionalInfo: addressArray[7],
    };
  };

  const keepChanged = (
    oldArray: string[],
    newArray: string[],
  ): (string | undefined)[] => {
    const result: (string | undefined)[] = [];
    if (newArray.length === oldArray.length) {
      for (let i = 0; i < newArray.length; i++) {
        if (newArray[i] === oldArray[i]) {
          result[i] = undefined;
        } else {
          result[i] = newArray[i];
        }
      }
    }
    return result;
  };

  const unifiedValue = (element: SettingsElement): (string | boolean)[] => {
    switch (element.inputType) {
      case SettingsElementInputType.TextField:
      case SettingsElementInputType.LanguageSelect:
      case SettingsElementInputType.TextArea:
        return element.data.value ? element.data.value : [''];
      case SettingsElementInputType.AddressFields:
        return addressToArray(element.data as AddressSettingsElement);
      case SettingsElementInputType.SwitchButton:
        return element.data.value ? element.data.value : [false];
      default:
        return [''];
    }
  };

  const displayValue = (element: SettingsElement): string[] => {
    const value = element.data.value ? element.data.value[0] : '';
    switch (element.inputType) {
      case SettingsElementInputType.TextField:
        return [value as string];
      case SettingsElementInputType.LanguageSelect:
        switch (value) {
          case 'en':
            return [t<string>('layout.English')];
          case 'fr':
            return [t<string>('layout.French')];
          default:
            return [''];
        }
      case SettingsElementInputType.AddressFields:
        return formatAddress(element.data as AddressSettingsElement);
      case SettingsElementInputType.TextArea:
        return element.data.value && element.data.value[0]
          ? element.data.value[0].toString().split('\n')
          : [''];
      default:
        return [''];
    }
  };

  const handleOpen = (element: SettingsElement) => {
    setModalSettingsElement(element);
    setModalSaveButtonDisabled(true);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const valueEquality = (
    newValueArray: (string | boolean)[],
    oldValueArray: (string | boolean)[],
  ) => {
    const lenNew = newValueArray.length;
    const lenOld = oldValueArray.length;
    if (lenNew !== lenOld) {
      return false;
    }
    for (let i = 0; i < lenNew; i++) {
      if (newValueArray[i] !== oldValueArray[i]) {
        return false;
      }
    }
    return true;
  };

  const handleUpdate = (newValue: (string | boolean)[]) => {
    setModalNewValue(newValue);
    setModalSaveButtonDisabled(
      valueEquality(newValue, unifiedValue(modalSettingsElement)),
    );
  };

  const handleSave = () => {
    if (modalNewValue) {
      switch (modalSettingsElement?.inputType) {
        case SettingsElementInputType.TextField:
        case SettingsElementInputType.TextArea:
        case SettingsElementInputType.LanguageSelect:
        case SettingsElementInputType.SwitchButton:
          modalSettingsElement?.callback(modalNewValue[0]);
          break;
        case SettingsElementInputType.AddressFields:
          modalSettingsElement.callback(
            arrayToAddress(
              keepChanged(
                unifiedValue(modalSettingsElement) as string[],
                modalNewValue as string[],
              ),
            ),
          );
          break;
      }
    }
    handleClose();
  };

  const handleChange = (newLanguage: string) => {
    handleUpdate([newLanguage]);
  };

  const handleSwitchChange = (newValue: boolean, element: SettingsElement) => {
    element?.callback(newValue);
  };

  const handleSwitchChecked = (element: SettingsElement) => {
    return element.data.value ? (element.data.value[0] as boolean) : false;
  };

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {lg: '60%', md: '75%', sm: '95%', xs: '95%'},
    boxShadow: 24,

    border: theme.border.default,
    backgroundColor: theme.interface.main,
    padding: theme.padding.default,
    borderRadius: theme.borderRadius.default,
  };
  return (
    <Card
      elevation={0}
      sx={{
        mb: theme.spacing(2),
        borderRadius: 2,
        backgroundColor: theme.interface.main,
        padding: theme.padding.default,
      }}
    >
      <CardContent>
        <Typography variant="h5">{props.title}</Typography>
        <TableContainer>
          <Table>
            <TableBody>
              {props.elements.map((element: SettingsElement) => (
                <TableRow
                  key={element.name}
                  sx={{
                    '&:last-child td, &:last-child th': {
                      border: 0,
                      paddingBottom: 0,
                    },
                  }}
                >
                  <TableCell sx={{width: '30%'}} component="th" scope="row">
                    <Typography
                      sx={{fontWeight: 'fontWeightMedium'}}
                      variant="subtitle1"
                    >
                      {element.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{width: '60%'}} align="left">
                    <>
                      {displayValue(element).map((line) => {
                        return (
                          <Typography key={line} variant="subtitle1">
                            {line}
                          </Typography>
                        );
                      })}
                    </>
                  </TableCell>
                  <TableCell sx={{width: '10%'}} align="right">
                    {[
                      SettingsElementInputType.AddressFields,
                      SettingsElementInputType.TextField,
                      SettingsElementInputType.TextArea,
                      SettingsElementInputType.LanguageSelect,
                    ].includes(element.inputType) &&
                      element.callback !== undefined && (
                        <IconButton
                          aria-label="edit"
                          data-testid="editPencil"
                          color="primary"
                          onClick={() => handleOpen(element)}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    {SettingsElementInputType.SwitchButton ===
                      element.inputType &&
                      element.callback !== undefined && (
                        <Switch
                          checked={handleSwitchChecked(element)}
                          onChange={(event) => {
                            handleSwitchChange(event.target.checked, element);
                          }}
                          inputProps={{'aria-label': 'controlled'}}
                        />
                      )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {[
            SettingsElementInputType.TextField,
            SettingsElementInputType.TextArea,
          ].includes(modalSettingsElement.inputType) && (
            <TextFieldInput
              title={modalSettingsElement.name}
              value={unifiedValue(modalSettingsElement)[0] as string}
              updateCallback={handleUpdate}
              multiline={
                modalSettingsElement.inputType ===
                SettingsElementInputType.TextArea
              }
            />
          )}
          {modalSettingsElement.inputType ===
            SettingsElementInputType.LanguageSelect && (
            <LanguageSelect
              title={modalSettingsElement.name}
              value={unifiedValue(modalSettingsElement)[0] as string}
              updateCallback={(newLanguage: string) => {
                handleChange(newLanguage);
              }}
            />
          )}
          {modalSettingsElement.inputType ===
            SettingsElementInputType.AddressFields && (
            <AddressFields
              title={modalSettingsElement.name}
              value={unifiedValue(modalSettingsElement) as string[]}
              updateCallback={(newValues: string[]) => {
                handleUpdate(newValues);
              }}
            />
          )}
          {modalSettingsElement.inputType > -1 && (
            <Button
              sx={{float: 'right', mt: theme.margin.default}}
              variant="contained"
              color="primary"
              disabled={modalSaveButtonDisabled}
              onClick={handleSave}
            >
              {t<string>('settings.Save')}
            </Button>
          )}
        </Box>
      </Modal>
    </Card>
  );
}

export default SettingsBox;
