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
import TrackMyTime7 from './components/TrackMyTime7';
import { ITrackMyTime7Props } from './components/ITrackMyTime7Props';

// npm install @pnp/logging @pnp/common @pnp/odata @pnp/sp --save
import { sp } from '@pnp/sp';

import { propertyPaneBuilder } from '../../services/propPane/PropPaneBuilder';
import { saveTheTime, getTheCurrentTime, saveAnalytics } from '../../services/createAnalytics';
import { makeTheTimeObject } from '../../services/dateServices';

import { getHelpfullError, } from '../../services/ErrorHandler';

import { PageContext } from '@microsoft/sp-page-context';

//  >>>> ADD import additional controls/components
import { UrlFieldFormatType, Field } from "@pnp/sp/presets/all";
import { IFieldAddResult, FieldTypes, IFieldInfo, IField,
    ChoiceFieldFormatType,
    DateTimeFieldFormatType, CalendarType, DateTimeFieldFriendlyFormatType,
    FieldUserSelectionMode } from "@pnp/sp/fields/types";

import { IItemAddResult } from "@pnp/sp/items";

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
        tenant: this.context.pageContext.web.absoluteUrl.replace(this.context.pageContext.web.serverRelativeUrl,""),
        urlVars: this.getUrlVars(),
        today: makeTheTimeObject(''),

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
 *         d8888b. db    db d888888b db      d8888b.      db      d888888b .d8888. d888888b .d8888. 
 *         88  `8D 88    88   `88'   88      88  `8D      88        `88'   88'  YP `~~88~~' 88'  YP 
 *         88oooY' 88    88    88    88      88   88      88         88    `8bo.      88    `8bo.   
 *         88~~~b. 88    88    88    88      88   88      88         88      `Y8b.    88      `Y8b. 
 *         88   8D 88b  d88   .88.   88booo. 88  .8D      88booo.   .88.   db   8D    88    db   8D 
 *         Y8888P' ~Y8888P' Y888888P Y88888P Y8888D'      Y88888P Y888888P `8888Y'    YP    `8888Y' 
 *                                                                                                  
 *                                                                                                  
 */



  private async ensureTrackTimeList(myListName: string, myListDesc: string, ProjectOrTime: string): Promise<boolean> {
    
    let result: boolean = false;

    let isProject = ProjectOrTime.toLowerCase() === 'project' ? true : false;
    let isTime = ProjectOrTime.toLowerCase() === 'trackmytime' ? true : false;

    alert('Hey!  Press OK to Build/Verify your ' + ProjectOrTime + ' list... Then please wait 5-30 seconds for another popup to confirm the result before moving on.');

    try {
      const ensureResult = await sp.web.lists.ensure(myListName,
        myListDesc,
        100,
        true,
        { EnableVersioning: true, MajorVersionLimit: 20, });

      // if we've got the list
      if (ensureResult.list != null) {
        // if the list has just been created
        if (ensureResult.created) {
          // we need to add the custom fields to the list
          //https://pnp.github.io/pnpjs/sp/lists/#ensure-that-a-list-exists-by-title
          //https://pnp.github.io/pnpjs/sp/fields/

          //Add this after creating field to change title:  //await field1.field.update({ Title: "My Text"});


          let columnGroup = 'TrackTimeProject';

          let fieldDescription = "Used by webpart to put inactive projects into different category for convenience";
          let fieldSchema = '<Field DisplayName="Active" Description="' +  fieldDescription + '" Format="Dropdown" Name="Active" Title="Active" Type="Boolean" ID="{d738a4f4-b23d-409d-a72e-8a09a6cd78a8}" SourceID="{53db1cec-2e4f-4db9-b4be-8abbbae91ee7}" Group="' + columnGroup + '" StaticName="Active" ColName="bit1" RowOrdinal="0"><Default>1</Default></Field>';
          const active: IFieldAddResult = await ensureResult.list.fields.createFieldAsXml(fieldSchema);

          if (isProject){
            fieldDescription = "Used by webpart to sort list of projects";
            fieldSchema = '<Field Type="Number" DisplayName="SortOrder" Description="' +  fieldDescription + '" Required="FALSE" EnforceUniqueValues="FALSE" Indexed="FALSE" Min="0" Max="1000" Decimals="1" ID="{a65f6333-dd5d-49af-acf9-68f1606052f2}" SourceID="{53db1cec-2e4f-4db9-b4be-8abbbae91ee7}" Group="' + columnGroup + '" StaticName="SortOrder" Name="SortOrder" ColName="float1" RowOrdinal="0" />';
            const sortOrder: IFieldAddResult = await ensureResult.list.fields.createFieldAsXml(fieldSchema);
  
            fieldDescription = "Used by webpart to easily find common or standard Project Items";
            fieldSchema = '<Field Type="Boolean" DisplayName="Everyone" Description="' +  fieldDescription + '" EnforceUniqueValues="FALSE" Indexed="FALSE" ID="{67fa37c2-2ccf-4c30-b586-ce876955cb12}" SourceID="{53db1cec-2e4f-4db9-b4be-8abbbae91ee7}" Group="' + columnGroup + '" StaticName="Everyone" Name="Everyone" ColName="bit2" RowOrdinal="0"><Default>0</Default></Field>';
            const everyone: IFieldAddResult = await ensureResult.list.fields.createFieldAsXml(fieldSchema);   

          }

          fieldDescription = "Leader of this Project Item.  Helps you find Projects you own";
          fieldSchema = '<Field DisplayName="Leader" Description="' +  fieldDescription + '" Format="Dropdown" List="UserInfo" Name="Leader" Title="Leader" Type="User" Indexed="TRUE" UserSelectionMode="1" UserSelectionScope="0" ID="{10e58bd6-3722-47a9-a34c-87c2dcade2aa}" SourceID="{53db1cec-2e4f-4db9-b4be-8abbbae91ee7}" Group="' + columnGroup + '" StaticName="Leader" ColName="int1" RowOrdinal="0" />';
          const leader: IFieldAddResult = await ensureResult.list.fields.createFieldAsXml(fieldSchema);

          fieldDescription = "Other Team Members for this project. Helps you find projects you are working on.";
          fieldSchema = '<Field DisplayName="Team" Description="' +  fieldDescription + '" Format="Dropdown" List="UserInfo" Mult="TRUE" Name="Team" Title="Team" Type="UserMulti" UserSelectionMode="0" UserSelectionScope="0" ID="{1614eec8-246a-4d63-9ce9-eb8c8a733af1}" SourceID="{53db1cec-2e4f-4db9-b4be-8abbbae91ee7}" Group="' + columnGroup + '" StaticName="Team" ColName="int2" RowOrdinal="0" />';
          const team: IFieldAddResult = await ensureResult.list.fields.createFieldAsXml(fieldSchema);

          fieldDescription = "Project level choice category in entry form.";
          fieldSchema = '<Field ClientSideComponentId="00000000-0000-0000-0000-000000000000" DisplayName="Category1" Description="' +  fieldDescription + '" FillInChoice="TRUE" Format="Dropdown" Name="Category1" Title="Category1" Type="MultiChoice" ID="{b04db900-ab45-415d-bb11-336704f82d31}" Version="4" Group="' + columnGroup + '" StaticName="Category1" SourceID="{53db1cec-2e4f-4db9-b4be-8abbbae91ee7}" ColName="ntext3" RowOrdinal="0" CustomFormatter="" EnforceUniqueValues="FALSE" Indexed="FALSE"><CHOICES><CHOICE>Daily</CHOICE><CHOICE>SPFx</CHOICE><CHOICE>Assistance</CHOICE><CHOICE>Team Meetings</CHOICE><CHOICE>Training</CHOICE><CHOICE>------</CHOICE><CHOICE>Other</CHOICE></CHOICES></Field>';
          const category1: IFieldAddResult = await ensureResult.list.fields.createFieldAsXml(fieldSchema);
          
          fieldDescription = "Project level choice category in entry form.";
          fieldSchema = '<Field ClientSideComponentId="00000000-0000-0000-0000-000000000000" DisplayName="Category2" Description="' +  fieldDescription + '" FillInChoice="TRUE" Format="Dropdown" Name="Category2" Title="Category2" Type="MultiChoice" ID="{ee040745-8628-479a-b865-98e35c9b6617}" Version="3" Group="' + columnGroup + '" StaticName="Category2" SourceID="{53db1cec-2e4f-4db9-b4be-8abbbae91ee7}" ColName="ntext2" RowOrdinal="0" CustomFormatter="" Required="FALSE" EnforceUniqueValues="FALSE" Indexed="FALSE"><CHOICES><CHOICE>EU</CHOICE><CHOICE>NA</CHOICE><CHOICE>SA</CHOICE><CHOICE>Asia</CHOICE></CHOICES></Field>';
          const category2: IFieldAddResult = await ensureResult.list.fields.createFieldAsXml(fieldSchema);

          fieldDescription = "Special field used by webpart which can change the entry format based on the value in the Project List field.  See documentation";
          fieldSchema = '<Field Type="Text" DisplayName="ProjectID1" Description="' +  fieldDescription + '" Required="FALSE" EnforceUniqueValues="FALSE" Indexed="FALSE" MaxLength="255" ID="{f844fefd-8fde-4227-9707-5facc835c7ed}" SourceID="{53db1cec-2e4f-4db9-b4be-8abbbae91ee7}" Group="' + columnGroup + '" StaticName="ProjectID1" Name="ProjectID1" ColName="nvarchar4" RowOrdinal="0" />';
          const projectID1: IFieldAddResult = await ensureResult.list.fields.createFieldAsXml(fieldSchema);
          
          fieldSchema = '<Field Type="Text" DisplayName="ProjectID2" Description="' +  fieldDescription + '" Required="FALSE" EnforceUniqueValues="FALSE" Indexed="FALSE" MaxLength="255" ID="{432aeccc-6f3a-4bf0-b451-6970c0eb292d}" SourceID="{53db1cec-2e4f-4db9-b4be-8abbbae91ee7}" Group="' + columnGroup + '" StaticName="ProjectID2" Name="ProjectID2" ColName="nvarchar5" RowOrdinal="0" />';
          const projectID2: IFieldAddResult = await ensureResult.list.fields.createFieldAsXml(fieldSchema);

          if (isProject){
            fieldDescription = "Used by webpart to define targets for charting.";
            fieldSchema = '<Field Type="Text" DisplayName="TimeTarget" Description="' +  fieldDescription + '" Required="FALSE" EnforceUniqueValues="FALSE" Indexed="FALSE" MaxLength="255" ID="{02c5c9a7-7690-4efe-8e75-404a90654946}" SourceID="{53db1cec-2e4f-4db9-b4be-8abbbae91ee7}" Group="' + columnGroup + '" StaticName="TimeTarget" Name="TimeTarget" ColName="nvarchar6" RowOrdinal="0" />';
            const timeTarget: IFieldAddResult = await ensureResult.list.fields.createFieldAsXml(fieldSchema);

            fieldDescription = "Used as rule to apply to Project Activy Text to build Activity URL";
            const choicesA = [`Build`, `Test`, `Deliver`, `Verify`, `Order`];
          
            //NOTE that allow user fill in is determined by isProject
            const choicesA1 = await ensureResult.list.fields.addChoice("ActivityType", choicesA, ChoiceFieldFormatType.Dropdown, isProject, { Group: columnGroup, Description: fieldDescription });
            //const choicesA2 = await ensureResult.list.fields.getByTitle("ActivityType").update({Title: 'ActivityType'});

            fieldDescription = "Used to complete Activity URL based on the selected choice.  Auto Builds Activity Link in TrackMyTime form.";
            const Activity1: IFieldAddResult = await ensureResult.list.fields.addText("Activity", 255, { Group: columnGroup, Description: fieldDescription });
  
            fieldDescription = "Special field for enabling special project level options in the webpart.";
            const OptionsTMT: IFieldAddResult = await ensureResult.list.fields.addText("OptionsTMT", 255, { Group: columnGroup, Description: fieldDescription });
            const OptionsTMT2 = await ensureResult.list.fields.getByTitle("OptionsTMT").update({Title: 'Options'});

            let thisFormula = '=IF(ISNUMBER(FIND("Test",Title)),"icon=TestAutoSolid;","")&IF(OR(ISNUMBER(FIND("Lunch",Title)),ISNUMBER(FIND("Break",Title))),"icon=EatDrink;fColor=green","")&IF(ISNUMBER(FIND("Email",Title)),"icon=MailCheck;","")&IF(ISNUMBER(FIND("Training",Title)),"icon=BookAnswers;fColor=blue","")&IF(ISNUMBER(FIND("Meet",Title)),"icon=Group;","")';
            const OptionsTMTCalc: IFieldAddResult = await ensureResult.list.fields.addCalculated('OptionsTMTCalc', thisFormula, DateTimeFieldFormatType.DateOnly, FieldTypes.Text, { Group: columnGroup, Description: fieldDescription });
            const OptionsTMTCalc2 = await ensureResult.list.fields.getByTitle("OptionsTMTCalc").update({Title: 'Options^'});

          }

          fieldDescription = "Used by web part to create Time Entry on secondary list at the same time... aka like Cc in email.";
          const ccList: IFieldAddResult = await ensureResult.list.fields.addUrl("CCList", UrlFieldFormatType.Hyperlink, { Group: columnGroup, Description: fieldDescription });

          fieldDescription = "To be used by webpart to email this address for every entry.  Not yet used.";
          const ccEmail: IFieldAddResult = await ensureResult.list.fields.addText("CCEmail", 255, { Group: columnGroup, Description: fieldDescription });

          fieldDescription = "Special field in Project list used create a Story in Charts. This is the primary filter for the Chart Story page.";
          const story: IFieldAddResult = await ensureResult.list.fields.addText("Story", 255, { Group: columnGroup, Description: fieldDescription, Indexed: true });

          fieldDescription = "Special field in Project list used create a Story in Charts. Consider this the primary category for the Story Chart.";
          const chapter: IFieldAddResult = await ensureResult.list.fields.addText("Chapter", 255, { Group: columnGroup, Description: fieldDescription, Indexed: true });

          /**
           * Status related fields - Only on Projects list
           * Choices from current smile list
           * 0. Not Started;1. Under Review;2. In Process;3. Verify;4. Complete;5. Rejected;9. Cancelled;
           */
          const choices = [`0. Review`, `1. Plan`, `2. In Process`, `3. Verify`, `4. Complete`, `9. Rejected`, `9. Cancelled`];
          
          //NOTE that allow user fill in is determined by isProject
          const statusTMT = await ensureResult.list.fields.addChoice("StatusTMT", choices, ChoiceFieldFormatType.Dropdown, isProject, { Group: columnGroup, Description: fieldDescription, DefaultFormula:'="0. Review"' });
          const statusTMT2 = await ensureResult.list.fields.getByTitle("StatusTMT").update({Title: 'Status'});

          fieldDescription = "Used in various places to track status.";
          const statNumber: IFieldAddResult = await ensureResult.list.fields.addCalculated("StatusNumber", '=VALUE(LEFT(Status,1))', DateTimeFieldFormatType.DateOnly, FieldTypes.Number, { Group: columnGroup, Description: fieldDescription });
          const statusText: IFieldAddResult = await ensureResult.list.fields.addCalculated("StatusText", '=TRIM(MID(Status,FIND(".",Status)+1,100))', DateTimeFieldFormatType.DateOnly, FieldTypes.Number, { Group: columnGroup, Description: fieldDescription });

          /**
           * Only have these on Project / Task list
           */

          //Create StepChecks
          if (isProject){
            fieldDescription = "Can be used to have checks at different status to impact Effective Status instead of just a number.";
            for (let i = 0; i < 6; i++) {
              let thisCheck = i === 0 ? '=IF(AND([StatusNumber]>' + i + ',[StatusNumber]>' + i + '),"Yes","No")'
              : '=IF(AND(Step' + (i - 1) + 'Check="Yes",[StatusNumber]>' + i + '),"Yes","No")';
              const stepCheck: IFieldAddResult = await ensureResult.list.fields.addCalculated('Step' + i + 'Check', thisCheck, DateTimeFieldFormatType.DateOnly, FieldTypes.Number, { Group: columnGroup, Description: fieldDescription });
  
            }
  
            const effectiveStatus: IFieldAddResult = await ensureResult.list.fields.addCalculated("EffectiveStatus", '=(IF([StatusNumber]=9,9,IF(Step4Check="Yes",5,IF(Step3Check="Yes",4,IF(Step2Check="Yes",3,IF(Step1Check="Yes",2,IF(Step0Check="Yes",1,0)))))))', DateTimeFieldFormatType.DateOnly, FieldTypes.Number, { Group: columnGroup, Description: fieldDescription });
            const stepCheck2: IFieldAddResult = await ensureResult.list.fields.addCalculated('IsOpen', '=IF(EffectiveStatus<4,"Yes","No") ', DateTimeFieldFormatType.DateOnly, FieldTypes.Number, { Group: columnGroup, Description: fieldDescription });  


            // Need to add DueDate column at some point.          
            //const dueDate: IField = await sp.web.fields.getByInternalNameOrTitle('TaskDueDate');
            //const dueDateField = await ensureResult.list.fields.addDateTime("TaskDueDate", DateTimeFieldFormatType.DateOnly, CalendarType.Gregorian, DateTimeFieldFriendlyFormatType.Disabled, { Group: columnGroup, Indexed: true });

            fieldSchema = '<Field ID="{cd21b4c2-6841-4f9e-a23a-738a65f99889}" Name="TaskDueDate" Group="Core Task and Issue Columns" Type="DateTime" DisplayName="Due Date" SourceID="http://schemas.microsoft.com/sharepoint/v3/fields" StaticName="TaskDueDate" Format="DateOnly" DelayActivateTemplateBinding="GROUP,SPSPERS,SITEPAGEPUBLISHING" AllowDeletion="TRUE" ColName="datetime2" RowOrdinal="0" />';
//            const dueDateField: IFieldAddResult = await ensureResult.list.fields.createFieldAsXml(fieldSchema);

            fieldDescription = "For use when using Project List for Task tracking.";
            const dueDate: IFieldAddResult = await ensureResult.list.fields.addDateTime("DueDateTMT", DateTimeFieldFormatType.DateOnly, CalendarType.Gregorian, DateTimeFieldFriendlyFormatType.Disabled, { Group: columnGroup, Description: fieldDescription });
            const completeDate: IFieldAddResult = await ensureResult.list.fields.addDateTime("CompletedDateTMT", DateTimeFieldFormatType.DateOnly, CalendarType.Gregorian, DateTimeFieldFriendlyFormatType.Disabled, { Group: columnGroup, Description: fieldDescription });
            const completedBy: IFieldAddResult = await ensureResult.list.fields.addUser("CompletedByTMT", FieldUserSelectionMode.PeopleOnly, { Group: columnGroup, Description: fieldDescription, Indexed: true });
            const dueDate2= await ensureResult.list.fields.getByTitle("DueDateTMT").update({ Title: 'Due Date' });
            const completeDate2= await ensureResult.list.fields.getByTitle("CompletedDateTMT").update({ Title: 'Completed' });
            const completedBy2= await ensureResult.list.fields.getByTitle("CompletedByTMT").update({ Title: 'Completed By' });

          }
  
          /**
           * Only have these on TIME list
           */

          if (isTime) { //Fields specific for Time
            let minInfinity: number = -1.7976931348623157e+308;
            let maxInfinity = -1 * minInfinity ;

            fieldDescription = "Link to the activity you are working on";
            const activity: IFieldAddResult = await ensureResult.list.fields.addUrl("Activity", UrlFieldFormatType.Hyperlink, { Group: columnGroup, Description: fieldDescription });
            
            fieldDescription = "May be used to indicate difference between when an entry is created and the actual time of the entry.";
            const deltaT: IFieldAddResult = await ensureResult.list.fields.addNumber("DeltaT", minInfinity, maxInfinity, { Group: columnGroup, Description: fieldDescription });
            const comments: IFieldAddResult = await ensureResult.list.fields.addText("Comments", 255, { Group: columnGroup });

            fieldDescription = "Saved at time of creation for comparison of changes.";
            const originalHours: IFieldAddResult = await ensureResult.list.fields.addNumber("OriginalHours", minInfinity, maxInfinity, { Group: columnGroup, Description: fieldDescription });

            const endTime: IFieldAddResult = await ensureResult.list.fields.addDateTime("EndTime", DateTimeFieldFormatType.DateTime, CalendarType.Gregorian, DateTimeFieldFriendlyFormatType.Disabled, { Group: columnGroup, Required: true });
            const startTime: IFieldAddResult = await ensureResult.list.fields.addDateTime("StartTime", DateTimeFieldFormatType.DateTime, CalendarType.Gregorian, DateTimeFieldFriendlyFormatType.Disabled, { Group: columnGroup, Required: true, Indexed: true });

            fieldDescription = "Saved at time of creation for comparison of changes.";
            const originalStart: IFieldAddResult = await ensureResult.list.fields.addDateTime("OriginalStart", DateTimeFieldFormatType.DateTime, CalendarType.Gregorian, DateTimeFieldFriendlyFormatType.Disabled, { Group: columnGroup });
            const originalEnd: IFieldAddResult = await ensureResult.list.fields.addDateTime("OriginalEnd", DateTimeFieldFormatType.DateTime, CalendarType.Gregorian, DateTimeFieldFriendlyFormatType.Disabled, { Group: columnGroup });

            fieldDescription = "Calculates Start to End time in Hours.";
            const hours: IFieldAddResult = await ensureResult.list.fields.addCalculated("Hours", '=IFERROR(24*(EndTime-StartTime),"")', DateTimeFieldFormatType.DateOnly, FieldTypes.Number, { Group: columnGroup, Description: fieldDescription });

            fieldDescription = "Calculates if significant changes were made after item was created.";
            const keyChanges: IFieldAddResult = await ensureResult.list.fields.addCalculated("KeyChanges", '=IF(OriginalHours="","-NoOriginalHours",IF(ABS(Hours-OriginalHours)>0.05,"-HoursChanged",""))&IF(OriginalStart="","-NoOriginalStart",IF(StartTime<>OriginalStart,"-StartChanged",""))&IF(OriginalEnd="","-NoOriginalEnd",IF(EndTime<>OriginalEnd,"-EndChanged",""))', DateTimeFieldFormatType.DateOnly, FieldTypes.Number, { Group: columnGroup, Description: fieldDescription });

            //Hide these fields so they can't be seen.
            const originalHours2= await ensureResult.list.fields.getByTitle("OriginalHours").update({ Hidden: true });
            const originalStart2= await ensureResult.list.fields.getByTitle("OriginalStart").update({ Hidden: true });
            const originalEnd2= await ensureResult.list.fields.getByTitle("OriginalEnd").update({ Hidden: true });

            fieldDescription = "Link to the Project List item used to create this entry.";
            const sourceProject: IFieldAddResult = await ensureResult.list.fields.addUrl("SourceProject", UrlFieldFormatType.Hyperlink, { Group: columnGroup, Description: fieldDescription });

            fieldDescription = "Used by webpart to get source project information.";
            const sourceProjectRef: IFieldAddResult = await ensureResult.list.fields.addText("SourceProjectRef", 255, { Group: columnGroup, Hidden: true, Description: fieldDescription, Indexed: true });

            fieldDescription = "The person this time entry applies to.";
            const user: IFieldAddResult = await ensureResult.list.fields.addUser("User", FieldUserSelectionMode.PeopleOnly, { Group: columnGroup, Description: fieldDescription, Indexed: true });

            fieldDescription = "For internal use of webpart";
            const settings: IFieldAddResult = await ensureResult.list.fields.addText("Settings", 255, { Group: columnGroup, Description: fieldDescription });

            fieldDescription = "Optional category to indicate where time was spent.  Such as Office, Customer, Home, Traveling etc.";
            const location: IFieldAddResult = await ensureResult.list.fields.addText("Location", 255, { Group: columnGroup, Description: fieldDescription });

            fieldDescription = "Shows what entry type was used, used in Charting";
            const entryType: IFieldAddResult = await ensureResult.list.fields.addText("EntryType", 255, { Group: columnGroup, Description: fieldDescription });

            fieldDescription = "Calculates Start to End time in Days.";
            const days: IFieldAddResult = await ensureResult.list.fields.addCalculated("Days", '=IFERROR((EndTime-StartTime),"")', DateTimeFieldFormatType.DateOnly, FieldTypes.Number, { Group: columnGroup, Description: fieldDescription });

            // let hoursWithFormatSchema = '<Field Type="Calculated" DisplayName="Hours" EnforceUniqueValues="FALSE" Indexed="FALSE" Format="DateOnly" Decimals="1" LCID="1033" ResultType="Number" ReadOnly="TRUE" ID="{3aba8d94-68e5-4368-a322-1e513c660506}" SourceID="{148e3b00-e7d3-4c93-b584-6c0dd2f74015}" StaticName="Hours" Name="Hours" ColName="sql_variant2" RowOrdinal="0" CustomFormatter="{"elmType":"div","children":[{"elmType":"span","txtContent":"@currentField","style":{"position":"absolute","white-space":"nowrap","padding":"0 4px"}},{"elmType":"div","attributes":{"class":{"operator":"?","operands":[{"operator":"&&","operands":[{"operator":"<","operands":[-8304,0]},{"operator":">","operands":[549,0]},{"operator":">=","operands":["@currentField",0]}]},"sp-field-dashedBorderRight",""]}},"style":{"min-height":"inherit","box-sizing":"border-box","padding-left":{"operator":"?","operands":[{"operator":">","operands":[0,-8304]},{"operator":"+","operands":[{"operator":"*","operands":[{"operator":"/","operands":[{"operator":"-","operands":[{"operator":"abs","operands":[-8304]},{"operator":"?","operands":[{"operator":"<","operands":["@currentField",0]},{"operator":"abs","operands":[{"operator":"?","operands":[{"operator":"<=","operands":["@currentField",-8304]},-8304,"@currentField"]}]},0]}]},8853]},100]},"%"]},0]}}},{"elmType":"div","attributes":{"class":{"operator":"?","operands":[{"operator":"&&","operands":[{"operator":"<","operands":[-8304,0]},{"operator":"<","operands":["@currentField",0]}]},"sp-css-backgroundColor-errorBackground sp-css-borderTop-errorBorder","sp-css-backgroundColor-blueBackground07 sp-css-borderTop-blueBorder"]}},"style":{"min-height":"inherit","box-sizing":"border-box","width":{"operator":"?","operands":[{"operator":">","operands":[0,-8304]},{"operator":"+","operands":[{"operator":"*","operands":[{"operator":"/","operands":[{"operator":"?","operands":[{"operator":"<=","operands":["@currentField",-8304]},{"operator":"abs","operands":[-8304]},{"operator":"?","operands":[{"operator":">=","operands":["@currentField",549]},549,{"operator":"abs","operands":["@currentField"]}]}]},8853]},100]},"%"]},{"operator":"?","operands":[{"operator":">=","operands":["@currentField",549]},"100%",{"operator":"?","operands":[{"operator":"<=","operands":["@currentField",-8304]},"0%",{"operator":"+","operands":[{"operator":"*","operands":[{"operator":"/","operands":[{"operator":"-","operands":["@currentField",-8304]},8853]},100]},"%"]}]}]}]}}},{"elmType":"div","style":{"min-height":"inherit","box-sizing":"border-box"},"attributes":{"class":{"operator":"?","operands":[{"operator":"&&","operands":[{"operator":"<","operands":[-8304,0]},{"operator":">","operands":[549,0]},{"operator":"<","operands":["@currentField",0]}]},"sp-field-dashedBorderRight",""]}}}],"templateId":"DatabarNumber"}" Version="1"><Formula>=IFERROR(24*(EndTime-StartTime),"")</Formula><FieldRefs><FieldRef Name="StartTime" /><FieldRef Name="EndTime" /></FieldRefs></Field>';

            fieldDescription = "Calculates Start to End time in Minutes.";
            const minutes: IFieldAddResult = await ensureResult.list.fields.addCalculated("Minutes", '=IFERROR(24*60*(EndTime-StartTime),"")', DateTimeFieldFormatType.DateOnly, FieldTypes.Number, { Group: columnGroup, Description: fieldDescription });

          }
                    
          const tbdInfo1: IFieldAddResult = await ensureResult.list.fields.addText("zzzTBDInfo1", 255, { Group: columnGroup, Hidden: true });
          const tbdInfo2: IFieldAddResult = await ensureResult.list.fields.addText("zzzTBDInfo2", 255, { Group: columnGroup, Hidden: true  });

          let viewXml = '';
          if (isTime) { //View schema specific for Time
            viewXml = '<View Name="{C7E59C90-7F68-4A19-96C8-73BB66C1A7A8}" DefaultView="TRUE" MobileView="TRUE" MobileDefaultView="TRUE" Type="HTML" DisplayName="All Items" Url="/sites/Templates/Tmt/Lists/TrackMyTime/AllItems.aspx" Level="1" BaseViewID="1" ContentTypeID="0x" ImageUrl="/_layouts/15/images/generic.png?rev=47"><Query><OrderBy><FieldRef Name="ID" Ascending="FALSE" /></OrderBy></Query><ViewFields><FieldRef Name="ID" /><FieldRef Name="LinkTitle" /><FieldRef Name="Active" /><FieldRef Name="Leader" /><FieldRef Name="Team" /><FieldRef Name="Category1" /><FieldRef Name="Category2" /><FieldRef Name="User" /><FieldRef Name="StartTime" /><FieldRef Name="EndTime" /><FieldRef Name="Hours" /><FieldRef Name="Minutes" /><FieldRef Name="Days" /><FieldRef Name="Location" /><FieldRef Name="ProjectID1" /><FieldRef Name="ProjectID2" /><FieldRef Name="EntryType" /><FieldRef Name="Story" /><FieldRef Name="Chapter" /><FieldRef Name="DeltaT" /><FieldRef Name="Activity" /><FieldRef Name="Comments" /><FieldRef Name="CCList" /><FieldRef Name="CCEmail" /></ViewFields><CustomFormatter /><Toolbar Type="Standard" /><Aggregations Value="Off" /><XslLink Default="TRUE">main.xsl</XslLink><JSLink>clienttemplates.js</JSLink><RowLimit Paged="TRUE">30</RowLimit><ParameterBindings><ParameterBinding Name="NoAnnouncements" Location="Resource(wss,noXinviewofY_LIST)" /><ParameterBinding Name="NoAnnouncementsHowTo" Location="Resource(wss,noXinviewofY_DEFAULT)" /></ParameterBindings></View>';
          } else {
            viewXml = '<View Name="{B02AD2F6-34B3-4AF9-BA56-4B29BF28C49E}" DefaultView="TRUE" MobileView="TRUE" MobileDefaultView="TRUE" Type="HTML" DisplayName="All Items" Url="/sites/Templates/Tmt/Lists/Projects/AllItems.aspx" Level="1" BaseViewID="1" ContentTypeID="0x" ImageUrl="/_layouts/15/images/generic.png?rev=47"><ViewFields><FieldRef Name="ID" /><FieldRef Name="Active" /><FieldRef Name="SortOrder" /><FieldRef Name="LinkTitle" /><FieldRef Name="Everyone" /><FieldRef Name="Leader" /><FieldRef Name="Team" /><FieldRef Name="Category1" /><FieldRef Name="Category2" /><FieldRef Name="ProjectID1" /><FieldRef Name="ProjectID2" /><FieldRef Name="Story" /><FieldRef Name="Chapter" /><FieldRef Name="TimeTarget" /><FieldRef Name="CCList" /><FieldRef Name="CCEmail" /></ViewFields><ViewData /><Query><OrderBy><FieldRef Name="SortOrder" /></OrderBy></Query><Aggregations Value="Off" /><RowLimit Paged="TRUE">30</RowLimit><Mobile MobileItemLimit="3" MobileSimpleViewField="Active" /><CustomFormatter /><Toolbar Type="Standard" /><XslLink Default="TRUE">main.xsl</XslLink><JSLink>clienttemplates.js</JSLink><ParameterBindings><ParameterBinding Name="NoAnnouncements" Location="Resource(wss,noXinviewofY_LIST)" /><ParameterBinding Name="NoAnnouncementsHowTo" Location="Resource(wss,noXinviewofY_DEFAULT)" /></ParameterBindings></View>';
          }

          await ensureResult.list.views.getByTitle('All Items').setViewXml(viewXml);

          if (isProject) {

            /**
             * This is for Options column view
             */

             viewXml = '<View Name="{E5C88B9A-E4EB-4AD0-A57F-D864B101C03E}" Type="HTML" DisplayName="Options" Url="/sites/Templates/Tmt/Lists/Projects/Options.aspx" Level="1" BaseViewID="1" ContentTypeID="0x" ImageUrl="/_layouts/15/images/generic.png?rev=47"><ViewFields><FieldRef Name="ID" /><FieldRef Name="LinkTitle" /><FieldRef Name="OptionsTMT" /><FieldRef Name="OptionsTMTCalc" /><FieldRef Name="Category1" /><FieldRef Name="Category2" /><FieldRef Name="ProjectID1" /><FieldRef Name="ProjectID2" /><FieldRef Name="Story" /><FieldRef Name="Chapter" /></ViewFields><ViewData /><Query><OrderBy><FieldRef Name="SortOrder" /></OrderBy></Query><Aggregations Value="Off" /><RowLimit Paged="TRUE">30</RowLimit><Mobile MobileItemLimit="3" MobileSimpleViewField="ID" /><XslLink Default="TRUE">main.xsl</XslLink><JSLink>clienttemplates.js</JSLink><Toolbar Type="Standard" /><ParameterBindings><ParameterBinding Name="NoAnnouncements" Location="Resource(wss,noXinviewofY_LIST)" /><ParameterBinding Name="NoAnnouncementsHowTo" Location="Resource(wss,noXinviewofY_DEFAULT)" /></ParameterBindings></View>';
             const optionsView = await ensureResult.list.views.add('Options');
             await optionsView.view.setViewXml(viewXml);
            /**
             * These are Task related columns
             */
            let orderBy = '<OrderBy><FieldRef Name="DueDateTMT" /></OrderBy>';     

            for (let i = 0; i < 10; i++) {
              if (i < 6 || i === 9) {
                let stepLabel = 'Step' + i + '.All';
                //viewXml = '<View Name="{AC0C86EB-A3DA-4973-AFE1-BD9246F334' + i + i + '}" DefaultView="TRUE" MobileView="TRUE" Type="HTML" DisplayName="' + stepLabel + '" Url="/sites/Templates/ScriptTesting/Lists/Projects/' + stepLabel + '.aspx" Level="1" BaseViewID="1" ContentTypeID="0x" ImageUrl="/_layouts/15/images/generic.png?rev=47">' + orderBy + '<Where><Eq><FieldRef Name="EffectiveStatus" /><Value Type="Number">' + i + '</Value></Eq></Where></Query><ViewFields><FieldRef Name="Edit" /><FieldRef Name="ID" /><FieldRef Name="StatusTMT" /><FieldRef Name="LinkTitle" /><FieldRef Name="TaskDueDate" /><FieldRef Name="Leader" /><FieldRef Name="Team" /><FieldRef Name="ActivityType" /><FieldRef Name="Activity" /><FieldRef Name="EffectiveStatus" /></ViewFields><Toolbar Type="Standard" /><Aggregations Value="Off" /><XslLink Default="TRUE">main.xsl</XslLink><JSLink>clienttemplates.js</JSLink><RowLimit Paged="TRUE">30</RowLimit><ParameterBindings><ParameterBinding Name="NoAnnouncements" Location="Resource(wss,noXinviewofY_LIST)" /><ParameterBinding Name="NoAnnouncementsHowTo" Location="Resource(wss,noXinviewofY_DEFAULT)" /></ParameterBindings></View>';
                viewXml = '<View Name="{331C141E-B5C3-4786-A5C6-FD1749A4A3' + i + i + '}" Type="HTML" DisplayName="' + stepLabel + '" Url="/sites/Templates/ScriptTesting/Lists/Projects/' + stepLabel + '.aspx" Level="1" BaseViewID="1" ContentTypeID="0x" ImageUrl="/_layouts/15/images/generic.png?rev=47"><ViewFields><FieldRef Name="Edit" /><FieldRef Name="ID" /><FieldRef Name="StatusTMT" /><FieldRef Name="LinkTitle" /><FieldRef Name="DueDateTMT" /><FieldRef Name="Leader" /><FieldRef Name="Team" /><FieldRef Name="ActivityType" /><FieldRef Name="Activity" /><FieldRef Name="EffectiveStatus" /></ViewFields><ViewData /><Query>' + orderBy + '<Where><Eq><FieldRef Name="EffectiveStatus" /><Value Type="Number">' + i + '</Value></Eq></Where></Query><Aggregations Value="Off" /><RowLimit Paged="TRUE">30</RowLimit><Mobile MobileItemLimit="3" MobileSimpleViewField="ID" /><Toolbar Type="Standard" /><XslLink Default="TRUE">main.xsl</XslLink><JSLink>clienttemplates.js</JSLink><ParameterBindings><ParameterBinding Name="NoAnnouncements" Location="Resource(wss,noXinviewofY_LIST)" /><ParameterBinding Name="NoAnnouncementsHowTo" Location="Resource(wss,noXinviewofY_DEFAULT)" /></ParameterBindings></View>';
                const stepView = await ensureResult.list.views.add(stepLabel);
                await stepView.view.setViewXml(viewXml);
              }
            }

          } else if (isTime) { //Add more views for this list
            const V1 = await ensureResult.list.views.add("ActivityURLTesting");
            viewXml = '<View Name="{E76C719C-F90D-4F81-9306-5F83E2FB4AB4}" Type="HTML" DisplayName="ActivityURLTesting" Url="/sites/Templates/Tmt/Lists/TrackMyTime/ActivityURLTesting.aspx" Level="1" BaseViewID="1" ContentTypeID="0x" ImageUrl="/_layouts/15/images/generic.png?rev=47"><ViewFields><FieldRef Name="ID" /><FieldRef Name="LinkTitle" /><FieldRef Name="Category1" /><FieldRef Name="Category2" /><FieldRef Name="ProjectID1" /><FieldRef Name="ProjectID2" /><FieldRef Name="Activity" /><FieldRef Name="Comments" /><FieldRef Name="User" /><FieldRef Name="StartTime" /><FieldRef Name="EndTime" /></ViewFields><ViewData /><Query><OrderBy><FieldRef Name="ID" Ascending="FALSE" /></OrderBy></Query><Aggregations Value="Off" /><RowLimit Paged="TRUE">30</RowLimit><Mobile MobileItemLimit="3" MobileSimpleViewField="ID" /><XslLink Default="TRUE">main.xsl</XslLink><JSLink>clienttemplates.js</JSLink><Toolbar Type="Standard" /><ParameterBindings><ParameterBinding Name="NoAnnouncements" Location="Resource(wss,noXinviewofY_LIST)" /><ParameterBinding Name="NoAnnouncementsHowTo" Location="Resource(wss,noXinviewofY_DEFAULT)" /></ParameterBindings></View>';
            await V1.view.setViewXml(viewXml);

            const V2 = await ensureResult.list.views.add("Commit Notes");
            viewXml = '<View Name="{6E564C83-0528-4B17-89EF-59E6148A19E2}" Type="HTML" DisplayName="Commit Notes" Url="/sites/Templates/Tmt/Lists/TrackMyTime/Commit Notes.aspx" Level="1" BaseViewID="1" ContentTypeID="0x" ImageUrl="/_layouts/15/images/generic.png?rev=47"><ViewFields><FieldRef Name="ID" /><FieldRef Name="LinkTitle" /><FieldRef Name="StartTime" /><FieldRef Name="EndTime" /><FieldRef Name="ProjectID1" /><FieldRef Name="ProjectID2" /><FieldRef Name="Comments" /></ViewFields><ViewData /><Query><OrderBy><FieldRef Name="ID" Ascending="FALSE" /></OrderBy></Query><Aggregations Value="Off" /><RowLimit Paged="TRUE">30</RowLimit><Mobile MobileItemLimit="3" MobileSimpleViewField="ID" /><XslLink Default="TRUE">main.xsl</XslLink><JSLink>clienttemplates.js</JSLink><Toolbar Type="Standard" /><ParameterBindings><ParameterBinding Name="NoAnnouncements" Location="Resource(wss,noXinviewofY_LIST)" /><ParameterBinding Name="NoAnnouncementsHowTo" Location="Resource(wss,noXinviewofY_DEFAULT)" /></ParameterBindings></View>';
            await V2.view.setViewXml(viewXml);

            const V3 = await ensureResult.list.views.add("Recent Updates");
            viewXml = '<View Name="{F29474A6-6948-4176-8E5B-4B31C47E027F}" Type="HTML" DisplayName="Recent Updates" Url="/sites/Templates/Tmt/Lists/TrackMyTime/Recent Updates.aspx" Level="1" BaseViewID="1" ContentTypeID="0x" ImageUrl="/_layouts/15/images/generic.png?rev=47"><Query><OrderBy><FieldRef Name="Created" Ascending="FALSE" /></OrderBy></Query><ViewFields><FieldRef Name="ID" /><FieldRef Name="Created" /><FieldRef Name="Author" /><FieldRef Name="LinkTitle" /><FieldRef Name="Comments" /><FieldRef Name="Category1" /><FieldRef Name="Category2" /><FieldRef Name="User" /><FieldRef Name="StartTime" /><FieldRef Name="EndTime" /><FieldRef Name="Location" /><FieldRef Name="EntryType" /><FieldRef Name="DeltaT" /><FieldRef Name="Activity" /></ViewFields><Toolbar Type="Standard" /><Aggregations Value="Off" /><XslLink Default="TRUE">main.xsl</XslLink><JSLink>clienttemplates.js</JSLink><RowLimit Paged="TRUE">30</RowLimit><ParameterBindings><ParameterBinding Name="NoAnnouncements" Location="Resource(wss,noXinviewofY_LIST)" /><ParameterBinding Name="NoAnnouncementsHowTo" Location="Resource(wss,noXinviewofY_DEFAULT)" /></ParameterBindings></View>';
            await V3.view.setViewXml(viewXml);

            const V4 = await ensureResult.list.views.add("TrackTime");
            viewXml = '<View Name="{9AD04F4B-8160-4FDD-8632-56DB0F4B8397}" Type="HTML" DisplayName="TrackTime" Url="/sites/Templates/Tmt/Lists/TrackMyTime/TrackTime.aspx" Level="1" BaseViewID="1" ContentTypeID="0x" ImageUrl="/_layouts/15/images/generic.png?rev=47"><ViewFields><FieldRef Name="User" /><FieldRef Name="LinkTitle" /><FieldRef Name="Category1" /><FieldRef Name="Category2" /><FieldRef Name="StartTime" /><FieldRef Name="EndTime" /></ViewFields><Query /><RowLimit Paged="TRUE">30</RowLimit><XslLink Default="TRUE">main.xsl</XslLink><JSLink>clienttemplates.js</JSLink><Toolbar Type="Standard" /><ParameterBindings><ParameterBinding Name="NoAnnouncements" Location="Resource(wss,noXinviewofY_LIST)" /><ParameterBinding Name="NoAnnouncementsHowTo" Location="Resource(wss,noXinviewofY_DEFAULT)" /></ParameterBindings></View>';
            await V4.view.setViewXml(viewXml);

            const V5 = await ensureResult.list.views.add("VerifyData");
            viewXml = '<View Name="{650FC10D-35B7-4F76-BDF2-9D6DC976B6BE}" Type="HTML" DisplayName="VerifyData" Url="/sites/Templates/Tmt/Lists/TrackMyTime/VerifyData.aspx" Level="1" BaseViewID="1" ContentTypeID="0x" ImageUrl="/_layouts/15/images/generic.png?rev=47"><ViewFields><FieldRef Name="User" /><FieldRef Name="LinkTitle" /><FieldRef Name="Category1" /><FieldRef Name="Category2" /><FieldRef Name="StartTime" /><FieldRef Name="Hours" /><FieldRef Name="OriginalHours" /><FieldRef Name="OriginalStart" /><FieldRef Name="OriginalEnd" /><FieldRef Name="KeyChanges" /></ViewFields><ViewData /><Query><OrderBy><FieldRef Name="StartTime" Ascending="FALSE" /></OrderBy></Query><Aggregations Value="Off" /><RowLimit Paged="TRUE">30</RowLimit><Mobile MobileItemLimit="3" MobileSimpleViewField="User" /><XslLink Default="TRUE">main.xsl</XslLink><JSLink>clienttemplates.js</JSLink><Toolbar Type="Standard" /><ParameterBindings><ParameterBinding Name="NoAnnouncements" Location="Resource(wss,noXinviewofY_LIST)" /><ParameterBinding Name="NoAnnouncementsHowTo" Location="Resource(wss,noXinviewofY_DEFAULT)" /></ParameterBindings></View>';
            await V5.view.setViewXml(viewXml);

            /*
            const V3 = await ensureResult.list.views.add("ActivityURLTesting");
            viewXml = '';
            await V3.view.setViewXml(viewXml);
            */
          }
          alert(`Hey there!  Your ${myListName} list is all ready to go!`);

          if (isProject) { //Create some sample items

            let list = sp.web.lists.getByTitle(myListName);
            const entityTypeFullName = await list.getListItemEntityTypeFullName();

            let batch = sp.web.createBatch();
          
            //, Category1: { results: ['Training']}
            list.items.inBatch(batch).add({ Title: "Training", Everyone: true, Story: 'Training', Chapter: 'Yet more training :)', Category1: { results: ['Training']}}, entityTypeFullName).then(b => {
              console.log(b);
            });
            //, Category1: { results: ['Daily']}
            list.items.inBatch(batch).add({ Title: "Email triage", Everyone: true, Story: 'Daily', Chapter: 'Email triage', Category1: { results: ['Daily']}}, entityTypeFullName).then(b => {
              console.log(b);
            });
            //, Category1: { results: ['Daily']}
            list.items.inBatch(batch).add({ Title: "Break", Everyone: true, Story: 'Daily', Chapter: 'Break', Category1: { results: ['Daily']}}, entityTypeFullName).then(b => {
              console.log(b);
            });
            //, Category1: { results: ['Meetings']}
            list.items.inBatch(batch).add({ Title: "Team Meeting", Everyone: true, Story: 'Meetings', Chapter: 'Team Meeting', Category1: { results: ['Meetings']}}, entityTypeFullName).then(b => {
              console.log(b);
            });
            //, Category1: { results: ['Meetings']}
            list.items.inBatch(batch).add({ Title: "Example for Mask and Prefix in ProjectID columns", Everyone: true, Story: 'Webpart', Chapter: 'Example', ProjectID1: 'mask=B\\atch99999', ProjectID2: 'My prefix:...', Category1: { results: ['TestWebpart']}}, entityTypeFullName).then(b => {
              console.log(b);
            });
      
            await batch.execute();
            alert(`Oh... One more thing... We created a few generic Projects under the EVERYONE Category to get you started.  Just refresh the page and click on that heading to see them.`);

          }

          /*
          const resultVx = await ensureResult.list.views.add("");
          viewXml = '';
          await resultVx.view.setViewXml(viewXml);
          */

          // the list is ready to be used
          result = true;

        } else {

        /***
         *         db    db d88888b d8888b. d888888b d88888b db    db 
         *         88    88 88'     88  `8D   `88'   88'     `8b  d8' 
         *         Y8    8P 88ooooo 88oobY'    88    88ooo    `8bd8'  
         *         `8b  d8' 88~~~~~ 88`8b      88    88~~~      88    
         *          `8bd8'  88.     88 `88.   .88.   88         88    
         *            YP    Y88888P 88   YD Y888888P YP         YP    
         *                                                            
         *                                                            
         */

          // the list already exists, double check the fields objectID

          console.log('what about this?');
          try {
            const field2 = await ensureResult.list.fields.getByInternalNameOrTitle("Active").get();
            if (isProject) { const field3 = await ensureResult.list.fields.getByInternalNameOrTitle("SortOrder").get(); }
            if (isProject) { const field4 = await ensureResult.list.fields.getByInternalNameOrTitle("Everyone").get(); }
            const field5 = await ensureResult.list.fields.getByInternalNameOrTitle("Leader").get();
            const field6 = await ensureResult.list.fields.getByInternalNameOrTitle("Team").get();
            const field7 = await ensureResult.list.fields.getByInternalNameOrTitle("Category1").get();
            const field8 = await ensureResult.list.fields.getByInternalNameOrTitle("Category2").get();
            const field20 = await ensureResult.list.fields.getByInternalNameOrTitle("ProjectID1").get();
            const field21 = await ensureResult.list.fields.getByInternalNameOrTitle("ProjectID2").get();

            if (isProject) { 
              const field22 = await ensureResult.list.fields.getByInternalNameOrTitle("TimeTarget").get();

              const field55 = await ensureResult.list.fields.getByInternalNameOrTitle("ActivityType").get();
              const field56 = await ensureResult.list.fields.getByInternalNameOrTitle("Activity").get();
              
              
              /**
               * These are all Task related
               */
              const field90 = await ensureResult.list.fields.getByInternalNameOrTitle("DueDateTMT").get();
              const field91 = await ensureResult.list.fields.getByInternalNameOrTitle("CompletedDateTMT").get();
              const field92 = await ensureResult.list.fields.getByInternalNameOrTitle("CompletedByTMT").get();
  
              const field57 = await ensureResult.list.fields.getByInternalNameOrTitle("StatusTMT").get();
              const field58 = await ensureResult.list.fields.getByInternalNameOrTitle("Due Date").get();

              const field71 = await ensureResult.list.fields.getByInternalNameOrTitle("OptionsTMT").get();
              const field72 = await ensureResult.list.fields.getByInternalNameOrTitle("OptionsTMTCalc").get();
              const field61 = await ensureResult.list.fields.getByInternalNameOrTitle("EffectiveStatus").get();
              const field62 = await ensureResult.list.fields.getByInternalNameOrTitle("IsOpen").get();
              const field63 = await ensureResult.list.fields.getByInternalNameOrTitle("StatusNumber").get();
              const field64 = await ensureResult.list.fields.getByInternalNameOrTitle("StatusText").get();
              const field65 = await ensureResult.list.fields.getByInternalNameOrTitle("Step0Check").get();
              const field66 = await ensureResult.list.fields.getByInternalNameOrTitle("Step1Check").get();
              const field67 = await ensureResult.list.fields.getByInternalNameOrTitle("Step2Check").get();
              const field68 = await ensureResult.list.fields.getByInternalNameOrTitle("Step3Check").get();
              const field69 = await ensureResult.list.fields.getByInternalNameOrTitle("Step4Check").get();
              const field70 = await ensureResult.list.fields.getByInternalNameOrTitle("Step5Check").get();
              
            }
            const field23 = await ensureResult.list.fields.getByInternalNameOrTitle("CCList").get();
            const field24 = await ensureResult.list.fields.getByInternalNameOrTitle("CCEmail").get();

            const field30 = await ensureResult.list.fields.getByInternalNameOrTitle("Story").get();
            const field31 = await ensureResult.list.fields.getByInternalNameOrTitle("Chapter").get();

            const field32 = await ensureResult.list.fields.getByInternalNameOrTitle("zzzTBDInfo1").get();
            const field33 = await ensureResult.list.fields.getByInternalNameOrTitle("zzzTBDInfo2").get();
            

            if (isTime) { //Fields specific for Time

              const field10 = await ensureResult.list.fields.getByInternalNameOrTitle("Activity").get();
              const field11 = await ensureResult.list.fields.getByInternalNameOrTitle("DeltaT").get();
              const field12 = await ensureResult.list.fields.getByInternalNameOrTitle("Comments").get();
              const field13 = await ensureResult.list.fields.getByInternalNameOrTitle("EndTime").get();
              const field14 = await ensureResult.list.fields.getByInternalNameOrTitle("StartTime").get();
              const field15 = await ensureResult.list.fields.getByInternalNameOrTitle("SourceProject").get();
              const field16 = await ensureResult.list.fields.getByInternalNameOrTitle("SourceProjectRef").get();
              const field17 = await ensureResult.list.fields.getByInternalNameOrTitle("User").get();
              const field18 = await ensureResult.list.fields.getByInternalNameOrTitle("Settings").get();
              const field19 = await ensureResult.list.fields.getByInternalNameOrTitle("Location").get();
              const field25 = await ensureResult.list.fields.getByInternalNameOrTitle("EntryType").get();

              const field26 = await ensureResult.list.fields.getByInternalNameOrTitle("Days").get();
              const field27 = await ensureResult.list.fields.getByInternalNameOrTitle("Hours").get();
              const field28 = await ensureResult.list.fields.getByInternalNameOrTitle("Minutes").get();

              const field40 = await ensureResult.list.fields.getByInternalNameOrTitle("OriginalStart").get();
              const field41 = await ensureResult.list.fields.getByInternalNameOrTitle("OriginalEnd").get();
              const field42 = await ensureResult.list.fields.getByInternalNameOrTitle("OriginalHours").get();
              const field43 = await ensureResult.list.fields.getByInternalNameOrTitle("KeyChanges").get();
  
              /**
               * These are for when Project list is run like a task list
              */
              const field80 = await ensureResult.list.fields.getByInternalNameOrTitle("StatusTMT").get();
              const field81 = await ensureResult.list.fields.getByInternalNameOrTitle("StatusNumber").get();
              const field82 = await ensureResult.list.fields.getByInternalNameOrTitle("StatusText").get();

            }

            // if it is all good, then the list is ready to be used
            result = true;
            console.log(`Your ${myListName} list is already set up!`);
            alert(`Your ${myListName} list is already set up!`);
          } catch (e) {
            // if any of the fields does not exist, raise an exception in the console log
            let errMessage = getHelpfullError(e);
            alert(`The ${myListName} list had this error so the webpart may not work correctly unless fixed:  ` + errMessage);
            console.log(`The ${myListName} list had this error:`, errMessage);

          }
        }
      }
    } catch (e) {
      // if we fail to create the list, raise an exception in the console log
      console.log(`Failed to create custom list ${myListName}.`, e, e.error);
    }

    return(result);
  }

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
    let listDesc = 'TrackMyTime list for TrackMyTime Webpart';
    console.log('CreateTTIMTimeList: oldVal', oldVal);

    let listCreated = this.ensureTrackTimeList(listName, listDesc, 'TrackMyTime');
    
    if ( listCreated ) { 
      this.properties.timeTrackListTitle = listName;
      this.properties.timeTrackListConfirmed= true;
    }
     return "Finished";  
  } 

  private CreateTTIMProjectList(oldVal: any): any {

    let listName = this.properties.projectListTitle ? this.properties.projectListTitle : 'Projects';
    let listDesc = 'Projects list for TrackMyTime Webpart';
    console.log('CreateTTIMProjectList: oldVal', oldVal);

    let listCreated = this.ensureTrackTimeList(listName, listDesc, 'Project');
    
    if ( listCreated ) { 
      this.properties.projectListTitle= listName;
      this.properties.projectListConfirmed= true;
      
    }
     return "Finished";  
  } 


  private async UpdateTitles(): Promise<boolean> {

    const list = sp.web.lists.getByTitle("Projects");
    const r = await list.fields();

    let getFields=["Title","Active","Everyone","ProjectID1","ProjectID2","Category1","Category2","Activity","Story","Chapter"];

    let fieldTitles = r.filter(f => f.Hidden !== true && getFields.indexOf(f.StaticName) > -1).map( 
      f => {return [f.StaticName,f.Title,f.Description,f.Required,f.FieldTypeKind];});
    
    //Update properties here:
    this.properties.projectListFieldTitles = JSON.stringify(fieldTitles);

    console.log('list fields: ', r);
    console.log('fieldTitles: ', fieldTitles);
    
    return true;

  } 

/***
 *         d88888b d8b   db d8888b.      db      d888888b .d8888. d888888b .d8888. 
 *         88'     888o  88 88  `8D      88        `88'   88'  YP `~~88~~' 88'  YP 
 *         88ooooo 88V8o 88 88   88      88         88    `8bo.      88    `8bo.   
 *         88~~~~~ 88 V8o88 88   88      88         88      `Y8b.    88      `Y8b. 
 *         88.     88  V888 88  .8D      88booo.   .88.   db   8D    88    db   8D 
 *         Y88888P VP   V8P Y8888D'      Y88888P Y888888P `8888Y'    YP    `8888Y' 
 *                                                                                 
 *                                                                                 
 */







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