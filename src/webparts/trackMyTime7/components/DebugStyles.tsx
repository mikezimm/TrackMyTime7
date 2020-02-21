import * as React from 'react';

import { Pivot, PivotItem, PivotLinkSize, PivotLinkFormat, IPivotStyles, IPivotStyleProps } from 'office-ui-fabric-react/lib/Pivot';

export const myLilac = "#EBD0FF";
export const myGreen = "#BBFFB0";
export const myYellow = "#FFFAB0";
export const myBlue = "#B0DEFF";
export const myOrange = "#FFDCB0";
export const myRed = "#FFC1B0";
export const defBorder = '#2566CA';
export const transp = 'transparent';

type PaneType = 'piv' | 'proj' | 'list' | 'entry' | 'command' | 'charts' | 'time' | 'category' | 'projectID' | 'activity';

export const colorMap = {
    piv: myLilac,
    proj: myGreen,
    list: myYellow,
    entry: myBlue,
    command: myOrange,
    charts: myRed,
};

let piv = myLilac;
let proj = myOrange;


export function styleRootBGColor(debugMode, part: PaneType ) {
    return { root: {
                backgroundColor: debugMode ? colorMap[part] : transp,
                borderColor: debugMode ? defBorder : transp,
                //...(cardSectionOrItemStyles.root as object)
            }};
}

export function styleBGColor(debugMode, part: PaneType ) {
    return { 
        backgroundColor: debugMode ? colorMap[part] : transp,
        borderColor: debugMode ? defBorder : transp,
    };
}
