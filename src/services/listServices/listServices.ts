//  >>>> ADD import additional controls/components
import { Web } from "@pnp/sp/presets/all";

import { UrlFieldFormatType, Field } from "@pnp/sp/presets/all";
import { IFieldAddResult, FieldTypes, IFieldInfo, IField, IFields,
    ChoiceFieldFormatType,
    DateTimeFieldFormatType, CalendarType, DateTimeFieldFriendlyFormatType,
    FieldUserSelectionMode, IFieldCreationProperties, } from "@pnp/sp/fields/types";

import { IItemAddResult } from "@pnp/sp/items";

import { IMyFieldTypes, IBaseField , ITextField , IMultiLineTextField , INumberField , IXMLField ,
    IBooleanField , ICalculatedField , IDateTimeField , ICurrencyField , IUserField , ILookupField , IChoiceField ,
    IMultiChoiceField , IDepLookupField , ILocationField } from './columnTypes';

import { MyFieldDef, changes, cBool, cCalcT, cCalcN, cChoice, cMChoice, cCurr, cDate, cLocal, cLook, cDLook,
    cMText, cText, cNumb, cURL, cUser, cMUser } from './columnTypes';

import { doesObjectExistInArray, compareArrays } from '../arrayServices';

import { IListInfo, IMyListInfo, IServiceLog, notify } from './listTypes';

import { getHelpfullError } from '../ErrorHandler';

import "@pnp/sp/webs";
import "@pnp/sp/lists";

export interface IListLog extends IServiceLog {
    list?: string;
}

/**
 * 
 * @param myList 
 * @param ensuredList 
 * @param ItemsToAdd - array of items to add to the list
 * @param alertMe 
 * @param consoleLog 
 * @param alwaysCreateNew - currently no functionality to use this but long term intent would be to check if item exists first, then only add if it does not exist.
 */
export async function addTheseItemsToList( myList: IMyListInfo, thisWeb, ItemsToAdd: any[], alertMe: boolean, consoleLog: boolean, alwaysCreateNew = true ): Promise<IListLog[]>{

    let statusLog : IListLog[] = [];
    console.log('Starting addTheseItemsToList', ItemsToAdd);

    let list = thisWeb.lists.getByTitle(myList.title);
    const entityTypeFullName = await list.getListItemEntityTypeFullName();

    let batch = thisWeb.createBatch();

    for (let item of ItemsToAdd) {
    //, Category1: { results: ['Training']}
        let thisItem = Object.keys(item)[0] + '===' + item[Object.keys(item)[0]];
        //let checkValue = thisItem;
        // Removed try/catch per https://github.com/pnp/pnpjs/issues/1275#issuecomment-658578589
        list.items.inBatch(batch).add( item , entityTypeFullName).then(b => {
            statusLog = notify(statusLog, 'Created Item', 'Batched', null, null, null, thisItem );
        });
    }

    try {
        await batch.execute();

        // Have a way to check which items did not get added.

        alert(`Oh... One more thing... We created a few generic Projects under the EVERYONE Category to get you started.  Just refresh the page and click on that heading to see them.`);

    } catch (e) {
        //ONLY SEEMS TO CATCH FIRST ERROR IN BATCH.
        //OTHER BATCH ITEMS GET PROCESSED BUT ONLY FLAGS FIRST ONE.
        //CONFIRMED LATER ITEMS IN ARRAY AFTER ERROR STILL GET PROCESSED, JUST NOT ERRORED OUT
        let errMessage = getHelpfullError(e, alertMe, consoleLog);
        if (errMessage.indexOf('missing a column') > -1) {
            let err = `The ${myList.title} list does not have XYZ or TBD yet:  ${'thisItem'}`;
            statusLog = notify(statusLog, 'Created Item', err, null, null, null, null);
        } else {
            let err = errMessage;
            statusLog = notify(statusLog, 'Problem processing Batch', err, null, null, null, null);
        }
    }

    let result : any [] = compareArrays(statusLog, ItemsToAdd, 'ReturnFound', 'checkValue','===', 'Both');

    return statusLog;
}

