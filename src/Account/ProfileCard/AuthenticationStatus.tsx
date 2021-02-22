import React from 'react';

import { Typography } from '@material-ui/core';
import { UserClaim } from '../../Firebase';


// -------------------------------------------------------------------------------------------
// Display Authentication Status

interface AuthenticationStatusProps {
    claim: UserClaim
}

export function AuthenticationStatus({claim}: AuthenticationStatusProps) {
    if (claim.hasAdminAccess) {
        return (
            <Typography style={{marginTop: "20px"}} variant="body1">
                You have administrator access
            </Typography>
        )
    } else if (claim.hasCalendarAccess) {
        return (
            <Typography style={{marginTop: "20px"}} variant="body1">
                You have calendar access
            </Typography>
        )
    }
    return (
        <Typography style={{marginTop: "20px"}} variant="body1">
            Unfortunately, until you can be authenticated, you are limited to this profile page.
            Please contact the site administrator to receive greater access.
        </Typography>
    )
}