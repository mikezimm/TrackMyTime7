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

import { testAlertsView, createRecentUpdatesView } from './viewsGeneric';

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

export const stdViewFields = [ootbID, Active, StatusTMT, SortOrder, ootbTitle, Everyone, Category1, Category2, ProjectID1, ProjectID2, Story, Chapter, Leader, Team];

export const stdProjectViewFields = ['Edit', ootbID, ootbTitle, Category1, Category2, ProjectID1, ProjectID2, Story, Chapter, Leader, Team, Everyone];
export const ProjectRecentUpdatesFields = spliceCopyArray ( stdProjectViewFields, null, null, 2, [ootbModified, ootbEditor ] );

export const ProjAllItemsView : IMyView = {
    Title: 'All Items',
    iFields: 	stdProjectViewFields,
    wheres: 	[ 	{field: ootbModified, clause:'And', 	oper: Geq, 	val: queryValueToday(-730) }, //Recently defined as last 2 years max (for indexing)
            ],
    orders: [ {field: ootbModified, asc: false} ],
};

let OptionsFields = [ootbID, ootbTitle, OptionsTMT, OptionsTMTCalc, Category1, Category2, ProjectID1, ProjectID2, Story, Chapter, ProjectEditOptions];

export const ProjOptionsView : IMyView = {
    Title: 'Options',
    iFields: 	OptionsFields,
    orders: [ {field: SortOrder, asc: true} ],
};

let ActivityFields = [ootbID, ootbTitle, ActivityType, ActivityTMT, OptionsTMTCalc, ActivtyURLCalc, ootbModified];

export const ProjActivityGroupView : IMyView = {
    Title: 'Activity',
    iFields: 	ActivityFields,
    orders: [ {field: ActivityType, asc: false} ],
    groups: { collapse: true, limit: 30,
		fields: [ {field: ActivityType, asc: false},  ],  },
};

export const ProjActivityFlatView : IMyView = {
    Title: 'ActivityFlat',
    iFields: 	ActivityFields,
    orders: [ {field: ootbModified, asc: false} ],
};

let TaskFields = [ootbID, Active, StatusTMT, SortOrder, ootbTitle, Everyone, Category1, EffectiveStatus, CompletedDateTMT, CompletedByTMT, DueDateTMT, IsOpen, StatusNumber, StatusText, 'Step0Check', 'Step1Check', 'Step2Check', 'Step3Check', 'Step4Check', 'Step5Check'];

export const ProjTaskColumnsView : IMyView = {
    Title: 'Task Columns',
    iFields: 	TaskFields,
    orders: [ {field: ootbID, asc: false} ],
};

export function ProjStepsViews(prefix : string, min: number, max: number, skip: number[], fieldSuffix: string, viewSuffix: string){

    let StepFields = [ootbID, Active, StatusTMT, SortOrder, ootbTitle, Everyone, Category1, StatusTMT, EffectiveStatus, CompletedDateTMT, CompletedByTMT, DueDateTMT, IsOpen, StatusNumber, StatusText ];

    let StepViews : IMyView[] = [];

    for ( let i = min; i < max; i++) {
        if ( skip.indexOf(i) < 0 ) {
            let thisField = prefix + i + fieldSuffix; //Only needed if we have columns for this.
            let thisTitle = prefix + i + '.' + viewSuffix;
            let thisView : IMyView = {
                Title: thisTitle,
                iFields: 	spliceCopyArray( StepFields, null, null, 1000, [thisField] ),
                orders: [ {field: DueDateTMT, asc: true} ],
                wheres: 	[ 	{field: EffectiveStatus, clause:'And', 	oper: Eq, 	val: i.toString() }, ],
            };
            StepViews.push(thisView);
        }
    }

    return StepViews;

}

export const projectViews : IMyView[] = [ 
    ProjAllItemsView, createRecentUpdatesView(ProjectRecentUpdatesFields), 
    ProjOptionsView, ProjActivityGroupView, ProjActivityFlatView,
    ProjTaskColumnsView

].concat(ProjStepsViews('Step', 0, 10, [6,7], 'Check', 'All'))  ;


