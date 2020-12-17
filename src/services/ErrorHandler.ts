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

 
export function getHelpfullError(e, alertMe = true, consoleLog = true){
  if ( consoleLog === true ) { console.log('getHelpfullError:',e); }
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
  let detailItem = null;
  if (result.indexOf('Failed to fetch') > -1 ) { friendlyMessage = 'This can happen if the web url is not valid.'; }
  if (result.indexOf('A null value was detected in the items of a collection property value') > -1 ) { friendlyMessage= 'This can happen if you are saving a null value where an array is expected... Maybe try saving an empty array instead :).'; }
  if (result.indexOf('An unexpected \'PrimitiveValue\' node was found when reading from the JSON reader. A \'StartObject\' node was expected') > -1 ) { 
    friendlyMessage = 'Common causes:  Saving a string to a URL column, saving text to multi-select choice column.';
  }
  if (result.indexOf('does not exist') > -1 && result.indexOf('Column') > -1) { 
    friendlyMessage = 'Missing column: ' + result.split('\'')[1]; 
  }
  if (result.indexOf('does not exist on type') > -1 ) { 
    friendlyMessage = 'Missing column: ' + result.split('\'')[1]; 
  }

  if (result.indexOf('does not exist') > -1 && result.indexOf('List') === 0) { 
    friendlyMessage = 'List : ' + result.split('\'')[1] + ' does not exist on this site: ' + result.split('\'')[4]; 
  }

  if (result.indexOf('document library with the specified title already exists') > -1 ) { friendlyMessage = 'List with title already exists.'; }
  if (result.indexOf('Item does not exist') > -1 ) { friendlyMessage = 'This can happen if you are trying to find something that well... does not exist:).'; }

  if (result.indexOf('Cannot find resource for the request SP.UserProfiles') > -1 ) { friendlyMessage = 'This can happen if you have a typo in a URL:).'; }


  if (result.indexOf('Invalid JSON. The property name \'\' is not valid.') > -1 ) { friendlyMessage = 'Check the code for a place where a single quote was replaced by a backtick.'; }
  if (result.indexOf('Cannot convert a primitive value to the expected type \'Edm.Double\'.') > -1 ) { friendlyMessage = 'You may be trying to save non-number to Number column :).'; }

  if (result.indexOf('One or more column references are not allowed, because the columns are defined as a data type that is not supported in formulas.') > -1 ) { friendlyMessage = 'You may be trying to use a Hidden or Non-Existant column in a calculated column.'; }
  
  if (result.indexOf('The formula refers to a column that does not exist.') > -1 ) { friendlyMessage = 'Check the formula for spelling mistakes and missing or hidden columns'; }

  if (result.indexOf('You do not have permission') > -1 ) { friendlyMessage = 'You do not have access to something.  Double check to make sure you are logged in as well!'; }

  if (result.indexOf('does not exist on type') > -1 &&  result.indexOf('ListItem\'') > -1  && result.indexOf('The property') > -1 ) {
    if ( friendlyMessage != null ) { friendlyMessage += ' AND '; } else { friendlyMessage = ''; }
    friendlyMessage += 'Column: ' + result.split('\'')[1] + ' does not exist on list!';
  }

  let returnMess = friendlyMessage === null ? result : 'Ohh Snap!\n' + friendlyMessage + ' \n-- FULL ERROR MESSAGE: \n' + result ;
  
  if ( consoleLog === true ) { 
    console.log('errObj:',errObj);
    console.log('result:',friendlyMessage);
  }
  return returnMess;
}

