/* eslint-disable react-hooks/exhaustive-deps */
import {
  useTheme,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  Box,
  Collapse,
  Fade,
  FormControl,
  MenuItem,
  styled,
  TextareaAutosize,
  TextField,
} from '@mui/material';
import {t} from 'i18next';
import {useEffect, useState} from 'react';
import {useQueryClient} from 'react-query';
import {walletBalanceQuery} from '@shared/components/SideBar/components/MiniWallet/MiniWallet';
import {useMsal} from '@azure/msal-react';

import {useMutationCreatePost} from './hooks/useMutationCreatePost';
import {ImageUploader} from './components';

import {searchUsers} from '@/data/api/requests/users';
import {INewPost, IUser} from '@/data/api/types';
import {PostType} from '@/data/api/enums';

interface NewPostDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (dialogOpen: boolean) => void;
}

interface Recipient {
  name: string;
  id: string;
}
interface FormValidation {
  recipients: boolean;
  companyValue: boolean;
}

const StyledTextareaAutosize = styled(TextareaAutosize)(({theme}) => ({
  width: '100%',
  flex: 1,
  border: 'none',
  outline: 'none',
  fontFamily: 'inherit',
  background: 'inherit',
  fontSize: theme.typography.subtitle2.fontSize,
  marginTop: theme.spacing(2),
  color: 'inherit',
}));

function NewPostDialog(props: NewPostDialogProps) {
  const {accounts} = useMsal();
  const {dialogOpen, setDialogOpen} = props;
  const [formValidity, setFormValidity] = useState<FormValidation>({
    recipients: true,
    companyValue: true,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  // form values
  const [amount, setAmount] = useState<string>('');
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [users, setusers] = useState<Recipient[]>([]);
  const [companyValue, setCompanyValue] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [imageUploaderOpen, setImageUploaderOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const mutation = useMutationCreatePost(recipients);

  const validateForm = () => {
    setFormValidity({
      recipients: recipients.length > 0,
      companyValue: companyValue.length > 0,
    });

    return recipients.length > 0 && companyValue.length > 0;
  };
  const handleSubmit = () => {
    setFormSubmitted(true);
    if (!validateForm()) return;
    const coins = parseInt(amount, 10) ? parseInt(amount, 10) : 0;

    const postData = {
      // tempRecipients are added for preemptive rendering
      recipients: recipients.map((recipient) => recipient.id),
      tempRecipients: recipients.map((recipient) => {
        return {
          name: recipient.name,
          id: recipient.id,
        };
      }),
      tags: [companyValue],
      message,
      coins,
      isTransactable: true,
      postType: PostType.Kudos,
      createdDate: new Date(),
    } as INewPost;

    mutation.mutate(postData, {
      onSuccess: () => {
        queryClient.invalidateQueries(walletBalanceQuery);
      },
    });
    setDialogOpen(false);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleRecipientsChange = (event: any, value: Recipient[]) => {
    setRecipients(value);
  };
  const handleSearch = (event: any) => {
    if (event.target.value.length === 0) {
      setusers([]);
      return;
    }
    searchUsers(event.target.value)
      .then((res) => {
        const users = res
          .map((user: IUser) => {
            return {name: user.name, id: user.oId} as Recipient;
          })
          .filter((user) => {
            return user.name !== accounts[0].name;
          });
        setusers(users);
      })
      .catch((err) => {});
  };
  const handleAmountChange = (event: any) => {
    const inputAmount = event.target.value;
    if (inputAmount === '0') {
      setAmount('');
      return;
    }
    setAmount(event.target.value);
  };
  const handleAmountKeyPress = (event: any) => {
    if (event?.key === '-' || event?.key === '+' || event?.key === '.') {
      event.preventDefault();
    }
  };
  const handleCompanyValueChange = (event: any) => {
    setCompanyValue(event.target.value);
  };
  useEffect(() => {
    if (formSubmitted) {
      validateForm();
    }
  }, [recipients, companyValue]);

  const handleMessageChange = (event: any) => {
    const newValue = event.target.value;
    setMessage(newValue);
  };
  const handleDropZoneClick = () => {
    setImageUploaderOpen(true);
  };

  const companyValues = [
    'ClientsAndValues',
    'PeopleAndKnowledge',
    'PublicTrustAndQuality',
    'OperationalExcellence',
    'Integrity',
    'Excellence',
    'Courage',
    'Together',
    'ForBetter',
  ];

  return (
    <Dialog
      data-testid="new-post-dialog"
      fullScreen={fullScreen}
      maxWidth="sm"
      fullWidth
      open={dialogOpen}
      onClose={handleClose}
      PaperProps={{
        style: {
          borderRadius: theme.borderRadius.large,
        },
      }}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        <Box sx={{display: 'flex', alignItems: 'baseline'}}>
          <Autocomplete
            id="autocomplete"
            sx={{flex: 1, ml: theme.spacing(1)}}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            multiple
            options={users}
            getOptionLabel={(user) => user.name}
            defaultValue={[]}
            onChange={handleRecipientsChange}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!formValidity.recipients}
                helperText={
                  !formValidity.recipients &&
                  t<string>('homePage.MustSelectRecipient')
                }
                variant="standard"
                label={t<string>('homePage.SendTo')}
                placeholder=""
                onKeyUp={handleSearch}
                id="new-post-dialog-recipients"
              />
            )}
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{pt: theme.spacing(1)}} />
        <FormControl>
          <TextField
            error={!formValidity.companyValue}
            select
            value={companyValue}
            label={t<string>('homePage.SelectValue')}
            onChange={handleCompanyValueChange}
            sx={{width: 300, mr: theme.spacing(1)}}
            id="new-post-dialog-company-value"
            helperText={
              !formValidity.companyValue &&
              t<string>('homePage.MustSelectValue')
            }
          >
            {companyValues.map((value) => (
              <MenuItem key={value} value={value}>
                {t<string>(`values.${value}`)}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <TextField
          type="number"
          InputProps={{
            inputProps: {min: 0},
          }}
          onChange={handleAmountChange}
          onKeyPress={handleAmountKeyPress}
          value={amount}
          placeholder={t<string>('homePage.AddCoins')}
          id="new-post-dialog-amount"
        />

        <StyledTextareaAutosize
          onChange={handleMessageChange}
          key="message-field"
          aria-label={t<string>('homePage.WriteMessage')}
          placeholder={t<string>('homePage.WriteMessage')}
          id="new-post-dialog-message"
        />
        <Collapse in={imageUploaderOpen} unmountOnExit>
          <Fade
            in={imageUploaderOpen}
            style={{transitionDelay: imageUploaderOpen ? '200ms' : '0ms'}}
          >
            <Box>
              <ImageUploader setFileUploadOpen={setImageUploaderOpen} />
            </Box>
          </Fade>
        </Collapse>
      </DialogContent>
      <DialogActions
        sx={{mt: 1, mb: 1, mr: 2, ml: 2, justifyContent: 'space-between'}}
      >
        {/* <IconButton
          sx={{visibility: 'hidden'}}
          onClick={handleDropZoneClick}
          data-testid="remove-image-button"
          disabled={imageUploaderOpen}
        >
          <PhotoIcon />
        </IconButton> */}
        <Box />

        <Button color="primary" variant="contained" onClick={handleSubmit}>
          {t<string>('homePage.Post')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default NewPostDialog;
