/* eslint-disable promise/catch-or-return */
/* eslint-disable @shopify/strict-component-boundaries */

import {useMsal} from '@azure/msal-react';
import {Typography, Stack, Grid, Box} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';

import {SignInButton} from '../Authentication/components/SignInButton';
import {routeHome} from '../routes';

import {getUserProfile} from '@/data/api/requests/users';

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

function LandingPage() {
  const navigate = useNavigate();
  const {accounts} = useMsal();
  const companyName = 'Cryoto';
  const theme = useTheme();
  const {t} = useTranslation();

  // if user is already logged in, redirect to home page
  useEffect(() => {
    if (accounts[0]) {
      // creates the user in the database if it doesn't exist
      getUserProfile().then(() => {
        navigate(routeHome);
      });
    }
  }, [accounts, navigate]);

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
      <Stack sx={headerStyle} direction="row" position="sticky">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <img
            src="images/svgIcons/CryotoIconLight.svg"
            alt={companyName}
            style={{
              height: theme.typography.h4.fontSize,
              verticalAlign: 'text-middle',
              marginRight: theme.spacing(1),
            }}
          />
          <Typography
            id="companyName"
            variant="h5"
            sx={{
              color: theme.palette.text.primary,
              lineHeight: 0,
            }}
          >
            {companyName}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <SignInButton />
        </Stack>
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
          image="/images/svgIcons/1.svg"
          imgAlt={t('landingPage.RecognizeAlt')}
          text={t('landingPage.RecognitionFeatureDescription')}
        />
        <Infographic
          image="/images/svgIcons/2.svg"
          imgAlt={t('landingPage.CelebrateAlt')}
          text={t('landingPage.CelebrationFeatureDescription')}
        />
        <Infographic
          image="/images/svgIcons/3.svg"
          imgAlt={t('landingPage.RewardsAlt')}
          text={t('landingPage.RewardsFeatureDescription')}
        />
      </Grid>
    </Stack>
  );
}

export default LandingPage;
