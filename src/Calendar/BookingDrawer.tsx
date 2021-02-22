import React from 'react';
import moment from 'moment';

import {
    Grid, Box,
    TextField,
    IconButton,
    Card, CardContent,
    Popper,
    PopperProps,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import './mui_overrides.css'

import { DebugError } from '../Errors';
import { InputOptions } from './types';
import { UserPublicProfile } from '../Firebase/types';
import { UserContext, FirebaseContext } from '../Firebase';

// —-------------------------------------------------------------------------------------
// Drawer Components

interface UserSelectProps {
    user: UserPublicProfile | null,
    users: UserPublicProfile[],
    setUser: React.Dispatch<React.SetStateAction<UserPublicProfile | null>>,
    disabled: boolean,
}

function CustomPopper(props: PopperProps) {
    return <Popper {...props} style={{width: "fit-content"}} placement="top-start"/>
}

const useStyles = makeStyles({
    option: {
        '&[data-focus=true]': {
            'background-color': '#d3d3d3',
        }
    }
})

function UserSelect({user, users, setUser, disabled}: UserSelectProps) {
    const classes = useStyles();

    return (
        <Box display="flex" justifyContent="center" alignItems="center" width="95%">
            <Autocomplete
                id="user-select"
                value={user}
                options={users}
                disabled={users.length === 0 || disabled}

                fullWidth
                clearOnBlur
                selectOnFocus
                handleHomeEndKeys

                forcePopupIcon={false}
                classes={{ option: classes.option }}
                PopperComponent={CustomPopper}
                getOptionLabel={(user) => `${user.displayName} (${user.email})`}
                renderInput={(params) => <TextField {...params} label="User" margin="dense"/>}
                onChange={(e: any, newValue: UserPublicProfile | null) => setUser(newValue)}
            />
        </Box>
    )
}

interface DateDisplayProps {
    date: moment.Moment | null,
    label: string,
    focused: boolean,
}

function DateDisplay({date, label, focused}: DateDisplayProps) {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" width="95%">
            <TextField
                label={label}
                disabled={focused}
                type="string"
                value={date?.format('Do [of] MMM, YYYY') || ""}
                margin="dense"
            />
        </Box>
    )
}

// —-------------------------------------------------------------------------------------
// Drawer Container

interface BookingDrawerProps {
    open: boolean,
    user: UserPublicProfile,
    start: (moment.Moment | null),
    end: (moment.Moment | null),
    focus: InputOptions,
    onConfirmBooking: (nBeds: number, userID?: string) => void,
    onCancel: () => void,
}

export function BookingDrawer({open, user, start, end, focus, onConfirmBooking, onCancel}: BookingDrawerProps) {
    const [nBeds, setNBeds] = React.useState(1);
    const firebase = React.useContext(FirebaseContext);
    const authenticatedUser = React.useContext(UserContext);

    const [allUsers, allUsersLoading, allUsersError] = firebase.database.usePublicProfiles();
    const [selectedUser, setUser] = React.useState<UserPublicProfile | null>(() => user);

    React.useEffect(() => setUser(user), [user]);

    if (authenticatedUser.userClaim.hasAdminAccess && allUsersError) {
        return DebugError(allUsersError);
    }

    return (
        <Card
            hidden={!open}
            style={{backgroundColor: "#d3d3d3"}}
        >
            <CardContent style={{maxWidth: '800px', margin: 'auto'}}>
                <Grid container justify="center" alignItems="center">
                    <Grid item xs={12} sm={10}>
                        <Grid container justify="center" alignItems="center">
                            {authenticatedUser.userClaim.hasAdminAccess ? (
                                <Grid item xs={12} sm={3}>
                                    <UserSelect
                                        user={selectedUser}
                                        users={allUsers || []}
                                        setUser={setUser}
                                        disabled={allUsersLoading}
                                    />
                                </Grid>
                            ) : null}
                            <Grid item xs={12} sm={3}>
                                <DateDisplay date={start} label={"Arriving"} focused={focus === "endDate"}/>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <DateDisplay date={end} label={"Leaving"} focused={focus === "startDate"}/>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <Box display="flex" justifyContent="center" alignItems="center" width="95%">
                                    <TextField
                                        label="# Beds" type="number" margin="dense"
                                        value={nBeds} onChange={event => setNBeds(parseInt(event.target.value))}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Grid container justify="center" alignItems="center">
                            <Grid item xs>
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <IconButton
                                        color="primary"
                                        disabled={start === null || end === null}
                                        onClick={() => onConfirmBooking(nBeds, selectedUser?.ID)}
                                    >
                                        <CheckCircleIcon fontSize="large"/>
                                    </IconButton>
                                </Box>
                            </Grid>
                            <Grid item xs>
                                <Box display="flex" justifyContent="center" alignItems="center">
                                    <IconButton
                                        color="secondary"
                                        onClick={() => onCancel()}
                                    >
                                        <CancelIcon fontSize="large"/>
                                    </IconButton>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}