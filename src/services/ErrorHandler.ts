
  export function getHelpfullError(e){
    console.log('getHelpfullError:',e);
    let result = 'e';
    let errObj: {} = null;
      if (e.message) {
        let loc1 = e.message.indexOf("{\"");
        if (loc1 > 0) {
          result = e.message.substring(loc1);
          errObj = JSON.parse(result);
        }
    }
    result = errObj != null ? errObj['odata.error']['message']['value'] : e.message != null ? e.message : e;
    let friendlyMessage = null;
    if (result.indexOf('Failed to fetch') > -1 ) { friendlyMessage = 'This can happen if the web url is not valid.'; }
    if (result.indexOf('A null value was detected in the items of a collection property value') > -1 ) { friendlyMessage= 'This can happen if you are saving a null value where an array is expected... Maybe try saving an empty array instead :).'; }
    if (result.indexOf('An unexpected \'PrimitiveValue\' node was found when reading from the JSON reader. A \'StartObject\' node was expected') > -1 ) { friendlyMessage = 'This can happen if you are saving a string to a URL column.  Might need to fix the code :).'; }
    if (result.indexOf(' does not exist') > -1 && result.indexOf('Column') > -1) { friendlyMessage = 'I think your list is missing a column :).'; }

    if (result.indexOf('Item does not exist') > -1 ) { friendlyMessage = 'This can happen if you are trying to find something that well... does not exist:).'; }

    if (result.indexOf('Cannot find resource for the request SP.UserProfiles') > -1 ) { friendlyMessage = 'This can happen if you have a typo in a URL:).'; }
    if (result.indexOf('does not exist on type \'SP.List\'') > -1 ) { friendlyMessage = 'Check to make sure the column name is correct in the code :).'; }
    if (result.indexOf('Invalid JSON. The property name \'\' is not valid.') > -1 ) { friendlyMessage = 'Check the code for a place where a single quote was replaced by a backtick.'; }
    if (result.indexOf('Cannot convert a primitive value to the expected type \'Edm.Double\'.') > -1 ) { friendlyMessage = 'You may be trying to save non-number to Number column :).'; }

    let returnMess = friendlyMessage === null ? result : 'Ohh Snap!  ' + friendlyMessage + ' -- FULL ERROR MESSAGE: ' + result;
    
    console.log('errObj:',errObj);
    console.log('result:',friendlyMessage);
    return returnMess;
  }

  