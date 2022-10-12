/* eslint-disable @typescript-eslint/naming-convention */

import {useTheme} from '@mui/material/styles';
import {Box} from '@mui/material';
import {ReactNode} from 'react';

interface Props {
  children: ReactNode[] | ReactNode | string;
}
function RightBar(props: Props) {
  const {children} = props;
  const theme = useTheme();
  const rightBarStyle = {
    // to adjust to the navbar height
    top: 56,
    maxHeight: 0,
    position: 'sticky',
    minHeight: 'calc(100vh - 56px)',
    flex: 2,
    marginLeft: '0!important',

    [theme.breakpoints.up('xs')]: {
      '@media (orientation: landscape)': {
        top: 48,
        minHeight: 'calc(100vh - 48px)',
      },
    },
    [theme.breakpoints.up('sm')]: {
      top: 64,
      minHeight: 'calc(100vh - 64px)',
    },
    display: {xs: 'none', sm: 'none', md: 'block'},
    overflowY: 'hidden',
    overFlowAnchor: 'none',
  };
  return (
    <Box p={2} sx={rightBarStyle}>
      {children}
    </Box>
  );
}
export default RightBar;
