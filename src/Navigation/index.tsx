import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import {
  BottomNavigation,
  BottomNavigationAction
} from '@material-ui/core';
import ViewListIcon from '@material-ui/icons/ViewList';
import DateRangeIcon from '@material-ui/icons/DateRange';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import * as ROUTES from '../constants/routes';
import { UserContext } from '../Firebase';
 
export function Navigation() {
    const history = useHistory();
    const location = useLocation();
    const authenticatedUser = React.useContext(UserContext);

    function changeNav(newValue: string) {
        history.push(newValue);
    }

    return (
        <BottomNavigation
            value={location.pathname}
            onChange={(_, newValue) => changeNav(newValue)}
            showLabels
        >
            <BottomNavigationAction
                label="Calendar"
                disabled={!authenticatedUser.userClaim.hasCalendarAccess}
                value={ROUTES.CALENDAR}
                icon={<DateRangeIcon/>}
            />
            <BottomNavigationAction
                label="Account"
                value={ROUTES.ACCOUNT}
                icon={<AccountCircleIcon/>}
            />
            {
                authenticatedUser.userClaim.hasAdminAccess ? (
                    <BottomNavigationAction
                        label="Bookings"
                        value={ROUTES.BOOKINGS}
                        icon={<ViewListIcon/>}
                    />
                ) : null
            }
        </BottomNavigation>
    )
};
