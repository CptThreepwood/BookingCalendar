import React from 'react';
import * as CSS from 'csstype';

import {
    Button
} from '@material-ui/core';

import FacebookIcon from '../../Images/f_logo_RGB-Blue_1024.svg';
import { FirebaseContext } from '../../Firebase';

const iconStyle: CSS.Properties = {
    height: "18px",
    marginRight: "18px",
}

export function FacebookAuthButton() {
    const firebase = React.useContext(FirebaseContext);

    return (
        <Button
            fullWidth={true}
            color="primary"
            variant="outlined"
            onClick={() => firebase.auth.facebookSignIn()}
        ><img src={FacebookIcon} style={iconStyle} alt="Facebook"/> Sign in with Facebook</Button>
    )
}

