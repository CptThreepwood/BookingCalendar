import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import firebaseConfig from '../config/firebase.secret.json';

import { useAuthState as useAuthStateAny } from 'react-firebase-hooks/auth';
import { User } from '@firebase/auth-types';

import {
    useUserProfile, useUserProfiles,
    usePublicProfile, usePublicProfiles,
    updateUserSettings,
    useCalendar, makeBooking, removeBooking,
} from './database';
import { Booking, PreBooking, AllYears, UserProfile, UserPublicProfile, UserSettings } from './types';
import { startEmailSignIn, handleEmailSignIn} from './emailSignIn';
import { useAuthClaim, UserClaim } from './useAuthClaim';

export interface FirebaseApp {
    auth: {
        useAuthState: () => [User | undefined, boolean, app.auth.Error | null],
        useAuthClaim: () => [UserClaim, boolean, app.auth.Error | null],
        startEmailSignIn: (email: string) => Promise<void>,
        handleEmailSignIn: (href: string) => Promise<void>,
        googleSignIn: () => Promise<void>,
        facebookSignIn: () => Promise<void>,
        signOut: () => Promise<void>,
    },
    database: {
        useCalendar: () => [AllYears | undefined | null, boolean, any],
        makeBooking: ( booking: PreBooking, userID?: string ) => Promise<void[]>,
        removeBooking: ( booking: Booking ) => Promise<void>,
        usePublicProfile: ( userID?: string ) => [UserPublicProfile | undefined | null, boolean, any],
        usePublicProfiles: () => [UserPublicProfile[] | undefined | null, boolean, any],
        useUserProfile: () => [UserProfile | undefined | null, boolean, any],
        useUserProfiles: () => [UserProfile[] | undefined | null, boolean, any],
        updateUserSettings: (newSettings: Partial<UserSettings>) => Promise<void>,
    }
}

// Configure Firebase
app.initializeApp(firebaseConfig);

// Authentication
const auth = app.auth();
auth.useDeviceLanguage();

const google = new app.auth.GoogleAuthProvider();
google.addScope('profile');
google.addScope('email');

const facebook = new app.auth.FacebookAuthProvider();

// Database
const database =  app.database();

export const firebaseApp: FirebaseApp = {
    auth: {
        useAuthState: () => useAuthStateAny(auth),
        useAuthClaim: () => useAuthClaim(auth),
        startEmailSignIn: (email: string) => startEmailSignIn(email, auth),
        handleEmailSignIn: (href: string) => handleEmailSignIn(href, auth),
        googleSignIn: () => auth.signInWithRedirect(google),
        facebookSignIn: () => auth.signInWithRedirect(facebook),
        signOut: () => auth.signOut(),
    },
    database: {
        useCalendar: () => useCalendar(database),
        makeBooking: ( booking: PreBooking, userID?: string ) => (
            makeBooking(booking, userID || auth.currentUser?.uid || null, database)
        ),
        removeBooking: ( booking: Booking ) => (
            removeBooking(booking, booking.userID || auth.currentUser?.uid || null, database)
        ),
        usePublicProfile: ( userID?: string ) => usePublicProfile(userID || auth.currentUser?.uid || '', database),
        usePublicProfiles: () => usePublicProfiles(database),
        useUserProfile: (userID?: string) => useUserProfile(userID || auth.currentUser?.uid, database),
        useUserProfiles: () => useUserProfiles(database),
        updateUserSettings: (newSettings: Partial<UserSettings>) => (
            updateUserSettings(newSettings, auth.currentUser, database)
        ),
    }
}