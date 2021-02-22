import React from 'react';

import { Slideshow } from './Slideshow';
import { LoginScreen } from './LoginScreen';
import { AuthenticatedView } from './AuthenticatedView';
import { FirebaseContext, UserContext } from './Firebase';
import { DebugError } from './Errors';

import './App.css';

function App() {
  const firebase = React.useContext(FirebaseContext);
  const [user, userLoading, userError] = firebase.auth.useAuthState();
  const [userClaim, claimLoading, claimError] = firebase.auth.useAuthClaim();

  if (userLoading || claimLoading) {
    return (
      // TODO: Some loading animation here
      <Slideshow/>
    )
  } else if (userError || claimError) {
    return DebugError(userError || claimError);
  } else if (!user) {
    return (<LoginScreen/>);
  }

  return (
    <UserContext.Provider value={ {userClaim: userClaim} }>
      <AuthenticatedView/>
    </UserContext.Provider>
  )
}

export default App;
