import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  useMediaQuery,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {useTheme} from '@mui/material/styles';
import {useState} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {useMutation, useQueryClient} from 'react-query';
import {useAlertContext} from '@shared/hooks/Alerts';

import {selfTransferTokens} from '@/data/api/requests/wallet';

interface ISelfTransferDialogProps {
  selfTransferOpen: boolean;
  setSelfTransferOpen: (selfTransferOpen: boolean) => void;
}

function SelfTransferDialog(props: ISelfTransferDialogProps) {
  const dispatchAlert = useAlertContext();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState<string>('');
  const [formValidity, setFormValidity] = useState(true);

  const {selfTransferOpen, setSelfTransferOpen} = props;
  const handleSelfTransferClose = () => setSelfTransferOpen(false);

  const theme = useTheme();
  const {t} = useTranslation();

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

  const {mutate} = useMutation((amount: number) => selfTransferTokens(amount), {
    onSuccess: () => {
      dispatchAlert.success('Tokens transferred successfully');
    },
    onError: () => {
      dispatchAlert.error('Error transferring tokens');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['walletsBalance']);
    },
  });

  const handleTransfer = () => {
    // eslint-disable-next-line no-negated-condition
    if (amount !== '') {
      mutate(parseFloat(amount));
      handleSelfTransferClose();
      setAmount('');
    } else {
      setFormValidity(false);
    }
  };

  return (
    <Dialog
      data-testid="self-transfer-dialog"
      maxWidth="sm"
      fullWidth
      open={selfTransferOpen}
      onClose={handleSelfTransferClose}
      PaperProps={{
        style: {
          borderRadius: theme.borderRadius.large,
        },
      }}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle>
        <Typography
          variant="h6"
          component="span"
          sx={{marginTop: theme.spacing(2), marginLeft: theme.spacing(1)}}
        >
          {t<string>('wallet.selfTransferDialog.TransferCoins')}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{marginLeft: theme.spacing(1)}}>
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            <TextField
              type="Account"
              InputProps={{
                readOnly: true,
              }}
              value={t<string>('wallet.toSpend')}
              label={t<string>('wallet.selfTransferDialog.From')}
              variant="standard"
              sx={{marginBottom: theme.spacing(2)}}
            />

            <IconButton
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.interface.main,
                '&:hover': {color: theme.palette.primary.main},
                margin: 1,
              }}
            >
              <ArrowForwardIcon sx={{width: '90%'}} />
            </IconButton>

            <TextField
              type="Account"
              InputProps={{
                readOnly: true,
              }}
              value={t<string>('wallet.toAward')}
              label={t<string>('wallet.selfTransferDialog.To')}
              variant="standard"
              sx={{marginBottom: theme.spacing(1)}}
            />
          </Box>
        </Box>
      </DialogContent>
      <Box sx={{display: 'flex', justifyContent: 'center'}}>
        <TextField
          type="number"
          InputProps={{
            inputProps: {min: 0},
          }}
          error={!formValidity}
          onChange={handleAmountChange}
          onKeyPress={handleAmountKeyPress}
          value={amount}
          placeholder={t<string>('wallet.selfTransferDialog.CoinAmount')}
          id="self-transfer-dialog-amount"
          sx={{marginBottom: theme.spacing(1)}}
          helperText={
            !formValidity &&
            t<string>('wallet.selfTransferDialog.TransferErrorMessage')
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
            display: 'flex',
            alignItems: 'center',
            marginRight: theme.spacing(2),
          }}
        >
          <Typography
            variant="caption"
            sx={{marginRight: theme.spacing(3), marginLeft: theme.spacing(2)}}
          >
            <Trans
              i18nKey="wallet.selfTransferDialog.TransferMessage"
              values={{
                coins: amount === '' ? 0 : amount,
              }}
              components={{italic: <i />}}
            />
          </Typography>
          <Button
            onClick={handleTransfer}
            variant="contained"
            size="medium"
            style={{textTransform: 'none'}}
          >
            {t<string>('wallet.Transfer')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default SelfTransferDialog;
