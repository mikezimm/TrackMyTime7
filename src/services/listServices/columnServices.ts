

//  >>>> ADD import additional controls/components
import { Web } from "@pnp/sp/presets/all";

import { UrlFieldFormatType, Field } from "@pnp/sp/presets/all";
import { IFieldAddResult, FieldTypes, IFieldInfo, IField,
    ChoiceFieldFormatType,
    DateTimeFieldFormatType, CalendarType, DateTimeFieldFriendlyFormatType,
    FieldUserSelectionMode, IFieldCreationProperties, } from "@pnp/sp/fields/types";

import { IItemAddResult } from "@pnp/sp/items";

import { ITextField, IMultiLineTextField, IMyFieldTypes } from './columnTypes';

import { cBool, cCalc, cChoice,cMChoice, cCurr, cDate, cLocal, cLook, cMText, cText, cNumb, cURL, MyFieldDef } from './columnTypes';

import { IListInfo, IMyListInfo } from './listTypes';

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
import "@pnp/sp/views";
import "@pnp/sp/fields/list";


// addText(title: string, maxLength?: number, properties?: IFieldCreationProperties)
// ensure(title: string, desc?: string, template?: number, enableContentTypes?: boolean, additionalSettings?: Partial<IListInfo>): Promise<IListEnsureResult>;


//private async ensureTrackTimeList(myListName: string, myListDesc: string, ProjectOrTime: string): Promise<boolean> {
export async function addTheseFields( myList: IMyListInfo, fieldsToAdd: IMyFieldTypes[]){

    const thisWeb = Web(myList.webURL);
    const thisList = JSON.parse(JSON.stringify(myList));
    delete thisList.webURL;

    const ensuredList = await thisWeb.lists.ensure(thisList);
    const listFields = ensuredList.list.fields;

    for (let f of fieldsToAdd) {

        if (f.fieldType === cText) {
            let thisField : ITextField = JSON.parse(JSON.stringify(f));
            /**
             * Adds a new SP.FieldText to the collection
             *
             * @param title The field title
             * @param maxLength The maximum number of characters allowed in the value of the field.
             * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
             */

            const actualField: IFieldAddResult = await listFields.addText( thisField.title, thisField.maxLength, thisField.properties );
            alert('Tried to add field :) ' + thisField.name);

        }

    }

}



