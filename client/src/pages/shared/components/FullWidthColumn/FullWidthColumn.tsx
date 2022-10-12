import {Box} from '@mui/material';
import {ReactNode} from 'react';

interface FullWidthColumnProps {
  children: ReactNode | ReactNode[] | string;
}

function FullWidthColumn(props: FullWidthColumnProps) {
  const {children} = props;
  return (
    <Box flex={8} p={0} sx={{marginLeft: '0!important'}}>
      <Box p={2} display="flex" alignItems="center" flexDirection="column">
        {children}
      </Box>
    </Box>
  );
}
export default FullWidthColumn;
