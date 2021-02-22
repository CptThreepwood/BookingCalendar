import { voidPromise } from './mockUtils';
import { authUserState, claimState } from './mockAuth';
import {
    useCalendar, makeBooking, removeBooking,
    usePublicProfile, usePublicProfiles,
    useUserProfile, useUserProfiles,
    updateUserSettings,
} from './mockDB';

import { FirebaseApp } from '../firebase';
import { PreBooking, Booking, UserSettings } from '../types';

export const defaultFirebaseApp: FirebaseApp = {
    auth: {
        useAuthState: () => authUserState,
        useAuthClaim: () => claimState,
        startEmailSignIn: async (email: string) => {},
        handleEmailSignIn: async (href: string) => {},
        googleSignIn: voidPromise,
        facebookSignIn: voidPromise,
        signOut: voidPromise,
    },
    database: {
        useCalendar: () => useCalendar(),
        makeBooking: ( booking: PreBooking, userID?: string ) => makeBooking(booking, userID || authUserState[0].uid),
        removeBooking: ( booking: Booking, userID?: string ) => removeBooking(booking, userID || authUserState[0].uid),
        usePublicProfile: ( userID?: string ) => usePublicProfile(userID || authUserState[0].uid),
        usePublicProfiles: () => usePublicProfiles(),
        useUserProfile: () => useUserProfile(authUserState[0].uid),
        useUserProfiles: () => useUserProfiles(),
        updateUserSettings: (newSettings: Partial<UserSettings>) => updateUserSettings(newSettings, authUserState[0]),
    }
}