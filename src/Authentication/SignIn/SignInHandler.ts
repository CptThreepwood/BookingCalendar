import React from 'react';
import { useHistory } from 'react-router-dom';

import { FirebaseContext} from '../../Firebase';

import * as ROUTES from '../../constants/routes';

export function EmailSignIn() {
    const firebase = React.useContext(FirebaseContext);
    const history = useHistory();

    firebase.auth.handleEmailSignIn(window.location.href).then(
        () => history.push(ROUTES.ACCOUNT)
    ).catch((error: any) => {
        console.log(error.code);
        console.log(error.message);
    });

    return null
}