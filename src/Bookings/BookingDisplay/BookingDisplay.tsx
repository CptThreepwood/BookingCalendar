import React from 'react';

import { DebugError } from '../../Errors';
import { FirebaseContext, Booking, UserProfile } from '../../Firebase';

import { BookingCard } from './BookingCard';

function decorateBookings(user: UserProfile | null | undefined): Booking[] {
    if (user === undefined || user === null) return [];
    return user.bookings.map( (booking) => {
        return {
            ...booking,
            userID: user.ID,
            email: user.email,
            displayName: user.settings.displayName,
        }
    });
}

function useBookings(all = false): [Booking[], boolean, any] {
    const firebase = React.useContext(FirebaseContext);

    if (!all) {
        const [user, userLoading, userError] = firebase.database.useUserProfile();
        return [user?.bookings || [], userLoading, userError];
    }
    const [users, userLoading, userError] = firebase.database.useUserProfiles();

    return [
        (users || []).reduce(
            (acc: Booking[], user) => [...acc, ...decorateBookings(user)], []
        ), userLoading, userError
    ]
}

interface BookingDisplayProps {
    all?: boolean
}

export function BookingDisplay({all = false}: BookingDisplayProps) {
    const firebase = React.useContext(FirebaseContext);
    const [bookings, loading, error] = useBookings(all);

    function removeBooking(booking: Booking) {
        return firebase.database.removeBooking(booking);
    }

    if ( error ) {
        return DebugError(error)
    }
    return (
        <BookingCard
            bookings={bookings}
            loading={loading}
            removeBooking={removeBooking}
        />
    )
}