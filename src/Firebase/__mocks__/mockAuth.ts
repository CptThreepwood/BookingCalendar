import { 
    User,
    IdTokenResult,
    AuthCredential,
    UserCredential,
    MultiFactorUser,
    ConfirmationResult
} from '@firebase/auth-types';
import firebase from 'firebase';

import { voidPromise } from './mockUtils';
import { UserClaim } from '../useAuthClaim';

import { authenticatedUserInfo} from './startingData';

const authenticatedIdTokenResult: IdTokenResult = {
    token: 'mock_token',
    expirationTime: '0',
    authTime: '0',
    issuedAtTime: '0',
    signInProvider: 'mock',
    signInSecondFactor: 'mock',
    claims: {'hasCalendarAccess': false, 'hasAdminAccess': false},
}

const authenticatedCredential: AuthCredential = {
    providerId: 'mock',
    signInMethod: 'mock',
    toJSON: () => { return {providerId: 'mock', signInMethod: 'mock'}},
}

const mockUserCredential: UserCredential = {
    credential: authenticatedCredential,
    user: null,
}

const mockConfirmationResult: ConfirmationResult = {
    confirm: async (verificationString) => mockUserCredential,
    verificationId: 'mock',
}

const mockMultiFactorUser: MultiFactorUser = {
    enrolledFactors: [],
    enroll: voidPromise,
    getSession: async () => {return {}},
    unenroll: voidPromise,
}

const mockUser: User = {
    // Configurable
    ...authenticatedUserInfo,
    emailVerified: true,
    email: authenticatedUserInfo.email,
    isAnonymous: false,
    metadata: {},
    phoneNumber: authenticatedUserInfo.phoneNumber,
    providerData: [],
    refreshToken: 'mockRefreshToken',
    tenantId: null,
    
    // Data functions
    getIdToken: async () => authenticatedIdTokenResult.token,
    getIdTokenResult: async () => authenticatedIdTokenResult,
    
    // Dummy functions
    multiFactor: mockMultiFactorUser,
    delete: voidPromise,
    linkAndRetrieveDataWithCredential: async (credential) => {return {credential, user: null}},
    linkWithCredential: async (credential) => {return {credential, user: null}},
    linkWithPhoneNumber: async (phone, verifier) => mockConfirmationResult,
    linkWithPopup: async (provider) => mockUserCredential,
    linkWithRedirect: voidPromise,
    reauthenticateAndRetrieveDataWithCredential: async (cred) => mockUserCredential,
    reauthenticateWithCredential: async (cred) => mockUserCredential,
    reauthenticateWithPhoneNumber: async (phone, verifier) => mockConfirmationResult,
    reauthenticateWithPopup: async (provider) => mockUserCredential,
    reauthenticateWithRedirect: voidPromise,
    reload: voidPromise,
    sendEmailVerification: voidPromise,
    toJSON: () => {return{}},
    unlink: async (provider) => {return ({} as User)}, // Most of these are dodgy, but this is particularly dodgy
    updateEmail: voidPromise,
    updatePassword: voidPromise,
    updatePhoneNumber: voidPromise,
    updateProfile: voidPromise,
    verifyBeforeUpdateEmail: voidPromise,
}

export const authUserState: [User, boolean, firebase.auth.Error | null] = [mockUser, false, null];

const mockClaim: UserClaim = {
    hasCalendarAccess: false,
    hasAdminAccess: false,
}

export const claimState: [UserClaim, boolean, firebase.auth.Error | null] = [mockClaim, false, null]