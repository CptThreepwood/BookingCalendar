import React from 'react';
import CSS from 'csstype';

import { Box } from '@material-ui/core';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Navigation } from './Navigation';
import { AccountPage } from './Account';
import { BookingPage } from './Bookings';
import { CalendarPage } from './Calendar';

import * as ROUTES from './constants/routes';

import * as BackgroundImage from './Images/Slideshow/Bird';

function fullscreenStyle(imageSrc: string): CSS.Properties {
    return {
        height: "100vh", width: "100vw", margin: 0,
        backgroundImage: `url(${imageSrc})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        position: "fixed",
    };
  }

export function AuthenticatedView() {
    return (
      <BrowserRouter>
        <Box display="flex" flexDirection="column" height="100vh" style={fullscreenStyle(BackgroundImage.w1920_1200)}>
          <Navigation/>
          <Switch>
            <Route path={ROUTES.CALENDAR}>
              <CalendarPage/>
            </Route>
            <Route path={ROUTES.BOOKINGS}>
              <BookingPage/>
            </Route>
            <Route path={ROUTES.ACCOUNT}>
              <AccountPage/>
            </Route>
          </Switch>
        </Box>
      </BrowserRouter>
    )
  }