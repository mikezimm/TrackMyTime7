import * as React from 'react';

import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";
import { Icon } from 'office-ui-fabric-react/lib/Icon';

export const  initials : IViewField = {
    name: "userInitials",
    displayName: "User",
    isResizable: true,
    sorting: true,
    minWidth: 10,
    maxWidth: 30
};

export const  id : IViewField = {
  name: "id",
  displayName: "ID",
  isResizable: true,
  sorting: true,
  minWidth: 10,
  maxWidth: 30
};

export const  timeSpan : IViewField = {
  name: "listTimeSpan",
  displayName: "Timespan",
  //linkPropertyName: "c",
  isResizable: true,
  sorting: true,
  minWidth: 150,
  maxWidth: 200
};

export const  title : IViewField = {
  name: "titleProject",
  displayName: "Title",
  isResizable: true,
  sorting: true,
  minWidth: 150,
  maxWidth: 200
};

export const  projectWide : IViewField = {
  name: "titleProject",
  displayName: "Project",
  isResizable: true,
  sorting: true,
  minWidth: 250,
  maxWidth: 400,
  //render: null,
};

export const  description : IViewField = {
  name: "description",
  displayName: "Description",
  //linkPropertyName: "c",
  isResizable: true,
  sorting: true,
  minWidth: 20,
  maxWidth: 100
};

export const  projects : IViewField = {
  name: "listProjects",
  displayName: "Projects",
  //linkPropertyName: "c",
  isResizable: true,
  sorting: true,
  minWidth: 20,
  maxWidth: 100
};

export const  comments : IViewField = {
  name: "listComments",
  displayName: "Comments",
  //linkPropertyName: "c",
  isResizable: true,
  sorting: true,
  minWidth: 20,
  maxWidth: 100
};

export const  category : IViewField = {
  name: "listCategory",
  displayName: "Category",
  //linkPropertyName: "c",
  isResizable: true,
  sorting: true,
  minWidth: 30,
  maxWidth: 100
};

//This does not yet work because the component ends up showing the field anyway
export function testField(visible: boolean) {
    let test  : IViewField = {
        name: "listCategory",
        displayName: visible ? "Category" : "",
        //linkPropertyName: "c",
        isResizable: visible ? true : false,
        sorting: visible ? true : false,
        minWidth: visible ? 30 : 0,
        maxWidth: visible ? 100 : 0,
    };
    return test;
}

export function viewFieldsFull() {

    let viewFields: IViewField[]=[];

    
    viewFields.push(id);
    viewFields.push(initials);
    viewFields.push(timeSpan);
    viewFields.push(title);
    //viewFields.push(description);
    viewFields.push(projects);    
    viewFields.push(category);
    viewFields.push(comments);


    return viewFields;
    
}

export function viewFieldsMin() {

    let viewFields: IViewField[]=[];
    viewFields.push(id);
    viewFields.push(initials);
    viewFields.push(timeSpan);
    viewFields.push(title);

    return viewFields;
    
}

export const  projectWide2 : IViewField = {
  name: "titleProject",
  displayName: "Project",
  isResizable: true,
  sorting: true,
  minWidth: 250,
  maxWidth: 400,
  //render: null,
  render: (item: any) => {
    console.log('projectWide:', item);
    let thisStyle : {} = {
      color: '#333333',
      background: 'transparent',
      verticalAlign: 'top',
//      fontWeight: 'normal',
//      fontStyle: 'normal',
//      fontWeight: 'normal',
    };
    let fColor = item['projOptions.font.color'];
    let fSize = item['projOptions.font.size'];
    let fWeight = item['projOptions.font.weight'];
    let fStyle = item['projOptions.font.style'];
    let bgColor = item['projOptions.bgColor'];
    if (fColor && fColor.length > 0) { thisStyle['color'] = fColor; }
    if (fSize && fSize.length > 0) { thisStyle['font-size'] = fSize; }
    if (fWeight && fWeight.length > 0) { thisStyle['font-weight'] = fWeight; }
    if (fStyle && fStyle.length > 0) { thisStyle['font-style'] = fStyle; }

    if (bgColor && bgColor.length > 0) { thisStyle['background'] = bgColor; }
    let iconName = item['projOptions.icon.name'];
    let iconColor = item['projOptions.icon.color'];
    let iconSize = item['projOptions.icon.size'];
    let iconWeight = item['projOptions.icon.weight'];

    //    iconSize = iconSize == null ? Math.floor(parseInt(fSize) * 1.5) : iconSize;
    iconSize = iconSize == null ? 'large' : iconSize;
/*
    fontSize: 18,
    fontWeight: iconName === 'Help' ? "900" : "normal",
    margin: '0px 2px',
    color: '#00457e', //This will set icon color
*/
//root: {padding:'10px !important', height: 32},//color: 'green' works here
    let iconStyles: any = { root: {
      //top: '10px !important',
      fontSize: iconSize,
      fontWeight: iconWeight,
      color: iconColor,
      paddingRight: '10px',
      //...(cardSectionOrItemStyles.root as object)
    }};

    let lineHeight = iconSize;
    if ( lineHeight === 'x-large') { lineHeight = '20px' ; }
    if ( lineHeight === 'xx-large') { lineHeight = '20px' ; }
    if ( lineHeight === 'large') { lineHeight = '18px' ; }

    if ( iconName && iconName.length ) { thisStyle['line-height'] = lineHeight; }
    const icon: any = iconName && iconName.length > 0 ? <Icon iconName={iconName} styles = {iconStyles}/> : null;
//    const element: any = React.createElement("span", { style: { color: _color, background : _bgColor } }, item.titleProject);
    const element: any = React.createElement("span", { style: thisStyle }, item.titleProject);
    let fullElement: any = <div> { icon } { element } </div>;
    return fullElement;
  }
};

export function viewFieldsProject() {

  let viewFields: IViewField[]=[];
  //viewFields.push(projectWide);
  viewFields.push(projectWide2);

  return viewFields;
  
}