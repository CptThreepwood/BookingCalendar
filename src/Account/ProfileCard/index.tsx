import React from 'react';

import {
    Card, CardContent, CardActions, CardHeader,
} from '@material-ui/core';

import { AuthenticationStatus } from './AuthenticationStatus';
import { UserPreference } from './UserPreference';
import { DisplayName } from './DisplayName';

import { DayOfWeek } from '../../Firebase/types';
import { UserContext, FirebaseContext, UserSettings } from '../../Firebase';
import { SignOutButton } from '../../Authentication';
import { DebugError } from '../../Errors';

export function ProfileCard() {
    const firebase = React.useContext(FirebaseContext);
    const authenticatedUser = React.useContext(UserContext);
    const [currentUser, userLoading, userError] = firebase.database.useUserProfile();

    function savePreferences(prefs: Partial<UserSettings>) {
        firebase.database.updateUserSettings(prefs)
    }

    if (userError) {
        return DebugError(userError);
    }

    return (
        <Card>
            <CardHeader
                title="Account Settings"
                subheader={userLoading ? '' : (currentUser?.email || 'Unknown')}
            />
            <CardContent>
                <AuthenticationStatus claim={authenticatedUser.userClaim}/>
                <DisplayName
                    label='I want other users to see my name is'
                    current={currentUser?.settings.displayName || ''}
                    loading={userLoading}
                />
                <UserPreference
                    text='I believe the week starts on a'
                    current={currentUser?.settings.startOfWeek || 0}
                    loading={userLoading}
                    options={[
                        {name: 'Sunday', value: 0},
                        {name: 'Monday', value: 1},
                        {name: 'Saturday', value: 6},
                    ]}
                    commit={value => savePreferences({startOfWeek: (value as DayOfWeek)})}
                />
                <UserPreference
                    text='Notify me'
                    current={currentUser?.settings.notificationType || 0}
                    loading={userLoading}
                    options={authenticatedUser.userClaim.hasAdminAccess ? [
                            {name: 'under no circumstances', value: 0},
                            {name: 'when a reservation is made in my name', value: 1},
                            {name: 'whenever a reservation is made', value: 2},
                        ] : [
                            {name: 'under no circumstances', value: 0},
                            {name: 'when a reservation is made in my name', value: 1},
                        ]
                    }
                    commit={value => savePreferences({notificationType: value})}
                />
            </CardContent>
            <CardActions>
                <SignOutButton/>
            </CardActions>
        </Card>
    )
}