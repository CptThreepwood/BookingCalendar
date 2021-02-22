import React from 'react';

import {
    Button
} from '@material-ui/core';
 
import { FirebaseContext } from '../../Firebase';
 
export function SignOutButton() {
  const firebase = React.useContext(FirebaseContext);

  return (
    <Button
        color="primary"
        onClick={() => firebase.auth.signOut()}
    >Sign Out</Button>
  )
};