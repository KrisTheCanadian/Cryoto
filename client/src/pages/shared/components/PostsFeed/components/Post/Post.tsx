/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-negated-condition */
/* eslint-disable @shopify/jsx-no-hardcoded-content */
/* eslint-disable @shopify/jsx-no-complex-expressions */
/* eslint-disable react-hooks/rules-of-hooks */
import {Avatar, Box, Chip, Stack, Typography} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import moment from 'moment';
import {useTranslation} from 'react-i18next';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {stringAvatar} from '@shared/utils/colorUtils';
import Divider from '@mui/material/Divider';
import {useMsal} from '@azure/msal-react';

import {LikeButtons} from '../../../../../HomePage/components/LikeButtons';

import {LoadingPostSkeleton} from './components';

import {getUserProfilePhoto} from '@/data/api/requests/users';
import NewComment from '@/pages/HomePage/components/Comments/Components/NewComment';
import IComment from '@/data/api/types/IComment';
import PreviewCommentSection from '@/pages/HomePage/components/Comments/Components/PreviewCommentSection';
import {IUser} from '@/data/api/types';
import {getUserById} from '@/data/api/requests/admin';
import {BoostButton} from '@/pages/HomePage/components/BoostButton';
import {IUserMinimal} from '@/data/api/types/IUser';

interface PostProps {
  name: string | undefined;
  oId: string | undefined;
  id: string;
  firstName: string;
  date: string;
  imageUrl?: string;
  recipients: string[];
  recipientProfiles: IUserMinimal[];
  message: string;
  coinsGiven: number;
  tags?: string[];
  loading: boolean;
  authorId: string;
  hearts: string[];
  claps: string[];
  celebrations: string[];
  comments: IComment[];
  boosts: string[];
}

function Post(props: PostProps) {
  const theme = useTheme();
  const {t, i18n} = useTranslation();
  const navigate = useNavigate();
  const {accounts} = useMsal();

  const {
    id,
    firstName,
    recipients,
    recipientProfiles,
    message,
    imageUrl,
    tags,
    date,
    coinsGiven,
    loading,
    authorId,
    hearts,
    claps,
    celebrations,
    boosts,
  } = props;
  if (loading) {
    return <LoadingPostSkeleton />;
  }

  const ChipStyles = {
    backgroundColor: theme.interface.contrastMain,
    border: theme.border.default,
    fontSize: '1rem',
    fontWeight: theme.typography.fontWeightMedium,
    marginRight: theme.spacing(1),
  };

  const timeAgo = moment.utc(date).local().startOf('seconds').fromNow();

  const [userProfilePhoto, setUserProfilePhoto] = useState<string | null>(null);

  const [showAllComments, setShowAllComments] = useState(false);

  useEffect(() => {
    getUserProfilePhoto(authorId)
      .then((response) => {
        setUserProfilePhoto(response);
      })
      .catch((err) => {});
  }, [authorId]);

  const handleAvatarClickAuthor = () => {
    navigate(`/profile/${authorId}`);
  };

  const handleAvatarClickRecipient = (recipientId: string) => {
    navigate(`/profile/${recipientId}`);
  };

  const getYearWithSuffix = (date: string | undefined, language: string) => {
    if (!date) return '';
    const year = moment().diff(moment(date), 'years');
    let suffix = '';

    if (language === 'en') {
      const lastDigit = year % 10;
      const lastTwoDigits = year % 100;

      if (lastDigit === 1 && lastTwoDigits !== 11) {
        suffix = 'st';
      } else if (lastDigit === 2 && lastTwoDigits !== 12) {
        suffix = 'nd';
      } else if (lastDigit === 3 && lastTwoDigits !== 13) {
        suffix = 'rd';
      } else {
        suffix = 'th';
      }
    } else if (language === 'fr') {
      if (year === 1) {
        suffix = 'er';
      } else {
        suffix = 'ième';
      }
    }

    const anniversaryYear = year + suffix;
    const [firstWord, ...remainingWords] = t('homePage.AniversaryPost').split(
      ' ',
    );
    const newTranslation = `${firstWord} ${anniversaryYear} ${remainingWords.join(
      ' ',
    )}`;

    return newTranslation;
  };

  const allowedToBoost = () => {
    const userRoles = accounts[0].idTokenClaims?.roles;
    if (userRoles === undefined || userRoles.length === 0) {
      return false;
    }
    const acceptedRoles = ['Partner', 'SeniorPartner'];
    return acceptedRoles.some((role) => userRoles.includes(role));
  };

  // fetch anniversary user profile for years worked
  const [anniversaryUserProfile, setAnniversaryUserProfile] = useState<IUser>();
  useEffect(() => {
    getUserById(recipientProfiles[0].oId)
      .then((response) => {
        setAnniversaryUserProfile(response);
      })
      .catch((err) => {});
  }, [recipientProfiles]);

  if (tags?.includes('Anniversary')) {
    return (
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            maxWidth: 600,
            mb: theme.margin.default,
            flex: 1,
            backgroundColor: theme.interface.main,
            padding: theme.padding.default,
            borderRadius: theme.borderRadius.default,
            boxShadow: 1,
          }}
        >
          <Stack direction="row">
            <Stack>
              <Box position="relative" textAlign="center">
                <img
                  src="images/jpgImages/celebration.png"
                  alt="companyName"
                  style={{width: '100%', display: 'block'}}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '100%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1,
                  }}
                >
                  <Typography variant="h4" sx={{mb: 2}}>
                    <span
                      style={{
                        background: theme.interface.offBackground,
                        lineHeight: '1.1',
                        display: 'inline',
                      }}
                    >
                      {getYearWithSuffix(
                        anniversaryUserProfile?.startDate,
                        i18n.language,
                      )}
                    </span>
                  </Typography>
                  <Typography variant="h3">
                    <span
                      style={{
                        background: theme.interface.offBackground,
                        lineHeight: '1.1',
                        display: 'inline',
                      }}
                    >
                      <b
                        style={{cursor: 'pointer'}}
                        onClick={() =>
                          handleAvatarClickRecipient(recipientProfiles[0]?.oId)
                        }
                      >
                        {` ${recipientProfiles[0]?.name}!`}
                      </b>
                    </span>
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{display: 'flex', alignItems: 'center', mt: 2, mb: 0.25}}
              >
                <Chip
                  sx={{
                    backgroundColor: theme.interface.contrastMain,
                    border: '3px solid',
                    borderColor: theme.palette.primary.main,
                    fontSize: '1rem',
                    fontWeight: theme.typography.fontWeightMedium,
                    marginRight: theme.spacing(1),
                    '& .MuiChip-label': {
                      color: theme.palette.primary.main,
                    },
                  }}
                  icon={
                    <VolunteerActivismIcon
                      style={{
                        fill: theme.palette.primary.main,
                        fontSize: '1.2rem',
                        marginLeft: '10px',
                      }}
                    />
                  }
                  key={coinsGiven}
                  label={coinsGiven.toString()}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{color: theme.palette.text.disabled}}
              >
                {timeAgo}
              </Typography>
            </Stack>
          </Stack>

          <Typography
            variant="body1"
            sx={{marginTop: theme.spacing(2), marginBottom: theme.spacing(2)}}
          >
            {message}
          </Typography>
          {imageUrl !== '' ? (
            <img
              src={imageUrl}
              alt="imageUrl"
              width="100%"
              style={{marginBottom: theme.spacing(1)}}
            />
          ) : null}
          <LikeButtons
            id={id}
            hearts={hearts}
            claps={claps}
            celebrations={celebrations}
          />
          <Divider sx={{my: theme.spacing(1)}} />
          <NewComment name={props.name} oId={props.oId} postid={props.id} />
          <PreviewCommentSection
            id={id}
            postId={props.id}
            max={3}
            comments={props.comments || []}
            showAllComments={showAllComments}
          />
          {props.comments?.length > 3 && (
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
              {showAllComments ? (
                <ExpandLessIcon
                  onClick={() => setShowAllComments(!showAllComments)}
                />
              ) : (
                <ExpandMoreIcon
                  onClick={() => setShowAllComments(!showAllComments)}
                />
              )}
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          maxWidth: 600,
          mb: theme.margin.default,
          flex: 1,
          backgroundColor: theme.interface.main,
          padding: theme.padding.default,
          borderRadius: theme.borderRadius.default,
          boxShadow: 1,
        }}
      >
        <Stack direction="row">
          {userProfilePhoto ? (
            <Avatar
              sx={{cursor: 'pointer'}}
              onClick={handleAvatarClickAuthor}
              src={userProfilePhoto}
            />
          ) : (
            <Avatar
              onClick={handleAvatarClickAuthor}
              {...stringAvatar(firstName || 'Cryoto')}
            />
          )}

          <Stack sx={{ml: 2}}>
            <Typography variant="body1">
              <>
                <b
                  data-testid="poster-name"
                  style={{cursor: 'pointer'}}
                  onClick={handleAvatarClickAuthor}
                >
                  {firstName}
                </b>
                {` ${t('homePage.Recognized')}`}

                {recipientProfiles.map((profile, index) => (
                  <React.Fragment key={index}>
                    <b
                      data-testid="rewardee-name"
                      style={{cursor: 'pointer'}}
                      onClick={() => handleAvatarClickRecipient(profile.oId)}
                    >
                      {profile.name}
                    </b>
                    {index < recipientProfiles.length - 2 && ', '}
                    {index === recipientProfiles.length - 2 &&
                      ` ${t('homePage.RecipientAnd')}`}
                  </React.Fragment>
                ))}
              </>
            </Typography>
            <Box
              sx={{display: 'flex', alignItems: 'center', mt: 0.25, mb: 0.25}}
            >
              <Chip
                sx={{
                  backgroundColor: theme.interface.contrastMain,
                  border: '3px solid',
                  borderColor: theme.palette.primary.main,
                  fontSize: '1rem',
                  fontWeight: theme.typography.fontWeightMedium,
                  marginRight: theme.spacing(1),
                  '& .MuiChip-label': {
                    color: theme.palette.primary.main,
                  },
                }}
                icon={
                  <VolunteerActivismIcon
                    style={{
                      fill: theme.palette.primary.main,
                      fontSize: '1.2rem',
                      marginLeft: '10px',
                    }}
                  />
                }
                key={coinsGiven}
                label={coinsGiven.toString()}
              />
              {tags?.map((tag) => (
                <Chip sx={ChipStyles} key={tag} label={tag} />
              ))}
            </Box>
            <Typography
              data-testid="body2"
              variant="body2"
              sx={{color: theme.palette.text.disabled}}
            >
              {timeAgo}
            </Typography>
          </Stack>
        </Stack>
        <Typography
          data-testid="body1"
          variant="body1"
          sx={{marginTop: theme.spacing(2), marginBottom: theme.spacing(2)}}
        >
          {message}
        </Typography>
        {imageUrl !== '' ? (
          <img
            data-testid="image-url"
            src={imageUrl}
            alt="imageUrl"
            width="100%"
            style={{marginBottom: theme.spacing(1)}}
          />
        ) : null}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <LikeButtons
            data-testid="like-button"
            id={id}
            hearts={hearts}
            claps={claps}
            celebrations={celebrations}
          />
          <Box sx={{ml: theme.spacing(2)}}>
            <BoostButton
              data-testid="postboostbutton"
              postId={id}
              userId={accounts[0].idTokenClaims?.oid!}
              interactionEnabled={allowedToBoost()}
              boosts={boosts}
              onBoost={() => {
                boosts.push(accounts[0].idTokenClaims?.oid!);
              }}
              onFail={() => {
                boosts.splice(
                  boosts.indexOf(accounts[0].idTokenClaims?.oid!),
                  boosts.indexOf(accounts[0].idTokenClaims?.oid!) >= 0 ? 1 : 0,
                );
              }}
            />
          </Box>
        </Box>
        <Divider sx={{my: theme.spacing(1)}} />
        <NewComment name={props.name} oId={props.oId} postid={props.id} />
        <PreviewCommentSection
          data-testid="preview-comments"
          id={id}
          postId={props.id}
          max={3}
          comments={props.comments || []}
          showAllComments={showAllComments}
        />
        {props.comments?.length > 3 && (
          <Box sx={{display: 'flex', justifyContent: 'center'}}>
            {showAllComments ? (
              <ExpandLessIcon
                onClick={() => setShowAllComments(!showAllComments)}
              />
            ) : (
              <ExpandMoreIcon
                onClick={() => setShowAllComments(!showAllComments)}
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default Post;
