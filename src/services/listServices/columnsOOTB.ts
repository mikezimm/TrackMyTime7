//  >>>> ADD import additional controls/components
import { UrlFieldFormatType, Field } from "@pnp/sp/presets/all";
import { IFieldAddResult, FieldTypes, IFieldInfo, IField,
    ChoiceFieldFormatType,
    DateTimeFieldFormatType, CalendarType, DateTimeFieldFriendlyFormatType,
    FieldUserSelectionMode, IFieldCreationProperties } from "@pnp/sp/fields/types";

import { IMyFieldTypes, IBaseField , ITextField , IMultiLineTextField , INumberField , IXMLField , 
    IBooleanField , ICalculatedField , IDateTimeField , ICurrencyField , IUserField , ILookupField , IChoiceField , 
    IMultiChoiceField , IDepLookupField , ILocationField, IURLField, cCount, cInt } from './columnTypes';

import { cBool, cCalcN, cCalcT, cChoice, cMChoice, cCurr, cDate, cLocal, cLook, cDLook, 
    cMText, cText, cNumb, cURL, cUser, cMUser, MyFieldDef, minInfinity, maxInfinity } from './columnTypes';

// import { ootbID, ootbTitle, ootbEditor, ootbAuthor, ootbCreated, ootbModified, } from './columnsOOTB';


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

const thisColumnGroup = 'Custom Columns';

const defGroup = {
    Group: thisColumnGroup,
};

export const ootbID : ITextField = {
    fieldType: cCount,
    name: 'ID',
    title: 'ID',
    onCreateProps: defGroup,
};

export const ootbVersion : ITextField = {
    fieldType: cNumb,
    name: '_UIVersionString',
    title: 'UI Version',
    onCreateProps: defGroup,
};

export const ootbTitle : ITextField = {
    fieldType: cText,
    name: 'Title',
    title: 'Title',
    onCreateProps: defGroup,
};

export const ootbEditor : ITextField = {
    fieldType: cInt,
    name: 'Editor',
    title: 'Modified By',
    onCreateProps: defGroup,
};

export const ootbAuthor : ITextField = {
    fieldType: cInt,
    name: 'Author',
    title: 'Created By',
    onCreateProps: defGroup,
};

export const ootbCreated : ITextField = {
    fieldType: cDate,
    name: 'Created',
    title: 'Created',
    onCreateProps: defGroup,
};

export const ootbModified : ITextField = {
    fieldType: cDate,
    name: 'Modified',
    title: 'Modified',
    onCreateProps: defGroup,
};