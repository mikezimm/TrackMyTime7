import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";

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

export function viewFieldsProject() {

  let viewFields: IViewField[]=[];
  viewFields.push(projectWide);

  return viewFields;
  
}