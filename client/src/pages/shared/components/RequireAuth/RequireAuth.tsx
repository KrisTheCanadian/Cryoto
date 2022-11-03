/* eslint-disable no-nested-ternary */
import {useIsAuthenticated, useMsal} from '@azure/msal-react';
import {Outlet} from 'react-router-dom';
import {Alert} from '@mui/material';
import PageFrame from '@shared/components/PageFrame';
import {MiddleColumn} from '@shared/components/MiddleColumn';
import {useTranslation} from 'react-i18next';

import Role from '../../../roles';

function RequireAuth(allowedRoles: Role[]) {
  const {t} = useTranslation();
  const {accounts} = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const userRoles: Role[] = filterRoles(accounts[0]?.idTokenClaims?.roles);

  return isAuthenticated ? (
    hasPermission(userRoles, allowedRoles) ? (
      <Outlet />
    ) : (
      <PageFrame>
        <MiddleColumn>
          <Alert severity="error">{t('errors.PermissionError')}</Alert>
        </MiddleColumn>
      </PageFrame>
    )
  ) : (
    <PageFrame>
      <MiddleColumn>
        <Alert severity="error">{t('errors.AuthenticationError')}</Alert>
      </MiddleColumn>
    </PageFrame>
  );
}

function hasPermission(userRoles: Role[], allowedRoles: Role[]) {
  if (Object.values(allowedRoles).length === 0) {
    return true;
  }
  return userRoles.find((role) => Object.values(allowedRoles).includes(role));
}
function filterRoles(roles: string[] | undefined) {
  if (roles === undefined) {
    return [];
  }
  const filtered: Role[] = [];

  roles.forEach((role) => {
    switch (role) {
      case 'Admin':
        filtered.push(Role.Admin);
        break;
      case 'Contractor':
        filtered.push(Role.Contractor);
        break;
      case 'Intern':
        filtered.push(Role.Intern);
        break;
      case 'Regular FTE':
        filtered.push(Role.RegularFTE);
        break;
      case 'Team Lead':
        filtered.push(Role.TeamLead);
        break;
      case 'Partner':
        filtered.push(Role.Partner);
        break;
      case 'Senior Partner':
        filtered.push(Role.SeniorPartner);
        break;
      default:
        break;
    }
  });
  return filtered;
}

export default RequireAuth;
