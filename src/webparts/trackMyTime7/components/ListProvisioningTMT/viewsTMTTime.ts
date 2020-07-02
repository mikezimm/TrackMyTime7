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

export const stdViewFields = [ootbID, Active, StatusTMT, SortOrder, ootbTitle, Everyone, Category1, Category2, ProjectID1, ProjectID2, Story, Chapter, Leader, Team];

export const stdTimeViewFields = ['Edit', ootbID, ootbTitle, Category1, Category2, ProjectID1, ProjectID2, Story, Chapter, Leader, Team, Everyone];
export const TimeRecentUpdatesFields = spliceCopyArray ( stdTimeViewFields, null, null, 2, [ootbModified, ootbEditor ] );

export const timeViews : IMyView[] = [ 
    createRecentUpdatesView(TimeRecentUpdatesFields), 

] ;

/**  Sample schema
 * <Where>
	<And>
		<Or>
			<Or>
				<Eq>
					<FieldRef Name="Author" />
					<Value Type="Integer">
						<UserID Type="Integer" />
					</Value>
				</Eq>
				<Eq>
					<FieldRef Name="zzzApprover1" />
					<Value Type="Integer">
						<UserID Type="Integer" />
					</Value>
				</Eq>
			</Or>
			<Eq>
				<FieldRef Name="zzzApprover2" />
				<Value Type="Integer">
					<UserID Type="Integer" />
				</Value>
			</Eq>
		</Or>
		<Eq>
			<FieldRef Name="zzzEffectiveStatus" />
			<Value Type="Text">4</Value>
		</Eq>
	</And>
</Where>
<Where>
	<Or>
		<Or>
			<Or>
				<Or>
					<Eq>
						<FieldRef Name="ID" />
						<Value Type="Counter">1</Value>
					</Eq>
					<Eq>
						<FieldRef Name="Everyone" />
						<Value Type="Boolean">1</Value>
					</Eq>
				</Or>
				<IsNull>
					<FieldRef Name="Author" />
				</IsNull>
			</Or>
			<Eq>
				<FieldRef Name="Leader" />
				<Value Type="User">Clicky McClickster</Value>
			</Eq>
		</Or>
		<Eq>
			<FieldRef Name="Team" />
			<Value Type="Integer">
				<UserID Type="Integer" />
			</Value>
		</Eq>
	</Or>
</Where>
<GroupBy Collapse="TRUE" GroupLimit="30">
	<FieldRef Name="Author" />
	<FieldRef Name="Created" Ascending="FALSE" />
</GroupBy>
 */