import React from 'react';

import {
    ListItem,
    ListItemText, ListItemIcon,
    ListItemSecondaryAction,
    Checkbox, IconButton,
} from '@material-ui/core';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'; 

import { Booking } from './types';

function dateFormat(date: moment.Moment) {
    return date.format('dddd, Do [of] MMM');
}

interface BookingElementProps {
    booking: Booking,
    checked: boolean,
    handleCheck: () => void,
    handleDelete: () => void,
}

export function BookingListElement({booking, checked, handleCheck, handleDelete}: BookingElementProps) {
    const bedsText = `${booking.nBeds} ${booking.nBeds === 1 ? 'bed' : 'beds'}`;
    const userText = (booking.displayName && booking.email) ? `${booking.displayName} (${booking.email}) ` : ``;
    const dateText = `from ${dateFormat(booking.startDate)} to ${dateFormat(booking.endDate)}`;
    const bookingText = `${userText}${bedsText} ${dateText}`;

    return (
        <ListItem key={booking.ID} role={undefined} dense button onClick={handleCheck}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': `checkbox-list-label-${booking.ID}` }}
              />
            </ListItemIcon>
            <ListItemText id={`${booking.ID}`} primary={bookingText}/>
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="comments" onClick={() => {handleDelete();}}>
                <DeleteForeverIcon />
              </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    )
}