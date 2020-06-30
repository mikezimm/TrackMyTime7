
import { sp, Views, IViews, IViewInfo } from "@pnp/sp/presets/all";

import { IMyFieldTypes, IBaseField , ITextField , IMultiLineTextField , INumberField , IXMLField , 
    IBooleanField , ICalculatedField , IDateTimeField , ICurrencyField , IUserField , ILookupField , IChoiceField , 
    IMultiChoiceField , IDepLookupField , ILocationField, IURLField } from './columnTypes';

//Imported but not used so that intellisense can prevent duplicate named columns.
import { ootbID, ootbTitle, ootbEditor, ootbAuthor, ootbCreated, ootbModified, } from './columnsOOTB';

export interface MyOperator {
    q: string;
    o: string;
}

/**
 * Standard query values
 */
export const queryValueCurrentUser = '<Value Type="Integer"><UserID Type="Integer" /></Value>';

export function queryValueToday(offSetDays: number = null){

    if ( offSetDays == null || offSetDays === 0 ) {
        return '<Value Type="DateTime"><Today /></Value>';
    } else {
        return '<Value Type="DateTime"><Today OffsetDays="' + offSetDays + '" /></Value>';
    }

}

export const Eq : MyOperator = { q:'Eq' , o: '='};
export const Ne : MyOperator = { q:'Ne' , o: '<>'};
export const Gt : MyOperator = { q:'Gt' , o: '>'};
export const Geq : MyOperator = { q:'Geq' , o: '>='};
export const Lt : MyOperator = { q:'Lt' , o: '<'};
export const Leq : MyOperator = { q:'Leq' , o: '<='};
export const IsNull : MyOperator = { q:'IsNull' , o: 'IsNull'};
export const IsNotNull : MyOperator = { q:'IsNotNull' , o: 'IsNotNull'};
export const Contains : MyOperator = { q:'Contains' , o: 'Contains'};
export const BeginsWith : MyOperator = { q:'BeginsWith' , o: 'BeginsWith'};




export interface IViewOrder {
    field: string | IMyFieldTypes;
    asc: true | false;
}

export interface IViewWhere {
    field: string | IMyFieldTypes; // Static Name
    clause: 'Or' | 'And'; //clause
    oper: MyOperator ; //Operator
    val: string; //Value
}

export interface IViewGroupBy {
    fields?: IViewOrder[];
    collapse?: boolean;
    limit?: number;
}

export type IViewField = IMyFieldTypes | string;

export interface IMyView extends Partial<IViewInfo> {
    Title: string;
    ServerRelativeUrl?: string;  //For creating views, just partial URL with no .aspx
    RowLimit?: number; //Optional.  Default = 30
    iFields?: IViewField[]; //Interface Objects of ViewFields in array (from columnTypes)
    wheres?: IViewWhere[];
    orders?: IViewOrder[];
    groups?: IViewGroupBy;
}
