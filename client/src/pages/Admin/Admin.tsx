import {Typography} from '@mui/material';
import {FullWidthColumn} from '@shared/components/FullWidthColumn';
import PageFrame from '@shared/components/PageFrame';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@mui/material/styles';

import AdminUsersTable from './components/AdminUsersTable';

function Admin() {
  const {t} = useTranslation();
  const theme = useTheme();

  return (
    <PageFrame>
      <FullWidthColumn>
        <Typography
          variant="h4"
          sx={{mb: theme.spacing(2), fontWeight: 200, fontSize: 32}}
        >
          {t<string>('adminDashboard.pageTitle')}
        </Typography>
        <AdminUsersTable />
      </FullWidthColumn>
    </PageFrame>
  );
}

export default Admin;
