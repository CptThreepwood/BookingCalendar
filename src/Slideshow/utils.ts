import { basename } from 'path';
import { Resolution } from './types';

// Get Resolution from Filename
export function getResolution(filename: string): Resolution {
    const filenameTokens = basename(filename).split('.')[0].split('_')
    if (filenameTokens.length === 0 || filenameTokens.length === 1) {
        throw new Error(`Invalid filename: ${filename}\nFilename must be in the form {horizontal_resolution}_{vertical_resolution}.*`)
    }
    return {
        width: parseInt(filenameTokens[0]), height: parseInt(filenameTokens[1]),
    }
}

export function shuffle(arr: any[]) {
    return arr.reduce(
        (acc, cur, i) => {
            const r = Math.floor(Math.random() * (acc.length - i));
            const t = acc[acc.length - i - 1];
            acc[acc.length - i - 1] = acc[r];
            acc[r] = t;
            return acc;
        }, arr
    )
}