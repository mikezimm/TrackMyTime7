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

import { statusChoices, defStatus }  from '../../webparts/trackMyTime7/components/TrackMyTime7';

//Imported but not used so that intellisense can prevent duplicate named columns.
import { ootbID, ootbTitle, ootbEditor, ootbAuthor, ootbCreated, ootbModified, } from './columnsOOTB';

//SHARED Columns
import {Leader, Team, Category1, Category2, ProjectID1, ProjectID2, Story, Chapter, StatusTMT, StatusNumber, StatusText,
    DueDateTMT, CompletedDateTMT, CompletedByTMT, CCList, CCEmail} from './columnsTMT';

//TIME columns
import { Activity, DeltaT, Comments, User, StartTime, EndTime, OriginalStart, OriginalEnd, OriginalHours,
    Hours, Days, Minutes, KeyChanges, SourceProject, SourceProjectRef, Settings, Location, EntryType } from './columnsTMT';

import { testAlertsView, createRecentUpdatesView } from './viewsGeneric';

import { spliceCopyArray } from '../arrayServices';


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