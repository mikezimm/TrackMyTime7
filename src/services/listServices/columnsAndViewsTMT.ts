//  >>>> ADD import additional controls/components
import { UrlFieldFormatType, Field } from "@pnp/sp/presets/all";
import { IFieldAddResult, FieldTypes, IFieldInfo, IField,
    ChoiceFieldFormatType,
    DateTimeFieldFormatType, CalendarType, DateTimeFieldFriendlyFormatType,
    FieldUserSelectionMode, IFieldCreationProperties } from "@pnp/sp/fields/types";

import { IMyFieldTypes, IBaseField , ITextField , IMultiLineTextField , INumberField , IXMLField , 
    IBooleanField , ICalculatedField , IDateTimeField , ICurrencyField , IUserField , ILookupField , IChoiceField , 
    IMultiChoiceField , IDepLookupField , ILocationField } from './columnTypes';

import { cBool, cCalc, cChoice, cMChoice, cCurr, cDate, cLocal, cLook, cDLook, 
    cMText, cText, cNumb, cURL, cUser, cMUser, MyFieldDef } from './columnTypes';



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

export const TeamDesc = "Other Team Members for this project. Helps you find projects you are working on.";

//export const Team : IXMLField = { 
export const Team : IUserField = { //IXMLField    
    fieldType: cMUser,
    name: 'Team',
    selectionMode: FieldUserSelectionMode.PeopleOnly,
//    xml: '<Field DisplayName="Team" Description="' +  TeamDesc + '" Format="Dropdown" List="UserInfo" Mult="TRUE" Name="Team" Title="Team" Type="UserMulti" UserSelectionMode="0" UserSelectionScope="0" ID="{1614eec8-246a-4d63-9ce9-eb8c8a733af1}" SourceID="{53db1cec-2e4f-4db9-b4be-8abbbae91ee7}" Group="' + thisColumnGroup + '" StaticName="Team" ColName="int2" RowOrdinal="0" />',
    onCreateProps: {
        Group: thisColumnGroup,
        Description: TeamDesc,
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
        Description: '"Special field used by webpart which can change the entry format based on the value in the Project List field.  See documentation.',
    }
};

export const ProjectID2 : ITextField = {
    fieldType: cText,
    name: 'ProjectID2',
    maxLength: 255,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: '"Special field used by webpart which can change the entry format based on the value in the Project List field.  See documentation.',
    }
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



export const Everyone : IBooleanField = {
    fieldType: cBool,
    name: 'Everyone',
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'Used by webpart to easily find common or standard Project Items.',
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
    }
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

export const CCEmail : ITextField = {
    fieldType: cText,
    name: 'CCEmail',
    maxLength: 255,
    onCreateProps: {
        Group: thisColumnGroup,
        Description: 'To be used by webpart to email this address for every entry.  Not yet used.',
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

    let theseFields: IMyFieldTypes[] = [];
    theseFields.push(SortOrder);  //Project
    theseFields.push(Everyone);  //Project
    theseFields.push(Leader);  //BOTH
    theseFields.push(Team);  //BOTH

    theseFields.push(Category1);  //BOTH
    theseFields.push(Category2);  //BOTH
    
    theseFields.push(ProjectID1);  //BOTH
    theseFields.push(ProjectID1);  //BOTH

    theseFields.push(HistoryTMT);  //Project

    return theseFields;
}

export function TMTTimeFields() {

    let theseFields: IMyFieldTypes[] = [];


    return theseFields;
}
