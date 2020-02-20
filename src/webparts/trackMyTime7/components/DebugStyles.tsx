import * as React from 'react';

import { Pivot, PivotItem, PivotLinkSize, PivotLinkFormat, IPivotStyles, IPivotStyleProps } from 'office-ui-fabric-react/lib/Pivot';


export function mainPivot(debugMode, display) {
    let ret = {
        root: {
            backgroundColor: debugMode ? '#B0DEFF' : 'transparent',
            borderColor: debugMode ? '#2566CA' : 'transparent',
            //...(cardSectionOrItemStyles.root as object)
          }
    };
    return ret;
}