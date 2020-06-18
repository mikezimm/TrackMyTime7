
//  >>>> ADD import additional controls/components
import { UrlFieldFormatType, Field } from "@pnp/sp/presets/all";
import { IFieldAddResult, FieldTypes, IFieldInfo, IField,
    ChoiceFieldFormatType,
    DateTimeFieldFormatType, CalendarType, DateTimeFieldFriendlyFormatType,
    FieldUserSelectionMode, IFieldCreationProperties, } from "@pnp/sp/fields/types";

import { IItemAddResult } from "@pnp/sp/items";
import "@pnp/sp/lists";
import { IListInfo } from './listTypes';


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

export const cBool =    {    kind :8 ,    type : 'SP.Field'  };

export const cNumb =    {    kind : 9,    type : 'SP.FieldNumber'  };

export const cCurr =    {    kind : 10,    type : 'SP.FieldCurrency'  };

export const cURL =     {    kind : 11,    type : 'SP.FieldUrl'  };

export const cMChoice = {    kind :15 ,    type : 'SP.FieldMultiChoice'  };

export const cCalc =    {    kind : 17,    type : 'SP.FieldCalculated'  };

export const cUser =    {    kind : 20,    type : 'SP.FieldUser'  };

export const cLocal =   {    kind : 33,    type : 'SP.FieldLocation'  };

export type IMyFieldTypes = ITextField | IMultiLineTextField | INumberField;

/**
 * Adds a new SP.FieldText to the collection
 *
 * @param title The field title
 * @param maxLength The maximum number of characters allowed in the value of the field.
 * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
 */

export interface ITextField extends Partial<IFieldInfo>{
    fieldType: MyFieldDef;
    name: string;  //Will be Title of list unless title is specified
    maxLength: number;
    title?: string;
    properties?: IFieldCreationProperties;
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
export interface IMultiLineTextField extends Partial<IFieldInfo> {
    fieldType: MyFieldDef;
    name: string;
    title?: string;  //Will be Title of list unless title is specified
    numberOfLines?: number;
    richText?: boolean;
    restrictedMode?: boolean;
    appendOnly?: boolean;
    allowHyperlink?: boolean;
    properties?: IFieldCreationProperties;
}

export interface INumberField extends Partial<IFieldInfo>{
    fieldType: MyFieldDef;
    name: string;
    title?: string;  //Will be Title of list unless title is specified
}
