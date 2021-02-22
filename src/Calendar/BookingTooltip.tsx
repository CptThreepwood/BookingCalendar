import React from 'react';
import { LinearProgress } from '@material-ui/core';

import { FirebaseContext } from '../Firebase';

function UserLine({userID}: {userID: string}) {
    const firebase = React.useContext(FirebaseContext);
    const [user, loading, error] = firebase.database.usePublicProfile(userID);

    if (loading){
        return (<LinearProgress/>)
    } else if (error) {
        if (error.code === 'PERMISSION_DENIED') { return (<p>Another User</p>) }
        return (<p>{error.message}</p>)
    }
    return (<p>{user?.email || 'Unknown'} {user?.displayName ? ` (${user.displayName})` : ''}</p>)
}

export function BookingTooltip(userIDs: string[]) {
    return (
        <React.Fragment>
            {userIDs.map(user => (<UserLine key={user} userID={user}/>))}
        </React.Fragment>
    )
} 