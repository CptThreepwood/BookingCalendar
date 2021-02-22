import React from 'react';

import {
    Typography, Box, Select, MenuItem
} from '@material-ui/core';

import { profileFormElementStyle, profileFormTextStyle } from './styles';

// -------------------------------------------------------------------------------------------
// Select Options Control

interface NumberSelectProps {
    options: SelectOption[],
    current: number,
    loading: boolean,
    onChange: (event: any) => void,
}

function NumberSelect({options, current, loading, onChange}: NumberSelectProps) {
    return (
        <Select
            value={current}
            onChange={onChange}
            disabled={loading || options.length < 2}
        >
            {options.map(option => <MenuItem value={option.value}>{option.name}</MenuItem>)}
        </Select>
    );
}

interface SelectOption {
    name: string,
    value: number,
}

interface PreferenceProps {
    text: string,
    current: number,
    loading: boolean,
    options: SelectOption[],
    commit: (value: number) => void,
}

export function UserPreference({text, current, loading, options, commit}: PreferenceProps) {
    return (
        <Box style={profileFormElementStyle}>
            <Typography style={profileFormTextStyle}>
                {text}
            </Typography>
            <NumberSelect
                current={current} loading={loading} options={options}
                onChange={event => commit(parseInt((event as React.ChangeEvent<HTMLSelectElement>).target.value) || 0)}
            />
        </Box>
    )
}