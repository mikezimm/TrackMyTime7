//  >>>> ADD import additional controls/components
import { UrlFieldFormatType, Field } from "@pnp/sp/presets/all";
import { IFieldAddResult, FieldTypes, IFieldInfo, IField,
    ChoiceFieldFormatType,
    DateTimeFieldFormatType, CalendarType, DateTimeFieldFriendlyFormatType,
    FieldUserSelectionMode, IFieldCreationProperties } from "@pnp/sp/fields/types";

import { IMyFieldTypes, IBaseField , ITextField , IMultiLineTextField , INumberField , IXMLField , 
    IBooleanField , ICalculatedField , IDateTimeField , ICurrencyField , IUserField , ILookupField , IChoiceField , 
    IMultiChoiceField , IDepLookupField , ILocationField, IURLField } from '../../../../services/listServices/columnTypes';

import { MyFieldDef, } from '../../../../services/listServices/columnTypes';

import { IMyView, } from '../../../../services/listServices/viewTypes';

import { Eq, Ne, Lt, Gt, Leq, Geq, IsNull, IsNotNull, Contains, BeginsWith } from '../../../../services/listServices/viewTypes';

//Standard Queries
import { queryValueCurrentUser, queryValueToday } from '../../../../services/listServices/viewTypes';

//Imported but not used so that intellisense can prevent duplicate named columns.
import { ootbID, ootbVersion, ootbTitle, ootbEditor, ootbAuthor, ootbCreated, ootbModified, } from '../../../../services/listServices/columnsOOTB';

//SHARED Columns
import {Leader, Team, Category1, Category2, ProjectID1, ProjectID2, Story, Chapter, StatusTMT, StatusNumber, StatusText,
    DueDateTMT, CompletedDateTMT, CompletedByTMT, CCList, CCEmail} from './columnsTMT';

//PROJECT columns
import { SortOrder, Everyone, Active, ActivityType, ActivityTMT, ActivtyURLCalc, OptionsTMT, OptionsTMTCalc,
    EffectiveStatus, IsOpen,
	ProjectEditOptions, HistoryTMT, TimeTarget} from './columnsTMT';

//TIME columns
import { Activity, DeltaT, Comments, User, StartTime, EndTime, OriginalStart, OriginalEnd, OriginalHours,
    Hours, Days, Minutes, KeyChanges, SourceProject, SourceProjectRef, Settings, Location, EntryType } from './columnsTMT';

	
import { testAlertsView, createRecentUpdatesView } from '../../../../services/listServices/viewsGeneric';

import { spliceCopyArray } from '../../../../services/arrayServices';

export const stdViewFields = [ootbID, StatusTMT, ootbTitle, Category1, Category2, ProjectID1, ProjectID2, Story, Chapter, Leader, Team, User, StartTime, Hours];

export const stdTimeViewFields = ['Edit', ootbID, ootbTitle, Category1, Category2, ProjectID1, ProjectID2, Story, Chapter, Leader, Team];
export const TimeRecentUpdatesFields = spliceCopyArray ( stdTimeViewFields, null, null, 2, [ootbModified, ootbEditor ] );

export const TimeByCreatedView : IMyView = {
    Title: 'By Created Date',
    iFields: 	stdTimeViewFields,
    TabularView: true,
    RowLimit: 33,
    orders: [ {field: ootbCreated, asc: false} ],
    groups: { collapse: true, limit: 30,
		fields: [
			{field: ootbCreated, asc: true},
		],
	},
};

export const TimeByEntryModeView : IMyView = {
    Title: 'By Entry Mode',
    iFields: 	stdTimeViewFields,
    TabularView: true,
    RowLimit: 33,
    orders: [ {field: ootbCreated, asc: false} ],
    groups: { collapse: true, limit: 30,
		fields: [
			{field: EntryType, asc: true},
		],
	},
};

export const TimeYourUserEntries : IMyView = {
    Title: 'Your Items',
    iFields: 	stdTimeViewFields,
    TabularView: true,
    RowLimit: 33,
	orders: [ {field: ootbCreated, asc: false} ],
	wheres: 	[ 	{field: User, 	clause:'Or', 	oper: Eq, 		val: queryValueCurrentUser },
	],
};

export const TimeByUserView : IMyView = {
    Title: 'By User',
    iFields: 	stdTimeViewFields,
    TabularView: true,
    RowLimit: 33,
    orders: [ {field: ootbCreated, asc: false} ],
    groups: { collapse: true, limit: 30,
		fields: [
			{field: User, asc: true},
		],
	},
};

export const VerifyNoStoryOrChapterView : IMyView = {
    Title: 'Verify - No Story or Chapter',
    iFields: 	
	[ootbID,ootbTitle,Active,Leader,Team,User,StartTime,EndTime,Hours,EntryType,Story,Chapter],
    TabularView: true,
    RowLimit: 33,
	orders: [ {field: ootbCreated, asc: false} ],
	wheres: 	[ 	{field: Chapter, 	clause:'Or', 	oper: IsNull, 		val: "" },
					{field: Story, 		clause:'Or', 	oper: IsNull, 		val: "" },
				],
    groups: { collapse: true, limit: 30,
		fields: [
			{field: SourceProject, asc: true},
		],
	},
};

export const TimeStoriesView : IMyView = {
    Title: 'Stories',
    iFields: 	stdTimeViewFields,
    TabularView: true,
    RowLimit: 33,
    orders: [ {field: ootbCreated, asc: false} ],
    groups: { collapse: true, limit: 30,
		fields: [
			{field: Story, asc: true},
			{field: Chapter, asc: true},
		],
	},
};

export const VerifyTimeSummaryView : IMyView = {
    Title: 'Verify - Time Summary',
    iFields: 	[ootbID,ootbTitle,Active,Leader,Team,Category1,Category2,User,StartTime,EndTime,Hours,Minutes,Days,Location,ProjectID1,ProjectID2,EntryType,DeltaT,Activity,Comments,CCList,CCEmail,SourceProject,SourceProjectRef],
    TabularView: true,
    RowLimit: 33,
    orders: [ {field: ootbCreated, asc: false} ],
};

export const VerifyDataChangedView : IMyView = {
    Title: 'Verify - Data Changes',
    iFields: 	[User,ootbTitle,Category1,Category2,StartTime,EndTime,Hours,OriginalHours,OriginalStart,OriginalEnd,KeyChanges],
    TabularView: true,
	RowLimit: 33,
	wheres: 	[ 	{field: KeyChanges, 	clause:'Or', 	oper: IsNotNull, 		val: "" },
	],
    orders: [ {field: ootbCreated, asc: false} ],
};

export const VerifyDataView : IMyView = {
    Title: 'Verify - Data',
    iFields: 	[User,ootbTitle,Category1,Category2,StartTime,EndTime,Hours,OriginalHours,OriginalStart,OriginalEnd,KeyChanges],
    TabularView: true,
    RowLimit: 33,
    orders: [ {field: ootbCreated, asc: false} ],
};

export const VerifyActivityView : IMyView = {
    Title: 'Verify - Has Activity',
    iFields: 	[ootbID,ootbTitle,Category1,Category2,ProjectID1,ProjectID2,Activity,Comments,User,StartTime,EndTime],
    TabularView: true,
	RowLimit: 33,
	wheres: 	[ 	{field: Activity, 	clause:'Or', 	oper: IsNotNull, 		val: "" },
		],
    orders: [ {field: ootbCreated, asc: false} ],
};

export const timeViews : IMyView[] = [ 
	createRecentUpdatesView(TimeRecentUpdatesFields),
	TimeByCreatedView, TimeByEntryModeView, //Grouped By Views
	TimeByUserView, TimeYourUserEntries, //User Centric Views
	TimeStoriesView, 
	VerifyNoStoryOrChapterView, //Story Views
	VerifyTimeSummaryView, VerifyDataView, VerifyDataChangedView, VerifyActivityView //Verify Views
] ;


/**
 * 
 * Example view
 * 
 * export const testProjectView : IMyView = {

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

 */