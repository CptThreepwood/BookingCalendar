import React from 'react';
import * as CSS from 'csstype';

import {
    Box, Container,
} from '@material-ui/core';
import { UserContext } from '../Firebase';
import { BookingDisplay } from '../Bookings';
import { ProfileCard } from './ProfileCard';

const profileCard: CSS.Properties = {
    marginTop: '20px',
}

export function AccountPage() {
    const authenticatedUser = React.useContext(UserContext);

    return (
        <Container style={{flexGrow: 1}}>
            <Box maxWidth="800px" margin="auto">
                <Box style={profileCard}>
                    <ProfileCard/>
                </Box>
                {
                    authenticatedUser.userClaim.hasCalendarAccess ? (
                        <Box style={profileCard}>
                            <BookingDisplay/>
                        </Box>
                    ): null
                }
            </Box>
        </Container>
    )
}