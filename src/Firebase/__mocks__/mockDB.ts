// A mock version of the firebase backing the app with just some local objects
// A more serious version of this would use Redux

import { v4 as uuidv4 } from 'uuid';
import {
    User
} from '@firebase/auth-types';

import {
    AllYears,
    PreBooking, Booking, BedsBooked,
    UserProfile, UserPublicProfile,
    UserSettings
} from '../types';
import { daysBetween } from '../utils';

import { mockUsers, LOADING, mockCalendar } from './startingData';

export function useUserProfile(userID: string | undefined): [UserProfile | undefined | null, boolean, any] {
    const data = mockUsers.find(item => item.ID === userID);
    return [data, LOADING, null]
}

export function useUserProfiles(): [UserProfile[] | undefined | null, boolean, any] {
    const data = mockUsers;
    return [data, LOADING, null]
}

export function usePublicProfiles(): [UserPublicProfile[] | undefined | null, boolean, any] {
    return [
        mockUsers.map(item => {
            return {ID: item.ID || '', displayName: item.settings.displayName, email: item.email}
        }), LOADING, null
    ];
}

export function usePublicProfile(userID: string): [UserPublicProfile | undefined | null, boolean, any] {
    const item = mockUsers.find(item => item.ID === userID);
    return [
        item === undefined ? item : {
            ID: userID, email: item.email, displayName: item.settings.displayName,
        }, LOADING, null
    ];
}

export async function updateUserSettings(
    newSettings: Partial<UserSettings>, user: User | null
): Promise<void> {
    if (user === null) { return }
    else if (mockUsers.find(item => item.ID === user.uid) === undefined) { return }

    const index = mockUsers.findIndex(item => item.ID === user.uid)
    if (newSettings.displayName === undefined) {
        mockUsers[index].settings = {...mockUsers[index].settings, ...newSettings};
    }
    return user.updateProfile({
        displayName: newSettings.displayName
    }).then(
        () => {
            mockUsers[index].settings = {...mockUsers[index].settings, ...newSettings};
        }
    );
}

// -------------------------------------------------------------------------------------------
// Booking Functions

export function useCalendar(): [AllYears | undefined | null, boolean, any] {
    return [mockCalendar, LOADING, null]
}

async function saveBookingToUser(
    userID: string,
    booking: PreBooking,
): Promise<string | null> {
    const bookingID = uuidv4();
    const index = mockUsers.findIndex(item => item.ID === userID);
    if (index === -1) return null;
    mockUsers[index].bookings = [...mockUsers[index].bookings, ({...booking, ID: bookingID})]
    return bookingID;
}

async function saveBookingToCalendar(userID: string, booking: Booking): Promise<void[]> {
    return Promise.all(daysBetween(booking.startDate, booking.endDate).map(
        async (date) => {
            if (mockCalendar[date.year()] === undefined) {
                mockCalendar[date.year()] = {}
            }
            if (mockCalendar[date.year()][date.month()] === undefined) {
                mockCalendar[date.year()][date.month()] = {}
            }
            if (mockCalendar[date.year()][date.month()][date.date()] === undefined) {
                mockCalendar[date.year()][date.month()][date.date()] = {}
            }
            mockCalendar[date.year()][date.month()][date.date()][uuidv4()] = {
                userID: userID, nBeds: booking.nBeds, bookingID: booking.ID
            }
            return;
        }
    ));
}

export async function makeBooking(
    booking: PreBooking, user: string | null
): Promise<void[]> {
    if (user === null) { return []; }
    return saveBookingToUser(user, booking).then(
        bookingID => {
            if (bookingID === null) { throw Error('No booking ID returned'); }
            return saveBookingToCalendar(user, {...booking, ID: bookingID});
        }
    );
}

async function getBookings(
    date: moment.Moment
): Promise<Record<string, BedsBooked>> {
    return mockCalendar[date.year()][date.month()][date.day()];
}

export async function removeBooking(booking: Booking, userID: string | null): Promise<void> {
    if (userID === null) { return }

    const daysBooked = daysBetween(booking.startDate, booking.endDate);

    return Promise.all(
        daysBooked.map(
            // For each date, get all database keys for bookings with matching booking IDs
            // THere should only be one matching booking for each date, but just in case get them all
            date => getBookings(date).then(
                bookings => Object.entries(bookings).filter(
                    ([_, val]) => val.bookingID === booking.ID
                ).map(
                    ([key, _]) => {
                        delete mockCalendar[date.year()][date.month()][date.date()][key];
                        if (Object.keys(mockCalendar[date.year()][date.month()][date.date()]).length === 0) {
                            delete mockCalendar[date.year()][date.month()][date.date()];
                        }
                        if (Object.keys(mockCalendar[date.year()][date.month()]).length === 0) {
                            delete mockCalendar[date.year()][date.month()];
                        }
                        if (Object.keys(mockCalendar[date.year()]).length === 0) {
                            delete mockCalendar[date.year()];
                        }
                    }
                )
            )
        )
    ).then(
        // Finally, clear the booking from the user
        () => {
            const index = mockUsers.findIndex(item => item.ID === userID);
            mockUsers[index].bookings = mockUsers[index].bookings.filter(b => b.ID !== booking.ID)
        }
    );
}