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

import { Icon } from 'office-ui-fabric-react/lib/Icon';

export const ColoredLine = ({ color, height }) => ( <hr style={{ color: color, backgroundColor: color, height: height }}/> );

/**
 * 
 * @param title Title string if required, can contain <above> or <below> anywhere to target location.
 * @param styles Styles should be this limited structure:  { color: 'htmlColor', height: 2 }
 */
export function MyDivider ( title: string, styles: any ) {

    let color = styles.color ? styles.color : 'gray';
    let height = styles.height ? styles.height : 1;

    let dividerElements = [];
    let divider = <div><ColoredLine color={ color } height= { height } /></div>;
    let isAbove = title.toLowerCase().indexOf('<above>') > -1 ? true : false ;
    let isBelow = isAbove === false || title.toLowerCase().indexOf('<below>') > -1 ? true : false ;
    let titleElement = title != '' ? <span style={{ fontSize: 28 }}> { title.replace(/\<above\>/gi,'').replace(/\<below\>/gi,'') } </span> : null;

    if ( isAbove && titleElement != null ) { dividerElements.push( titleElement ); }
    dividerElements.push( divider );
    if ( isBelow && titleElement != null ) { dividerElements.push( titleElement ); }

    let thisDivider = <div style={{ width: '100%'}}> { dividerElements.map( e => { return e; }) }</div>;

    return thisDivider;

}

export const defProjectIconStyle = {
    name: null,
    color: null,
    size: null,
    weight: null,
};

export function ProjectTitleElement (item: any) {

        let icon: any = MyIcon(item.projOptions.icon, defProjectIconStyle);
        //const element: any = MySpan(item['projOptions']);

        let fullElement: any = <div> { icon } { null } </div>;
        return fullElement;
}

export function MyIcon(item, defIcon) {

        let iconName = defIcon.name;
        let iconColor = defIcon.color;
        let iconSize = defIcon.size;
        let iconWeight = defIcon.weight;

        if (item != null) {
            if ( item.name ) { iconName = item.name ; }
            if ( item.color ) { iconColor = item.color ; }
            if ( item.size ) { iconSize = item.size ; }
            if ( item.weight ) { iconWeight = item.weight ; }
        }

        iconSize = iconSize == null ? 'large' : iconSize;

        let iconStyles: any = { root: {
            fontSize: iconSize,
            fontWeight: iconWeight,
            color: iconColor,
            paddingRight: '10px',
        }};

        const icon: any = iconName && iconName.length > 0 ? <Icon iconName={iconName} styles = {iconStyles}/> : null;

        return icon;
}


export const MySpan = ({itemX}) => ({

    render: (item: any) => {

        let thisStyle : {} = {
            color: '#333333',
            background: 'transparent',
            verticalAlign: 'top',
    //      fontWeight: 'normal',
    //      fontStyle: 'normal',
    //      fontWeight: 'normal',
        };
        let fColor = item['font.color'];
        let fSize = item['font.size'];
        let fWeight = item['font.weight'];
        let fStyle = item['font.style'];
        let bgColor = item['bgColor'];
        if (fColor && fColor.length > 0) { thisStyle['color'] = fColor; }
        if (fSize && fSize.length > 0) { thisStyle['font-size'] = fSize; }
        if (fWeight && fWeight.length > 0) { thisStyle['font-weight'] = fWeight; }
        if (fStyle && fStyle.length > 0) { thisStyle['font-style'] = fStyle; }
    
        if (bgColor && bgColor.length > 0) { thisStyle['background'] = bgColor; }
        let iconName = item['projOptions.icon.name'];
        let iconSize = item['projOptions.icon.size'];
    
        let lineHeight = iconSize == null ? 'large' : iconSize;
        if ( lineHeight === 'x-large') { lineHeight = '20px' ; }
        if ( lineHeight === 'xx-large') { lineHeight = '20px' ; }
        if ( lineHeight === 'large') { lineHeight = '18px' ; }
    
        if ( iconName && iconName.length ) { thisStyle['line-height'] = lineHeight; }
        const element: any = React.createElement("span", { style: thisStyle }, item.titleProject);
        return element;
    }});

