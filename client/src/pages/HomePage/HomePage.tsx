import {MiddleColumn} from '@shared/components/MiddleColumn';
import PageFrame from '@shared/components/PageFrame';
import {RightBar} from '@shared/components/RightBar';
import {useEffect, useState} from 'react';
import {useMsal, AuthenticatedTemplate} from '@azure/msal-react';
import {useAlertContext} from '@shared/hooks/Alerts/AlertContext';
import {useLocation} from 'react-router-dom';
import {PostsFeed} from '@shared/components/PostsFeed';

import {getNextPage} from '../../data/api/requests/posts';

import {NewPost} from './components';

export const postsQuery = ['posts-query'];

function HomePage() {
  const {accounts} = useMsal();
  const dispatchAlert = useAlertContext();
  const location = useLocation();

  useEffect(() => {
    if (location.state !== null) {
      const err = location.state.error;
      dispatchAlert.error(err);
    }
  }, [dispatchAlert, location.state]);

  return (
    <>
      <AuthenticatedTemplate>
        <PageFrame>
          <MiddleColumn>
            {accounts && (
              <NewPost
                name={accounts[0].name}
                oId={accounts[0].idTokenClaims?.oid}
              />
            )}
            <PostsFeed
              queryKey={postsQuery}
              getNextPage={getNextPage}
              userId={accounts[0].idTokenClaims?.oid!}
            />
          </MiddleColumn>
          <RightBar>
            <></>
          </RightBar>
        </PageFrame>
      </AuthenticatedTemplate>
    </>
  );
}

export default HomePage;
