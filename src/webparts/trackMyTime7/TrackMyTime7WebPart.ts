import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'TrackMyTime7WebPartStrings';
import TrackMyTime7 from './components/TrackMyTime7';
import { ITrackMyTime7Props } from './components/ITrackMyTime7Props';

// npm install @pnp/logging @pnp/common @pnp/odata @pnp/sp --save
import { sp } from '@pnp/sp';

import { propertyPaneBuilder } from '../../services/propPane/PropPaneBuilder';
import { saveTheTime, getTheCurrentTime, saveAnalytics } from '../../services/createAnalytics';

import { PageContext } from '@microsoft/sp-page-context';

export interface ITrackMyTimeWebPartProps {
  // 0 - Context
  pageContext: PageContext;

  // 1 - Analytics options
  useListAnalytics: boolean;
  analyticsWeb?: string;
  analyticsList?: string;
  stressMultiplier?: number;

  // 2 - Source and destination list information
  projectListTitle: string;
  projectListWeb: string;

  timeTrackListTitle: string;
  timeTrackListWeb: string;

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

  pivotSize: string;
  pivotFormat: string;
  pivotOptions: string;
  pivotTab: string;

}

export default class TrackMyTimeWebPart extends BaseClientSideWebPart<ITrackMyTimeWebPartProps> {

    //Added for Get List Data:  https://www.youtube.com/watch?v=b9Ymnicb1kc
    public onInit():Promise<void> {
      return super.onInit().then(_ => {
        // other init code may be present
  
        //https://stackoverflow.com/questions/52010321/sharepoint-online-full-width-page
        if ( window.location.href &&  
          window.location.href.indexOf("layouts/15/workbench.aspx") > 0 ) {
            
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

  public render(): void {
    const element: React.ReactElement<ITrackMyTime7Props > = React.createElement(
      TrackMyTime7,
      {
        description: strings.description,

        // 0 - Context
        pageContext: this.context.pageContext,
        tenant: this.context.pageContext.web.absoluteUrl.replace(this.context.pageContext.web.serverRelativeUrl,""),
        urlVars: this.getUrlVars(),

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

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return propertyPaneBuilder.getPropertyPaneConfiguration(this.properties);
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
      'setSize','setTab','otherTab','setTab','otherTab','setTab','otherTab','setTab','otherTab'
    ];

    if (updateOnThese.indexOf(propertyPath) > -1 ) {
      this.properties[propertyPath] = newValue;   
      this.context.propertyPane.refresh();

    } else { //This can be removed if it works

    }
    this.render();
  }
}

/*
export interface ITrackMyTime7WebPartProps {
  description: string;
}

export default class TrackMyTime7WebPart extends BaseClientSideWebPart<ITrackMyTime7WebPartProps> {

  public render(): void {
    const element: React.ReactElement<ITrackMyTime7Props > = React.createElement(
      TrackMyTime7,
      {
        description: this.properties.description
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

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

*/