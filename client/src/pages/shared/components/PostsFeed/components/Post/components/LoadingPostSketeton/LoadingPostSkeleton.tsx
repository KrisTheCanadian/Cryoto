import {Box, Card, CardContent, CardHeader, Skeleton} from '@mui/material';
import {useTheme} from '@mui/material/styles';

function LoadingPostSkeleton() {
  const theme = useTheme();

  return (
    <Box sx={{width: '100%', display: 'flex', justifyContent: 'center'}}>
      <Card sx={{maxWidth: 600, mb: 2, flex: 1}}>
        <CardHeader
          avatar={
            <Skeleton
              animation="wave"
              variant="circular"
              width={40}
              height={40}
            />
          }
          title={
            <Skeleton
              animation="wave"
              height={10}
              width="80%"
              style={{marginBottom: 6}}
            />
          }
          subheader={<Skeleton animation="wave" height={10} width="40%" />}
        />

        <Skeleton sx={{height: 190}} animation="wave" variant="rectangular" />

        <CardContent>
          <>
            {' '}
            <Skeleton animation="wave" height={10} style={{marginBottom: 6}} />
            <Skeleton animation="wave" height={10} width="80%" />
          </>
        </CardContent>
        <Box />
      </Card>
    </Box>
  );
}

export default LoadingPostSkeleton;
