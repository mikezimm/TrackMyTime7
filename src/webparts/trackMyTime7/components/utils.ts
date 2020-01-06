//Utils Concept from:  https://stackoverflow.com/questions/32790311/how-to-structure-utility-class



export default class Utils {

  public static convertCategoryToIndex(cat: string) {
    //https://stackoverflow.com/questions/6555182/remove-all-special-characters-except-space-from-a-string-using-javascript
    //string = string.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
    //console.log('convertCategoryToIndex', cat);
    if (!cat) { return "";}

    const thisCat = cat.toString();
    if (thisCat == null) { return ""; }
    if (thisCat){
      return (thisCat.replace(" ",'_').replace(/[&]/,'And').replace(/[*]/,'aamp').replace(/[\/\\#,+()$~%.'":*?<>{}]/g,''));
    } else {
      return ("");
    }
  }

  public static fixURLs(oldURL,pageContext) {
    let newURL = oldURL;
    if (!oldURL || newURL.length === 0) {
      newURL = pageContext.web.absoluteUrl;
    }
    newURL += newURL.endsWith("/") ? "" : "/";
    return newURL;
  }


  public static parseMe(str, parser, leftOrRight) {
    // Usage:
    // parseMe(theseProps[getProp],"/",'left')
    // parseMe(theseProps[getProp],"/",'right');

    let splitCol = str.split(parser);
    if (leftOrRight.toLowerCase() === 'left') {
      return splitCol[0];
    } else if (leftOrRight.toLowerCase() === 'right') {
      return splitCol[1] ? splitCol[1] : "";
    }
  }

  /**
 * Returns TRUE if the first specified array contains all elements
 * from the second one. FALSE otherwise.
 * https://github.com/lodash/lodash/issues/1743#issue-125967660
 * @param {array} superset
 * @param {array} subset
 *
 * @returns {boolean}
 */
  public static arrayContainsArray (superset, subset) {
    if (0 === subset.length) {
      return false;
    }

    return subset.every( (value) => {
      return (superset.indexOf(value) >= 0);
    });

  }

}
