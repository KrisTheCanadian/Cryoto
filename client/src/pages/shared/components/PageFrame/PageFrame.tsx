import {ReactNode} from 'react';
import {NavBar} from '@shared/components/NavBar';
import {SideBar} from '@shared/components/SideBar';
import {Stack} from '@mui/material';

interface PageFrameProps {
  children: ReactNode | string | ReactNode[];
}
function PageFrame(props: PageFrameProps) {
  const {children} = props;
  return (
    <>
      <NavBar />
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={2}
        position="relative"
      >
        <SideBar />
        {children}
      </Stack>
    </>
  );
}

export default PageFrame;
