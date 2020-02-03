
  export function getHelpfullError(e){
    let result = 'e';
    let errObj: {} = null;
      if (e.message) {
        let loc1 = e.message.indexOf("{\"");
        if (loc1 > 0) {
          result = e.message.substring(loc1);
          errObj = JSON.parse(result);
        }
    }
    result = errObj['odata.error']['message']['value'];
    console.log('errObj:',errObj);
    console.log('result:',result);
    return result;
  }