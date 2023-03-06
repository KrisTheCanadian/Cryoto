import {MiddleColumn} from '@shared/components/MiddleColumn';
import {useTheme} from '@mui/material/styles';
import PageFrame from '@shared/components/PageFrame';
import {RightBar} from '@shared/components/RightBar';
import {useEffect} from 'react';
import {useMsal, AuthenticatedTemplate} from '@azure/msal-react';
import {useAlertContext} from '@shared/hooks/Alerts/AlertContext';
import {useLocation} from 'react-router-dom';
import {PostsFeed} from '@shared/components/PostsFeed';
import {Box} from '@mui/material';

import {getNextPage} from '../../data/api/requests/posts';

import {NewPost, TopRecognizersBoard, AnniversaryBoard} from './components';

export const postsQuery = ['posts-query'];

function HomePage() {
  const theme = useTheme();
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
          <Box
            p={0}
            sx={{marginRight: '0!important', flex: 6, maxWidth: '600px'}}
          >
            <Box
              id="Feed"
              p={2}
              display="flex"
              alignItems="center"
              flexDirection="column"
            >
              {accounts && (
                <NewPost
                  name={accounts[0].name}
                  oId={accounts[0].idTokenClaims?.oid}
                />
              )}
              <PostsFeed
                name={accounts[0].name}
                oId={accounts[0].idTokenClaims?.oid}
                queryKey={postsQuery}
                getNextPage={getNextPage}
                userId={accounts[0].idTokenClaims?.oid!}
              />
            </Box>
          </Box>
          <RightBar>
            <Box
              sx={{
                display: 'flex',
                [theme.breakpoints.down(1000)]: {
                  display: 'none',
                },
                flexDirection: 'column',
              }}
            >
              <AnniversaryBoard />
              <TopRecognizersBoard />
            </Box>
          </RightBar>
        </PageFrame>
      </AuthenticatedTemplate>
    </>
  );
}

export default HomePage;
