import {FullWidthColumn} from '@shared/components/FullWidthColumn';
import PageFrame from '@shared/components/PageFrame';

function MarketPlace() {
  const rightBarContent = 'Marketplace Route';

  return (
    <PageFrame>
      <FullWidthColumn>{rightBarContent}</FullWidthColumn>
    </PageFrame>
  );
}

export default MarketPlace;
