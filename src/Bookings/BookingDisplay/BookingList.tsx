import React from 'react';

import { List, LinearProgress } from '@material-ui/core';

import { Booking } from './types';
import { BookingListElement } from './BookingListElement';

interface BookingListProps {
    bookings: Booking[] | undefined,
    checkedBookings: Booking[],
    loadingBookings: boolean,
    handleCheck: (booking: Booking) => void,
    deleteBooking: (booking: Booking) => void,
}

export function BookingList(
    {bookings, checkedBookings, handleCheck, loadingBookings, deleteBooking}: BookingListProps
) {

    if (bookings === undefined || loadingBookings) {
        return (<LinearProgress/>);
    }

    return (
        <List component="ul" aria-label="available calendars">
            {bookings.map(booking => BookingListElement({
                booking,
                checked: checkedBookings.findIndex(b => b.ID === booking.ID) !== -1,
                handleCheck: () => handleCheck(booking),
                handleDelete: () => deleteBooking(booking),
            }))}
        </List>
    );
}