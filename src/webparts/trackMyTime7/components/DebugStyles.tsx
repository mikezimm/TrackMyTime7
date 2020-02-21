import * as React from 'react';

import { Pivot, PivotItem, PivotLinkSize, PivotLinkFormat, IPivotStyles, IPivotStyleProps } from 'office-ui-fabric-react/lib/Pivot';

export const myLilac = "#EBD0FF";
export const myGreen = "#BBFFB0";
export const myYellow = "#FFFAB0";
export const myBlue = "#B0DEFF";
export const myOrange = "#FFDCB0";
export const myRed = "#FFC1B0";



export function mainPivot(debugMode, display) {
    let ret = {
        root: {
            backgroundColor: debugMode ? myBlue : 'transparent',
            borderColor: debugMode ? '#2566CA' : 'transparent',
            //...(cardSectionOrItemStyles.root as object)
          }
    };
    return ret;
}

export function projectList(debugMode, display) {
    let ret = {
        root: {
            backgroundColor: debugMode ? myYellow : 'transparent',
            borderColor: debugMode ? '#2566CA' : 'transparent',
            //...(cardSectionOrItemStyles.root as object)
          }
    };
    return ret;
}

export function itemList(debugMode, display) {
    let ret = {
        root: {
            backgroundColor: debugMode ? myGreen : 'transparent',
            borderColor: debugMode ? '#2566CA' : 'transparent',
            //...(cardSectionOrItemStyles.root as object)
          }
    };
    return ret;
}

export function entryChoice(debugMode, display) {
    let ret = {
        root: {
            backgroundColor: debugMode ? myLilac : 'transparent',
            borderColor: debugMode ? '#2566CA' : 'transparent',
            //...(cardSectionOrItemStyles.root as object)
          }
    };
    return ret;
}