/* eslint-disable @typescript-eslint/naming-convention */
import {Box, SxProps} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {ReactNode} from 'react';

/*
Usage:
<RoundedInput>
  <InputBase
    placeholder={t('layout.Search')}
    sx={{width: '100%', ml: theme.spacing(0.5)}}
  />  
</RoundedInput>
*/
interface RoundedInputProps {
  children: ReactNode;
}

function RoundedInput(props: RoundedInputProps) {
  const children = props.children;
  const theme = useTheme();
  const searchInputStyle = {
    padding: theme.spacing(0.5),
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.interface.contrastMain,
    '&:hover': {
      backgroundColor: theme.interface.contrastMain,
    },
    borderRadius: theme.shape.borderRadius,
    width: '100%',
  };
  return <Box sx={searchInputStyle}>{children}</Box>;
}

export default RoundedInput;
