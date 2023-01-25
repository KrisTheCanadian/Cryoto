import {ReactNode} from 'react';
import {SideBar} from '@shared/components/SideBar';
import {Stack, Box} from '@mui/material';

interface PageFrameProps {
  children: ReactNode | string | ReactNode[];
}
function PageFrame(props: PageFrameProps) {
  const {children} = props;
  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={2}
        position="relative"
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
