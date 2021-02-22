import React from 'react';

import { UserContext } from '../Firebase';
import { AuthenticatedView } from '../AuthenticatedView';

export default {
    title: 'Authenticated View',
    component: AuthenticatedView,
}

const unregisteredClaim = {
    hasCalendarAccess: false,
    hasAdminAccess: false,
};

export const UnregisteredView = () => (
    <UserContext.Provider value={ {userClaim: unregisteredClaim} }>
      <AuthenticatedView/>
    </UserContext.Provider>
)

const registeredClaim = {
    hasCalendarAccess: true,
    hasAdminAccess: false,
};

export const RegisteredView = () => (
    <UserContext.Provider value={ {userClaim: registeredClaim} }>
      <AuthenticatedView/>
    </UserContext.Provider>
)

const administratorClaim = {
    hasCalendarAccess: true,
    hasAdminAccess: true,
};

export const AdministratorView = () => (
    <UserContext.Provider value={ {userClaim: administratorClaim} }>
      <AuthenticatedView/>
    </UserContext.Provider>
)