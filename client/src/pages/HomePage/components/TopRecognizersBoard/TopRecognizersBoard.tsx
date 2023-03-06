import {Box, Card, Divider, Typography} from '@mui/material';
import {t} from 'i18next';
import {useEffect, useState} from 'react';
import {useQuery} from 'react-query';

import {TopRecognizerItem} from './components';

import {ITopRecognizer} from '@/data/api/types/ITopRecognizer';
import {getTopRecognizers} from '@/data/api/requests/users';

export default function TopRecognizersBoard() {
  const [topRecognizers, setTopRecognizers] = useState<ITopRecognizer[]>([]);

  const {data: topRecognizersData, status: topRecognizersStatus} = useQuery<
    ITopRecognizer[]
  >('topRecognizers', getTopRecognizers);

  useEffect(() => {
    if (topRecognizersStatus === 'success') {
      if (topRecognizersData.length > 10) {
        setTopRecognizers(topRecognizersData.slice(0, 10));
      } else {
        setTopRecognizers(topRecognizersData);
      }
    }
  }, [topRecognizersData, topRecognizersStatus]);

  return (
    <Card
      sx={{
        mr: 4,
        maxWidth: 500,
        display: topRecognizers.length > 0 ? 'flex' : 'none',
        justifyContent: 'center',
        flexDirection: 'column',
        pb: 2,
      }}
    >
      <Box
        sx={{
          padding: 2,
          pb: 1,
        }}
      >
        <Typography variant="h6" sx={{fontSize: 16, fontWeight: 350}}>
          {t<string>('homePage.TopRecognizers')}
        </Typography>
      </Box>
      <Divider sx={{ml: 2, mr: 2}} />
      {topRecognizers.map((user: ITopRecognizer, index) => (
        <TopRecognizerItem
          key={user.userProfile.oId}
          oId={user.userProfile.oId}
          name={user.userProfile.name}
          businessTitle={user.userProfile?.businessTitle}
          count={user.count}
          position={index + 1}
        />
      ))}
    </Card>
  );
}
