import {FullWidthColumn} from '@shared/components/FullWidthColumn';
import PageFrame from '@shared/components/PageFrame';

function Wallet() {
  const rightBarContent = 'Wallet Route';
  return (
    <PageFrame>
      <FullWidthColumn>{rightBarContent}</FullWidthColumn>
    </PageFrame>
  );
}

export default Wallet;
