import React from 'react';
import { User } from '@firebase/auth-types';
import { useAuthState } from 'react-firebase-hooks/auth';

import { FirebaseAuthenticator } from './types';

export interface UserClaim {
  hasCalendarAccess: boolean,
  hasAdminAccess: boolean,
}

// Note that this hook is just for the UI
// It is *not* secure, a user can always edit the output in the console
// Make sure the server side enforces these permissions
export function useAuthClaim(auth: FirebaseAuthenticator): [UserClaim, boolean, any] {
  const [user, loading, error]: [ User | undefined, boolean, any ] = useAuthState(auth);
  const [userClaim, setUserClaim] = React.useState<UserClaim>({
    hasCalendarAccess: false,
    hasAdminAccess: false,
  });

  React.useEffect(
    () => {
        if (user) {
            user.getIdTokenResult().then(
              (result) => setUserClaim({
                hasCalendarAccess: result.claims?.hasCalendarAccess || false,
                hasAdminAccess: result.claims?.hasAdminAccess || false,
              })
            )
        }
    }, [user]
  );

  return [userClaim, loading, error];
};