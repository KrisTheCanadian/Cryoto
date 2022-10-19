import {FullWidthColumn} from '@shared/components/FullWidthColumn';
import PageFrame from '@shared/components/PageFrame';

function Orders() {
  const rightBarContent = 'Orders Route';
  return (
    <PageFrame>
      <FullWidthColumn>{rightBarContent}</FullWidthColumn>
    </PageFrame>
  );
}

export default Orders;
