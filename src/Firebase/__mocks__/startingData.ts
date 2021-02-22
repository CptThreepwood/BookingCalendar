import { UserInfo } from '@firebase/auth-types';

import { UserProfile, AllYears } from '../types';

export const LOADING = false;

// -------------------------------------------------------------------------------------------
// Users

export const mockUsers: UserProfile[] = [
    {
        ID: 'mockID_0',
        email: 'alex@example.com',
        settings: {
            displayName: 'Alex Example',
            startOfWeek: 1,
            notificationType: 0
        },
        bookings: []
    }, {
        ID: 'mockID_1',
        email: 'sam@example.com',
        settings: {
            displayName: 'Sam Smith',
            startOfWeek: 0,
            notificationType: 0,
        },
        bookings: []
    }, {
        ID: 'mockID_2',
        email: 'taylor@example.com',
        settings: {
            displayName: 'Taylor Jones',
            startOfWeek: 6,
            notificationType: 0,
        },
        bookings: []
    },
]

// -------------------------------------------------------------------------------------------
// Authenticated User Info

export const authenticatedUserInfo: UserInfo = {
    displayName: mockUsers[0].settings.displayName,
    email: mockUsers[0].email,
    phoneNumber: '0491 570 006',
    photoURL: null,
    providerId: 'mock',
    uid: 'mockID_0',
}

// -------------------------------------------------------------------------------------------
// Calendar

export  const mockCalendar: AllYears = {

}