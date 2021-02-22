import moment from 'moment';
import { AllYears, YearData, MonthData, BedsBooked } from '../Firebase/types';

export function dayKey(date: moment.Moment) {
    return `bookings/${date.year()}/${date.month()}/${date.date()}`
}

export function monthKey(date: moment.Moment) {
    return `bookings/${date.year()}/${date.month()}`;
}

export function matchMonth(a: moment.Moment, b: moment.Moment): boolean {
    return monthKey(a) === monthKey(b)
}

export function daysBetween(start: moment.Moment, end: moment.Moment): moment.Moment[] {
    const nDays = end.diff(start, 'days');
    return Array(nDays).fill(0).map((_, i) => {
        const newDay = moment(start);
        newDay.add(i, 'days');
        return newDay;
    });
}

// Get booking data beneath a given key
export function bookingAtKey(
    data: AllYears | undefined | null, year: number, month: number, day: number
): BedsBooked[] | undefined
export function bookingAtKey(
    data: AllYears | undefined | null, year: number, month: number, day: undefined
): MonthData | undefined
export function bookingAtKey(
    data: AllYears | undefined | null, year: number, month: undefined, day: undefined
): YearData | undefined
export function bookingAtKey(
    data: AllYears | undefined | null,
    year: number,
    month: number | undefined,
    day: number | undefined
): BedsBooked[] | MonthData | YearData | undefined {
    if (data === undefined || data === null || data[year] === undefined) { return undefined; }
    if (month === undefined) { return data[year]; }
    if (day === undefined) { return data[year][month]; }
    if (data[year][month] === undefined || data[year][month][day] === undefined) { return undefined };
    return Object.values(data[year][month][day]);
}