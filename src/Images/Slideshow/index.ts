import * as AlongBeach from './AlongBeach';
import * as Backyard from './Backyard';
import * as BeachView from './BeachView';
import * as Bird from './Bird';
import * as DunePath from './DunePath';
import * as Front from './Front';
import * as FrontBeach from './FrontBeach';
import * as Lighthouse from './Lighthouse';
import * as PierAlong from './PierAlong';
import * as PierBelow from './PierBelow';
import * as RockIsland from './RockIsland';
import * as RockWave from './RockWave';
import * as SeaWall from './SeaWall';
import * as Seaweed from './Seaweed';
import * as TownView from './TownView';
import * as Tunnel from './Tunnel';

export interface ImageSet {
    w960_600?: string
    w1440_900?: string
    w1920_1200?: string
}

export const images: Record<string, ImageSet> = {
    AlongBeach, Backyard, BeachView, Bird,
    DunePath, Front, FrontBeach, Lighthouse,
    PierAlong, PierBelow, RockIsland, RockWave,
    SeaWall, Seaweed, TownView, Tunnel
}