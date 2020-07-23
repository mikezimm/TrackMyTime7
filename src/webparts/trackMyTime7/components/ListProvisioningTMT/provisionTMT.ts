import { Web } from "@pnp/sp/presets/all";

import { sp, Views, IViews } from "@pnp/sp/presets/all";

import { IListInfo, IMyListInfo, IServiceLog } from '../../../../services/listServices/listTypes'; //Import view arrays for Time list

import { changes, IMyFieldTypes } from '../../../../services/listServices/columnTypes'; //Import view arrays for Time list

import { IMyView,  } from '../../../../services/listServices/viewTypes'; //Import view arrays for Time list

import { addTheseItemsToList } from '../../../../services/listServices/listServices';

import { IFieldLog, addTheseFields } from '../../../../services/listServices/columnServices'; //Import view arrays for Time list

import { IViewLog, addTheseViews } from '../../../../services/listServices/viewServices'; //Import view arrays for Time list

import { TMTProjectFields, TMTTimeFields} from './columnsTMT'; //Import column arrays (one file because both lists use many of same columns)

import { projectViews} from './viewsTMTProject';  //Import view arrays for Project list

import { timeViewsFull } from './viewsTMTTime'; //Import view arrays for Time list

import { TMTDefaultProjectItems, TMTTestTimeItems, IAnyArray } from './ItemsTMT'; // Import items to create in the list

export async function provisionTheList( listName : string, listDefinition: 'Projects' | 'TrackMyTime' , webURL: string ): Promise<IServiceLog[]>{

    let statusLog : IServiceLog[] = [];
    let createTheseFields : IMyFieldTypes[] = [];
    let createTheseViews : IMyView[] = [];
    let createTheseItems : IAnyArray = [];

    let alertMe = false;
    let consoleLog = false;

    let theList = {
        title: listName,
        desc: 'Update List Description below',
        template: 100,
        enableContentTypes: true,
        additionalSettings: { EnableVersioning: true, MajorVersionLimit: 50, OnQuickLaunch: true },
      };

    if (listDefinition === 'Projects') {
        theList.desc = 'Projects list for TrackMyTime Webpart';
        createTheseFields = TMTProjectFields();
        createTheseViews = projectViews;
        createTheseItems = TMTDefaultProjectItems;

    } else if (listDefinition === 'TrackMyTime') {
        theList.desc = 'TrackMyTime list for TrackMyTime Webpart';
        createTheseFields = TMTTimeFields();
        createTheseViews = timeViewsFull;

        let currentUser = await sp.web.currentUser.get();
        createTheseItems = TMTTestTimeItems(currentUser);

    }

    const thisWeb = Web(webURL);
    const ensuredList = await thisWeb.lists.ensure(theList.title);
    const listFields = ensuredList.list.fields;
    const listViews = ensuredList.list.views;

    let fieldsToGet = createTheseFields.map ( thisField => {
        return thisField.name;
    });

    let fieldFilter = "StaticName eq '" + fieldsToGet.join("' or StaticName eq '") + "'";

    console.log('fieldFilter:', fieldFilter);

    const  currentFields = await listFields.select('StaticName,Title,Hidden,Formula,DefaultValue,Required,TypeAsString,Indexed,OutputType,DateFormat').filter(fieldFilter).get();

    const  currentViews = await listViews.get();

    console.log(theList.title + ' list fields and views', currentFields, currentViews);

    alert('Still need to check:  Set Title in onCreate,  changesFinal - hidding original fields and setting and why Hours calculated is single line of text');

    let result = await addTheseFields(['create','changesFinal'], theList, ensuredList, currentFields, createTheseFields, alertMe, consoleLog );

    //let testViews = projectViews;
    //alert('adding Views');
    let result2 = await addTheseViews(['create'],  theList, ensuredList, currentViews, createTheseViews, alertMe, consoleLog);

    let result3 = null;

    let createItems: boolean = false;
    if (listDefinition === 'Projects') {
        //Auto create new items
        createItems = true;

    } else {
        //let confirmItems = confirm("We created your list, do you want us to create some sample Time entries so you can see how it looks?")
        if (confirm("We created your list, do you want us to create some sample Time entries so you can see how it looks?")) {
            //You pressed Ok, add items
            createItems = true;
          }
    }

    if ( createItems === true ) {
        result3 = await addTheseItemsToList(theList, thisWeb, createTheseItems, true, true);
        if (listDefinition === 'Projects') {
            alert(`Oh... One more thing... We created a few generic Projects under the EVERYONE Category to get you started.  Just refresh the page and click on that heading to see them.`);
        } else {
            alert(`All Test Data present and accounted for!  Don't forget to clear it before you start using this webpart for real!`);
        }


      }

    return statusLog;

}
