
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

export type IMyFieldTypes = IBaseField | ITextField | IMultiLineTextField | INumberField;

/**
 * Adds a new SP.FieldText to the collection
 *
 * @param title The field title
 * @param maxLength The maximum number of characters allowed in the value of the field.
 * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
 */

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


export interface ITextField extends IBaseField{
    maxLength: number;
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

export interface INumberField extends IBaseField {

}
