import {ReactNode} from 'react';
import {SideBar} from '@shared/components/SideBar';
import {Stack, Box, useTheme} from '@mui/material';

interface PageFrameProps {
  children: ReactNode | string | ReactNode[];
}

function PageFrame(props: PageFrameProps) {
  const theme = useTheme();

  const {children} = props;
  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={2}
        position="relative"
        sx={{
          [theme.breakpoints.down(1000)]: {
            justifyContent: 'center',
          },
        }}
      >
        <Box sx={{display: {xs: 'none', md: 'flex'}, flex: 'auto'}}>
          <SideBar />
        </Box>
        {children}
      </Stack>
    </>
  );
}

export default PageFrame;
