import React from 'react';
import * as CSS from 'csstype';
import { Link } from 'react-router-dom';

import {
    Box, Container,
    Card, CardContent, CardHeader, Typography,
} from '@material-ui/core';

const profileCard: CSS.Properties = {
    marginTop: '20px',
}

export function UnauthorizedPage() {
    return (
        <Container style={{flexGrow: 1}}>
            <Box maxWidth="800px" margin="auto">
                <Box style={profileCard}>
                    <Card>
                        <CardHeader
                            title="Sorry"
                            subheader="You don't have permission to be here"
                        />
                        <CardContent>
                            <Typography>
                                You've managed to stumble onto a page you don't have rights to view.
                            </Typography>
                            <Typography>
                                Please head back to the <Link to="/">Account Page</Link>
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </Container>
    )
}