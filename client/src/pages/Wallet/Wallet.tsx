import {FullWidthColumn} from '@shared/components/FullWidthColumn';
import PageFrame from '@shared/components/PageFrame';
import {IconButton, Box, Typography} from '@mui/material';
import {Autorenew} from '@mui/icons-material';
import {useTheme} from '@mui/material/styles';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';

import {CreditCard, TransactionTable, SelfTransferDialog} from './components';

function Wallet() {
  const theme = useTheme();
  const {t} = useTranslation();

  const [selfTransferOpen, setSelfTransferOpen] = useState(false);
  const handleSelfTransferOpen = () => setSelfTransferOpen(true);

  return (
    <PageFrame>
      <FullWidthColumn>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
          }}
        >
          <CreditCard />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              marginLeft: theme.spacing(3),
              alignItems: 'center',
            }}
          >
            <IconButton
              onClick={handleSelfTransferOpen}
              data-testid="self-transfer-button"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.common.white,
                '&:hover': {backgroundColor: theme.palette.primary.light},
              }}
            >
              <Autorenew fontSize="large" />
            </IconButton>
            <Typography variant="body2" sx={{fontWeight: 'medium'}}>
              {t<string>('wallet.Transfer')}
            </Typography>
          </Box>
        </Box>
        <Box sx={{marginTop: theme.spacing(2)}}>
          <TransactionTable />
        </Box>

        <SelfTransferDialog
          selfTransferOpen={selfTransferOpen}
          setSelfTransferOpen={setSelfTransferOpen}
        />
      </FullWidthColumn>
    </PageFrame>
  );
}

export default Wallet;
