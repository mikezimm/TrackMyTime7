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
	
import { IMyView, Eq, Ne, Lt, Gt, Leq, Geq, IsNull, IsNotNull, Contains } from './viewTypes';

//Standard Queries
import { queryValueCurrentUser, queryValueToday } from './viewTypes';


import { statusChoices, defStatus }  from '../../webparts/trackMyTime7/components/TrackMyTime7';

/**
 * For Importing columns, it's best to create one view file per list and only import the columns from that list :
 */

//Imported but not used so that intellisense can prevent duplicate named columns.
import { ootbID, ootbVersion, ootbTitle, ootbEditor, ootbAuthor, ootbCreated, ootbModified, } from './columnsOOTB';

//SHARED Columns
import {Leader, Team, Category1, Category2, ProjectID1, ProjectID2, Story, Chapter, StatusTMT, StatusNumber, StatusText,
    DueDateTMT, CompletedDateTMT, CompletedByTMT, CCList, CCEmail} from './columnsTMT';

//PROJECT columns
import { SortOrder, Everyone, Active, ActivityType, ActivityTMT, ActivtyURLCalc, OptionsTMT, OptionsTMTCalc,
    EffectiveStatus, IsOpen,
    ProjectEditOptions, HistoryTMT, TimeTarget} from './columnsTMT';
//let checks = StepChecks(0,5);  //Project

/**
 * 
export interface IViewOrder {
    field: string | IMyFieldTypes; //Static Name
    order: '+' | '-';
}

export interface IViewWhere {
    field: string | IMyFieldTypes; // Static Name
    clause: '||' | '&&'; //
    oper: MyOperator ; //Operator
    val: string; //Value
}

export interface IViewGroupBy {
    fields?: IViewOrder[];
    collapse?: boolean;
    limit?: number;
}
 */


export const stdViewFields = [ootbID, Active, StatusTMT, SortOrder, ootbTitle, Everyone, Category1, Category2, ProjectID1, ProjectID2, Story, Chapter, Leader, Team];

export const stdViewFieldsTest = ['Edit', ootbVersion, ootbAuthor, ootbCreated, ootbEditor, ootbModified, 'Step5Check', ootbTitle ];

export const testProjectView : IMyView = {

    Title: 'E94 fixedAuthor',
    iFields: 	stdViewFieldsTest,
    TabularView: true,
    RowLimit: 22,
	wheres: 	[ 	{field: StatusTMT, 	clause:'OR', 	oper: Eq, 		val: "1" },
					{field: Everyone, 	clause:'OR', 	oper: Eq, 		val: "1" },
					{field: ootbAuthor, clause:'OR', 	oper: IsNull, 	val: "1" },
					{field: Leader, 	clause:'OR', 	oper: Eq, 		val: "1" },
					{field: Team, 		clause:'OR', 	oper: Eq, 		val: queryValueCurrentUser },
				],
    orders: [ {field: ootbID, asc: true}, {field: 'Step4Check', asc: false} ],
    groups: { collapse: false, limit: 25,
		fields: [
			{field: ootbAuthor, asc: false},
			{field: ootbCreated, asc: true},
		],
	},
};

export const projectViews : IMyView[] = [ testProjectView ];

