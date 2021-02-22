import React from 'react';

import { LoginScreen } from '../LoginScreen';
import { images } from '../Images/Slideshow';

export default {
    title: 'Sign In Overlay',
    component: LoginScreen,
}

export const LoginScreenAndOverlay = () => (
    <LoginScreen slideshowSlides={[images.Bird, images.Tunnel]}/>
)