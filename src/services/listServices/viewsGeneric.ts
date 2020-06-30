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
	
import { IMyView, Eq, Ne, Lt, Gt, Leq, Geq, IsNull, IsNotNull, Contains, BeginsWith } from './viewTypes';

import { spliceCopyArray } from '../arrayServices';

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
 * Array splicer to remove elements, and add in  middle
 * @param sourceArray 
 * @param startDel - zero based index where you want to start deleting
 * @param countDelete - # of elements to delete
 * @param startAddOrigPos - starting position to add addArray to... NOTE:  Based on ORIGINAL sourceArray elements
 *      The reason for startAddOrigPos is because you don't need to figure out the right position if you remove elements first.
 * @param addArray 
 */


export const stdViewFieldsTest = ['Edit', ootbAuthor, ootbCreated, ootbEditor, ootbModified, ootbTitle, ootbVersion, ];

export const testAlertsView : IMyView = {

    Title: 'E82 startWhere',
    iFields: 	stdViewFieldsTest,
    TabularView: true,
    RowLimit: 22,
	wheres: 	[ 	{field: Everyone, 	clause:'Or', 	oper: Contains, val: "4" },  //Error because Everyone should not be 4
                    {field: Story, 	    clause:'Or', 	oper: Contains, 		val: "T" }, //Error because can't use BeginsWith on Indexed column
                    {field: Leader, 	clause:'Or', 	oper: BeginsWith, 		val: "4" }, //Error because can't use BeginsWith on Person column
					{field: Leader, 	clause:'And', 	oper: Eq, 		val: queryValueCurrentUser },
					{field: Team, 		clause:'Or', 	oper: Eq, 		val: queryValueCurrentUser }, //Error because Or should not come after And
				],
    orders: [ 
        {field: ootbID, asc: true}, 
        {field: 'Step4Check', asc: false} 
    ],
    groups: { collapse: false, limit: 25,
		fields: [
			{field: ootbAuthor, asc: false},
			{field: ootbCreated, asc: true},
		],
	},
};

export const testProjectView : IMyView = {

    Title: 'E86 startWhere',
    iFields: 	stdViewFieldsTest,
    TabularView: true,
    RowLimit: 22,
	wheres: 	[ 	{field: StatusTMT, 	clause:'Or', 	oper: Eq, 		val: "1" },
					{field: Everyone, 	clause:'Or', 	oper: Eq, 		val: "4" },
                    {field: ootbAuthor, clause:'Or', 	oper: IsNull, 	val: "1" },
                    {field: ootbModified, clause:'Or', 	oper: Geq, 	val: queryValueToday(-22) },
					{field: Leader, 	clause:'Or', 	oper: IsNotNull,val: queryValueCurrentUser },
					{field: Team, 		clause:'Or', 	oper: Eq, 		val: queryValueCurrentUser },
				],
    orders: [ {field: ootbID, asc: true}, {field: 'Step4Check', asc: false} ],
    groups: { collapse: false, limit: 25,
		fields: [
			{field: ootbAuthor, asc: false},
			{field: ootbCreated, asc: true},
		],
	},
};

export function createRecentUpdatesView(viewFields) {
    let result : IMyView = {
        Title: 'Recent Updates',
        iFields: viewFields,
        TabularView: true,
        RowLimit: 30,
        wheres: 	[ 	{field: ootbModified, clause:'And', 	oper: Geq, 	val: queryValueToday(-730) }, //Recently defined as last 2 years max (for indexing)
                    ],
        orders: [ {field: ootbModified, asc: false} ],
    };
    return result;
}

export const genericViews : IMyView[] = [ createRecentUpdatesView(stdViewFieldsTest), testProjectView ];


