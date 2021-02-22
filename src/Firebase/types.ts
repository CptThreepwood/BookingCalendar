import moment from 'moment';
import app from 'firebase/app';

export type FirebaseAuthenticator = app.auth.Auth;

export interface Booking {
    ID: string,
    nBeds: number,
    startDate: moment.Moment,
    endDate: moment.Moment,

    // Optional fields that only matter if you're looking at other people's bookings
    // I'm looking at you admins
    userID?: string,
    email?: string,
    displayName?: string,
}

export type PreBooking = Pick<Booking, "endDate" | "startDate" | "nBeds">

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6 | null | undefined;

export interface UserSettings {
    displayName: string,
    startOfWeek: DayOfWeek,
    notificationType: number,
}

export interface UserProfile {
    ID?: string,
    email: string,
    settings: UserSettings,
    bookings: Booking[],
}

export interface UserPublicProfile {
    ID: string,
    email?: string,
    displayName?: string,
}

export interface BedsBooked {
    userID: string,
    nBeds: number,
    bookingID: string,
}

export type DayData = Record<string, BedsBooked>;
export type MonthData = Record<number, DayData>;
export type YearData = Record<number, MonthData>;
export type AllYears = Record<number, YearData>;

export interface DatabaseBooking {
    ID: string,
    nBeds: number,
    startDate: string,
    endDate: string,
}

interface DatabaseUserSettings {
    displayName: string,
    startOfWeek: string,
    notificationType: string,
}

export interface DatabaseUserProfile {
    email: string,
    settings: DatabaseUserSettings,
    bookings?: Record<string, DatabaseBooking>,
}

export function database2Booking(booking: DatabaseBooking): Booking {
    return {
        ...booking,
        startDate: moment(booking.startDate),
        endDate: moment(booking.endDate),
    }
}

export function booking2Database(booking: Booking): DatabaseBooking {
    return {
        ...booking,
        startDate: booking.startDate.toISOString(),
        endDate: booking.endDate.toISOString(),
    }
}

function database2DayOfWeek(data: string): DayOfWeek {
    const int = parseInt(data || '0');
    if (int === undefined) {
        return int;
    } else if (int < 0 || int > 6) {
        return null;
    }
    return (int as DayOfWeek);
}

function database2UserSettings(data: Partial<DatabaseUserSettings> | undefined | null): UserSettings {
    return {
        displayName: data?.displayName || '',
        startOfWeek: database2DayOfWeek(data?.startOfWeek || '0'),
        notificationType: parseInt(data?.notificationType || '0') || 0,
    }
}

export function userSettings2Database(data: Partial<UserSettings>): Partial<DatabaseUserSettings> {
    return {
        displayName: data.displayName,
        startOfWeek: data.startOfWeek === undefined ? data.startOfWeek : `${data.startOfWeek}`,
        notificationType: data.notificationType === undefined ? data.notificationType : `${data.notificationType}`,
    }
}

export function database2UserProfile(data: DatabaseUserProfile, ID?: string): UserProfile {
    const bookings: Booking[] = data.bookings === undefined ? [] : Object.values(data.bookings).map(database2Booking);
    return {
        ...data, ID,
        settings: database2UserSettings(data.settings),
        bookings
    }
}