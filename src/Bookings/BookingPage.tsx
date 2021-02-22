import React from 'react';
import * as CSS from 'csstype';

import { Box, Container } from '@material-ui/core';
import { UserContext } from '../Firebase';
import { BookingDisplay } from './BookingDisplay';
import { UnauthorizedPage } from '../Errors';

const profileCard: CSS.Properties = {
    marginTop: '20px',
}

export function BookingPage() {
    const authenticatedUser = React.useContext(UserContext);

    if (!authenticatedUser.userClaim.hasAdminAccess) {
        return (<UnauthorizedPage/>)
    }

    return (
        <Container style={{flexGrow: 1}}>
            <Box maxWidth="800px" margin="auto">
                <Box style={profileCard}>
                    <BookingDisplay all={true}/>
                </Box>
            </Box>
        </Container>
    )
}