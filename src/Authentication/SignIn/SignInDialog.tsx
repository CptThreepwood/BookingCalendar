import React from 'react';

import { useTheme } from '@material-ui/core/styles';
import {
    Box, Button, Dialog, Divider,
    DialogTitle, DialogActions, DialogContent,
    TextField, Typography, useMediaQuery,
} from '@material-ui/core';

import { GoogleAuthButton } from './GoogleAuth';
import { FacebookAuthButton } from './FacebookAuth';
import { FirebaseContext } from '../../Firebase';

import { dialogDivider, dialogText, spaceAbove } from '../styles';

export function SignInDialog(props: {close: (() => void), open: boolean}) {
    const firebase = React.useContext(FirebaseContext);

    const [email, setEmail] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [signInDisabled, setSignInDisabled] = React.useState(false);

    const theme = useTheme();
    const isWide = useMediaQuery(theme.breakpoints.up('sm'));

    function cleanUp() {
        setMessage('');
    }

    function handleClose() {
        cleanUp();
        props.close();
    }

    function handleSignIn() {
        firebase.auth.startEmailSignIn(email).then(
            () => {
                setMessage(`I've sent an email to ${email}`);
                setSignInDisabled(false);
            }
        ).catch((error) => {
            console.log(error.code);
            console.log(error.message);
            setMessage(error.message);
        })
    }

    return (
        <Dialog
          open={props.open}
          onClose={handleClose}
          onBackdropClick={handleClose}
          aria-labelledby="confirmation-dialog-title"
          PaperProps={{style: {minWidth: (isWide ? `${theme.breakpoints.values.sm - 64}px` : 'calc(100% - 64px)')}}}
        >
            <DialogTitle id="confirmation-dialog-title">Sign In</DialogTitle>
            <DialogContent>
                <Box>
                    <TextField
                        type="email"
                        label="Email"
                        variant="outlined"
                        autoFocus
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        margin="dense"
                        fullWidth
                    />
                    <Box style={dialogText}>
                        <Typography variant="button"
                            style={{textTransform: 'inherit'}}
                        >
                            {message || ""}
                        </Typography>
                    </Box>
                    <Button
                        fullWidth={true}
                        color="primary"
                        variant="outlined"
                        onClick={() => handleSignIn()}
                        style={spaceAbove}
                        disabled={signInDisabled}
                    >Send me a link to sign in</Button>
                </Box>
                <Divider variant="middle" style={dialogDivider}/>
                <Box>
                    <Box style={dialogText}>
                        <Typography variant="button" style={{textTransform: 'inherit'}}>
                            Sign in with another account
                        </Typography>
                    </Box>
                    <GoogleAuthButton/>
                    <Box style={spaceAbove}><FacebookAuthButton/></Box>
                </Box>
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog>
    );
}