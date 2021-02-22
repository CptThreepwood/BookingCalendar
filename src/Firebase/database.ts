import moment from 'moment';
import firebase from 'firebase';
import { User } from '@firebase/auth-types';
// import { Database } from '@firebase/database-types';

import { useObjectVal } from 'react-firebase-hooks/database';

import {
    AllYears, Booking, PreBooking, BedsBooked,
    DatabaseUserProfile, UserProfile, UserPublicProfile, UserSettings,
    booking2Database, database2UserProfile, userSettings2Database,
} from './types';
import { daysBetween } from './utils';

// -------------------------------------------------------------------------------------------
// Constants

const CALENDAR_ROOT = 'calendar';
const USER_ROOT = 'users';

const buildKey = (...args: string[]) => args.join('/');
const dateKey = (date: moment.Moment) => buildKey(
    CALENDAR_ROOT, date.year().toString(), date.month().toString(), date.date().toString()
);
const userKey = (userID: string) => buildKey(USER_ROOT, userID);
const userSettingsKey = (userID: string) => buildKey(userKey(userID), 'settings');
const userBookings = (userID: string) => buildKey(userKey(userID), 'bookings');

// -------------------------------------------------------------------------------------------
// UserProfile Functions

export function useUserProfile(
    userID: string | undefined, database: firebase.database.Database
): [UserProfile | undefined | null, boolean, any] {
    const [data, loading, error] = useObjectVal<DatabaseUserProfile>(database.ref(userKey(userID || '')));
    return [(data === undefined || data === null) ? data : database2UserProfile(data, userID), loading, error]
}

export function useUserProfiles(
    database: firebase.database.Database
): [UserProfile[] | undefined | null, boolean, any] {
    const [data, loading, error] = useObjectVal<Record<string, DatabaseUserProfile>>(database.ref(USER_ROOT));
    if (data === undefined || data === null) { return [data, loading, error]; }
    return [Object.entries(data).map(
        ([id, profile]) => database2UserProfile(profile, id)
    ), loading, error]
}

export function usePublicProfile(
    userID: string, database: firebase.database.Database
): [UserPublicProfile | undefined | null, boolean, any] {
    const [name, nameLoading, nameError] = useObjectVal<string>(
        database.ref(buildKey(userSettingsKey(userID || ''), 'displayName'))
    );
    const [email, emailLoading, emailError] = useObjectVal<string>(
        database.ref(buildKey(userKey(userID || ''), 'email'))
    );
    return [{
        ID: userID, email: email, displayName: name,
    }, emailLoading && nameLoading, emailError || nameError];
}

export function usePublicProfiles(
    database: firebase.database.Database
): [UserPublicProfile[] | undefined | null, boolean, any] {
    const [data, loading, error] = useObjectVal<Record<string, DatabaseUserProfile>>(database.ref(USER_ROOT));
    if (data === undefined || data === null) { return [data, loading, error]; }
    return [Object.keys(data).map(key => {
        return { ID: key, displayName: data[key].settings.displayName, email: data[key].email }
    }).sort((a, b) => a.displayName.localeCompare(b.displayName)), loading, error];
}

export async function updateUserSettings(
    newSettings: Partial<UserSettings>, user: User | null, database: firebase.database.Database
): Promise<void> {
    if (user === null) { return }

    const databaseUserSettings = userSettings2Database(newSettings);
    const updateObject = Object.entries(databaseUserSettings).reduce(
        (acc: Record<string, string>, [key, val]) => {
            if (val !== undefined) { acc[key] = val; }
            return acc;
        }, {}
    )

    if (newSettings.displayName === undefined) {
        return database.ref(userSettingsKey(user.uid)).update(updateObject)
    }
    return user.updateProfile({
        displayName: newSettings.displayName
    }).then(
        () => database.ref(userSettingsKey(user.uid)).update(updateObject)
    );
}

// -------------------------------------------------------------------------------------------
// Calendar Functions

export function useCalendar(database: firebase.database.Database) {
    return useObjectVal<AllYears>(database.ref(CALENDAR_ROOT));
}

async function getBookings(
    date: moment.Moment, database: firebase.database.Database
): Promise<Record<string, BedsBooked>> {
    return database.ref(dateKey(date)).once('value').then(snapshot => snapshot.val());
}

async function saveBookingToCalendar(
    userID: string, booking: Booking, database: firebase.database.Database
): Promise<void[]> {
    return Promise.all(daysBetween(booking.startDate, booking.endDate).map(
        date => database.ref(dateKey(date)).push().set(
            {userID: userID, nBeds: booking.nBeds, bookingID: booking.ID}
        )
    ));
}

// -------------------------------------------------------------------------------------------
// Booking Functions

async function saveBookingToUser(
    userID: string,
    booking: PreBooking,
    database: firebase.database.Database
): Promise<string | null> {
    const bookingRef = database.ref(userBookings(userID)).push();
    return bookingRef.set(booking2Database({...booking, ID: (bookingRef.key || '')})).then(
        () => bookingRef.key
    );
}

export async function makeBooking(
    booking: PreBooking, userID: string | null, database: firebase.database.Database
): Promise<void[]> {
    if (userID === null) { return []; }
    return saveBookingToUser(userID, booking, database).then(
        bookingID => {
            if (bookingID === null) { throw Error('No booking ID returned'); }
            return saveBookingToCalendar(userID, {...booking, ID: bookingID}, database);
        }
    );
}

export async function removeBooking(
    booking: Booking, userID: string | null, database: firebase.database.Database
): Promise<void> {
    if (userID === null) { return }

    const daysBooked = daysBetween(booking.startDate, booking.endDate);

    return Promise.all(
        daysBooked.map(
            // For each date, get all database keys for bookings with matching booking IDs
            // THere should only be one matching booking for each date, but just in case get them all
            date => getBookings(date, database).then(
                bookings => Object.entries(bookings).filter(
                    ([_, val]) => val.bookingID === booking.ID && val.userID === userID
                ).map(
                    ([key, _]) => `${dateKey(date)}/${key}`
                )
            )
        )
    ).then(
        // Flatten database keys to a single array and remove them
        (databaseKeys) => databaseKeys.reduce(
            (acc, cur) => acc.concat(cur), []
        ).map(
            databaseKey => database.ref(databaseKey).remove()
        )
    ).then(
        // Finally, clear the booking from the user
        () => database.ref(`${userBookings(userID)}/${booking.ID}`).remove()
    );
}
