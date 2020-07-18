
//Updated Jan 5, 2020 per https://pnp.github.io/pnpjs/getting-started/
import { Web } from "@pnp/sp/presets/all";

/**
 * This function will take an array of objects, and insert into another array of objects at a specific index.
 * It will also remove objects at specific indexies.
 * 
 * Example of call:  This will take an array of fields from a view, and just insert [ootbModified, ootbEditor ] at index #2 of the array.
 * If you replace the startDel and countDelete with values, it will remove XX objects starting at index YY
 * The unique thing about it though is for adding, you can give the original position to add things in.
 * This way you don't have to figure out the new index if something is to be removed.
 * 
 * export const ProjectRecentUpdatesFields = spliceCopyArray ( stdProjectViewFields, null, null, 2, [ootbModified, ootbEditor ] );
 * 
 * In the example
 * 
 * @param sourceArray - Original array of objects
 * @param startDel - index of objects to start deleting
 * @param countDelete - number of objects to delete starting at startDel
 * @param startAddOrigPos - index to add 'addArray' in sourceArray... this is based on the original array you send, not what is left if you delete some items.
 * @param addArray - array of items to insert into object a specified position.
 */
export function spliceCopyArray(sourceArray, startDel, countDelete, startAddOrigPos, addArray) {

    let whole = [];
    let skipMin = startDel === null ? "-1000" : startDel ;
    let skipMax = startDel === null ? "-1000" : startDel + countDelete - 1 ; 
    let addedArray = false;

    if ( startAddOrigPos <= 0 ) {
      whole = whole.concat(addArray);
      addedArray = true;
    }

    for (let i in sourceArray){
        let addedItem = false;
        if ( i < skipMin ) {
            whole.push(sourceArray[i]);
            addedItem = true; }
        if ( i == startAddOrigPos ) {
            whole = whole.concat(addArray) ;
            addedArray = true; }
       if ( i > skipMax && addedItem === false ) {  whole.push(sourceArray[i]);   }
    }

    if ( addedArray === false ) {  whole = whole.concat(addArray);  }

    return whole;
}

/**
 * This function checks to see if an element of an array (object) contains a specific property/value pair.
 * 
 * example call:  if ( doesObjectExistInArray(currentFields, 'StaticName', checkField ) ) {
 * This takes an array of field objects (currentFields), and looks to see if any of the objects has a key of StaticName which has a value of checkField variable.
 * 
 * @param sourceArray 
 * @param objectProperty 
 * @param propValue 
 */

export function doesObjectExistInArray(sourceArray, objectProperty : string, propValue){

    let result : boolean | string = false;

    for (let i in sourceArray){
        if ( sourceArray[i][objectProperty] === propValue ) {
            result = i;
            break;
        }
    }

    return result;

}

/**
 * The original goal of this function, would be to remove objects from one array if it were in another array.
 * As an example, I have an array of items I want to add to a list (addItemsArray)
 * Then I run a process which creates another 'result' array of what things were actually added - minus any errors
 * The function will remove the items in the 'result' array from the 'addItemsArray.
 * Only the items that were not added (ie the ones that errored out) will be left... or maybe it would add a key with the result.
 * 
 */

 /**
  * 
  * @param checkForTheseItems - this is the array of items you want to check for in the sourceArray ('inThisArray')
  * @param inThisArray - this is the array where you are looking for items in
  * @param method - this tells what to do... either flage items in 'inThisArray' with found/not found, or remove the found ones
  * @param keyToCheck - checkForTheseItems must have a key which has this syntax:  checkValue: "Title===Training"
  *                     keyToCheck would === 'checkValue' and the value for that key must have the syntax:  PropertyKey===ValueOfProperty;
  *                     In the example above, it will split Title===Training into ['Title','Training']
  *                     Then look for all items in 'inThisArray' which have the value 'Training' in the key 'Title', and apply the method you want to apply.
  */
 export function compareArrays(checkForTheseItems: any [], inThisArray: any [], method: 'AddTag' | 'ReturnNOTFound' | 'ReturnFound', keyToCheck: string, checkDelimiter : string, messsages: 'Console'|'Alert'|'Both'|'None' ) {
    let compareKey = 'compareArrays';
    let foundTag = 'Found';
    let result : any[] = [];
    let foundCount = 0;
    let notFoundCount = 0;
    let notFoundItems = '';

    //Loop through all the objects you want to check for
    for (let c in checkForTheseItems){

        let foundThisCheck : boolean = false;
        
        //Expecting syntax "Title===Email triage"
        let splitStr : string = checkForTheseItems[c][keyToCheck];

        if ( splitStr ) { //Only check if this has a value for keyToCheck

            let splitArr: string[] = splitStr.split(checkDelimiter);
            let testKey: string = splitArr[0];
            let testVal: string = splitArr[1];
    
            if ( splitArr.length !== 2 ) {
                //There was a problem with the test value... needs to be syntax like this:  "Title===Email triage"
                notFoundCount ++;
                notFoundItems += '\n???: ' +splitStr;
            } else {
    
                //Loop through all the objects in the 'inThisArray' and process them
                for (let i in inThisArray){
                    let objectToUpdate: {} = inThisArray[i];
    
                    if ( inThisArray[i][testKey] === testVal ) {
                        //Value was found.... do whatever needs to be done.
                        objectToUpdate[compareKey] = foundTag;
                        foundCount ++;
                        foundThisCheck = true;
                        //break;
                    }
                }
                if ( foundThisCheck === false  ) { 
                    notFoundCount ++; 
                    notFoundItems += '\n' + notFoundCount + splitStr;
                }
            }
        }
    }

    
    /** this is where we need to do some other things for other options
     * 
     */

    for (let i in inThisArray){
        let objectToUpdate: any = inThisArray[i];
            //Value was found.... do whatever needs to be done.
            if ( method === 'AddTag') { //Add item to result and then add keyTag to it
                if ( objectToUpdate[compareKey] ) { } else { objectToUpdate[compareKey] = 'NOTFound'; }
                result.push(objectToUpdate);
            } else if ( method === 'ReturnNOTFound') { //Do not add this one to the result array
                if ( objectToUpdate[compareKey] === foundTag ) { } else { result.push(objectToUpdate); }

            } else if ( method === 'ReturnFound') { //If it's not found, do not add it
                if ( objectToUpdate[compareKey] === foundTag ) { result.push(objectToUpdate); } else {  }

            }
    }

    if ( messsages !== 'None' ) {
        console.log('compareArrays - checkForTheseItems',checkForTheseItems);
        console.log('compareArrays - inThisArray',inThisArray);
        console.log('compareArrays - result: ' + method ,result);
    }

    if ( messsages === 'Alert' || messsages === 'Both') {
        //alert('compareArrays - completed! Check Console for results');

        let alertMessage = `Found (${foundCount}) matches in both arrays`;
        if (notFoundCount > 0 ) { 
            alertMessage += '\nCheck Console.log for details';
            alertMessage += `\nDid NOT find these (${notFoundCount}) items!`;
            alertMessage += '\n+' + notFoundItems;
        }
        alert( alertMessage );
    }

    return result;

 }