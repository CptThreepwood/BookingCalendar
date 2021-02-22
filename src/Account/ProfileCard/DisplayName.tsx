import React from 'react';

import {
    TextField, InputAdornment, IconButton, Typography, Box
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import { FirebaseContext } from '../../Firebase';
import { profileFormElementStyle, profileFormTextStyle } from './styles';

// -------------------------------------------------------------------------------------------
// Display Name Control

interface TextInputControlProps {
    current: string,
    loading: boolean,
    label: string,
}

export function DisplayName({current, loading, label}: TextInputControlProps) {
    const firebase = React.useContext(FirebaseContext);

    const [displayName, setDisplayName] = React.useState(current);
    React.useEffect(() => setDisplayName(current), [current, loading]);

    function commit() {
        firebase.database.updateUserSettings({displayName})
    }

    return (
        <Box style={profileFormElementStyle}>
            <Typography style={profileFormTextStyle}>
                {label}
            </Typography>
            <TextField
                type="string"
                value={displayName}
                onChange={event => setDisplayName(event.target.value)}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                        <IconButton
                            color="primary"
                            aria-label="save display name"
                            onClick={event => commit()}
                            disabled={loading || displayName === current}
                        ><CheckCircleIcon/></IconButton>
                        </InputAdornment>
                    )
                }}
            />
        </Box>
    )
}