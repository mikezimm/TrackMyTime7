import { ITrackMyTime7State } from '../ITrackMyTime7State';

import { ITrackMyTime7Props } from '../ITrackMyTime7Props';


export interface IFieldDef {

    name: string;
    title: string;
    column: string;
    type: string; //Smart, Text, Number, etc...
    required: boolean;
    disabled: boolean;
    hidden: boolean;
    blinkOnProject: boolean;
    value?: any;

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


export interface IProjectFormFields {
    Title: IFieldDef;

    Category1: IFieldDef;
    Category2: IFieldDef;

    ProjectID1: IFieldDef;
    ProjectID2: IFieldDef;

    Story: IFieldDef;
    Chapter: IFieldDef;

    Everyone: IFieldDef;
    Leader: IFieldDef;
    Team: IFieldDef;
    
    ActivityType: IFieldDef;
    ActivityTMT: IFieldDef;

    StatusTMT: IFieldDef;
    DueDateTMT: IFieldDef;
    CompletedDateTMT: IFieldDef;
    CompletedByTMT: IFieldDef;

    CCEmail: IFieldDef;
    CCList: IFieldDef;
    OptionsTMT: IFieldDef;
    TimeTarget: IFieldDef;
    SortOrder: IFieldDef;


}

export function createEntryField(name: string, title: string, column: string, type: string, blinkOnProject: boolean){
    let field : IFieldDef = {
        name: name,
        column: column,
        title: title,
        type: type, //Smart, Text, Number, etc...
        required: false,
        disabled: false,
        hidden: false,
        blinkOnProject: blinkOnProject,
        value: null,
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


export function buildProjectFormFields(parentProps:ITrackMyTime7Props , parentState: ITrackMyTime7State ){
    let fields : IProjectFormFields = {
        //createEntryField(name: string, title: string, column: string, type: string, blinkOnProject: boolean){
        Title: createEntryField("titleProject","Title","Title", "Text", true),

        Category1: createEntryField("category1","Category 1","Category1","Text", true),
        Category2: createEntryField("category2","Category 2","Category2","Text", true),

        ProjectID1: createEntryField("projectID1","Project ID 1","ProjectID1","Text", true),
        ProjectID2: createEntryField("projectID2","Project ID 2","ProjectID2","Text", true),

        Story: createEntryField("story","Story","Story","Text", true),
        Chapter: createEntryField("chapter","Chapter","Chapter","Text", true),
    
        Everyone: createEntryField("everyone","Everyone","Everyone","Boolean", true),
        Leader: createEntryField("leader","Leader","Leader","User", true),
        Team: createEntryField("team","Team","Team","Users", true),
        
        ActivityType: createEntryField("activityType","ActivityType","ActivityType","Choice", true),
        ActivityTMT: createEntryField("activity","Activity","ActivityTMT","Text", true),
    
        StatusTMT: createEntryField("status","Status","StatusTMT","Choice", true),
        DueDateTMT: createEntryField("dueDate","DueDate","DueDateTMT","Date", true),
        CompletedDateTMT: createEntryField("completedDate","CompletedDate","CompletedDateTMT","Date", true),
        CompletedByTMT: createEntryField("completedBy","CompletedBy","CompletedByTMT","User", true),
    
        CCEmail: createEntryField("ccEmail","Email","CCEmail","Text", true),
        CCList: createEntryField("ccList","List","CCList","Text", true),
        OptionsTMT: createEntryField("projOptions","Options","OptionsTMT","Text", true),
        TimeTarget: createEntryField("timeTarget","TimeTarget","TimeTarget","Text", true),
        SortOrder: createEntryField("sortOrder","SortOrder","SortOrder","Text", true),

    };

    return fields;

}

