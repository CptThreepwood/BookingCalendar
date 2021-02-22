import React from 'react';

import { defaultFirebaseApp } from './__mocks__/mockApp';
import { UserClaim } from './useAuthClaim';
 
export const FirebaseContext = React.createContext(defaultFirebaseApp);

export interface UserContextType {
    userClaim: UserClaim,
}

export const UserContext = React.createContext<UserContextType>({
    userClaim: {hasCalendarAccess: false, hasAdminAccess: false}
})