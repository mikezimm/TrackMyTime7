//  >>>> ADD import additional controls/components
import { UrlFieldFormatType, Field } from "@pnp/sp/presets/all";
import { IFieldAddResult, FieldTypes, IFieldInfo, IField,
    ChoiceFieldFormatType,
    DateTimeFieldFormatType, CalendarType, DateTimeFieldFriendlyFormatType,
    FieldUserSelectionMode, IFieldCreationProperties } from "@pnp/sp/fields/types";

import { IMyFieldTypes, IBaseField , ITextField , IMultiLineTextField , INumberField , IXMLField , 
    IBooleanField , ICalculatedField , IDateTimeField , ICurrencyField , IUserField , ILookupField , IChoiceField , 
    IMultiChoiceField , IDepLookupField , ILocationField, IURLField } from './columnTypes';

import { cBool, cCalcN, cCalcT, cChoice, cMChoice, cCurr, cDate, cLocal, cLook, cDLook, 
    cMText, cText, cNumb, cURL, cUser, cMUser, MyFieldDef, minInfinity, maxInfinity } from './columnTypes';

//import { statusChoices, defStatus }  from '../../webparts/trackMyTime7/components/TrackMyTime7';

//Imported but not used so that intellisense can prevent duplicate named columns.
import { ootbID, ootbTitle, ootbEditor, ootbAuthor, ootbCreated, ootbModified, } from './columnsOOTB';

/***
 *     .d8b.  d8888b. d8888b.       d888b  d8888b.  .d88b.  db    db d8888b.      d8b   db  .d8b.  .88b  d88. d88888b 
 *    d8' `8b 88  `8D 88  `8D      88' Y8b 88  `8D .8P  Y8. 88    88 88  `8D      888o  88 d8' `8b 88'YbdP`88 88'     
 *    88ooo88 88   88 88   88      88      88oobY' 88    88 88    88 88oodD'      88V8o 88 88ooo88 88  88  88 88ooooo 
 *    88~~~88 88   88 88   88      88  ooo 88`8b   88    88 88    88 88~~~        88 V8o88 88~~~88 88  88  88 88~~~~~ 
 *    88   88 88  .8D 88  .8D      88. ~8~ 88 `88. `8b  d8' 88b  d88 88           88  V888 88   88 88  88  88 88.     
 *    YP   YP Y8888D' Y8888D'       Y888P  88   YD  `Y88P'  ~Y8888P' 88           VP   V8P YP   YP YP  YP  YP Y88888P 
 *                                                                                                                    
 *                                                                                                                    
 */

const thisColumnGroup = 'TrackTimeProject';



/***
 *    d88888b db    db  .d8b.  .88b  d88. d8888b. db      d88888b       .o88b.  .d88b.  db      db    db .88b  d88. d8b   db .d8888. 
 *    88'     `8b  d8' d8' `8b 88'YbdP`88 88  `8D 88      88'          d8P  Y8 .8P  Y8. 88      88    88 88'YbdP`88 888o  88 88'  YP 
 *    88ooooo  `8bd8'  88ooo88 88  88  88 88oodD' 88      88ooooo      8P      88    88 88      88    88 88  88  88 88V8o 88 `8bo.   
 *    88~~~~~  .dPYb.  88~~~88 88  88  88 88~~~   88      88~~~~~      8b      88    88 88      88    88 88  88  88 88 V8o88   `Y8b. 
 *    88.     .8P  Y8. 88   88 88  88  88 88      88booo. 88.          Y8b  d8 `8b  d8' 88booo. 88b  d88 88  88  88 88  V888 db   8D 
 *    Y88888P YP    YP YP   YP YP  YP  YP 88      Y88888P Y88888P       `Y88P'  `Y88P'  Y88888P ~Y8888P' YP  YP  YP VP   V8P `8888Y' 
 *                                                                                                                                   
 *                                                                                                                                   
 */

export const example : ITextField = {
    fieldType: cText,
    name: 'xyz',
    title: 'xyz Title visible',
    maxLength: 255,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'To be used by webpart to email this address for every entry.  Not yet used.',
    },
    onCreateChanges: {
        //Hidden: true,
        Title: 'xyz Title Updated on Create',
    },
    showNew: true,
    showEdit: true,
    showDisplay: false,
    changes1: { Title: 'xyz Title changes1' },  //Properties you want changed any time in your code
    changes2: { Title: 'xyz Title changes2' },  //Properties you want changed any time in your code
    changes3: { Title: 'xyz Title changes3' },  //Properties you want changed any time in your code
    changesFinal: { Title: 'xyz Title changesFinal' },  //Properties you want changed at the very end... like hiding fields once formula columns are created and views are also created (can't add to view if it's hidden)

    //showDisplay: false,
};

/***
 *    d8888b. d88888b  .d8b.  db            .o88b.  .d88b.  db      db    db .88b  d88. d8b   db .d8888. 
 *    88  `8D 88'     d8' `8b 88           d8P  Y8 .8P  Y8. 88      88    88 88'YbdP`88 888o  88 88'  YP 
 *    88oobY' 88ooooo 88ooo88 88           8P      88    88 88      88    88 88  88  88 88V8o 88 `8bo.   
 *    88`8b   88~~~~~ 88~~~88 88           8b      88    88 88      88    88 88  88  88 88 V8o88   `Y8b. 
 *    88 `88. 88.     88   88 88booo.      Y8b  d8 `8b  d8' 88booo. 88b  d88 88  88  88 88  V888 db   8D 
 *    88   YD Y88888P YP   YP Y88888P       `Y88P'  `Y88P'  Y88888P ~Y8888P' YP  YP  YP VP   V8P `8888Y' 
 *                                                                                                       
 *                                                                                                       
 */


/***
 *    d8888b. d8888b. d888888b .88b  d88.  .d8b.  d8888b. db    db 
 *    88  `8D 88  `8D   `88'   88'YbdP`88 d8' `8b 88  `8D `8b  d8' 
 *    88oodD' 88oobY'    88    88  88  88 88ooo88 88oobY'  `8bd8'  
 *    88~~~   88`8b      88    88  88  88 88~~~88 88`8b      88    
 *    88      88 `88.   .88.   88  88  88 88   88 88 `88.    88    
 *    88      88   YD Y888888P YP  YP  YP YP   YP 88   YD    YP    
 *                                                                 
 *                                                                 
 */


/***
 *    .d8888. db   db  .d8b.  d8888b. d88888b d8888b. 
 *    88'  YP 88   88 d8' `8b 88  `8D 88'     88  `8D 
 *    `8bo.   88ooo88 88ooo88 88oobY' 88ooooo 88   88 
 *      `Y8b. 88~~~88 88~~~88 88`8b   88~~~~~ 88   88 
 *    db   8D 88   88 88   88 88 `88. 88.     88  .8D 
 *    `8888Y' YP   YP YP   YP 88   YD Y88888P Y8888D' 
 *                                                    
 *                                                    
 */

export const Leader : IUserField = {
    fieldType: cUser,
    name: 'Leader',
    selectionMode: FieldUserSelectionMode.PeopleOnly,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Leader of this Project Item.  Helps you find Projects you own.',
        Indexed: true
    }
};

//export const Team : IXMLField = { 
export const Team : IUserField = { //IXMLField    
    fieldType: cMUser,
    name: 'Team',
    selectionMode: FieldUserSelectionMode.PeopleOnly,
//    xml: '<Field DisplayName="Team" Description="' +  TeamDesc + '" Format="Dropdown" List="UserInfo" Mult="TRUE" Name="Team" Title="Team" Type="UserMulti" UserSelectionMode="0" UserSelectionScope="0" ID="{1614eec8-246a-4d63-9ce9-eb8c8a733af1}" SourceID="{53db1cec-2e4f-4db9-b4be-8abbbae91ee7}" Group="' + thisColumnGroup + '" StaticName="Team" ColName="int2" RowOrdinal="0" />',
    onCreateProps: {
        Group: thisColumnGroup,
        Description: "Other Team Members for this project. Helps you find projects you are working on.",
    },
};

export const Category1 : IMultiChoiceField = {
    fieldType: cMChoice,
    name: 'Category1',
    choices: ['Daily','SPFx','Assistance','Team Meetings','Training'],
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Project level choice category in entry form.',
    }
};

export const Category2 : IMultiChoiceField = {
    fieldType: cMChoice,
    name: 'Category2',
    choices: ['EU','NA','SA','Asia'],
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Project level choice category in entry form.',
    }
};

export const ProjectID1 : ITextField = {
    fieldType: cText,
    name: 'ProjectID1',
    maxLength: 255,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Special field used by webpart which can change the entry format based on the value in the Project List field.  See documentation.',
    }
};

export const ProjectID2 : ITextField = {
    fieldType: cText,
    name: 'ProjectID2',
    maxLength: 255,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Special field used by webpart which can change the entry format based on the value in the Project List field.  See documentation.',
    }
};

export const CCList : IURLField = {
    fieldType: cURL,
    name: 'CCList',
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Used by web part to create Time Entry on secondary list at the same time... aka like Cc in email.',
    }
};

export const CCEmail : ITextField = {
    fieldType: cText,
    name: 'CCEmail',
    maxLength: 255,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'To be used by webpart to email this address for every entry.  Not yet used.',
    }
};

export const Story : ITextField = {
    fieldType: cText,
    name: 'Story',
    maxLength: 255,
    onCreateProps: {
        Group: thisColumnGroup,
        Indexed: true,
        Description: 'Special field in Project list used create a Story in Charts. This is the primary filter for the Chart Story page.',
    }
};

export const Chapter : ITextField = {
    fieldType: cText,
    name: 'Chapter',
    maxLength: 255,
    onCreateProps: {
        Group: thisColumnGroup,
        Indexed: true,
        Description: 'Special field used by webpart which can change the entry format based on the value in the Project List field.  See documentation.',
    }
};

export const defStatus = '0. Review';
export const planStatus = '1. Plan';
export const processStatus = '2. Process';
export const parkStatus = '8. Parking lot';
export const cancelStatus = '9. Cancelled';
export const completeStatus = '9. Complete';

export const statusChoices : string[] = [defStatus, planStatus, processStatus, parkStatus, cancelStatus, completeStatus];

export const StatusTMT : IChoiceField = {
    fieldType: cChoice,
    name: 'StatusTMT',
    choices: statusChoices,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Used as rule to apply to Project Activy Text to build Activity URL.',
        DefaultFormula:'="' + defStatus + '"',
        Indexed: true,
    },
    onCreateChanges: {
        Title: 'Status',
    }
};

export const StatusNumber : ICalculatedField = {
    fieldType: cCalcN,
    name: 'StatusNumber',
    formula: '=VALUE(LEFT(Status,1))',
    dateFormat: DateTimeFieldFormatType.DateOnly,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Used in various places to track status.',
    },
};

export const StatusText : ICalculatedField = {
    fieldType: cCalcT,
    name: 'StatusText',
    formula: '=TRIM(MID(Status,FIND(".",Status)+1,100))',
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Used in various places to track status.',
    },
};

 /***
 *    d8888b. d8888b.  .d88b.     d88b d88888b  .o88b. d888888b       .d88b.  d8b   db db      db    db 
 *    88  `8D 88  `8D .8P  Y8.    `8P' 88'     d8P  Y8 `~~88~~'      .8P  Y8. 888o  88 88      `8b  d8' 
 *    88oodD' 88oobY' 88    88     88  88ooooo 8P         88         88    88 88V8o 88 88       `8bd8'  
 *    88~~~   88`8b   88    88     88  88~~~~~ 8b         88         88    88 88 V8o88 88         88    
 *    88      88 `88. `8b  d8' db. 88  88.     Y8b  d8    88         `8b  d8' 88  V888 88booo.    88    
 *    88      88   YD  `Y88P'  Y8888P  Y88888P  `Y88P'    YP          `Y88P'  VP   V8P Y88888P    YP    
 *                                                                                                      
 *                                                                                                      
 */



export const SortOrder : INumberField = {
    fieldType: cNumb,
    name: 'SortOrder',
    minValue: 0,
    maxValue: 1000,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Used by webpart to sort list of projects.',
    }
};


export const Active : IBooleanField = {
    fieldType: cBool,
    name: 'Active',
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Used by webpart to filter out old items that should not be loaded (archived).',
    }
};

export const Everyone : IBooleanField = {
    fieldType: cBool,
    name: 'Everyone',
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Used by webpart to easily find common or standard Project Items.',
    }
};

export const TimeTarget : ITextField = {
    fieldType: cText,
    name: 'TimeTarget',
    maxLength: 255,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Used by webpart to define targets for charting.',
    }
};

export const ActivityType : IChoiceField = {
    fieldType: cChoice,
    name: 'ActivityType',
    choices: [`Build`, `Test`, `Ship`, `Verify`, `Order`],
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Used as rule to apply to Project Activy Text to build Activity URL.',
    }
};

export const ActivityTMT : ITextField = {
    fieldType: cText,
    name: 'ActivityTMT',
    maxLength: 255,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Used to complete Activity URL based on the selected choice.  Auto Builds Activity Link in TrackMyTime form.',
    },
    onCreateChanges: {
        Title: 'Activity',
    }
};

export const ActivtyURLCalc : ICalculatedField = {
    fieldType: cCalcN,
    name: 'ActivtyURLCalc',
    formula: '=IF(ActivityType="Build","https://plm. ..... /enovia/common/emxNavigator.jsp?type=GEOBuildOrder&name=[Activity]&rev=-&return=specific",IF(ActivityType="Ship","https://alvweb.alv.autoliv.int/PRISM/SalesOrder_List.aspx?Order=[Activity]",IF(ActivityType="TMT Issue","https://github.com/mikezimm/TrackMyTime7/issues/[Activity]",IF(ActivityType="Socialiis Issue","https://github.com/mikezimm/Social-iis-7/issues/[Activity]",IF(ActivityType="Pivot Tiles Issue","https://github.com/mikezimm/Pivot-Tiles/issues/[Activity]","")))))',
    dateFormat: DateTimeFieldFormatType.DateOnly,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Used to build goto links for Activity and Activity Choice.  See docs for syntax.',
    },
    onCreateChanges: {
        Title: 'ActivityURL^',
    }
};

export const OptionsTMT : ITextField = {
    fieldType: cText,
    name: 'OptionsTMT',
    maxLength: 255,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Special field for enabling special project level options in the webpart.',
    },
    onCreateChanges: {
        Title: 'Options',
    }
};

export const OptionsTMTCalc : ICalculatedField = {
    fieldType: cCalcT,
    name: 'OptionsTMTCalc',
    dateFormat: DateTimeFieldFormatType.DateOnly,
    formula: '=IF(ISNUMBER(FIND("JIRA",ActivityType)),"icon=Info;","")&IF(OR(ISNUMBER(FIND("Lunch",Title)),ISNUMBER(FIND("Break",Title))),"icon=EatDrink;fColor=green","")&IF(ISNUMBER(FIND("Email",Title)),"icon=MailCheck;","")&IF(ISNUMBER(FIND("Training",Title)),"icon=BookAnswers;fColor=blue","")&IF(ISNUMBER(FIND("Meet",Title)),"icon=Group;","")&IF(ISNUMBER(FIND("Test",Title)),"icon=TestAutoSolid;","")',
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Used to create Project settings like Icons, font color etc.  See docs for syntax.',
    },
    onCreateChanges: {
        Title: 'Options^',
    }
};

export function StepChecks(min: number, max: number) {
    let checkFields: IMyFieldTypes[] = [];
    for (let i = min; i <= max; i++) {
        let thisCheck = i === 0 ? '=IF(AND([StatusNumber]>' + i + ',[StatusNumber]>' + i + '),"Yes","No")'
        : '=IF(AND(Step' + (i - 1) + 'Check="Yes",[StatusNumber]>' + i + '),"Yes","No")';

        const thisField : ICalculatedField = {
            fieldType: cCalcN,
            name: 'Step' + i + 'Check',
            dateFormat: DateTimeFieldFormatType.DateOnly,
            formula: thisCheck,
            onCreateProps: {
                Group: thisColumnGroup,
                Description: 'Can be used to have checks at different status to impact Effective Status instead of just a number.',
            },
        };
        checkFields.push(thisField);  //Project
    }
    return checkFields;
}


export const EffectiveStatus : ICalculatedField = {
    fieldType: cCalcN,
    name: 'EffectiveStatus',
    dateFormat: DateTimeFieldFormatType.DateOnly,
    formula: '=(IF([StatusNumber]=9,9,IF([StatusNumber]=8,8,IF(Step4Check="Yes",5,IF(Step3Check="Yes",4,IF(Step2Check="Yes",3,IF(Step1Check="Yes",2,IF(Step0Check="Yes",1,0))))))))',
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Can be used to have checks at different status to impact Effective Status instead of just a number.',
    },
};

export const IsOpen : ICalculatedField = {
    fieldType: cCalcN,
    name: 'IsOpen',
    dateFormat: DateTimeFieldFormatType.DateOnly,
    formula: '=IF(EffectiveStatus<9,"Yes","No")',
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Can be used to have checks at different status to impact Effective Status instead of just a number.',
    },
};

export const DueDateTMT : IDateTimeField = {
    fieldType: cDate,
    name: 'DueDateTMT',
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'For use when using Project List for Task tracking.',
    },
    onCreateChanges: {
        Title: 'Due Date',
    }
};

export const CompletedDateTMT : IDateTimeField = {
    fieldType: cDate,
    name: 'CompletedDateTMT',
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'For use when using Project List for Task tracking.',
        Indexed: true,
    },
    onCreateChanges: {
        Title: 'Completed',
    }
};

export const CompletedByTMT : IUserField = {
    fieldType: cUser,
    name: 'CompletedDateTMT',
    selectionMode: FieldUserSelectionMode.PeopleOnly,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'For use when using Project List for Task tracking.',
        Indexed: true,
    },
    onCreateChanges: {
        Title: 'Completed By',
    }
};

export const HistoryTMT : IMultiLineTextField = {
    fieldType: cMText,
    name: 'HistoryTMT',
    //title: string,
    numberOfLines: 6,
    richText: false,
    restrictedMode: false,
    appendOnly: false,
    allowHyperlink: false,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Special field for change history from webpart.',
        Hidden: true,
    }
};

export const ProjectEditOptions : ITextField = {
    fieldType: cText,
    name: 'ProjectEditOptions',
    maxLength: 255,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Hidden field used to remember settings on Project Edit page for this project.',
        Hidden: true,
    },
};


/***
 *    d888888b d888888b .88b  d88. d88888b       .d88b.  d8b   db db      db    db 
 *    `~~88~~'   `88'   88'YbdP`88 88'          .8P  Y8. 888o  88 88      `8b  d8' 
 *       88       88    88  88  88 88ooooo      88    88 88V8o 88 88       `8bd8'  
 *       88       88    88  88  88 88~~~~~      88    88 88 V8o88 88         88    
 *       88      .88.   88  88  88 88.          `8b  d8' 88  V888 88booo.    88    
 *       YP    Y888888P YP  YP  YP Y88888P       `Y88P'  VP   V8P Y88888P    YP    
 *                                                                                 
 *                                                                                 
 */


export const Activity : IURLField = {
    fieldType: cURL,
    name: 'Activity',
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Link to the activity you are working on.',
    }
};

export const DeltaT : INumberField = {
    fieldType: cNumb,
    name: 'DeltaT',
    minValue: minInfinity,
    maxValue: maxInfinity,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'May be used to indicate difference between when an entry is created and the actual time of the entry.',
    }
};

export const Comments : ITextField = {
    fieldType: cText,
    name: 'Comments',
    maxLength: 255,
    onCreateProps: {
        Group: thisColumnGroup,
    },
};

export const DescriptionSaveAtTime = 'Saved at time of creation for comparison of changes.';
export const OriginalHours : INumberField = {
    fieldType: cNumb,
    name: 'OriginalHours',
    minValue: minInfinity,
    maxValue: maxInfinity,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: DescriptionSaveAtTime,
    },
    changesFinal: {
        Hidden: true,
    },
};

export const StartTime : IDateTimeField = {
    fieldType: cDate,
    name: 'StartTime',
    displayFormat:  DateTimeFieldFormatType.DateTime,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Start Time for this entry.',
        Indexed: true,
        Required: true,
    },
};

export const EndTime : IDateTimeField = {
    fieldType: cDate,
    name: 'EndTime',
    displayFormat:  DateTimeFieldFormatType.DateTime,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'End Time for this entry.',
        Required: true,
    },
};

export const OriginalStart : IDateTimeField = {
    fieldType: cDate,
    name: 'OriginalStart',
    displayFormat:  DateTimeFieldFormatType.DateTime,
    onCreateProps: {
        Group: thisColumnGroup,        
        Description: DescriptionSaveAtTime,
        Indexed: true,
        Required: true,
    },
    changesFinal: {
        Hidden: true,
    },
};

export const OriginalEnd : IDateTimeField = {
    fieldType: cDate,
    name: 'OriginalEnd',
    displayFormat:  DateTimeFieldFormatType.DateTime,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: DescriptionSaveAtTime,
        Required: true,
    },
    changesFinal: {
        Hidden: true,
    },
};

export const Hours : ICalculatedField = {
    fieldType: cCalcN,
    name: 'Hours',
    formula: '=IFERROR(24*(EndTime-StartTime),"")',
    dateFormat: DateTimeFieldFormatType.DateOnly,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Calculates Start to End time in Hours.',
    },
};

export const Days : ICalculatedField = {
    fieldType: cCalcN,
    name: 'Days',
    formula: '=IFERROR((EndTime-StartTime),"")',
    dateFormat: DateTimeFieldFormatType.DateOnly,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Calculates Start to End time in Days.',
    },
};

export const Minutes : ICalculatedField = {
    fieldType: cCalcN,
    name: 'Minutes',
    formula: '=IFERROR(24*60*(EndTime-StartTime),"")',
    dateFormat: DateTimeFieldFormatType.DateOnly,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Calculates Start to End time in Minutes.',
    },
};

export const KeyChanges : ICalculatedField = {
    fieldType: cCalcN,
    name: 'KeyChanges',
    formula: '=IF(OriginalHours="","-NoOriginalHours",IF(ABS(Hours-OriginalHours)>0.05,"-HoursChanged",""))&IF(OriginalStart="","-NoOriginalStart",IF(StartTime<>OriginalStart,"-StartChanged",""))&IF(OriginalEnd="","-NoOriginalEnd",IF(EndTime<>OriginalEnd,"-EndChanged",""))',
    dateFormat: DateTimeFieldFormatType.DateOnly,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Calculates if significant changes were made after item was created.',
    },
};

export const SourceProject : IURLField = {
    fieldType: cURL,
    name: 'SourceProject',
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Link to the Project List item used to create this entry.',
    }
};

export const SourceProjectRef : ITextField = {
    fieldType: cText,
    name: 'SourceProjectRef',
    maxLength: 255,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Used by webpart to get source project information.',
        Hidden: true,
        Indexed: true,
    },
};

export const Settings : ITextField = {
    fieldType: cText,
    name: 'Settings',
    maxLength: 255,
    onCreateProps: {
        Description: 'For internal use of webpart',
        Group: thisColumnGroup,
    },
};

export const Location : ITextField = {
    fieldType: cText,
    name: 'Location',
    maxLength: 255,
    onCreateProps: {
        Description: 'Optional category to indicate where time was spent.  Such as Office, Customer, Home, Traveling etc.',
        Group: thisColumnGroup,
    },
};

export const EntryType : ITextField = {
    fieldType: cText,
    name: 'EntryType',
    maxLength: 255,
    onCreateProps: {
        Description: 'Shows what entry type was used, used in Charting.',
        Group: thisColumnGroup,
    },
};

export const User : IUserField = {
    fieldType: cUser,
    name: 'User',
    selectionMode: FieldUserSelectionMode.PeopleOnly,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'The person this time entry applies to.',
        Indexed: true
    }
};


/***
 *     .o88b.  .d8b.  db       .o88b. db    db db       .d8b.  d888888b d88888b d8888b. 
 *    d8P  Y8 d8' `8b 88      d8P  Y8 88    88 88      d8' `8b `~~88~~' 88'     88  `8D 
 *    8P      88ooo88 88      8P      88    88 88      88ooo88    88    88ooooo 88   88 
 *    8b      88~~~88 88      8b      88    88 88      88~~~88    88    88~~~~~ 88   88 
 *    Y8b  d8 88   88 88booo. Y8b  d8 88b  d88 88booo. 88   88    88    88.     88  .8D 
 *     `Y88P' YP   YP Y88888P  `Y88P' ~Y8888P' Y88888P YP   YP    YP    Y88888P Y8888D' 
 *                                                                                      
 *                                                                                      
 */




 /***
 *    db   db d888888b d8888b. d8888b. d88888b d8b   db 
 *    88   88   `88'   88  `8D 88  `8D 88'     888o  88 
 *    88ooo88    88    88   88 88   88 88ooooo 88V8o 88 
 *    88~~~88    88    88   88 88   88 88~~~~~ 88 V8o88 
 *    88   88   .88.   88  .8D 88  .8D 88.     88  V888 
 *    YP   YP Y888888P Y8888D' Y8888D' Y88888P VP   V8P 
 *                                                      
 *                                                      
 */




/***
 *    d88888b db    db d8888b.  .d88b.  d8888b. d888888b 
 *    88'     `8b  d8' 88  `8D .8P  Y8. 88  `8D `~~88~~' 
 *    88ooooo  `8bd8'  88oodD' 88    88 88oobY'    88    
 *    88~~~~~  .dPYb.  88~~~   88    88 88`8b      88    
 *    88.     .8P  Y8. 88      `8b  d8' 88 `88.    88    
 *    Y88888P YP    YP 88       `Y88P'  88   YD    YP    
 *                                                       
 *                                                       
 */
/***
 *     .o88b.  .d88b.  db      db    db .88b  d88. d8b   db       .d8b.  d8888b. d8888b.  .d8b.  db    db .d8888. 
 *    d8P  Y8 .8P  Y8. 88      88    88 88'YbdP`88 888o  88      d8' `8b 88  `8D 88  `8D d8' `8b `8b  d8' 88'  YP 
 *    8P      88    88 88      88    88 88  88  88 88V8o 88      88ooo88 88oobY' 88oobY' 88ooo88  `8bd8'  `8bo.   
 *    8b      88    88 88      88    88 88  88  88 88 V8o88      88~~~88 88`8b   88`8b   88~~~88    88      `Y8b. 
 *    Y8b  d8 `8b  d8' 88booo. 88b  d88 88  88  88 88  V888      88   88 88 `88. 88 `88. 88   88    88    db   8D 
 *     `Y88P'  `Y88P'  Y88888P ~Y8888P' YP  YP  YP VP   V8P      YP   YP 88   YD 88   YD YP   YP    YP    `8888Y' 
 *                                                                                                                
 *                                                                                                                
 */

/**
 * This just creates an array of fields for the build/test sequence
 * Each list would have an array of field objects like this.
 */


export function TMTProjectFields() {
    console.log('helpme :)');
    //return null;

    let theseFields: IMyFieldTypes[] = TMTFields('Project');

    console.log('theseFields', theseFields);
    return theseFields;
}

export function TMTTimeFields() {
    let theseFields: IMyFieldTypes[] = TMTFields('Time');
    return theseFields;
}

export function TMTFields(listName: 'Project' | 'Time') {

    let theseFields: IMyFieldTypes[] = [];
    if (listName === 'Project' ) { theseFields.push(SortOrder); }  //Project
    if (listName === 'Project' ) { theseFields.push(Everyone); }  //Project
    if (listName === 'Project' ) { theseFields.push(Active); }  //Project
    
    theseFields.push(Leader);  //BOTH
    theseFields.push(Team);  //BOTH

    theseFields.push(Category1);  //BOTH
    theseFields.push(Category2);  //BOTH
    
    theseFields.push(ProjectID1);  //BOTH
    theseFields.push(ProjectID2);  //BOTH
    theseFields.push(Story);  //BOTH
    theseFields.push(Chapter);  //BOTH

    if (listName === 'Project' ) { theseFields.push(ActivityType); }  //Project
    if (listName === 'Project' ) { theseFields.push(ActivityTMT); }  //Project
    if (listName === 'Project' ) { theseFields.push(ActivtyURLCalc); }  //Project
    if (listName === 'Project' ) { theseFields.push(OptionsTMT); }  //Project
    if (listName === 'Project' ) { theseFields.push(OptionsTMTCalc); }  //Project

    theseFields.push(StatusTMT);  //BOTH        - must be before StatusNumber, StatusText, StepChecks, EffectiveStatus, IsOpen
    theseFields.push(StatusNumber);  //BOTH     - must be before StatusNumber, StatusText, StepChecks, EffectiveStatus, IsOpen
    theseFields.push(StatusText);  //BOTH       - must be before StatusNumber, StatusText, StepChecks, EffectiveStatus, IsOpen

    let checks = StepChecks(0,5);  //Project
    theseFields.push(...checks);  //Project

    if (listName === 'Project' ) { theseFields.push(EffectiveStatus); }  //Project
    if (listName === 'Project' ) { theseFields.push(IsOpen); }  //Project

    theseFields.push(DueDateTMT);  //BOTH
    theseFields.push(CompletedDateTMT);  //BOTH
    theseFields.push(CompletedByTMT);  //BOTH

    if (listName === 'Project' ) { theseFields.push(ProjectEditOptions); }  //Project
    if (listName === 'Project' ) { theseFields.push(HistoryTMT); }  //Project
    if (listName === 'Project' ) { theseFields.push(TimeTarget); }  //Project

    if (listName === 'Time' ) { theseFields.push(Activity); }  //Time
    if (listName === 'Time' ) { theseFields.push(DeltaT); }  //Time
    if (listName === 'Time' ) { theseFields.push(Comments); }  //Time

    if (listName === 'Time' ) { theseFields.push(User); }  //Time
    if (listName === 'Time' ) { theseFields.push(StartTime); }  //Time      - must be before Hours, Days, Minutes, KeyChanges
    if (listName === 'Time' ) { theseFields.push(EndTime); }  //Time        - must be before Hours, Days, Minutes, KeyChanges
    if (listName === 'Time' ) { theseFields.push(OriginalStart); }  //Time  - must be before Hours, Days, Minutes, KeyChanges
    if (listName === 'Time' ) { theseFields.push(OriginalEnd); }  //Time    - must be before Hours, Days, Minutes, KeyChanges
    if (listName === 'Time' ) { theseFields.push(OriginalHours); }  //Time  - must be before KeyChanges

    if (listName === 'Time' ) { theseFields.push(Hours); }  //Time
    if (listName === 'Time' ) { theseFields.push(Days); }  //Time
    if (listName === 'Time' ) { theseFields.push(Minutes); }  //Time
    if (listName === 'Time' ) { theseFields.push(KeyChanges); }  //Time

    if (listName === 'Time' ) { theseFields.push(SourceProject); }  //Time
    if (listName === 'Time' ) { theseFields.push(SourceProjectRef); }  //Time

    if (listName === 'Time' ) { theseFields.push(Settings); }  //Time
    if (listName === 'Time' ) { theseFields.push(Location); }  //Time
    if (listName === 'Time' ) { theseFields.push(EntryType); }  //Time

    theseFields.push(CCList);  //BOTH
    theseFields.push(CCEmail);  //BOTH

    return theseFields;

}


