import React from 'react';

import { useMediaQuery } from 'react-responsive';

import { shuffle } from './utils';
import { PortraitSlide, LandscapeSlide } from './Slide';

import './slideStyles.css';
import {images as slideshowImages, ImageSet} from '../Images/Slideshow';


const DEFAULT_SLIDE_DELAY = 2000;
// Only want this to be shuffled once (is there a better component did mount analogy?)

interface SlideshowProps {
    allowedSlides?: ImageSet[]
}

export function Slideshow({allowedSlides}: SlideshowProps) {
    const portrait = useMediaQuery({orientation: 'portrait'});
    const orientedSlide = portrait ? PortraitSlide : LandscapeSlide;
    const [slides] = React.useState<ImageSet[]>(() => shuffle(allowedSlides || Object.values(slideshowImages)));

    const [currentIndex, setCurrentSlide] = React.useState(0);
    React.useEffect(() => {
        if (currentIndex === slides.length - 1) {
            setTimeout(
                () => setCurrentSlide(0),
                parseInt(process.env.REACT_APP_SLIDE_DELAY || '') || DEFAULT_SLIDE_DELAY
            );
        } else {
            setTimeout(
                () => setCurrentSlide(currentIndex + 1),
                parseInt(process.env.REACT_APP_SLIDE_DELAY || '') || DEFAULT_SLIDE_DELAY
            );
        }
    })

    return (
        <React.Fragment>
            {slides.map((slide, i) => (
                <React.Fragment key={i}>
                    {orientedSlide(slide, i === currentIndex)}
                </React.Fragment>
            ))}
        </React.Fragment>
    );
}