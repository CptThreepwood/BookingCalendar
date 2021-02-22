import React from 'react';
import * as CSS from 'csstype';
import { useMediaQuery, MediaQueryAllQueryable } from 'react-responsive';

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

export function ConditionalImage(image: string, query: Partial<MediaQueryAllQueryable>, active: boolean) {
    const result = useMediaQuery(query);

    if (!result) return null
    return (<div key={image} className={active ? "slide active" : "slide"} style={fullscreenStyle(image)}></div>)
}