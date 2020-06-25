import { Web } from "@pnp/sp/presets/all";

import { sp, Views, IViews } from "@pnp/sp/presets/all";

import { IMyFieldTypes, IBaseField , ITextField , IMultiLineTextField , INumberField , IXMLField , 
    IBooleanField , ICalculatedField , IDateTimeField , ICurrencyField , IUserField , ILookupField , IChoiceField , 
    IMultiChoiceField , IDepLookupField , ILocationField, IURLField } from './columnTypes';

import { MyFieldDef, changes, cBool, cCalcN, cCalcT, cChoice, cMChoice, cCurr, cDate, cLocal, cLook, cDLook, 
	cMText, cText, cNumb, cURL, cUser, cMUser, minInfinity, maxInfinity } from './columnTypes';

import { IMyView, IViewField, Eq, Ne, Lt, Gt, Leq, Geq, IsNull, IsNotNull, Contains } from './viewTypes';

import { IListInfo, IMyListInfo, IServiceLog, notify, getXMLObjectFromString } from './listTypes';

import { getHelpfullError } from '../ErrorHandler';

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
import "@pnp/sp/views";
import "@pnp/sp/fields/list";

export interface IViewLog extends IServiceLog {
    view?: string;
}

/**
 * export const testProjectView : IMyView = {

    ServerRelativeUrl: 'TestQuery',
	iFields: 	stdViewFields,
	wheres: 	[ 	{f: StatusTMT, 	c:'OR', 	o: Eq, 		v: "1" },
					{f: Everyone, 	c:'OR', 	o: Eq, 		v: "1" },
					{f: ootbAuthor, c:'OR', 	o: IsNull, 	v: "1" },
					{f: Leader, 	c:'OR', 	o: Eq, 		v: "1" },
					{f: Team, 		c:'OR', 	o: Eq, 		v: queryValueCurrentUser },
				],
    orders: [ {f: ootbID, o: 'asc'}],
    groups: { collapse: false, limit: 25,
		fields: [
			{f: ootbAuthor, o: ''},
			{f: ootbCreated, o: 'asc'},
		],
	},
};
 */


//private async ensureTrackTimeList(myListName: string, myListDesc: string, ProjectOrTime: string): Promise<boolean> {
export async function addTheseViews( steps : changes[], webURL, myList: IMyListInfo, viewsToAdd: IMyView[], skipTry = false): Promise<IViewLog[]>{

    let statusLog : IViewLog[] = [];
    
    const thisWeb = Web(webURL);
    //const thisList = JSON.parse(JSON.stringify(myList));

    const ensuredList = await thisWeb.lists.ensure(myList.title);
    const listViews = ensuredList.list.views;
    
    //let returnArray: [] = [];

    for (let v of viewsToAdd) {

        /**
         * Build view settings schema
         */


        /**
         * Build VewFields schema
         */

        let viewFieldsSchema = v.iFields.map( thisField => { 
            let copyField : IViewField = JSON.parse(JSON.stringify(thisField));
            let fieldName = typeof copyField  === 'object' ? copyField.name : copyField;
            return '<FieldRef Name="' + fieldName + '" />';
        });

        let viewFieldsSchemaString: string = '';
        if ( viewFieldsSchema.length > 0) {
            //viewFieldsSchemaString = '<ViewFields>' + viewFieldsSchema.join('') + '</ViewFields>';
            viewFieldsSchemaString = viewFieldsSchema.join('');            
        }

        console.log('addTheseViews', viewFieldsSchema, viewFieldsSchemaString);



         /**
          * Build view Query schema
          */


        /**
         * Combine all schema elements together
         */

         /**
          * Do view creation
          */
        //listViews.add(v.Title, false, {

            try {
                const result = await listViews.add('Title 1', false, {
                    RowLimit: 10,
                    ViewQuery: "<OrderBy><FieldRef Name='Modified' Ascending='False' /></OrderBy>",
                    //ViewFields: viewFieldsSchemaString,
                });

                let viewXML = result.data.ListViewXml;

                let ViewFieldsXML = getXMLObjectFromString(viewXML,'ViewFields',false, true);
                console.log('ViewFieldsXML', ViewFieldsXML);
                viewXML = viewXML.replace(ViewFieldsXML,viewFieldsSchemaString);

                result.view.setViewXml(viewXML);
    
            } catch (e) {
                // if any of the fields does not exist, raise an exception in the console log
                let errMessage = getHelpfullError(e);
                if (errMessage.indexOf('missing a column') > -1) {
                    let err = `The ${myList.title} list does not have this column yet:  ${v.Title}`;
                    statusLog = notify(statusLog, 'Create', v,  'Creating', err, null);
                } else {
                    let err = `The ${myList.title} list had this error so the webpart may not work correctly unless fixed:  `;
                    statusLog = notify(statusLog, 'Create', v,  'Creating', err, null);
                }
            }




        /**
         * Add response, comments, alerts
         */

    }  //END: for (let f of fieldsToAdd) {

    console.log('addTheseViews', statusLog);
    return(statusLog);

}

/** Sample default simple view schema
 * <View 
 * Name="{B02AD2F6-34B3-4AF9-BA56-4B29BF28C49E}" 
    * DefaultView="TRUE" 
    * MobileView="TRUE" 
    * MobileDefaultView="TRUE" 
    * Type="HTML" 
    * DisplayName="All Items" 
    * Url="/sites/Templates/Tmt/Lists/Projects/AllItems.aspx" 
 * Level="1" BaseViewID="1" 
 * ContentTypeID="0x" 
 * ImageUrl="/_layouts/15/images/generic.png?rev=47" >
    <Query>
        <OrderBy>
            <FieldRef Name="ID" Ascending="FALSE" />
        </OrderBy>
    </Query>
    <ViewFields>
        <FieldRef Name="ID" />
        <FieldRef Name="Active" />
        <FieldRef Name="StatusTMT" />
        <FieldRef Name="SortOrder" />
        <FieldRef Name="LinkTitle" />
        <FieldRef Name="Everyone" />
        <FieldRef Name="Category1" />
        <FieldRef Name="Category2" />
        <FieldRef Name="ProjectID1" />
        <FieldRef Name="ProjectID2" />
        <FieldRef Name="TimeTarget" />
        <FieldRef Name="Story" />
        <FieldRef Name="Chapter" />
        <FieldRef Name="Leader" />
    </ViewFields>
    <RowLimit Paged="TRUE">30</RowLimit>
    <Aggregations Value="Off" />
    <JSLink>clienttemplates.js</JSLink>
    <XslLink Default="TRUE">main.xsl</XslLink>
    <CustomFormatter />
    <ColumnWidth>
        <FieldRef Name="Title" width="265" />
        <FieldRef Name="Options" width="321" />
    </ColumnWidth>
    <ViewData />
    <Toolbar Type="Standard"/>
</View>
 */

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