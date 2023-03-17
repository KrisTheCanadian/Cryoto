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
  IconButton,
  ClickAwayListener,
} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {useEffect, useState} from 'react';
import {useQueryClient} from 'react-query';
import {walletBalanceQuery} from '@shared/components/SideBar/SideBar';
import {useMsal} from '@azure/msal-react';
import PhotoIcon from '@mui/icons-material/Photo';
import CloseIcon from '@mui/icons-material/Close';
import EmojiPicker, {Theme} from 'emoji-picker-react';
import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';

import {useMutationCreatePost} from './hooks/useMutationCreatePost';
import {ImageUploader} from './components';

import {searchUsers} from '@/data/api/requests/users';
import {INewPost, IUser} from '@/data/api/types';
import {PostType} from '@/data/api/enums';
import {IUserMinimal} from '@/data/api/types/IUser';

interface NewPostDialogProps {
  dialogOpen: boolean;
  setDialogOpen: (dialogOpen: boolean) => void;
  initialRecipients?: Recipient[];
  queryKey: [string];
}

interface Recipient {
  name: string;
  id: string;
}
interface FormValidation {
  recipients: boolean;
  companyValue: boolean;
}

const StyledTextAreaAutosize = styled(TextareaAutosize)(({theme}) => ({
  width: '100%',
  flex: 1,
  border: 'none',
  outline: 'none',
  fontFamily: 'inherit',
  resize: 'none',
  background: 'inherit',
  fontSize: theme.typography.subtitle2.fontSize,
  marginTop: theme.spacing(2),
  color: 'inherit',
}));

function NewPostDialog(props: NewPostDialogProps) {
  const {t} = useTranslation();
  const {accounts} = useMsal();
  const {dialogOpen, setDialogOpen, initialRecipients, queryKey} = props;
  const [formValidity, setFormValidity] = useState<FormValidation>({
    recipients: true,
    companyValue: true,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  // form values
  const [amount, setAmount] = useState<string>('');
  const [recipients, setRecipients] = useState<Recipient[]>(
    initialRecipients || [],
  );
  const [users, setusers] = useState<Recipient[]>([]);
  const [companyValue, setCompanyValue] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [imageUploaderOpen, setImageUploaderOpen] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const mutation = useMutationCreatePost(recipients, queryKey);

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
      imageUrl,
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
          .map((user: IUserMinimal) => {
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

  const handleEmojiButtonClick = () => {
    setEmojiPickerOpen(!emojiPickerOpen);
  };

  const handleEmojiSelect = (clickedEmoji: any) => {
    setMessage(message + clickedEmoji.emoji);
    setEmojiPickerOpen(false);
  };

  const emojiTheme = theme.palette.mode === 'dark' ? Theme.DARK : Theme.LIGHT;

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
          maxWidth: '500px',
          overflow: 'visible',
        },
      }}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title" sx={{p: 0}}>
        <Box
          sx={{
            display: 'flex',
            p: 3,
            pt: 2,
            pb: 1,
          }}
        >
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            {t('homePage.NewRecognition')}
          </Box>
          <Box sx={{flex: 1, textAlign: 'right'}}>
            <IconButton
              data-testid="close-button"
              aria-label="close"
              onClick={handleClose}
              sx={{color: theme.palette.grey[500]}}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent sx={{pb: '0px!important'}}>
        <Box sx={{display: 'flex', alignItems: 'baseline', pt: 1, pb: 1}}>
          <Autocomplete
            id="autocomplete"
            sx={{flex: 1}}
            isOptionEqualToValue={(option: Recipient, value: Recipient) =>
              option.id === value.id
            }
            multiple
            options={users}
            getOptionLabel={(user) => user.name}
            defaultValue={initialRecipients || []}
            onChange={handleRecipientsChange}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!formValidity.recipients}
                helperText={
                  !formValidity.recipients && t('homePage.MustSelectRecipient')
                }
                variant="standard"
                label={t('homePage.SendTo')}
                placeholder=""
                onKeyUp={handleSearch}
                id="new-post-dialog-recipients"
              />
            )}
          />
        </Box>
        <Box sx={{pt: 2}} />
        <FormControl sx={{width: '60%'}}>
          <TextField
            error={!formValidity.companyValue}
            select
            value={companyValue}
            label={t('homePage.SelectValue')}
            onChange={handleCompanyValueChange}
            sx={{width: '100%', mr: theme.spacing(1)}}
            id="new-post-dialog-company-value"
            helperText={
              !formValidity.companyValue && t('homePage.MustSelectValue')
            }
          >
            {companyValues.map((value) => (
              <MenuItem key={value} value={value}>
                {t(`values.${value}`)}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
        <TextField
          sx={{
            width: `calc(40% - ${theme.spacing(1)} )`,
            marginLeft: theme.spacing(1),
          }}
          type="number"
          InputProps={{
            inputProps: {min: 0},
          }}
          onChange={handleAmountChange}
          onKeyPress={handleAmountKeyPress}
          value={amount}
          placeholder={t('homePage.AddCoins')}
          id="new-post-dialog-amount"
        />

        <StyledTextAreaAutosize
          minRows={3}
          onChange={handleMessageChange}
          value={message}
          key="message-field"
          aria-label={t('homePage.WriteMessage')}
          placeholder={t('homePage.WriteMessage')}
          id="new-post-dialog-message"
        />
        <Collapse in={imageUploaderOpen} unmountOnExit>
          <Fade
            in={imageUploaderOpen}
            style={{transitionDelay: imageUploaderOpen ? '200ms' : '0ms'}}
          >
            <Box>
              <ImageUploader
                setFileUploadOpen={setImageUploaderOpen}
                setImageUrl={setImageUrl}
              />
            </Box>
          </Fade>
        </Collapse>
      </DialogContent>
      <DialogActions sx={{mt: 1, mb: 1, mr: 2, ml: 2, display: 'block'}}>
        <IconButton
          onClick={handleDropZoneClick}
          data-testid="remove-image-button"
          disabled={imageUploaderOpen}
        >
          <PhotoIcon />
        </IconButton>
        <ClickAwayListener onClickAway={() => setEmojiPickerOpen(false)}>
          <Box sx={{position: 'relative', display: 'inline-block'}}>
            <IconButton
              onClick={handleEmojiButtonClick}
              data-testid="add-emoji-button"
            >
              <AddReactionOutlinedIcon />
            </IconButton>

            <Box
              sx={{
                position: 'absolute',
                zIndex: 99999999999,
                top: -305,
                overflow: 'hidden',
                display: emojiPickerOpen ? 'block' : 'none',
              }}
            >
              <EmojiPicker
                searchDisabled
                width={300}
                theme={emojiTheme}
                height={300}
                previewConfig={{showPreview: false}}
                onEmojiClick={handleEmojiSelect}
              />
            </Box>
          </Box>
        </ClickAwayListener>

        <Box />

        <Button
          color="primary"
          variant="contained"
          onClick={handleSubmit}
          sx={{width: '100%', ml: '0!important', mt: 1}}
        >
          {t('homePage.Post')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default NewPostDialog;
