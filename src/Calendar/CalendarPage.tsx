import React from 'react';
import * as CSS from 'csstype';
import moment from 'moment';

import 'react-dates/initialize';
import { DayPickerRangeController, ModifiersShape } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import './react_dates_overrides.css'

import { Box, Container } from '@material-ui/core';

import { FirebaseContext } from '../Firebase';
import { BookingDay } from './BookingDay';
import { BookingDrawer } from './BookingDrawer';
import { InputOptions } from './types';
import { bookingAtKey } from './utils';
import { DebugError } from '../Errors';

// Some components overflow the div for some reason
// This is a hacky solution until I work it out
const clipOverflow: CSS.Properties = {
    overflow: "hidden",
    // padding: "1px",
}

type DateState = {
    startDate: moment.Moment | null,
    endDate: moment.Moment | null,
}

const NUMBER_OF_MONTHS = 4;
const NO_SELECTION: DateState = {startDate: null, endDate: null}

function CalendarLoading() {
    return <div style={{
        height: '100%', width: '100%',
        position: 'absolute', left: 0, zIndex: 10,
        backgroundColor: "#e5e5e5", opacity: 0.7}
    }/>
}

export function CalendarPage() {
    const startMonth = moment().subtract(1, 'M');

    const [dateState, setDateState] = React.useState<DateState>(NO_SELECTION);
    const [focusedInput, setFocusedInput] = React.useState<InputOptions>('startDate')

    const firebase = React.useContext(FirebaseContext);
    const [bookingData, dataLoading, dataError] = firebase.database.useCalendar();
    const [profileData, profileLoading, profileError] = firebase.database.useUserProfile();

    function renderBookingDays(date: moment.Moment, modifiers: ModifiersShape) {
        const {year, month, day} = {year: date.year(), month: date.month(), day: date.date()};
        const bookings = bookingAtKey(bookingData, year, month, day);

        return BookingDay(date, modifiers, bookings);
    }

    function confirmBooking(nBeds: number, userID?: string) {
        if (dateState.startDate !== null && dateState.endDate !== null) {
            firebase.database.makeBooking({
                startDate: dateState.startDate,
                endDate: dateState.endDate,
                nBeds,
            }, userID);
            clearSelection();
        }
    }

    function isDayBlocked(day: moment.Moment): boolean {
        return moment().startOf('day').isAfter(day);
    }

    function clearSelection() {
        setDateState(NO_SELECTION);
    }

    if (dataError) {
        return DebugError(dataError);
    } else if (profileError) {
        return DebugError(profileError);
    }

    return (
        <Container style={{flexGrow: 1}}>
            { (dataLoading || profileLoading) ? CalendarLoading() : null }
            <Box display="flex" flexDirection="column" height="calc(100% - 20px)" maxWidth="800px" marginTop="10px" margin="auto">
                <Box flexGrow={1} style={{...clipOverflow}}>
                    <DayPickerRangeController
                        startDate={dateState.startDate}
                        endDate={dateState.endDate}
                        onDatesChange={setDateState}
                        focusedInput={focusedInput}
                        onFocusChange={(input) => setFocusedInput(input || 'startDate')}
                        initialVisibleMonth={() => startMonth}
                        numberOfMonths={NUMBER_OF_MONTHS}
                        orientation={"verticalScrollable"}
                        minimumNights={1}
                        renderDayContents={renderBookingDays}
                        isDayBlocked={isDayBlocked}
                        firstDayOfWeek={profileData?.settings.startOfWeek || 0}
                    />
                </Box>
                <Box>
                    <BookingDrawer
                        open={dateState.startDate !== null || dateState.endDate !== null}
                        start={dateState.startDate}
                        end={dateState.endDate}
                        onConfirmBooking={confirmBooking}
                        onCancel={clearSelection}
                        focus={focusedInput}
                        user={{
                            ID: profileData?.ID || '',
                            email: profileData?.email || '',
                            displayName: profileData?.settings.displayName || 'Unknown',
                        }}
                    />
                </Box>
            </Box>
        </Container>
    )
}