import {Box, Card, Divider, Typography} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {t} from 'i18next';
import {useEffect, useState} from 'react';
import {useQuery} from 'react-query';

import {AnniversaryItem} from './components';

import {getUpcomingAnniversaries} from '@/data/api/requests/users';
import IUser, {IUserWithDate} from '@/data/api/types/IUser';

export default function AnniversaryBoard() {
  const [upcomingAnniversaries, setUpcomingAnniversaries] = useState<
    IUserWithDate[]
  >([]);

  const {data: upcomingAnniversariesData, status: upcomingAnniversariesStatus} =
    useQuery<IUserWithDate[]>(
      'upcomingAnniversaries',
      getUpcomingAnniversaries,
    );

  useEffect(() => {
    if (upcomingAnniversariesStatus === 'success') {
      setUpcomingAnniversaries(upcomingAnniversariesData);
    }
  }, [upcomingAnniversariesData, upcomingAnniversariesStatus]);

  return (
    <Card
      sx={{
        mr: 4,
        maxWidth: 500,
        display: upcomingAnniversaries.length > 0 ? 'flex' : 'none',
        justifyContent: 'center',
        flexDirection: 'column',
        pb: 2,
        mb: 2,
      }}
    >
      <Box
        sx={{
          padding: 2,
          pb: 1,
        }}
      >
        <Typography variant="h6" sx={{fontSize: 16, fontWeight: 350}}>
          {t<string>('homePage.Celebrations')}
        </Typography>
      </Box>
      <Divider sx={{ml: 2, mr: 2}} />
      {upcomingAnniversaries.map((user: IUserWithDate) => (
        <AnniversaryItem
          key={user.oId}
          oId={user.oId}
          name={user.name}
          startDate={user.startDate}
        />
      ))}
    </Card>
  );
}
