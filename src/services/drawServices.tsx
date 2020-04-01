import * as React from 'react';

import { Icon } from 'office-ui-fabric-react/lib/Icon';

import { IProjectOptions } from '../webparts/trackMyTime7/components/ITrackMyTime7State';


export const ColoredLine = ({ color, height }) => ( <hr style={{ color: color, backgroundColor: color, height: height }}/> );

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

