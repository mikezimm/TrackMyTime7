//  >>>> ADD import additional controls/components
import { UrlFieldFormatType, Field } from "@pnp/sp/presets/all";
import { IFieldAddResult, FieldTypes, IFieldInfo, IField,
    ChoiceFieldFormatType,
    DateTimeFieldFormatType, CalendarType, DateTimeFieldFriendlyFormatType,
    FieldUserSelectionMode, IFieldCreationProperties } from "@pnp/sp/fields/types";

import { IItemAddResult } from "@pnp/sp/items";

import { ITextField, IMultiLineTextField, INumberField, IMyFieldTypes } from './columnTypes';

import { cBool, cCalc, cChoice,cMChoice, cCurr, cDate, cLocal, cLook, cMText, cText, cNumb, cURL, MyFieldDef } from './columnTypes';

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
import "@pnp/sp/views";
import "@pnp/sp/fields/list";

const thisColumnGroup = 'TrackTimeProject';

export const xyz : ITextField = {
    fieldType: cText,
    name: 'xyz',
    maxLength: 255,
    properties: {
        Group: thisColumnGroup,
        Description: 'To be used by webpart to email this address for every entry.  Not yet used.',
    }
};

export const CCEmail : ITextField = {
    fieldType: cText,
    name: 'CCEmail',
    maxLength: 255,
    properties: {
        Group: thisColumnGroup,
        Description: 'To be used by webpart to email this address for every entry.  Not yet used.',
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
    properties: {
        Group: thisColumnGroup,
        Description: 'Special field for change history from webpart.',
    }
};


/**
 * This just creates an array of fields for the build/test sequence
 * Each list would have an array of field objects like this.
 */

export function TMTProjectFields() {

    let theseFields: IMyFieldTypes[] = [];
    //theseFields.push(HistoryTMT);
    //theseFields.push(CCEmail);
    theseFields.push(xyz);
    theseFields.push(CCEmail);
    theseFields.push(xyz);
    return theseFields;
}

//const HistoryTMT: IFieldAddResult = await ensureResult.list.fields.addMultilineText("HistoryTMT", 6, false, false, false, false, { Group: columnGroup, Description: fieldDescription  });