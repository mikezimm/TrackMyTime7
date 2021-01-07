/***
 *    .d888b.  .d88b.  .d888b.  .d88b.          db .d888b.         db   j88D                     
 *    VP  `8D .8P  88. VP  `8D .8P  88.        o88 VP  `8D        o88  j8~88                     
 *       odD' 88  d'88    odD' 88  d'88         88    odD'         88 j8' 88                     
 *     .88'   88 d' 88  .88'   88 d' 88 C8888D  88  .88'   C8888D  88 V88888D                    
 *    j88.    `88  d8' j88.    `88  d8'         88 j88.            88     88                     
 *    888888D  `Y88P'  888888D  `Y88P'          VP 888888D         VP     VP                     
 *                                                                                               
 *                                                                                               
 *    d8888b. d888888b db    db  .d88b.  d888888b      d888888b d888888b db      d88888b .d8888. 
 *    88  `8D   `88'   88    88 .8P  Y8. `~~88~~'      `~~88~~'   `88'   88      88'     88'  YP 
 *    88oodD'    88    Y8    8P 88    88    88            88       88    88      88ooooo `8bo.   
 *    88~~~      88    `8b  d8' 88    88    88            88       88    88      88~~~~~   `Y8b. 
 *    88        .88.    `8bd8'  `8b  d8'    88            88      .88.   88booo. 88.     db   8D 
 *    88      Y888888P    YP     `Y88P'     YP            YP    Y888888P Y88888P Y88888P `8888Y' 
 *                                                                                               
 *                                                                                               
 */

import { ISeriesSort } from './IReUsableInterfaces';


/***
 *    .d8888. d888888b d8888b. d888888b d8b   db  d888b  d888888b d88888b db    db db   dD d88888b db    db db    db  .d8b.  db      db    db d88888b 
 *    88'  YP `~~88~~' 88  `8D   `88'   888o  88 88' Y8b   `88'   88'     `8b  d8' 88 ,8P' 88'     `8b  d8' 88    88 d8' `8b 88      88    88 88'     
 *    `8bo.      88    88oobY'    88    88V8o 88 88         88    88ooo    `8bd8'  88,8P   88ooooo  `8bd8'  Y8    8P 88ooo88 88      88    88 88ooooo 
 *      `Y8b.    88    88`8b      88    88 V8o88 88  ooo    88    88~~~      88    88`8b   88~~~~~    88    `8b  d8' 88~~~88 88      88    88 88~~~~~ 
 *    db   8D    88    88 `88.   .88.   88  V888 88. ~8~   .88.   88         88    88 `88. 88.        88     `8bd8'  88   88 88booo. 88b  d88 88.     
 *    `8888Y'    YP    88   YD Y888888P VP   V8P  Y888P  Y888888P YP         YP    YP   YD Y88888P    YP       YP    YP   YP Y88888P ~Y8888P' Y88888P 
 *                                                                                                                                                    
 *                                                                                                                                                    
 */

/**
 * This just takes an object, and returns a string of the Key and Value.
 * Used for logging
 * @param thisOne 
 * @param keyNo 
 * @param delimiter 
 */
export function stringifyKeyValue( thisOne: any, keyNo, delimiter : string ) {

    return Object.keys(thisOne)[keyNo] + delimiter + thisOne[Object.keys(thisOne)[keyNo]];

}


/***
 *    .d8888. d8888b. db      d888888b  .o88b. d88888b  .o88b.  .d88b.  d8888b. db    db  .d8b.  d8888b. d8888b.  .d8b.  db    db 
 *    88'  YP 88  `8D 88        `88'   d8P  Y8 88'     d8P  Y8 .8P  Y8. 88  `8D `8b  d8' d8' `8b 88  `8D 88  `8D d8' `8b `8b  d8' 
 *    `8bo.   88oodD' 88         88    8P      88ooooo 8P      88    88 88oodD'  `8bd8'  88ooo88 88oobY' 88oobY' 88ooo88  `8bd8'  
 *      `Y8b. 88~~~   88         88    8b      88~~~~~ 8b      88    88 88~~~      88    88~~~88 88`8b   88`8b   88~~~88    88    
 *    db   8D 88      88booo.   .88.   Y8b  d8 88.     Y8b  d8 `8b  d8' 88         88    88   88 88 `88. 88 `88. 88   88    88    
 *    `8888Y' 88      Y88888P Y888888P  `Y88P' Y88888P  `Y88P'  `Y88P'  88         YP    YP   YP 88   YD 88   YD YP   YP    YP    
 *                                                                                                                                
 *                                                                                                                                
 */

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

/***
 *    d8888b.  .d88b.  d88888b .d8888.       .d88b.  d8888b.    d88b d88888b  .o88b. d888888b      d88888b db    db d888888b .d8888. d888888b      d888888b d8b   db  .d8b.  d8888b. d8888b.  .d8b.  db    db 
 *    88  `8D .8P  Y8. 88'     88'  YP      .8P  Y8. 88  `8D    `8P' 88'     d8P  Y8 `~~88~~'      88'     `8b  d8'   `88'   88'  YP `~~88~~'        `88'   888o  88 d8' `8b 88  `8D 88  `8D d8' `8b `8b  d8' 
 *    88   88 88    88 88ooooo `8bo.        88    88 88oooY'     88  88ooooo 8P         88         88ooooo  `8bd8'     88    `8bo.      88            88    88V8o 88 88ooo88 88oobY' 88oobY' 88ooo88  `8bd8'  
 *    88   88 88    88 88~~~~~   `Y8b.      88    88 88~~~b.     88  88~~~~~ 8b         88         88~~~~~  .dPYb.     88      `Y8b.    88            88    88 V8o88 88~~~88 88`8b   88`8b   88~~~88    88    
 *    88  .8D `8b  d8' 88.     db   8D      `8b  d8' 88   8D db. 88  88.     Y8b  d8    88         88.     .8P  Y8.   .88.   db   8D    88           .88.   88  V888 88   88 88 `88. 88 `88. 88   88    88    
 *    Y8888D'  `Y88P'  Y88888P `8888Y'       `Y88P'  Y8888P' Y8888P  Y88888P  `Y88P'    YP         Y88888P YP    YP Y888888P `8888Y'    YP         Y888888P VP   V8P YP   YP 88   YD 88   YD YP   YP    YP    
 *                                                                                                                                                                                                            
 *                                                                                                                                                                                                            
 */

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

export function doesObjectExistInArray(sourceArray, objectProperty : string, propValue, exact : boolean = true ){

    let result : boolean | string = false;

    for (let i in sourceArray){
        let test = false;
        if ( exact === true ) { //2020-10-07:  Added this to allow for Id string to number checks
            test = sourceArray[i][objectProperty] === propValue ? true : false;
        } else {
            test = sourceArray[i][objectProperty] == propValue ? true : false;
        }
        if ( test ) {
            result = i;
            break;
        }
    }

    return result;

}


export interface ICompareResult {
    checkForTheseItems: any [];
    inThisArray: any [];
    found: any [];
    notFound: any [];
    result: any [];
    message: string;
}


/***
 *     .o88b.  .d88b.  .88b  d88. d8888b.  .d8b.  d8888b. d88888b  .d8b.  d8888b. d8888b.  .d8b.  db    db .d8888. 
 *    d8P  Y8 .8P  Y8. 88'YbdP`88 88  `8D d8' `8b 88  `8D 88'     d8' `8b 88  `8D 88  `8D d8' `8b `8b  d8' 88'  YP 
 *    8P      88    88 88  88  88 88oodD' 88ooo88 88oobY' 88ooooo 88ooo88 88oobY' 88oobY' 88ooo88  `8bd8'  `8bo.   
 *    8b      88    88 88  88  88 88~~~   88~~~88 88`8b   88~~~~~ 88~~~88 88`8b   88`8b   88~~~88    88      `Y8b. 
 *    Y8b  d8 `8b  d8' 88  88  88 88      88   88 88 `88. 88.     88   88 88 `88. 88 `88. 88   88    88    db   8D 
 *     `Y88P'  `Y88P'  YP  YP  YP 88      YP   YP 88   YD Y88888P YP   YP 88   YD 88   YD YP   YP    YP    `8888Y' 
 *                                                                                                                 
 *                                                                                                                 
 * The original goal of this function, would be to remove objects from one array if it were in another array.
 * As an example, I have an array of items I want to add to a list (addItemsArray)
 * Then I run a process which creates another 'result' array of what things were actually added - minus any errors
 * The function will remove the items in the 'result' array from the 'addItemsArray.
 * Only the items that were not added (ie the ones that errored out) will be left... or maybe it would add a key with the result.
 * 
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
    let notFoundTag = 'Not' + foundTag;
    
    let result : ICompareResult = {
        checkForTheseItems: checkForTheseItems,
        inThisArray: inThisArray,
        found: [],
        notFound: [], 
        result: [],
        message: '',
    };

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
                notFoundItems += '\n???: ' +splitStr;
            } else {
    
                //Loop through all the objects in the 'inThisArray' and process them
                for (let i in inThisArray){
                    let objectToUpdate: {} = inThisArray[i];
    
                    if ( inThisArray[i][testKey] === testVal ) {
                        //Value was found.... do whatever needs to be done.
                        objectToUpdate[compareKey] = foundTag;
                        /*
                        if ( method === 'AddTag') { //Add item to result and then add keyTag to it
                            objectToUpdate[compareKey] = foundTag;
                            
                        } else if ( method === 'ReturnNOTFound') { //Do not add this one to the result array
    
    
                        } else if ( method === 'ReturnFound') { //Not sure about this loop yet
    
                        }
                        */
                       
                        foundThisCheck = true;
                        break;
                    }
                }
            }
        }
        if ( foundThisCheck === false  ) { notFoundItems += '\nNotFound: ' +splitStr; checkForTheseItems[c][compareKey] = notFoundTag; }
    }

    
    /** this is where we need to do some other things for other options
     * 
     */

    for (let i in inThisArray){
        let objectToUpdate: any = inThisArray[i];
            //Value was found.... do whatever needs to be done.
            if ( objectToUpdate[compareKey] ) { 
                objectToUpdate[compareKey] = 'Found';
                result.found.push(objectToUpdate);
                foundCount ++;
            } else { 
                objectToUpdate[compareKey] = 'NOTFound';
                result.notFound.push(objectToUpdate);
                notFoundCount ++; 
            }
    }

    result.message = result.notFound.map( thisOne => { 
        return 'NF: ' + stringifyKeyValue(thisOne, 0, '===') + '\n';
    }).join('');

    if (method === 'ReturnFound') {
        result.result = result.found;
    } else if (method === 'ReturnNOTFound') {
        result.result = result.notFound;
    } else if ( method === 'AddTag' ) {
        result.result = result.inThisArray;
    }

    if ( messsages !== 'None' ) {
        console.log('compareArrays - result: ' + method ,result);
    }

    if ( messsages === 'Alert' || messsages === 'Both') {
        //alert('compareArrays - completed! Check Console for results');

        let alertMessage = `Found (${foundCount}) matches in both arrays`;
        if (notFoundCount > 0 ) { 
            alertMessage += '\nCheck Console.log for details';
            alertMessage += `\nDid NOT find these (${notFoundCount}) items!`;
            alertMessage += '\n' + result.message;
        }
        alert( alertMessage );
    }

    return result;

 }


/***
 *     .d8b.  d8888b. d8888b. d888888b d888888b d88888b .88b  d88.      d888888b  .d88b.   .d8b.  d8888b. d8888b.  .d8b.  db    db      d888888b d88888b      d888888b d888888b d8888b.  .d88b.  d88888b .d8888. d8b   db  .d88b.  d888888b d88888b db    db d888888b .d8888. d888888b 
 *    d8' `8b 88  `8D 88  `8D   `88'   `~~88~~' 88'     88'YbdP`88      `~~88~~' .8P  Y8. d8' `8b 88  `8D 88  `8D d8' `8b `8b  d8'        `88'   88'            `88'   `~~88~~' 88  `8D .8P  Y8. 88'     88'  YP 888o  88 .8P  Y8. `~~88~~' 88'     `8b  d8'   `88'   88'  YP `~~88~~' 
 *    88ooo88 88   88 88   88    88       88    88ooooo 88  88  88         88    88    88 88ooo88 88oobY' 88oobY' 88ooo88  `8bd8'          88    88ooo           88       88    88   88 88    88 88ooooo `8bo.   88V8o 88 88    88    88    88ooooo  `8bd8'     88    `8bo.      88    
 *    88~~~88 88   88 88   88    88       88    88~~~~~ 88  88  88         88    88    88 88~~~88 88`8b   88`8b   88~~~88    88            88    88~~~           88       88    88   88 88    88 88~~~~~   `Y8b. 88 V8o88 88    88    88    88~~~~~  .dPYb.     88      `Y8b.    88    
 *    88   88 88  .8D 88  .8D   .88.      88    88.     88  88  88         88    `8b  d8' 88   88 88 `88. 88 `88. 88   88    88           .88.   88             .88.      88    88  .8D `8b  d8' 88.     db   8D 88  V888 `8b  d8'    88    88.     .8P  Y8.   .88.   db   8D    88    
 *    YP   YP Y8888D' Y8888D' Y888888P    YP    Y88888P YP  YP  YP         YP     `Y88P'  YP   YP 88   YD 88   YD YP   YP    YP         Y888888P YP           Y888888P    YP    Y8888D'  `Y88P'  Y88888P `8888Y' VP   V8P  `Y88P'     YP    Y88888P YP    YP Y888888P `8888Y'    YP    
 *                                                                                                                                                                                                                                                                                     
 *     2020-09-24:  Updated from drilldown-filter webpart                                                                                                                                                                                                                                                                                
 */

export function addItemToArrayIfItDoesNotExist (arr : string[], item: string, suppressUndefined: boolean = true ) {
    if ( item === undefined ) { 
        if ( suppressUndefined != true ) {
            console.log('addItemToArrayIfItDoesNotExist found undefined!') ;
        }
     }
    if ( item != '' && item !== undefined && arr.indexOf(item) < 0  ) { arr.push(item); }
    return arr;
}


/***
 *     .o88b.  .d88b.  d8b   db db    db d88888b d8888b. d888888b      d8b   db db    db .88b  d88. d8888b. d88888b d8888b.  .d8b.  d8888b. d8888b.  .d8b.  db    db      d888888b  .d88b.  d8888b. d88888b db       .d8b.  d888888b d888888b db    db d88888b      d8888b. d88888b d8888b.  .o88b. d88888b d8b   db d888888b .d8888. 
 *    d8P  Y8 .8P  Y8. 888o  88 88    88 88'     88  `8D `~~88~~'      888o  88 88    88 88'YbdP`88 88  `8D 88'     88  `8D d8' `8b 88  `8D 88  `8D d8' `8b `8b  d8'      `~~88~~' .8P  Y8. 88  `8D 88'     88      d8' `8b `~~88~~'   `88'   88    88 88'          88  `8D 88'     88  `8D d8P  Y8 88'     888o  88 `~~88~~' 88'  YP 
 *    8P      88    88 88V8o 88 Y8    8P 88ooooo 88oobY'    88         88V8o 88 88    88 88  88  88 88oooY' 88ooooo 88oobY' 88ooo88 88oobY' 88oobY' 88ooo88  `8bd8'          88    88    88 88oobY' 88ooooo 88      88ooo88    88       88    Y8    8P 88ooooo      88oodD' 88ooooo 88oobY' 8P      88ooooo 88V8o 88    88    `8bo.   
 *    8b      88    88 88 V8o88 `8b  d8' 88~~~~~ 88`8b      88         88 V8o88 88    88 88  88  88 88~~~b. 88~~~~~ 88`8b   88~~~88 88`8b   88`8b   88~~~88    88            88    88    88 88`8b   88~~~~~ 88      88~~~88    88       88    `8b  d8' 88~~~~~      88~~~   88~~~~~ 88`8b   8b      88~~~~~ 88 V8o88    88      `Y8b. 
 *    Y8b  d8 `8b  d8' 88  V888  `8bd8'  88.     88 `88.    88         88  V888 88b  d88 88  88  88 88   8D 88.     88 `88. 88   88 88 `88. 88 `88. 88   88    88            88    `8b  d8' 88 `88. 88.     88booo. 88   88    88      .88.    `8bd8'  88.          88      88.     88 `88. Y8b  d8 88.     88  V888    88    db   8D 
 *     `Y88P'  `Y88P'  VP   V8P    YP    Y88888P 88   YD    YP         VP   V8P ~Y8888P' YP  YP  YP Y8888P' Y88888P 88   YD YP   YP 88   YD 88   YD YP   YP    YP            YP     `Y88P'  88   YD Y88888P Y88888P YP   YP    YP    Y888888P    YP    Y88888P      88      Y88888P 88   YD  `Y88P' Y88888P VP   V8P    YP    `8888Y' 
 *                                                                                                                                                                                                                                                                                                                                    
 * 
 * @param arr 
 * @param percentsAsWholeNumbers -- If true, converts 25% from 0.25 to 25.
 *                                                                                                                                                                                                                                                                                                                                 
 */

export function convertNumberArrayToRelativePercents( arr: number[] , percentsAsWholeNumbers : boolean = true ) {

    let result : number[] = [];
    //Get sum of array of numbers:  https://codeburst.io/javascript-arrays-finding-the-minimum-maximum-sum-average-values-f02f1b0ce332
    // Can't do this:  const arrSum = arr => arr.reduce((a,b) => a + b, 0) like example.
    // And THIS changes arr to single value:  const arrSum = arr.reduce((a,b) => a + b, 0);
    let arrSum = 0;
    arr.map( v => { if ( v !== null && v !== undefined ) { arrSum += v;} });

    let multiplier = percentsAsWholeNumbers === true ? 100 : 1 ;

    if ( arrSum === 0 ) { console.log('Unable to convertNumberArrayToRelativePercents because Sum === 0', arrSum, arr ) ; }
    arr.map( v => {
        result.push( arrSum !== 0 ? multiplier * v / arrSum : multiplier * v / 1 )  ;
    });

    return result;
}


/***
 *    .d8888.  .d88b.  d8888b. d888888b      .d8888. d888888b d8888b. d888888b d8b   db  d888b        .d8b.  d8888b. d8888b.  .d8b.  db    db 
 *    88'  YP .8P  Y8. 88  `8D `~~88~~'      88'  YP `~~88~~' 88  `8D   `88'   888o  88 88' Y8b      d8' `8b 88  `8D 88  `8D d8' `8b `8b  d8' 
 *    `8bo.   88    88 88oobY'    88         `8bo.      88    88oobY'    88    88V8o 88 88           88ooo88 88oobY' 88oobY' 88ooo88  `8bd8'  
 *      `Y8b. 88    88 88`8b      88           `Y8b.    88    88`8b      88    88 V8o88 88  ooo      88~~~88 88`8b   88`8b   88~~~88    88    
 *    db   8D `8b  d8' 88 `88.    88         db   8D    88    88 `88.   .88.   88  V888 88. ~8~      88   88 88 `88. 88 `88. 88   88    88    
 *    `8888Y'  `Y88P'  88   YD    YP         `8888Y'    YP    88   YD Y888888P VP   V8P  Y888P       YP   YP 88   YD 88   YD YP   YP    YP    
 *                                                                                                                                            
 * 2020-12-14
 * sortStringArray was added to remove typescript errors in sortKeysByOtherKey
 * @param arr 
 * @param order                                                                                                                                         
 */

export function sortStringArray( arr: string[], order: ISeriesSort ) : string[] {

    if ( order === 'asc' ) { 
        arr.sort((a,b) => a.localeCompare(b));
    } else if ( order === 'dec' ) {
        arr.sort((a,b) => b.localeCompare(a));
    } else {
        
    }
    return arr;
}

/***
 *    .d8888.  .d88b.  d8888b. d888888b      d8b   db db    db .88b  d88. d8888b. d88888b d8888b.       .d8b.  d8888b. d8888b.  .d8b.  db    db 
 *    88'  YP .8P  Y8. 88  `8D `~~88~~'      888o  88 88    88 88'YbdP`88 88  `8D 88'     88  `8D      d8' `8b 88  `8D 88  `8D d8' `8b `8b  d8' 
 *    `8bo.   88    88 88oobY'    88         88V8o 88 88    88 88  88  88 88oooY' 88ooooo 88oobY'      88ooo88 88oobY' 88oobY' 88ooo88  `8bd8'  
 *      `Y8b. 88    88 88`8b      88         88 V8o88 88    88 88  88  88 88~~~b. 88~~~~~ 88`8b        88~~~88 88`8b   88`8b   88~~~88    88    
 *    db   8D `8b  d8' 88 `88.    88         88  V888 88b  d88 88  88  88 88   8D 88.     88 `88.      88   88 88 `88. 88 `88. 88   88    88    
 *    `8888Y'  `Y88P'  88   YD    YP         VP   V8P ~Y8888P' YP  YP  YP Y8888P' Y88888P 88   YD      YP   YP 88   YD 88   YD YP   YP    YP    
 *                                                                                                                                              
 *     
 * 2020-12-14
 * sortNumberArray was added to remove typescript errors in sortKeysByOtherKey
 * @param arr 
 * @param order                                                                                                                                          
 */

export function sortNumberArray( arr: number[], order: ISeriesSort ) : number[] {

    if ( order === 'asc' ) { 
        arr.sort();
    } else if ( order === 'dec' ) {
        arr.sort((a, b) => b-a );
    } else {
        
    }
    return arr;

}


/***
 *    .d8888.  .d88b.  d8888b. d888888b      db   dD d88888b db    db .d8888.      d8888b. db    db       .d88b.  d888888b db   db d88888b d8888b.      db   dD d88888b db    db 
 *    88'  YP .8P  Y8. 88  `8D `~~88~~'      88 ,8P' 88'     `8b  d8' 88'  YP      88  `8D `8b  d8'      .8P  Y8. `~~88~~' 88   88 88'     88  `8D      88 ,8P' 88'     `8b  d8' 
 *    `8bo.   88    88 88oobY'    88         88,8P   88ooooo  `8bd8'  `8bo.        88oooY'  `8bd8'       88    88    88    88ooo88 88ooooo 88oobY'      88,8P   88ooooo  `8bd8'  
 *      `Y8b. 88    88 88`8b      88         88`8b   88~~~~~    88      `Y8b.      88~~~b.    88         88    88    88    88~~~88 88~~~~~ 88`8b        88`8b   88~~~~~    88    
 *    db   8D `8b  d8' 88 `88.    88         88 `88. 88.        88    db   8D      88   8D    88         `8b  d8'    88    88   88 88.     88 `88.      88 `88. 88.        88    
 *    `8888Y'  `Y88P'  88   YD    YP         YP   YD Y88888P    YP    `8888Y'      Y8888P'    YP          `Y88P'     YP    YP   YP Y88888P 88   YD      YP   YD Y88888P    YP    
 *                                                                                                                                                                               
 *  2020-12-14
 *  This function caused errors in TrackMyTime which was based on @yo 1.9.1 but works in Drilldown and ActionNews @yo 1.11.0 
 * 
 *  Cannot invoke an expression whose type lacks a call signature. Type '((compareFn?: (a: string, b: string) => number) => string[]) | ((compareFn?: (a: number, b: numbe...' has no compatible call signatures.
 * 
 *  Rebuilt and added sortNumberArray and sortStringArray and it seems to work ok.
*/

export function sortKeysByOtherKey( obj: any, sortKey: ISeriesSort, order: ISeriesSort, dataType: 'number' | 'string', otherKeys: string[]) {

    let sortCopy : any[] = JSON.parse(JSON.stringify(obj[sortKey]));
    let otherKeyArrays : any = {};
    otherKeys.map( m => { otherKeyArrays[m] = [] ; } );
    
    if ( dataType === 'number' ) {
        sortCopy = sortNumberArray( sortCopy, order );
    } else {
        sortCopy = sortStringArray( sortCopy, order );
    }

    let x = 0;
    for ( let v of sortCopy) {
      let currentIndex = obj[sortKey].indexOf(v); //Get index of the first sortable value in original array
      let i = 0;
      otherKeys.map( key => {
        if ( obj[key] ) {
            otherKeyArrays[key].push( obj[key][currentIndex] );
        } else {
            console.log('sortKeysByOtherKey: Unable to push obj[key][currentIndex] because obj[key] does not exist!', obj,key,currentIndex );
        }
      });
      obj[sortKey][currentIndex] = null;
      x ++;
    }
  
    otherKeys.map( key => {

      obj[key] = otherKeyArrays[key] ;

    }); 
  
    obj[sortKey] = sortCopy;

    return obj;
  
}

  
/***
 *    d8888b. d88888b .88b  d88.  .d88b.  db    db d88888b      d888888b d888888b d88888b .88b  d88.      d88888b d8888b.  .d88b.  .88b  d88.       .d8b.  d8888b. d8888b.  .d8b.  db    db       .d88b.  d8b   db  .o88b. d88888b 
 *    88  `8D 88'     88'YbdP`88 .8P  Y8. 88    88 88'            `88'   `~~88~~' 88'     88'YbdP`88      88'     88  `8D .8P  Y8. 88'YbdP`88      d8' `8b 88  `8D 88  `8D d8' `8b `8b  d8'      .8P  Y8. 888o  88 d8P  Y8 88'     
 *    88oobY' 88ooooo 88  88  88 88    88 Y8    8P 88ooooo         88       88    88ooooo 88  88  88      88ooo   88oobY' 88    88 88  88  88      88ooo88 88oobY' 88oobY' 88ooo88  `8bd8'       88    88 88V8o 88 8P      88ooooo 
 *    88`8b   88~~~~~ 88  88  88 88    88 `8b  d8' 88~~~~~         88       88    88~~~~~ 88  88  88      88~~~   88`8b   88    88 88  88  88      88~~~88 88`8b   88`8b   88~~~88    88         88    88 88 V8o88 8b      88~~~~~ 
 *    88 `88. 88.     88  88  88 `8b  d8'  `8bd8'  88.            .88.      88    88.     88  88  88      88      88 `88. `8b  d8' 88  88  88      88   88 88 `88. 88 `88. 88   88    88         `8b  d8' 88  V888 Y8b  d8 88.     
 *    88   YD Y88888P YP  YP  YP  `Y88P'     YP    Y88888P      Y888888P    YP    Y88888P YP  YP  YP      YP      88   YD  `Y88P'  YP  YP  YP      YP   YP 88   YD 88   YD YP   YP    YP          `Y88P'  VP   V8P  `Y88P' Y88888P 
 * 
 * import { removeItemFromArrayOnce, removeItemFromArrayAll } from '../../../services/arrayServices';
 * https://stackoverflow.com/a/5767357                                                                                                                                                                                                                               
 *                                                                                                                                                                                                                                 
 */

export function removeItemFromArrayOnce(arr, value) {
    if ( arr === null || arr === undefined ) {
        //Do nothing... 
    } else {
        var index = arr.indexOf(value);
        if (index > -1) {
        arr.splice(index, 1);
        }
    }
    return arr;
}
  
/***
 *    d8888b. d88888b .88b  d88.  .d88b.  db    db d88888b      d888888b d888888b d88888b .88b  d88.      d88888b d8888b.  .d88b.  .88b  d88.       .d8b.  d8888b. d8888b.  .d8b.  db    db       .d8b.  db      db      
 *    88  `8D 88'     88'YbdP`88 .8P  Y8. 88    88 88'            `88'   `~~88~~' 88'     88'YbdP`88      88'     88  `8D .8P  Y8. 88'YbdP`88      d8' `8b 88  `8D 88  `8D d8' `8b `8b  d8'      d8' `8b 88      88      
 *    88oobY' 88ooooo 88  88  88 88    88 Y8    8P 88ooooo         88       88    88ooooo 88  88  88      88ooo   88oobY' 88    88 88  88  88      88ooo88 88oobY' 88oobY' 88ooo88  `8bd8'       88ooo88 88      88      
 *    88`8b   88~~~~~ 88  88  88 88    88 `8b  d8' 88~~~~~         88       88    88~~~~~ 88  88  88      88~~~   88`8b   88    88 88  88  88      88~~~88 88`8b   88`8b   88~~~88    88         88~~~88 88      88      
 *    88 `88. 88.     88  88  88 `8b  d8'  `8bd8'  88.            .88.      88    88.     88  88  88      88      88 `88. `8b  d8' 88  88  88      88   88 88 `88. 88 `88. 88   88    88         88   88 88booo. 88booo. 
 *    88   YD Y88888P YP  YP  YP  `Y88P'     YP    Y88888P      Y888888P    YP    Y88888P YP  YP  YP      YP      88   YD  `Y88P'  YP  YP  YP      YP   YP 88   YD 88   YD YP   YP    YP         YP   YP Y88888P Y88888P 
 *                                                                                                                                                                                                                       
 * import { removeItemFromArrayOnce, removeItemFromArrayAll } from '../../../services/arrayServices';
 * https://stackoverflow.com/a/5767357                                                                                                                                                                                                                        
 */

export function removeItemFromArrayAll(arr, value) {
    if ( arr === null || arr === undefined ) {
        //Do nothing... 
    } else {
        var i = 0;
        while (i < arr.length) {
          if (arr[i] === value) {
            arr.splice(i, 1);
          } else {
            ++i;
          }
        }
    }
    return arr;
}