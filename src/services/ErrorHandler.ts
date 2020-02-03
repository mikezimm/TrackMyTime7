
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
    if (result.indexOf('Failed to fetch') > -1 ) { result += ', which can happen if the web url is not valid.'; }
    console.log('errObj:',errObj);
    console.log('result:',result);
    return result;
  }