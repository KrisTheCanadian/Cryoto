import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';
import {
  Autocomplete,
  Box,
  FormControl,
  MenuItem,
  styled,
  TextareaAutosize,
  TextField,
} from '@mui/material';
import {t} from 'i18next';
import {useState} from 'react';
import {NewPostType} from 'data/api/types/NewPost';
import {useMsal} from '@azure/msal-react';
import IPost from 'data/api/types/IPost';
import IUser from 'data/api/types/IUser';

import {searchUsers} from '../../../../../../data/api/requests/users';
import {createPost} from '../../../../../../data/api/requests/posts';

interface NewPostDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (dialogOpen: boolean) => void;
  addPost: (post: IPost) => void;
}

interface Recipient {
  name: string;
  id: string;
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
  const {dialogOpen, setDialogOpen, addPost} = props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  // form values
  const [amount, setAmount] = useState<string>('');
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [users, setusers] = useState<Recipient[]>([]);
  const [companyValue, setCompanyValue] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const {instance, accounts} = useMsal();
  const handleSubmit = () => {
    const coins = parseInt(amount, 10) ? parseInt(amount, 10) : 0;

    const postData = {
      recipients: recipients.map((recipient) => recipient.id),
      tags: [companyValue],
      message,
      coins,
      isTransactable: true,
      postType: 'Kudos',
      createdDate: new Date(),
    } as NewPostType;
    createPost(postData, instance, accounts)
      .then((res) => {
        addPost(res);
      })
      .catch((err) => {});
    setDialogOpen(false);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleRecipientsChange = (event: any, value: Recipient[]) => {
    setRecipients(value);
  };
  const handleSearch = (event: any) => {
    searchUsers(event.target.value, accounts, instance)
      .then((res) => {
        const users = res.map((user: IUser) => {
          return {name: user.name, id: user.oId} as Recipient;
        });
        setusers(users);
      })
      .catch((err) => {
        console.log(err);
      });
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
  const handleMessageChange = (event: any) => {
    const newValue = event.target.value;
    setMessage(newValue);
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
                variant="standard"
                label={t<string>('homePage.SendTo')}
                placeholder=""
                onKeyUp={handleSearch}
              />
            )}
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{pt: theme.spacing(1)}} />
        <FormControl>
          <TextField
            select
            value={companyValue}
            label={t<string>('homePage.SelectValue')}
            onChange={handleCompanyValueChange}
            sx={{width: 300, mr: theme.spacing(1)}}
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
        />

        <StyledTextareaAutosize
          onChange={handleMessageChange}
          key="message-field"
          aria-label={t<string>('homePage.WriteMessage')}
          placeholder={t<string>('homePage.WriteMessage')}
        />
      </DialogContent>
      <DialogActions sx={{mt: 1, mb: 1, mr: 2, ml: 2}}>
        <Button color="primary" variant="contained" onClick={handleSubmit}>
          {t<string>('homePage.Post')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default NewPostDialog;
