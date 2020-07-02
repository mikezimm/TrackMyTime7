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
    
import { IListInfo, IMyListInfo, IServiceLog, notify } from './listTypes';

import { getHelpfullError } from '../ErrorHandler';

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
import "@pnp/sp/fields/list";


export interface IFieldLog extends IServiceLog {
    field?: string;
}

export const minInfinity: number = -1.7976931348623157e+308;
export const maxInfinity: number = -1 * minInfinity ;

// addText(title: string, maxLength?: number, properties?: IFieldCreationProperties)
// ensure(title: string, desc?: string, template?: number, enableContentTypes?: boolean, additionalSettings?: Partial<IListInfo>): Promise<IListEnsureResult>;

//private async ensureTrackTimeList(myListName: string, myListDesc: string, ProjectOrTime: string): Promise<boolean> {



export async function addTheseFieldsOriginal( steps : changes[], webURL, myList: IMyListInfo, fieldsToAdd: IMyFieldTypes[], skipTry = false): Promise<IFieldLog[]>{

    let statusLog : IFieldLog[] = [];
    
    const thisWeb = Web(webURL);
    //const thisList = JSON.parse(JSON.stringify(myList));

    const ensuredList = await thisWeb.lists.ensure(myList.title);
    const listFields = ensuredList.list.fields;
    //    .select(selectColsProj).expand(expandTheseProj).filter(projectRestFilter).orderBy(projectSort,true).inBatch(batch).getAll()

    const  myFields = await listFields.select('StaticName,Title,Hidden,Formula,Required,TypeAsString').filter(`StaticName eq 'Title' or StaticName eq 'Editor'`).get();
    console.log('listFields:', listFields);
    console.log('myFields:', myFields);

    //let returnArray: [] = [];

    return statusLog;
}


export async function addTheseFields( steps : changes[], myList: IMyListInfo, ensuredList, currentFields , fieldsToAdd: IMyFieldTypes[], alertMe: boolean, consoleLog: boolean, skipTry = false): Promise<IFieldLog[]>{

    let statusLog : IFieldLog[] = [];
    
    const listFields = ensuredList.list.fields;

    for ( let step of steps ) {

        for (let f of fieldsToAdd) {
            //console.log(step + ' trying adding column:', f);

            let foundField = skipTry === true ? true : false;
            let skipTryField : boolean;

            if ( step !== 'create' && step !== 'setForm' && f[step] != null ) {
                //Skip trying field because it's not having anything done to it
                foundField = false;//
                skipTryField = false;
            } else { skipTryField = skipTry; }

            if ( skipTryField != true ) {
                try {
                    const checkField = await listFields.getByInternalNameOrTitle(f.name).get();
                    statusLog = notify(statusLog, step, f,  'Checked', 'Found', checkField);
                    foundField = true;
        
                } catch (e) {
                    // if any of the fields does not exist, raise an exception in the console log
                    let errMessage = getHelpfullError(e, alertMe, consoleLog);
                    if (errMessage.indexOf('missing a column') > -1) {
                        let err = `The ${myList.title} list does not have this column yet:  ${f.name}`;
                        statusLog = notify(statusLog, step, f,  'Checked', err, null);
                    } else {
                        let err = `The ${myList.title} list had this error so the webpart may not work correctly unless fixed:  `;
                        statusLog = notify(statusLog, step, f,  'Checked', err, null);
                    }
                }
            }

            //Have to do this in order for TS not to throw error
            let thisField = JSON.parse(JSON.stringify(f));
            //onCreateProps?: IFieldCreationProperties;  //Initial Properties at time of creating field
            //onCreateChanges?: IFieldCreationProperties;  //Properties you want changed right after creating field (like update Title so it's matches calculated column titles)
            let actualField : IFieldAddResult = null;

            if ( step === 'create' && foundField === false) {
                if (thisField.xml) {
                    actualField = await listFields.createFieldAsXml(thisField.xml);

                } else {

                    switch ( f.fieldType.type ){
                        case cText.type :
                            actualField = await listFields.addText( thisField.name, 
                                thisField.maxLength ? thisField.maxLength : 255, 
                                thisField.onCreateProps );
                            break ;
    
                        case cMText.type :
                            actualField = await listFields.addMultilineText(thisField.name, 
                                thisField.numberOfLines ? thisField.numberOfLines : 6, 
                                thisField.richText ? thisField.richText : false, 
                                thisField.restrictedMode ? thisField.restrictedMode : false, 
                                thisField.appendOnly ? thisField.appendOnly : false, 
                                thisField.allowHyperlink ? thisField.allowHyperlink : false,
                                thisField.onCreateProps);
    
                            break ;
    
                        case cNumb.type :
                            actualField = await listFields.addNumber(thisField.name, 
                                thisField.minValue ? thisField.minValue : minInfinity, 
                                thisField.maxValue ? thisField.maxValue : maxInfinity, 
                                thisField.onCreateProps);
                            break ;
    
                        case cURL.type :
                            actualField = await listFields.addUrl(thisField.name, 
                                thisField.displayFormat ? thisField.displayFormat : UrlFieldFormatType.Hyperlink,
                                thisField.onCreateProps);
                            break ;
    
                        case cChoice.type :
                            actualField = await listFields.addChoice(thisField.name, thisField.choices, 
                                thisField.format ? thisField.format : ChoiceFieldFormatType.Dropdown, 
                                thisField.fillIn ? thisField.fillIn : false, 
                                thisField.onCreateProps);
                            break ;
    
                        case cMChoice.type :
                                actualField = await listFields.addMultiChoice(thisField.name, thisField.choices,
                                    thisField.fillIn ? thisField.fillIn : false, 
                                    thisField.onCreateProps);
                                break ;
    
                        case cUser.type :
                            actualField = await listFields.addUser(thisField.name,
                                thisField.selectionMode ?  thisField.selectionMode : FieldUserSelectionMode.PeopleOnly,
                                thisField.onCreateProps);
                            break ;

                        case cMUser.type :
                            let fieldName = thisField.name;
                            let fieldTitle = thisField.title ? thisField.title : thisField.Title ? thisField.Title : thisField.onCreateProps.Title ? thisField.onCreateProps.Title : fieldName;
                            let fieldGroup = thisField.onCreateProps.Group ? thisField.onCreateProps.Group : '';
                            let fieldDesc = thisField.onCreateProps.Description ? thisField.onCreateProps.Description : '';
                            let fieldSelectMode = thisField.selectionMode;
                            let thisSchema = '<Field DisplayName="' + fieldTitle + '" Type="UserMulti"';
                            thisSchema += ' Required="FALSE" StaticName="' + fieldName + '" Name="' + fieldName + '"';
                            thisSchema += ' UserSelectionMode="' + fieldSelectMode + '"';
                            thisSchema += ' Group="' + fieldGroup + '"';
                            thisSchema += ' Description="' + fieldDesc + '"';
                            thisSchema += ' EnforceUniqueValues="FALSE" ShowField="ImnName" UserSelectionScope="0" Mult="TRUE" Sortable="FALSE"/>';
                            // ^^^^ I think ShowField=ImnName shows field as skype jellybean; ShowField=Name shows account name ; ShowField="EMail" shows email address
                            // ^^^^ EnforceUniqueValues & Sortable need to be false for Multi-select fields.

                            actualField = await listFields.createFieldAsXml(thisSchema);

                            break ;
    
                        case cCalcN.type || cCalcT.type :
                            actualField = await listFields.addCalculated(thisField.name, 
                                thisField.formula, 
                                thisField.dateFormat ? thisField.dateFormat : DateTimeFieldFormatType.DateOnly, 
                                f.fieldType.type === 'Number'? FieldTypes.Number : FieldTypes.Text,  //FieldTypes.Number is used for Calculated Link columns
                                thisField.onCreateProps);
                            break ;
    
                        case cDate.type :
                            actualField = await listFields.addDateTime(thisField.name,
                                thisField.displayFormat ? thisField.displayFormat : DateTimeFieldFormatType.DateOnly,
                                thisField.calendarType ? thisField.calendarType : CalendarType.Gregorian,
                                thisField.friendlyDisplayFormat ? thisField.friendlyDisplayFormat : DateTimeFieldFriendlyFormatType.Disabled,
                                thisField.onCreateProps);
                            break ;
    
                        case cBool.type :
                            actualField = await listFields.addBoolean( thisField.name, thisField.onCreateProps );
                            break ;
    
                        case cCurr.type :
                            actualField = await listFields.addCurrency(thisField.name,
                                thisField.minValue ? thisField.minValue : minInfinity,
                                thisField.maxValue ? thisField.maxValue : maxInfinity,
                                thisField.currencyLocalId ? thisField.currencyLocalId : maxInfinity,
                                thisField.onCreateProps);
                            break ;
    
                        default :   // stuff
                            alert('Didn\'t find field type for ' + thisField.name + ':  ' + JSON.stringify(thisField.fieldType));
                            break ; 
                    }
                }
                foundField = true;
                statusLog = notify(statusLog, step, f,  'Created', 'Complete', actualField);
            }

            if ( foundField === true ) {
                if ( step === 'create' || step === 'setForm' ) {
                    if ( thisField.showNew === false || thisField.showNew === true ) {
                        const setDisp = await listFields.getByInternalNameOrTitle(f.name).setShowInNewForm(thisField.showNew);
                        statusLog = notify(statusLog, step, f,  'setShowNew', 'Complete',setDisp);
                    }
            
                    if ( thisField.showEdit === false || thisField.showNew === true ) {
                        const setDisp = await listFields.getByInternalNameOrTitle(f.name).setShowInEditForm(thisField.showEdit);
                        statusLog = notify(statusLog, step, f,  'setShowEdit', 'Complete', setDisp);
                    }
            
                    if ( thisField.showDisplay === false || thisField.showNew === true ) {
                        const setDisp = await listFields.getByInternalNameOrTitle(f.name).setShowInDisplayForm(thisField.showDisplay);
                        statusLog = notify(statusLog, step, f,  'setShowDisplay', 'Complete', setDisp);                     
                    } 
                } //END: if ( step === 'create' || step === 'setForm' ) {

                if ( step === 'create') { 
                    if (thisField.onCreateChanges) {
                        const createChanges = await listFields.getByInternalNameOrTitle(f.name).update(thisField.onCreateChanges);
                        statusLog = notify(statusLog, step, f, 'onCreateChanges', JSON.stringify(thisField.onCreateChanges), createChanges);
                    } //END: if (thisField.onCreateChanges) {
                        
                } else if ( step !== 'setForm' ) { // Will do changes1, changes2, changes3 and changesFinal
                    //Loop through other types of changes

                    if ( thisField[step] != null ) {
                        const otherChanges = await listFields.getByInternalNameOrTitle(f.name).update(thisField[step]);
                        statusLog = notify(statusLog, step, f,  step, JSON.stringify(thisField[step]), otherChanges);
                    }

                } //END: else if ( step !== 'setForm' ) {

            }  //END:  if ( foundField === true ) {

        }  //END: for (let f of fieldsToAdd) {
    }  //END: for ( let step of steps ) {

    alert('Added columns to list:' );
    console.log('addTheseFields', statusLog);
    return(statusLog);

}



