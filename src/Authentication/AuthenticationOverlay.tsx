import React from 'react';
import * as CSS from 'csstype';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Button } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import { SignInDialog, EmailSignIn } from './SignIn';
import * as ROUTES from '../constants/routes';

const floatingStyle: CSS.Properties = {
    zIndex: 1,
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    display: 'flex',
    justifyContent: 'center',
};

export function AuthenticationOverlay() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path={ROUTES.EMAIL_SIGN_IN}>
                    <EmailSignIn/>
                </Route>
                <Route path="/">
                    <SignInOverlay/>
                </Route>
            </Switch>
        </BrowserRouter>
    )
}

export function SignInOverlay() {
    const [signInOpen, openSignIn] = React.useState(false)

    return (
        <React.Fragment>
            <div style={floatingStyle}>
                <Button
                    variant='contained'
                    startIcon={<AccountCircleIcon/>}
                    style={ {marginTop: '70vh', maxHeight: '50px'} }
                    onClick={() => openSignIn(true)}
                >Sign In</Button>
            </div>
            <SignInDialog
                open={signInOpen}
                close={() => openSignIn(false)}
            />
        </React.Fragment>
    );
}