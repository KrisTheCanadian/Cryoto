import {useIsAuthenticated, useMsal} from '@azure/msal-react';
import {Navigate, Outlet, useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useEffect} from 'react';

import Role from '@/pages/roles';
import {routeHome, routeLandingPage} from '@/pages/routes';

function RequireAuth(allowedRoles: Role[]) {
  const {t} = useTranslation();
  const {accounts} = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  const hasPermission = (userRoles: Role[], allowedRoles: Role[]) => {
    if (Object.values(allowedRoles).length === 0) {
      return true;
    }
    return userRoles.find((role) => Object.values(allowedRoles).includes(role));
  };

  const filterRoles = (roles: string[] | undefined) => {
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
  };

  const userRoles: Role[] = filterRoles(accounts[0]?.idTokenClaims?.roles);

  useEffect(() => {
    if (isAuthenticated && !hasPermission(userRoles, allowedRoles)) {
      navigate(routeHome, {
        state: {error: t('errors.PermissionError')},
      });
    }
  }, [allowedRoles, isAuthenticated, navigate, t, userRoles]);

  if (isAuthenticated && hasPermission(userRoles, allowedRoles)) {
    return <Outlet />;
  } else {
    return <Navigate to={routeLandingPage} />;
  }
}

export default RequireAuth;
