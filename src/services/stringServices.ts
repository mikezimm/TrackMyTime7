

/*
//https://stackoverflow.com/a/2970667/4210807
export function camelize(str,firstCap: boolean) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
        
        if ( firstCap ) {   //Use this flavor for CamelCase
            return index == 0 ? word.toUpperCase() : word.toUpperCase();
            
        } else {    //Use this flavor for camelCase
            return index == 0 ? word.toLowerCase() : word.toUpperCase();
        }
        
    }).replace(/\s+/g, '');
}

}
*/

//https://stackoverflow.com/a/2970667/4210807
export function camelize(str,firstCap: boolean) {

    if ( str == null ) { return ''; }
    else {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, 
            (word, index) => {
                if ( firstCap ) {   //Use this flavor for CamelCase
                    return index == 0 ? word.toUpperCase() : word.toUpperCase();
                } else {    //Use this flavor for camelCase
                    return index == 0 ? word.toLowerCase() : word.toUpperCase();
                } 
            }).replace(/\s+/g, '');
    }
}
//Sample to convert to arrow function
//const sum1 = function(list, prop){ return list.reduce( function(a, b){ return a + b[prop];}, 0);}
//const sum2 = (list,prop) =>  { return list.reduce((a,b) => {return (a+ b[prop])}, 0);}