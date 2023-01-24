import {Box} from '@mui/material';
import {ReactNode} from 'react';

interface MiddleColumnProps {
  children: ReactNode | ReactNode[] | string;
}

function MiddleColumn(props: MiddleColumnProps) {
  const {children} = props;
  return (
    <Box flex={6} p={0} sx={{marginLeft: '0!important'}}>
      <Box
        id="Feed"
        p={2}
        display="flex"
        alignItems="center"
        flexDirection="column"
      >
        {children}
      </Box>
    </Box>
  );
}
export default MiddleColumn;
