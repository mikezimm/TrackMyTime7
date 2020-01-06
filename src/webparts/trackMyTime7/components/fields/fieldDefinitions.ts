import { ITrackMyTime7State } from '../ITrackMyTime7State';

import { ITrackMyTime7Props } from '../ITrackMyTime7Props';


export interface IFieldDef {

    name: string;
    title: string;
    column: string;
    type: string; //Smart, Text, Number, etc...
    required: boolean;
    disabled: boolean;
    blinkOnProject: boolean;

}

export interface IFormFields {
    Title: IFieldDef;
    Activity: IFieldDef;
    Comments: IFieldDef;
    Category1: IFieldDef;
    Category2: IFieldDef;

    ProjectID1: IFieldDef;
    ProjectID2: IFieldDef;

    Start: IFieldDef;
    End: IFieldDef;

}

export function createEntryField(name: string, title: string, column: string, type: string, blinkOnProject: boolean){
    let field : IFieldDef = {
        name: name,
        column: column,
        title: title,
        type: type, //Smart, Text, Number, etc...
        required: false,
        disabled: false,
        blinkOnProject: blinkOnProject,
    };
    //console.log('createEntryField: ' + name, field)
    return field;
  }

export function buildFormFields(parentProps:ITrackMyTime7Props , parentState: ITrackMyTime7State ){
    let fields : IFormFields = {
        //createEntryField(name: string, title: string, column: string, type: string, blinkOnProject: boolean){
        Title: createEntryField("titleProject","Title","Title", "Text", true),
        Comments: createEntryField("comments","Comments","Comments","Smart", false),
        Activity: createEntryField("activity","Activity","Activity","SmartLink", false),
        Category1: createEntryField("category1","Category 1","Category1","Text", true),
        Category2: createEntryField("category2","Category 2","Category2","Text", true),

        ProjectID1: createEntryField("projectID1","Project ID 1","ProjectID1","Smart", true),
        ProjectID2: createEntryField("projectID2","Project ID 2","ProjectID2","Smart", true),

        Start: createEntryField("startTime","Start Time","StartTime","Time", false),
        End: createEntryField("endTime","End Time","EndTime","Time", false),

    };

    return fields;

}


