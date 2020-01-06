//Updated Jan 5, 2020 per https://pnp.github.io/pnpjs/getting-started/
import { Web } from "@pnp/sp/presets/all";

export function getBrowser(validTypes,changeSiteIcon){

    let thisBrowser = "";
    return thisBrowser;

}

/**
 * Be sure to update your analyticsList and analyticsWeb in en-us.js strings file
 * @param theProps 
 * @param theState 
 */
export function saveAnalytics (theProps,theState) {

    //Do nothing if either of these strings is blank
    if (!theProps.analyticsList) { return ; }
    if (!theProps.analyticsWeb) { return ; }

    if (  theProps.analyticsWeb.indexOf(theProps.tenant) === -1 ) {
        //The current site is not in the expected tenant... skip analytics.
        console.log('the analyticsWeb is not in the same tenant...',theProps.analyticsWeb,theProps.tenant);
        return ;
    } else {

        //console.log('saveAnalytics: ', theProps, theState);
        let analyticsList = theProps.analyticsList;
        let startTime = theProps.startTime;
        let endTime = theState.endTime;

        //Updated Jan 5, 2020 per https://pnp.github.io/pnpjs/getting-started/
        const web = Web(theProps.analyticsWeb);

        const delta = endTime.now - startTime.now;
        //alert(delta);
        //alert(getBrowser("Chrome",false));
        /*

        */
        let siteLink = {
            'Url': theProps.pageContext.web.serverRelativeUrl,
            'Description': theProps.pageContext.web.serverRelativeUrl ,
        };
        
        let itemInfo1 = "(" + theState.allTiles.length + ")"  + " - " +  theProps.getAll + " - " + " - " + theProps.listDefinition;
        let itemInfo2 = "(" + theProps.listTitle + ")"  + " - " +  theProps.listWebURL;

        let itemInfoProps = theProps.setSize +
                " ImgFit: " +  theProps.setImgFit;

        let heroCount;
        if (theProps.heroTiles) { 
            let itemInfoHero = 
            " ShowHero: " +  theProps.showHero +
            " HeroType: " +  theProps.heroType +
            " HeroFit: " +  theProps.setHeroFit;
            heroCount = theProps.heroTiles.length;
            itemInfoProps += ' -Hero: ' + itemInfoHero; }
    
        web.lists.getByTitle(analyticsList).items.add({
            'Title': ['Pivot-Tiles',theProps.scenario,theProps.setSize,theProps.heroType].join(' : '),
            'zzzText1': startTime.now,      
            'zzzText2': startTime.theTime,
            'zzzNumber1': startTime.milliseconds,
            'zzzText3': endTime.now,      
            'zzzText4': endTime.theTime,
            'zzzNumber2': endTime.milliseconds,
            'zzzNumber3': delta,
            'zzzNumber4': theState.allTiles.length,
            'zzzNumber5': heroCount,
            'zzzText5': itemInfo1,
            'zzzText6': itemInfo2,
            'zzzText7': itemInfoProps,
            'SiteLink': siteLink,
            'SiteTitle': theProps.pageContext.web.title,
            'ListTitle': theProps.listTitle,


            }).then((response) => {
            //Reload the page
                //location.reload();
            }).catch((e) => {
            //Throw Error
                alert(e);
        });

    }



}


export function saveAnalyticsX (theTime) {

    let analyticsList = "TilesCycleTesting";
    let currentTime = theTime;
    
    //Updated Jan 5, 2020 per https://pnp.github.io/pnpjs/getting-started/
    const web = Web('https://mcclickster.sharepoint.com/sites/Templates/SiteAudit/');

    web.lists.getByTitle(analyticsList).items.add({
        'Title': 'Pivot-Tiles x1asdf',
        'zzzText1': currentTime.now,      
        'zzzText2': currentTime.theTime,
        'zzzNumber1': currentTime.milliseconds,

        }).then((response) => {
        //Reload the page
            //location.reload();
        }).catch((e) => {
        //Throw Error
            alert(e);
    });


}

export function saveTheTime () {
    let theTime = getTheCurrentTime();
    saveAnalyticsX(theTime);

    return theTime;

}

export function getTheCurrentTime () {

    const now = new Date();
    const theTime = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + "." + now.getMilliseconds();
    let result : any = {
        'now': now,
        'theTime' : theTime,
        'milliseconds' : now.getMilliseconds(),
    };

    return result;

}
