import {FullWidthColumn} from '@shared/components/FullWidthColumn';
import PageFrame from '@shared/components/PageFrame';

function Profile() {
  const rightBarContent = 'Profile Route';
  return (
    <PageFrame>
      <FullWidthColumn>{rightBarContent}</FullWidthColumn>
    </PageFrame>
  );
}

export default Profile;
