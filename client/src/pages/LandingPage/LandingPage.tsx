/* eslint-disable promise/catch-or-return */
/* eslint-disable @shopify/strict-component-boundaries */
/* eslint-disable no-negated-condition */
/* eslint-disable @shopify/jsx-no-complex-expressions */
import {useMsal} from '@azure/msal-react';
import {
  Typography,
  Button,
  Stack,
  Grid,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {getUserProfile} from '@shared/hooks/getUserProfile';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';

import {SignInButton} from '../Authentication/components/SignInButton';
import {routeHome} from '../routes';

interface InfographicProps {
  image: string;
  imgAlt: string;
  text: string;
}

function Infographic({image, imgAlt, text}: InfographicProps) {
  return (
    <Stack direction="column" alignItems="center">
      <img src={image} alt={imgAlt} width="250px" />
      <Typography width="75%" variant="subtitle1" textAlign="center">
        {text}
      </Typography>
    </Stack>
  );
}

function LandingPage({isRedirecting}: {isRedirecting: boolean}) {
  const {accounts} = useMsal();
  const companyName = 'Cryoto';
  const theme = useTheme();
  const {t} = useTranslation();

  // if user is already logged in, redirect to home page
  useEffect(() => {
    if (accounts[0]) {
      // creates the user in the database if it doesn't exist
      getUserProfile().then(() => {
        window.location.href = routeHome;
      });
    }
  }, [accounts]);

  const headerStyle = {
    color: 'text.primary',
    position: 'sticky',
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(3),
    paddingRight: theme.spacing(6),
    paddingLeft: theme.spacing(6),
    direction: 'row',
    [theme.breakpoints.up('xs')]: {
      padding: theme.spacing(2),
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(3),
      paddingRight: theme.spacing(6),
      paddingLeft: theme.spacing(6),
    },
  };

  const mainTextGroupStyle = {
    display: 'flex',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    [theme.breakpoints.up('xs')]: {
      marginTop: '50px',
      marginBottom: '100px',
      width: '90%',
    },
    [theme.breakpoints.up('md')]: {
      marginTop: '50px',
      marginBottom: '100px',
      width: '50%',
    },
  };

  const mainTextIndividualStyle = {
    [theme.breakpoints.down('md')]: {
      fontSize: '2.75rem!important',
    },
  };

  const infographicGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.up('xs')]: {
      flexDirection: 'column',
      paddingBottom: '50px',
    },
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingBottom: '50px',
    },
  };

  return (
    <Stack height="100%">
      {isRedirecting ? (
        <Backdrop
          data-testid="Backdrop"
          sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}
          open
        >
          <CircularProgress data-testid="CircularProgress" size="10rem" />
        </Backdrop>
      ) : null}
      <Stack sx={headerStyle} direction="row" position="sticky">
        <Typography variant="h4" sx={{color: theme.palette.text.primary}}>
          {companyName}
        </Typography>
        {!isRedirecting ? (
          <Stack direction="row" spacing={2}>
            <SignInButton />
            <Button variant="contained">
              {t('landingPage.ActivateButton')}
            </Button>
          </Stack>
        ) : null}
      </Stack>
      <Stack sx={mainTextGroupStyle}>
        <Typography
          id="landingPageWelcome"
          variant="h2"
          sx={mainTextIndividualStyle}
        >
          {t('landingPage.LandingPage1')}
        </Typography>
        <Typography
          variant="h2"
          sx={mainTextIndividualStyle}
          color={theme.palette.primary.main}
        >
          {t('landingPage.LandingPage2')}
        </Typography>
        <Typography variant="h5" marginTop="25px">
          {t('landingPage.LandingPageSubText')}
        </Typography>
      </Stack>
      <Grid sx={infographicGroupStyle}>
        <Infographic
          image="/images/1.svg"
          imgAlt={t('landingPage.RecognizeAlt')}
          text={t('landingPage.FeatureDescription')}
        />
        <Infographic
          image="/images/2.svg"
          imgAlt={t('landingPage.CelebrateAlt')}
          text={t('landingPage.FeatureDescription')}
        />
        <Infographic
          image="/images/3.svg"
          imgAlt={t('landingPage.RewardsAlt')}
          text={t('landingPage.FeatureDescription')}
        />
      </Grid>
    </Stack>
  );
}

export default LandingPage;
