import React from 'react';
import * as CSS from 'csstype';
import * as moment from 'moment';

import { ModifiersShape } from 'react-dates';

import { Tooltip } from '@material-ui/core';

import { BookingTooltip } from './BookingTooltip';
import { BedsBooked } from '../Firebase/types';

function hasColourModifier(modifiers: ModifiersShape) {
    return (
        modifiers.has('blocked-calendar') ||
        modifiers.has('selected-span') ||
        modifiers.has('selected-start') ||
        modifiers.has('selected-end') ||
        modifiers.has('before-hovered-end') ||
        // modifiers.has('no-selected-start-before-selected-end') ||
        // modifiers.has('selected-start-in-hovered-span') ||
        modifiers.has('selected-end-in-hovered-span') ||
        // modifiers.has('selected-start-no-selected-end') ||
        modifiers.has('selected-end-no-selected-start')
    );
}

const BOOKING_DAY_STYLE: CSS.Properties = {
    height: '100%', width: '100%',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
}

export function BookingDay(date: moment.Moment, modifiers: ModifiersShape, bookings: BedsBooked[] | undefined) {
    if (bookings === undefined) {
        return date.format('D');
    }

    const bedsBooked = bookings.reduce(
        (acc, cur) => acc + cur.nBeds, 0
    );
    const bedClass = `BedsBooked__${bedsBooked > 8 ? 8 : bedsBooked}`;
    const usersBooked = new Set(bookings.map(booking => booking.userID));

    return (
        <Tooltip disableFocusListener title={BookingTooltip(Array.from(usersBooked))}>
            <div className={hasColourModifier(modifiers) ? '' : bedClass} style={BOOKING_DAY_STYLE}>
                <p style={{margin: '0'}}><strong>{date.format('D')}</strong></p>
                <p style={{margin: '0', fontSize: '10px'}}>{bedsBooked}</p>
            </div>
        </Tooltip>
    )
} 