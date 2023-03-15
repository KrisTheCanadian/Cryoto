/* eslint-disable @babel/no-unused-expressions */
/* eslint-disable @shopify/jsx-no-hardcoded-content */
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
} from '@mui/material';
import {useState} from 'react';
import {useTheme} from '@mui/material/styles';
import {useTranslation} from 'react-i18next';

import Role from '@/pages/roles';
import {updateUserRoles} from '@/data/api/requests/admin';
import IUserRoles from '@/data/api/types/IUserRoles';

interface Props {
  handleClose: () => void;
  selectedUser: IUserRoles;
  retrieveUsers: () => void;
}

export const EditUserRolesModal = ({
  handleClose,
  selectedUser,
  retrieveUsers,
}: Props) => {
  const [userPermissions, setUserPermissions] = useState<any>([
    {
      key: 'Admin',
      value: selectedUser.roles?.includes(Role.Admin),
    },
    {
      key: 'Contractor',
      value: selectedUser.roles?.includes(Role.Contractor),
    },
    {
      key: 'Intern',
      value: selectedUser.roles?.includes(Role.Intern),
    },
    {
      key: 'RegularFTE',
      value: selectedUser.roles?.includes(Role.RegularFTE),
    },
    {
      key: 'TeamLead',
      value: selectedUser.roles?.includes(Role.TeamLead),
    },
    {
      key: 'Partner',
      value: selectedUser.roles?.includes(Role.Partner),
    },
    {
      key: 'SeniorPartner',
      value: selectedUser.roles?.includes(Role.SeniorPartner),
    },
  ]);
  const theme = useTheme();
  const {t} = useTranslation();

  const handleSave = () => {
    const userRolesList: Role[] = [];
    userPermissions.forEach((permission: any) => {
      switch (permission.key) {
        case 'Admin':
          permission.value && userRolesList.push(Role.Admin);
          break;

        case 'Contractor':
          permission.value && userRolesList.push(Role.Contractor);
          break;

        case 'Intern':
          permission.value && userRolesList.push(Role.Intern);
          break;

        case 'RegularFTE':
          permission.value && userRolesList.push(Role.RegularFTE);
          break;

        case 'TeamLead':
          permission.value && userRolesList.push(Role.TeamLead);
          break;

        case 'Partner':
          permission.value && userRolesList.push(Role.Partner);
          break;

        case 'SeniorPartner':
          permission.value && userRolesList.push(Role.SeniorPartner);
          break;
      }
    });
    updateUserRoles(userRolesList, selectedUser.oId)
      .then(() => {
        retrieveUsers();
      })
      .catch((error) => {});
    handleClose();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, checked} = event.target;
    setUserPermissions(
      userPermissions.map((role: any) =>
        role.key === name ? {...role, value: checked} : role,
      ),
    );
  };

  const validInputs = userPermissions.some(
    (permission: any) => permission.value === true,
  );

  return (
    <>
      <Grid container spacing={theme.spacing(2)}>
        <FormControl required component="fieldset" variant="standard">
          <FormLabel component="legend">
            {`${t<string>(
              `adminDashboard.userManagementTable.roleModificationLabel`,
            )} ${selectedUser.name} `}
          </FormLabel>
          <FormGroup>
            {userPermissions.map((permission: any) => (
              <FormControlLabel
                key={permission.key}
                control={
                  <Checkbox
                    checked={permission.value}
                    onChange={handleChange}
                    name={permission.key}
                  />
                }
                label={t<string>(`userPermissions.${permission.key}`)}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        onClick={handleSave}
        sx={{mt: 3, mb: 2}}
        disabled={!validInputs}
      >
        {t<string>('settings.Save')}
      </Button>
    </>
  );
};
