

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

import { getHelpfullError } from '../ErrorHandler';

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
import "@pnp/sp/views";
import "@pnp/sp/fields/list";


// addText(title: string, maxLength?: number, properties?: IFieldCreationProperties)
// ensure(title: string, desc?: string, template?: number, enableContentTypes?: boolean, additionalSettings?: Partial<IListInfo>): Promise<IListEnsureResult>;


//private async ensureTrackTimeList(myListName: string, myListDesc: string, ProjectOrTime: string): Promise<boolean> {
export async function addTheseFields( step: string, webURL, myList: IMyListInfo, fieldsToAdd: IMyFieldTypes[]): Promise<boolean>{

    const thisWeb = Web(webURL);
    //const thisList = JSON.parse(JSON.stringify(myList));

    const ensuredList = await thisWeb.lists.ensure(myList.title);
    const listFields = ensuredList.list.fields;

    //let returnArray: [] = [];

    for (let f of fieldsToAdd) {
        console.log('trying adding column:', f);

            /**
             * Adds a new SP.FieldText to the collection
             *
             * @param title The field title
             * @param maxLength The maximum number of characters allowed in the value of the field.
             * @param properties Differ by type of field being created (see: https://msdn.microsoft.com/en-us/library/office/dn600182.aspx)
             */


            if ( step === 'Create') {

                let foundField = false;
                try {
                    const checkField = await listFields.getByInternalNameOrTitle(f.name).get();
                    alert('Checked for field ' + f.name + ' and found: ' + checkField);
                    foundField = true;

                } catch (e) {
                    // if any of the fields does not exist, raise an exception in the console log
                    let errMessage = getHelpfullError(e);
                    let err = `The ${myList.title} list had this error so the webpart may not work correctly unless fixed:  `;
                    alert(err + errMessage);
                    console.log(err, errMessage);
                }

                if (foundField === false) {
                    //Have to do this in order for TS not to throw error
                    let thisField = JSON.parse(JSON.stringify(f));
                    //onCreateProps?: IFieldCreationProperties;  //Initial Properties at time of creating field
                    //onCreateChanges?: IFieldCreationProperties;  //Properties you want changed right after creating field (like update Title so it's matches calculated column titles)
                    switch ( f.fieldType.type ){
                        case cText.type :
                            const actualField: IFieldAddResult = await listFields.addText( thisField.name, thisField.maxLength, thisField.onCreateProps );
                            break ;

                        case cMText.type :

                            break ;

                        case cNumb.type :

                            break ;

                        case cNumb.type :

                            break ;

                        case cNumb.type :

                            break ;

                        case cNumb.type :

                            break ;

                        case cNumb.type :

                            break ;

                        default :   // stuff
                                    break ; 
                    }

                    alert('Tried to add field :) ' + f.name);

                    if ( thisField.showNew === false ) {
                        const setDisp = await listFields.getByInternalNameOrTitle(f.name).setShowInNewForm(thisField.showNew);
                        alert('Updated ' + f.name + '  setShowInNewForm to: ' + thisField.showNew);                                      
                    }

                    if ( thisField.showEdit === false ) {
                        const setDisp = await listFields.getByInternalNameOrTitle(f.name).setShowInEditForm(thisField.showEdit);
                        alert('Updated ' + f.name + '  setShowInEditForm to: ' + thisField.showNew);                                      
                    }

                    if ( thisField.showDisplay === false ) {
                        const setDisp = await listFields.getByInternalNameOrTitle(f.name).setShowInDisplayForm(thisField.showDisplay);
                        alert('Updated ' + f.name + '  setShowInDisplayForm to: ' + thisField.showNew);                                      
                    }

                    if (thisField.onCreateChanges) {
                        const addTitle = await listFields.getByInternalNameOrTitle(f.name).update(thisField.onCreateChanges);
                        alert('Updated ' + f.name + ' to: ' + JSON.stringify(thisField.onCreateChanges));
                    }



                } else {
                    alert('Field already existed... skipping: ' + f.name);
                }

            }

    }

    return(true);

}



