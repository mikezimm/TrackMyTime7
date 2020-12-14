/***
 *    .d888b.  .d88b.  .d888b.  .d88b.          db .d888b.         db   j88D                     
 *    VP  `8D .8P  88. VP  `8D .8P  88.        o88 VP  `8D        o88  j8~88                     
 *       odD' 88  d'88    odD' 88  d'88         88    odD'         88 j8' 88                     
 *     .88'   88 d' 88  .88'   88 d' 88 C8888D  88  .88'   C8888D  88 V88888D                    
 *    j88.    `88  d8' j88.    `88  d8'         88 j88.            88     88                     
 *    888888D  `Y88P'  888888D  `Y88P'          VP 888888D         VP     VP                     
 *                                                                                               
 *                                                                                               
 *    d8888b. d888888b db    db  .d88b.  d888888b      d888888b d888888b db      d88888b .d8888. 
 *    88  `8D   `88'   88    88 .8P  Y8. `~~88~~'      `~~88~~'   `88'   88      88'     88'  YP 
 *    88oodD'    88    Y8    8P 88    88    88            88       88    88      88ooooo `8bo.   
 *    88~~~      88    `8b  d8' 88    88    88            88       88    88      88~~~~~   `Y8b. 
 *    88        .88.    `8bd8'  `8b  d8'    88            88      .88.   88booo. 88.     db   8D 
 *    88      Y888888P    YP     `Y88P'     YP            YP    Y888888P Y88888P Y88888P `8888Y' 
 *                                                                                               
 *                                                                                               
 */

import * as React from 'react';

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
            }};
}

export function styleBGColor(debugMode, part: PaneType ) {
    return { 
        backgroundColor: debugMode ? colorMap[part] : transp,
        borderColor: debugMode ? defBorder : transp,
    };
}
