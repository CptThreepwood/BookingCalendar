import React from 'react';

import { getResolution } from './utils';
import { ConditionalImage } from './ConditionalImage';

import { ImageSet } from '../Images/Slideshow';

export function LandscapeSlide(imageSet: ImageSet, active=false) {
    const images = Object.values(imageSet).map(
        image => {return {image, res: getResolution(image)}}
    ).map(
        ({image, res}, i, arr) => {
            if (i === 0) {
                return ConditionalImage(image, {minWidth: 0, maxWidth: res.width}, active)
            } else if (i === arr.length-1) {
                return ConditionalImage(image, {minWidth: arr[i-1].res.width + 1, maxWidth: undefined}, active)
            }
            return ConditionalImage(image, {minWidth: arr[i-1].res.width + 1, maxWidth: res.width}, active)
        }
    )
    return <React.Fragment> {images} </React.Fragment>
}

export function PortraitSlide(imageSet: ImageSet, active=false) {
    const images = Object.values(imageSet).map(
        image => {return {image, res: getResolution(image)}}
    ).map(
        ({image, res}, i, arr) => {
            if (i === 0) {
                return ConditionalImage(image, {minHeight: 0, maxHeight: res.height}, active)
            } else if (i === arr.length-1) {
                return ConditionalImage(image, {minHeight: arr[i-1].res.height + 1, maxHeight: undefined}, active)
            }
            return ConditionalImage(image, {minHeight: arr[i-1].res.height + 1, maxHeight: res.height}, active)
        }
    )
    return <React.Fragment> {images} </React.Fragment>
}