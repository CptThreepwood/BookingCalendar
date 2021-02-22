import React from 'react';
import moment from 'moment';

import {
    Button,
    Card, CardHeader,
    CardContent, CardActions
} from '@material-ui/core';

import { Booking } from './types';
import { BookingList } from './BookingList';

function toggleCheck(booking: Booking | undefined, currentChecks: Booking[]): Booking[] {
    if (booking === undefined) { return currentChecks}
    const index = currentChecks.findIndex(b => b.ID === booking.ID);
    const newChecked = [...currentChecks];

    if (index !== -1) {
        newChecked.splice(index, 1);
    } else {
        newChecked.push(booking);
    }
    return newChecked;
}

interface BookingCardProps {
    bookings: Booking[],
    loading: boolean,
    removeBooking: (booking: Booking) => Promise<void>
}

export function BookingCard({bookings, loading, removeBooking}: BookingCardProps) {
    const [checkedBookings, setCheckedBookings] = React.useState<Booking[]>([]);

    const now = moment();

    function sortBookings(bookings: Booking[]): Booking[] {
        return bookings.filter(
            booking => booking.endDate > now
        ).sort(
            (a, b) => (a.startDate.isBefore(b.startDate) ? -1 : 1)
        )
    }

    function deleteSelected() {
        if (checkedBookings === undefined) { return }
        return Promise.all(checkedBookings.map(removeBooking)).then(
            () => setCheckedBookings([])
        );
    }

    return (
        <Card>
            <CardHeader
                title="Upcoming Bookings"
            />
            <CardContent>
                <BookingList
                    bookings={(sortBookings(bookings))}
                    checkedBookings={checkedBookings}
                    handleCheck={(booking: Booking) => setCheckedBookings(
                        currentChecks => toggleCheck(booking, currentChecks)
                    )}
                    loadingBookings={loading}
                    deleteBooking={removeBooking}
                />
            </CardContent>
            <CardActions>
                <Button
                    color="secondary"
                    onClick={() => deleteSelected()}
                    disabled={checkedBookings.length === 0}
                >Delete Selected</Button>
            </CardActions>
        </Card>
    );
}