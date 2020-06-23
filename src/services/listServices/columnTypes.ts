
//  >>>> ADD import additional controls/components
import { UrlFieldFormatType, Field } from "@pnp/sp/presets/all";
import { IFieldAddResult, FieldTypes, IFieldInfo, IField,
    ChoiceFieldFormatType,
    DateTimeFieldFormatType, CalendarType, DateTimeFieldFriendlyFormatType,
    FieldUserSelectionMode, IFieldCreationProperties, } from "@pnp/sp/fields/types";

import { IItemAddResult } from "@pnp/sp/items";
import "@pnp/sp/lists";
import { IListInfo } from './listTypes';

export const minInfinity: number = -1.7976931348623157e+308;
export const maxInfinity = -1 * minInfinity ;

export interface MyListDef {
title: string;
desc?: string; 
template?: number;
enableContentTypes?: boolean;
additionalSettings?: Partial<IListInfo>;
}

export interface MyFieldDef {
    kind: number;
    type: string;
}

export const cText =    {    kind : 2,    type : 'SP.FieldText' };

export const cMText =   {    kind : 3,    type : 'SP.FieldMultiLineText' };

export const cDate =    {    kind : 4,    type : 'SP.FieldDateTime' };

export const cChoice =  {    kind :6 ,    type : 'SP.FieldChoice'  };

export const cLook =    {    kind : 7,    type : 'SP.FieldCreationInformation'  };

export const cDLook =    {    kind : 7,    type : 'SP.FieldCreationInformation'  };

export const cBool =    {    kind :8 ,    type : 'SP.Field'  };

export const cNumb =    {    kind : 9,    type : 'SP.FieldNumber'  };

export const cCurr =    {    kind : 10,    type : 'SP.FieldCurrency'  };

export const cURL =     {    kind : 11,    type : 'SP.FieldUrl'  };

export const cMChoice = {    kind :15 ,    type : 'SP.FieldMultiChoice'  };

export const cCalc =    {    kind : 17,    type : 'SP.FieldCalculated'  };

export const cUser =    {    kind : 20,    type : 'SP.FieldUser'  };

export const cMUser =    {    kind : 20,    type : 'SP.FieldUserMulti'  }; //This may be SP.FieldUserMulti or may not ????... but this is required for the function in columnServices.ts to catch this option.

export const cLocal =   {    kind : 33,    type : 'SP.FieldLocation'  };

export type IMyFieldTypes = IBaseField | ITextField | IMultiLineTextField | INumberField | IXMLField | 
    IBooleanField | ICalculatedField | IDateTimeField | ICurrencyField | IUserField | ILookupField | IChoiceField | 
    IMultiChoiceField | IDepLookupField | ILocationField;

/**
 * Adds a new SP.FieldText to the collection
 *
 * @param title The field title
 * @param maxLength The maximum number of characters allowed in the value of the field.
 * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
 */

export type changes = 'create' | 'changes1' | 'changes2' | 'changes3' | 'changesFinal' | 'setForm';

export interface IBaseField extends Partial<IFieldInfo>{
    fieldType: MyFieldDef;
    name: string;  //Will be Title of list unless title is specified

    onCreateProps?: IFieldCreationProperties;  //Initial Properties at time of creating field

    showNew?: boolean;
    showEdit?: boolean;
    showDisplay?: boolean;

    title?: string;

    onCreateChanges?: IFieldCreationProperties;  //Properties you want changed right after creating field (like update Title so it's matches calculated column titles)
    changes1?: IFieldCreationProperties;  //Properties you want changed any time in your code
    changes2?: IFieldCreationProperties;  //Properties you want changed any time in your code
    changes3?: IFieldCreationProperties;  //Properties you want changed any time in your code
    changesFinal?: IFieldCreationProperties;  //Properties you want changed at the very end... like hiding fields once formula columns are created and views are also created (can't add to view if it's hidden)

}

export interface IXMLField extends IBaseField {
    xml: string;
}

export interface ITextField extends IBaseField{
    maxLength?: number;
}

/**
 * Adds a new SP.FieldMultiLineText to the collection
 *
 * @param title The field title
 * @param numberOfLines Specifies the number of lines of text to display for the field.
 * @param richText Specifies whether the field supports rich formatting.
 * @param restrictedMode Specifies whether the field supports a subset of rich formatting.
 * @param appendOnly Specifies whether all changes to the value of the field are displayed in list forms.
 * @param allowHyperlink Specifies whether a hyperlink is allowed as a value of the field.
 * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
 *
 */
export interface IMultiLineTextField extends IBaseField {
    numberOfLines?: number;
    richText?: boolean;
    restrictedMode?: boolean;
    appendOnly?: boolean;
    allowHyperlink?: boolean;
}

/**
 * Adds a new SP.FieldNumber to the collection
 *
 * @param title The field title
 * @param minValue The field's minimum value
 * @param maxValue The field's maximum value
 * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
 */
//    addNumber(title: string, minValue?: number, maxValue?: number, properties?: IFieldCreationProperties): Promise<IFieldAddResult>;
export interface INumberField extends IBaseField {
    minValue?: number; 
    maxValue?: number; 
}

/**
 * Adds a new SP.FieldBoolean to the collection
 *
 * @param title The field title.
 * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
 */
export interface IBooleanField extends IBaseField {

}

/**
 * Adds a new SP.FieldCalculated to the collection
 *
 * @param title The field title.
 * @param formula The formula for the field.
 * @param dateFormat The date and time format that is displayed in the field.
 * @param outputType Specifies the output format for the field. Represents a FieldType value.
 * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
 */
export interface ICalculatedField extends IBaseField {
    formula: string;
    dateFormat?: DateTimeFieldFormatType;
    outputType?: FieldTypes;
}

/**
 * Adds a new SP.FieldDateTime to the collection
 *
 * @param title The field title
 * @param displayFormat The format of the date and time that is displayed in the field.
 * @param calendarType Specifies the calendar type of the field.
 * @param friendlyDisplayFormat The type of friendly display format that is used in the field.
 * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
 */
export interface IDateTimeField extends IBaseField {
    displayFormat?: DateTimeFieldFormatType;
    calendarType?: CalendarType;
    friendlyDisplayFormat?: DateTimeFieldFriendlyFormatType;
}

/**
 * Adds a new SP.FieldCurrency to the collection
 *
 * @param title The field title
 * @param minValue The field's minimum value
 * @param maxValue The field's maximum value
 * @param currencyLocalId Specifies the language code identifier (LCID) used to format the value of the field
 * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
 */
export interface ICurrencyField extends IBaseField {
    minValue?: number; 
    maxValue?: number; 
    currencyLocalId?: number; //This is technically available but 
}

/**
 * Adds a new SP.FieldUrl to the collection
 * @param title The field title
 */
export interface IURLField extends IBaseField {
    displayFormat?: UrlFieldFormatType;
}

/** Adds a user field to the colleciton
*
* @param title The new field's title
* @param selectionMode The selection mode of the field
* @param selectionGroup Value that specifies the identifier of the SharePoint group whose members can be selected as values of the field
* @param properties
*/
export interface IUserField extends IBaseField {
    selectionMode: FieldUserSelectionMode;
    //selectionGroup?: any; //This is not used in addUser function and not applicable in building webparts... User would need to fill in.
}

/**
 * Adds a SP.FieldLookup to the collection
 *
 * @param title The new field's title
 * @param lookupListId The guid id of the list where the source of the lookup is found
 * @param lookupFieldName The internal name of the field in the source list
 * @param properties Set of additional properties to set on the new field
 */
export interface ILookupField extends IBaseField {
    lookupListId: string;
    lookupFieldName: string;
}

/**
 * Adds a new SP.FieldChoice to the collection
 *
 * @param title The field title.
 * @param choices The choices for the field.
 * @param format The display format of the available options for the field.
 * @param fillIn Specifies whether the field allows fill-in values.
 * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
 */
export interface IChoiceField extends IBaseField {
    choices: string[]; 
    format?: ChoiceFieldFormatType; 
    fillIn?: boolean; 
}

/**
 * Adds a new SP.FieldMultiChoice to the collection
 *
 * @param title The field title.
 * @param choices The choices for the field.
 * @param fillIn Specifies whether the field allows fill-in values.
 * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
 */
export interface IMultiChoiceField extends IBaseField {
    choices: string[]; 
    fillIn?: boolean;
}

/**
* Creates a secondary (dependent) lookup field, based on the Id of the primary lookup field.
*
* @param displayName The display name of the new field.
* @param primaryLookupFieldId The guid of the primary Lookup Field.
* @param showField Which field to show from the lookup list.
*/
export interface IDepLookupField extends IBaseField {
    primaryLookupFieldId: string;
    showField: string;
}

/**
 * Adds a new SP.FieldLocation to the collection
 *
 * @param title The field title.
 * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
 */
export interface ILocationField extends IBaseField {

}



