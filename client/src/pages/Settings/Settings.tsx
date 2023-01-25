import {FullWidthColumn} from '@shared/components/FullWidthColumn';
import PageFrame from '@shared/components/PageFrame';
import {useTranslation} from 'react-i18next';
import {useMutation, useQuery} from 'react-query';
import {InteractionStatus} from '@azure/msal-browser';
import {useMsal} from '@azure/msal-react';
import {useEffect, useState} from 'react';
import {Typography} from '@mui/material';
import {useTheme} from '@mui/material/styles';

import {
  SettingsBox,
  SettingsBoxProps,
  SettingsElementInputType,
} from '@/pages/Settings/components/SettingsBox';
import {getDefaultAddress, updateAddress} from '@/data/api/requests/address';
import {getUserProfile, updateUserProfile} from '@/data/api/requests/users';
import {IUserProfile} from '@/data/api/types/IUser';
import IAddress, {IUpdateAddress} from '@/data/api/types/IAddress';

const MAX_QUERY_REFETCH = 10;
let queryRefetchCounter = 0;

function Settings() {
  const {t, i18n} = useTranslation();
  const theme = useTheme();
  const [userProfileState, setUserProfileState] = useState<IUserProfile>();
  const [shippingAddressState, setDefaultAddressState] = useState<IAddress>();
  const [profileDataState, setProfileDataState] = useState<SettingsBoxProps>();
  const [personalDataState, setPersonalDataState] =
    useState<SettingsBoxProps>();
  const [notificationsDataState, setNotificationsDataState] =
    useState<SettingsBoxProps>();
  const {inProgress} = useMsal();

  const {mutate: mutateUserProfile} = useMutation(updateUserProfile, {
    onSuccess: (mutatedUserProfileData) => {
      setUserProfileState(mutatedUserProfileData);
    },
  });

  const {mutate: mutateAddresse} = useMutation(
    (newAddress: IUpdateAddress) =>
      updateAddress(shippingAddressState?.id as number, newAddress),
    {
      onSuccess: (mutatedAddressData) => {
        setDefaultAddressState(mutatedAddressData);
      },
    },
  );

  const loadUserProfile = async () => {
    if (inProgress === InteractionStatus.None) {
      return getUserProfile();
    }
  };

  const {status: userProfileStatus, refetch: refetchUserProfile} = useQuery(
    ['userprofile'],
    loadUserProfile,
    {
      onSuccess: (userProfile) => {
        setUserProfileState(userProfile);
      },
    },
  );

  const loadDefaultAddress = async () => {
    if (inProgress === InteractionStatus.None) {
      return getDefaultAddress();
    }
  };

  const {status: shippingAddressStatus, refetch: refetchShippingAddress} =
    useQuery(['defaultAddress'], loadDefaultAddress, {
      onSuccess: (defaultAddress) => {
        setDefaultAddressState(defaultAddress);
      },
    });

  const updateName = (newName: string) => {
    mutateUserProfile({name: newName});
  };

  const updateJobTitle = (newJobTitle: string) => {
    mutateUserProfile({businessTitle: newJobTitle});
  };

  const updateLanguage = (newLanguage: string) => {
    mutateUserProfile({language: newLanguage});
    i18n.changeLanguage(newLanguage);
  };

  const updateShippingAddress = (newAddress: IUpdateAddress) => {
    mutateAddresse(newAddress);
  };

  const updateBio = (newBio: string) => {
    mutateUserProfile({bio: newBio});
  };

  const updateEmailNotification = (newValue: boolean) => {
    mutateUserProfile({emailNotifications: newValue});
  };

  const prepareData = () => {
    const profileData: SettingsBoxProps = {
      title: t<string>('settings.Profile'),
      elements: [
        {
          name: t<string>('settings.Name'),
          data: {value: [userProfileState?.name as string]},
          inputType: SettingsElementInputType.TextField,
          callback: undefined,
        },
        {
          name: t<string>('settings.JobTitle'),
          data: {value: [userProfileState?.businessTitle as string]},
          inputType: SettingsElementInputType.TextField,
          callback: updateJobTitle,
        },
        {
          name: t('settings.Bio'),
          data: {value: [userProfileState?.bio as string]},
          inputType: SettingsElementInputType.TextArea,
          callback: updateBio,
        },
      ],
    };

    const personalData: SettingsBoxProps = {
      title: t<string>('settings.Personal'),
      elements: [
        {
          name: t('settings.Email'),
          data: {value: [userProfileState?.email as string]},
          inputType: SettingsElementInputType.TextField,
          callback: undefined,
        },
        {
          name: t('settings.ShippingAddress'),
          data: {
            unit: shippingAddressState?.apartment,
            streetNumber: shippingAddressState?.streetNumber,
            street: shippingAddressState?.street,
            city: shippingAddressState?.city,
            province: shippingAddressState?.province,
            country: shippingAddressState?.country,
            postalCode: shippingAddressState?.postalCode,
            additionalInfo: shippingAddressState?.additionalInfo,
            isDefualt: true,
          },
          inputType: SettingsElementInputType.AddressFields,
          callback: updateShippingAddress,
        },
        {
          name: t<string>('settings.Language'),
          data: {value: [userProfileState?.language as string]},
          inputType: SettingsElementInputType.LanguageSelect,
          callback: updateLanguage,
        },
      ],
    };

    const notificationsData: SettingsBoxProps = {
      title: t('settings.Notifications'),
      elements: [
        {
          name: t<string>('settings.EmailNotifications'),
          data: {value: [userProfileState?.emailNotifications ?? false]},
          inputType: SettingsElementInputType.SwitchButton,
          callback: updateEmailNotification,
        },
      ],
    };

    setProfileDataState(profileData);
    setPersonalDataState(personalData);
    setNotificationsDataState(notificationsData);
  };

  useEffect(() => {
    if (
      userProfileState !== undefined &&
      userProfileStatus === 'success' &&
      shippingAddressState !== undefined &&
      shippingAddressStatus === 'success'
    ) {
      // case: useQuery finishes sucessfully and returns valid data
      queryRefetchCounter = 0;
      prepareData();
    } else if (
      userProfileState === undefined &&
      userProfileStatus === 'success'
    ) {
      // case: useQuery finishes sucessfully but return blank user profile data
      queryRefetchCounter++;
      refetchUserProfile();
    } else if (
      shippingAddressState === undefined &&
      shippingAddressStatus === 'success'
    ) {
      // case: useQuery finishes sucessfully but return blank shipping address data
      queryRefetchCounter++;
      if (queryRefetchCounter < MAX_QUERY_REFETCH) {
        refetchShippingAddress();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userProfileState,
    userProfileStatus,
    shippingAddressState,
    shippingAddressStatus,
  ]);

  return (
    <PageFrame>
      <FullWidthColumn>
        <Typography variant="h4" sx={{mb: theme.spacing(2)}}>
          {t<string>('layout.Settings')}
        </Typography>
        {profileDataState && (
          <SettingsBox
            title={profileDataState.title}
            elements={profileDataState.elements}
          />
        )}
        {personalDataState && (
          <SettingsBox
            title={personalDataState.title}
            elements={personalDataState.elements}
          />
        )}
        {notificationsDataState && (
          <SettingsBox
            title={notificationsDataState.title}
            elements={notificationsDataState.elements}
          />
        )}
      </FullWidthColumn>
    </PageFrame>
  );
}

export default Settings;
