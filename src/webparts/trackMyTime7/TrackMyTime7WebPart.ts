import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
} from '@microsoft/sp-webpart-base';

import {
  IPropertyPaneConfiguration,
} from '@microsoft/sp-property-pane';

import * as strings from 'TrackMyTime7WebPartStrings';
import TrackMyTime7  from './components/TrackMyTime7';
import { statusChoices }  from './components/TrackMyTime7';

import { ITrackMyTime7Props } from './components/ITrackMyTime7Props';

// npm install @pnp/logging @pnp/common @pnp/odata @pnp/sp --save
import { sp } from '@pnp/sp';

import { propertyPaneBuilder } from '../../services/propPane/PropPaneBuilder';
import { saveTheTime, getTheCurrentTime, saveAnalytics } from '../../services/createAnalytics';
import { makeTheTimeObject } from '../../services/dateServices';

import { getHelpfullError, } from '../../services/ErrorHandler';

import { PageContext } from '@microsoft/sp-page-context';
import { WebPartContext } from '@microsoft/sp-webpart-base';

//  >>>> ADD import additional controls/components
import { UrlFieldFormatType, Field } from "@pnp/sp/presets/all";
import { IFieldAddResult, FieldTypes, IFieldInfo, IField,
    ChoiceFieldFormatType,
    DateTimeFieldFormatType, CalendarType, DateTimeFieldFriendlyFormatType,
    FieldUserSelectionMode } from "@pnp/sp/fields/types";

import { IItemAddResult } from "@pnp/sp/items";

import { provisionTheList } from './components/ListProvisioningTMT/provisionTMT';

require('../../services/propPane/GrayPropPaneAccordions.css');

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
import "@pnp/sp/views";
import "@pnp/sp/fields/list";

/***
 *         d888888b d8b   db d888888b d88888b d8888b. d88888b  .d8b.   .o88b. d88888b 
 *           `88'   888o  88 `~~88~~' 88'     88  `8D 88'     d8' `8b d8P  Y8 88'     
 *            88    88V8o 88    88    88ooooo 88oobY' 88ooo   88ooo88 8P      88ooooo 
 *            88    88 V8o88    88    88~~~~~ 88`8b   88~~~   88~~~88 8b      88~~~~~ 
 *           .88.   88  V888    88    88.     88 `88. 88      88   88 Y8b  d8 88.     
 *         Y888888P VP   V8P    YP    Y88888P 88   YD YP      YP   YP  `Y88P' Y88888P 
 *                                                                                    
 *                                                                                    
 */

export interface ITrackMyTimeWebPartProps {
  // 0 - Context
  pageContext: PageContext;

  // 1 - Analytics options
  useListAnalytics: boolean;
  analyticsWeb?: string;
  analyticsList?: string;
  stressMultiplier?: number;

  // 2 - Source and destination list information
  createVerifyLists: boolean;
  projectListTitle: string;
  projectListWeb: string;
  projectListConfirmed: boolean;

  timeTrackListTitle: string;
  timeTrackListWeb: string;
  timeTrackListConfirmed: boolean;
  projectListFieldTitles: string;

  // 3 - General how accurate do you want this to be
  roundTime: string; //Up 5 minutes, Down 5 minutes, No Rounding;
  forceCurrentUser: boolean; //false allows you to put in data for someone else
  confirmPrompt: boolean;  //Make user press confirm

  // 4 -Project options
  allowUserProjects: boolean; //Will build list of ProjectsUser based on existing data from TrackMyTime list
  projectMasterPriority: string; //Use to determine what projects float to top.... your most recent?  last day?
  projectUserPriority: string; //Use to determine what projects float to top.... your most recent?  last day?
  onlyActiveProjects: boolean; //Only read in active projects.
  projectKey: string[]; // project props used to determine a unique user project in the choice list
  syncProjectPivotsOnToggle: boolean;  //always keep pivots in sync when toggling projects/history

  projectType?:boolean; //Projects = 0 History = 1
  defProjEditOptions?: string;

  projActivityRule?: string;  //title=NoTitleType-Activity

  // 5 - UI Defaults
  defaultProjectPicker: string; //Recent, Your Projects, All Projects etc...
  defaultTimePicker: string; //SinceLast, Slider, Manual???
  locationChoices: string;  //semi-colon separated choices
  defaultLocation: string; //Office, Customer, Traveling, Home

  // 6 - User Feedback:
  showElapsedTimeSinceLast: boolean;  // Idea is that it can be like a clock showing how long it's been since your last entry.

  // Target will be used to provide user feedback on how much/well they are tracking time
  showTargetBar: boolean; //Eventually have some kind of way to tell user that x% of hours have been entered for day/week
  showTargetToggle: boolean; //Maybe give user option to toggle between day/week
  dailyTarget: number; // Target hours per day to have tracked in a day - propLabelDailyTarget
  weeklyTarget:  number;  // Target hours per day to have tracked in a week - propLabelWeeklyTarget

  // 7 - Slider Options
  showTimeSlider: boolean; //true allows you to define end time and slider for how long you spent
  timeSliderInc: number; //incriment of time slider
  timeSliderMax: number; //max of time slider

  // 9 - Other web part options
  webPartScenario: string; //Choice used to create mutiple versions of the webpart.

  advancedPivotStyles: boolean;
  pivotSize: string;
  pivotFormat: string;
  pivotOptions: string;
  pivotTab: string;

}



export default class TrackMyTimeWebPart extends BaseClientSideWebPart<ITrackMyTimeWebPartProps> {

  /***
 *          .d88b.  d8b   db d888888b d8b   db d888888b d888888b 
 *         .8P  Y8. 888o  88   `88'   888o  88   `88'   `~~88~~' 
 *         88    88 88V8o 88    88    88V8o 88    88       88    
 *         88    88 88 V8o88    88    88 V8o88    88       88    
 *         `8b  d8' 88  V888   .88.   88  V888   .88.      88    
 *          `Y88P'  VP   V8P Y888888P VP   V8P Y888888P    YP    
 *                                                               
 *                                                               
 */

    //Added for Get List Data:  https://www.youtube.com/watch?v=b9Ymnicb1kc
    public onInit():Promise<void> {
      return super.onInit().then(_ => {
        // other init code may be present
  
        //https://stackoverflow.com/questions/52010321/sharepoint-online-full-width-page
        if ( window.location.href &&  
          window.location.href.toLowerCase().indexOf("layouts/15/workbench.aspx") > 0 ) {
            
          if (document.getElementById("workbenchPageContent")) {
            document.getElementById("workbenchPageContent").style.maxWidth = "none";
          }
        } 

        //console.log('window.location',window.location);
        sp.setup({
          spfxContext: this.context
        });
      });
    }
  
    public getUrlVars(): {} {
      var vars = {};
      vars = location.search
      .slice(1)
      .split('&')
      .map(p => p.split('='))
      .reduce((obj, pair) => {
        const [key, value] = pair.map(decodeURIComponent);
        return ({ ...obj, [key]: value }) ;
      }, {});
      return vars;
    }

/***
 *         d8888b. d88888b d8b   db d8888b. d88888b d8888b. 
 *         88  `8D 88'     888o  88 88  `8D 88'     88  `8D 
 *         88oobY' 88ooooo 88V8o 88 88   88 88ooooo 88oobY' 
 *         88`8b   88~~~~~ 88 V8o88 88   88 88~~~~~ 88`8b   
 *         88 `88. 88.     88  V888 88  .8D 88.     88 `88. 
 *         88   YD Y88888P VP   V8P Y8888D' Y88888P 88   YD 
 *                                                          
 *                                                          
 */

  public render(): void {
    const element: React.ReactElement<ITrackMyTime7Props > = React.createElement(
      TrackMyTime7,
      {
        description: strings.description,

        // 0 - Context
        pageContext: this.context.pageContext,
        wpContext: this.context,
        tenant: this.context.pageContext.web.absoluteUrl.replace(this.context.pageContext.web.serverRelativeUrl,""),
        urlVars: this.getUrlVars(),
        today: makeTheTimeObject(''),

        //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
        WebpartElement:this.domElement,

        // 1 - Analytics options  
        useListAnalytics: this.properties.useListAnalytics,
        analyticsWeb: strings.analyticsWeb,
        analyticsList: strings.analyticsList,
        stressMultiplier: this.properties.stressMultiplier,
      
        // 2 - Source and destination list information
        projectListTitle: this.properties.projectListTitle,
        projectListWeb: this.properties.projectListWeb,
      
        timeTrackListTitle: this.properties.timeTrackListTitle,
        timeTrackListWeb: this.properties.timeTrackListWeb,
      
        // 3 - General how accurate do you want this to be
        roundTime: this.properties.roundTime, //Up 5 minutes, Down 5 minutes, No Rounding,
        forceCurrentUser: this.properties.forceCurrentUser, //false allows you to put in data for someone else
        confirmPrompt: this.properties.confirmPrompt,  //Make user press confirm
      
        // 4 -Project options
        allowUserProjects: this.properties.allowUserProjects, //Will build list of ProjectsUser based on existing data from TrackMyTime list
        projectMasterPriority: this.properties.projectMasterPriority, //Use to determine what projects float to top.... your most recent?  last day?
        projectUserPriority: this.properties.projectUserPriority, //Use to determine what projects float to top.... your most recent?  last day?
        onlyActiveProjects: this.properties.onlyActiveProjects, //Only read in active projects.
        projectKey: ['titleProject','projectID2'], // project props used to determine a unique user project in the choice list
        syncProjectPivotsOnToggle: this.properties.syncProjectPivotsOnToggle, //always keep pivots in sync when toggling projects/history

        projectType: this.properties.projectType, //Projects = 0 History = 1
        defProjEditOptions : this.properties.defProjEditOptions ,

        projActivityRule: this.properties.projActivityRule ? this.properties.projActivityRule : 'title=Replace...<Title>: <Type>-<Activity>',  // is same as 'title=<Type>-<Activity>'

        // 5 - UI Defaults
        defaultProjectPicker: this.properties.defaultProjectPicker, //Recent, Your Projects, All Projects etc...
        defaultTimePicker: this.properties.defaultTimePicker, //SinceLast, Slider, Manual???
        locationChoices: this.properties.locationChoices,  //semi-colon separated choices
        defaultLocation: this.properties.defaultLocation, //Office, Customer, Traveling, Home
        
        // 6 - User Feedback:
        showElapsedTimeSinceLast: this.properties.showElapsedTimeSinceLast,  // Idea is that it can be like a clock showing how long it's been since your last entry.
        showTargetBar: this.properties.showTargetBar, //Eventually have some kind of way to tell user that x% of hours have been entered for day/week
        showTargetToggle: this.properties.showTargetToggle, //Maybe give user option to toggle between day/week
        dailyTarget:  this.properties.dailyTarget, //Day, Week, Both?
        weeklyTarget: this.properties.weeklyTarget, //Hours for typical day/week

        // 7 - Slider Options
        showTimeSlider: this.properties.showTimeSlider, //true allows you to define end time and slider for how long you spent
        timeSliderInc: this.properties.timeSliderInc, //incriment of time slider
        timeSliderMax: this.properties.timeSliderMax * 60, //max of time slider (in hours)
      
        // 9 - Other web part options
        webPartScenario: this.properties.webPartScenario, //Choice used to create mutiple versions of the webpart.
          
        pivotSize: this.properties.pivotSize,
        pivotFormat: this.properties.pivotFormat,
        pivotOptions: this.properties.pivotOptions,
        pivotTab: 'Projects', //this.properties.pivotTab (was setTab in pivot-tiles)

      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }


/**
 * 
 * @param myListName 
 * 
 * 
 * 
 * THIS IS FOR PROPERTY PANE TO BUILD LISTS
 * 
 * 
 * 
 * @param myListDesc 
 * @param ProjectOrTime 
 */


/***
 *          .o88b. d8888b. d88888b  .d8b.  d888888b d88888b      db      d888888b .d8888. d888888b .d8888. 
 *         d8P  Y8 88  `8D 88'     d8' `8b `~~88~~' 88'          88        `88'   88'  YP `~~88~~' 88'  YP 
 *         8P      88oobY' 88ooooo 88ooo88    88    88ooooo      88         88    `8bo.      88    `8bo.   
 *         8b      88`8b   88~~~~~ 88~~~88    88    88~~~~~      88         88      `Y8b.    88      `Y8b. 
 *         Y8b  d8 88 `88. 88.     88   88    88    88.          88booo.   .88.   db   8D    88    db   8D 
 *          `Y88P' 88   YD Y88888P YP   YP    YP    Y88888P      Y88888P Y888888P `8888Y'    YP    `8888Y' 
 *                                                                                                         
 *                                                                                                         
 */

  private CreateTTIMTimeList(oldVal: any): any {

    let listName = this.properties.timeTrackListTitle ? this.properties.timeTrackListTitle : 'TrackMyTime';
    let listCreated = provisionTheList( listName , 'TrackMyTime', this.context.pageContext.web.absoluteUrl);
    
    if ( listCreated ) { 
      this.properties.timeTrackListTitle = listName;
      this.properties.timeTrackListConfirmed= true;
    }
     return "Finished";  
  } 

  private CreateTTIMProjectList(oldVal: any): any {

    let listName = this.properties.projectListTitle ? this.properties.projectListTitle : 'Projects';
    let listCreated = provisionTheList( listName , 'Projects', this.context.pageContext.web.absoluteUrl);
    
    if ( listCreated ) { 
      this.properties.projectListTitle= listName;
      this.properties.projectListConfirmed= true;
    }
     return "Finished";  
  } 


  private async UpdateTitles(): Promise<boolean> {

    const list = sp.web.lists.getByTitle("Projects");
    const r = await list.fields();

    //2020-05-13:  Remove Active since it's replaced with StatusTMT which is not applicable here
    let getFields=["Title","ProjectID1","ProjectID2","Category1","Category2","Activity","Story","Chapter","ActivityTMT","ActivityType"];

    let fieldTitles = r.filter(f => f.Hidden !== true && getFields.indexOf(f.StaticName) > -1).map( 
      f => {return [f.StaticName,f.Title,f.Description,f.Required,f.FieldTypeKind];});
    
    //Update properties here:
    this.properties.projectListFieldTitles = JSON.stringify(fieldTitles);

    console.log('list fields: ', r);
    console.log('fieldTitles: ', fieldTitles);
    
    return true;

  } 


/***
 *         d8888b. d8888b.  .d88b.  d8888b.      d8888b.  .d8b.  d8b   db d88888b 
 *         88  `8D 88  `8D .8P  Y8. 88  `8D      88  `8D d8' `8b 888o  88 88'     
 *         88oodD' 88oobY' 88    88 88oodD'      88oodD' 88ooo88 88V8o 88 88ooooo 
 *         88~~~   88`8b   88    88 88~~~        88~~~   88~~~88 88 V8o88 88~~~~~ 
 *         88      88 `88. `8b  d8' 88           88      88   88 88  V888 88.     
 *         88      88   YD  `Y88P'  88           88      YP   YP VP   V8P Y88888P 
 *                                                                                
 *                                                                                
 */



  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return propertyPaneBuilder.getPropertyPaneConfiguration(
      this.properties,
      this.CreateTTIMTimeList.bind(this),
      this.CreateTTIMProjectList.bind(this),
      this.UpdateTitles.bind(this),

      );
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {

    /**
     * Use this section when there are multiple web part configurations
     */
      /*
          let newMap : any = {};
          if (this.properties.scenario === 'DEV' ) {
            //newMap = availableListMapping.getListColumns(newValue);
          } else if (this.properties.scenario === 'TEAM') {
            //newMap = availableListMapping.getListColumns(newValue);  
          } else if (this.properties.scenario === 'CORP') {
            //newMap = availableListMapping.getListColumns(newValue); 
          }

          const hasValues = Object.keys(newMap).length;

          if (hasValues !== 0) {
            //this.properties.listTitle = newMap.listDisplay;
          } else {
            console.log('Did NOT List Defintion... updating column name props');
          }
          this.context.propertyPane.refresh();

      /**
     * Use this section when there are multiple web part configurations
     */

    /**
     * This section is used to determine when to refresh the pane options
     */
    let updateOnThese = [
      'setSize','setTab','otherTab','setTab','otherTab','setTab','otherTab','setTab','otherTab',
      'projectListFieldTitles'
    ];
    //alert('props updated');
    if (updateOnThese.indexOf(propertyPath) > -1 ) {
      this.properties[propertyPath] = newValue;   
      this.context.propertyPane.refresh();

    } else { //This can be removed if it works

    }
    this.render();
  }
}
