import React from 'react';

import { Slideshow } from './Slideshow';
import { ImageSet } from './Images/Slideshow';
import { AuthenticationOverlay } from './Authentication';

interface LoginScreenProps {
  slideshowSlides?: ImageSet[]
}

export function LoginScreen({slideshowSlides}: LoginScreenProps) {
    return (
      <React.Fragment>
        <AuthenticationOverlay/>
        <Slideshow allowedSlides={slideshowSlides}/>
      </React.Fragment>
    )
  }