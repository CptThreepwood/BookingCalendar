import { FirebaseAuthenticator } from './types';
import * as ROUTES from '../constants/routes';

const LOCAL_STORAGE_KEY = 'signInEmail';

export function startEmailSignIn(email: string, authenticator: FirebaseAuthenticator): Promise<void> {
    localStorage.setItem(LOCAL_STORAGE_KEY, email);
    const actionCodeSettings = {
        url: `${window.location.protocol}//${window.location.host}${ROUTES.EMAIL_SIGN_IN}`,
        handleCodeInApp: true,
    }
    return authenticator.sendSignInLinkToEmail(email, actionCodeSettings);
}

export async function handleEmailSignIn(href: string, authenticator: FirebaseAuthenticator): Promise<void> {
    if (authenticator.isSignInWithEmailLink(href)) {
        let email = window.localStorage.getItem(LOCAL_STORAGE_KEY)
        if (email === null) {
            email = window.prompt("I've forgotten your email, could you remind me?") || '';
        }
        return authenticator.signInWithEmailLink(email, href).then((result) => {
            // Clear email from storage.
            window.localStorage.removeItem(LOCAL_STORAGE_KEY);
            // You can access the new user via result.user
            // Additional user info profile not available via:
            // result.additionalUserInfo.profile == null
            // You can check if the user is new or existing:
            // result.additionalUserInfo.isNewUser
        });
    }

    throw new Error('Invalid Sign In URL');
}