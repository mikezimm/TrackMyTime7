
//Updated Jan 5, 2020 per https://pnp.github.io/pnpjs/getting-started/
import { Web } from "@pnp/sp/presets/all";

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
