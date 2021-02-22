import React from 'react';
import * as CSS from 'csstype';

import {
    Button
} from '@material-ui/core';

import GoogleIcon from '../../Images/google_signin_logo_compact.svg';
import { FirebaseContext } from '../../Firebase';

const iconStyle: CSS.Properties = {
    height: "18px",
    marginRight: "18px",
}

export function GoogleAuthButton() {
    const firebase = React.useContext(FirebaseContext);

    return (
        <Button
            fullWidth={true}
            color="primary"
            variant="outlined"
            onClick={() => firebase.auth.googleSignIn()}
        ><img src={GoogleIcon} style={iconStyle} alt="Google"/> Sign in with Google</Button>
    )
}

