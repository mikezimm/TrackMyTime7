import { BaseClientSideWebPart,  } from "@microsoft/sp-webpart-base";
import { IPropertyPanePage, PropertyPaneLabel, IPropertyPaneLabelProps, 
  PropertyPaneHorizontalRule, PropertyPaneTextField, IPropertyPaneTextFieldProps, 
  PropertyPaneLink, IPropertyPaneLinkProps, PropertyPaneDropdown, 
  IPropertyPaneDropdownProps, IPropertyPaneDropdownOption, PropertyPaneToggle, 
  IPropertyPaneConfiguration, PropertyPaneButton, PropertyPaneButtonType,
} from "@microsoft/sp-property-pane";

import * as strings from 'TrackMyTime7WebPartStrings';
import { pivotOptionsGroup} from './index';

import * as links from '../../webparts/trackMyTime7/components/HelpInfo/AllLinks';   //              { links.gitRepoTrackMyTime.issues }

import { ITrackMyTimeWebPartProps } from '../../webparts/trackMyTime7/TrackMyTime7WebPart';

/*

  // 1 - Analytics options
  useListAnalytics: boolean;
  analyticsWeb?: string;
  analyticsList?: string;

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

  // 5 - UI Defaults
  defaultProjectPicker: string; //Recent, Your Projects, All Projects etc...
  defaultTimePicker: string; //SinceLast, Slider, Manual???

  // 6 - User Feedback:
  showElapsedTimeSinceLast: boolean;  // Idea is that it can be like a clock showing how long it's been since your last entry.

  // Target will be used to provide user feedback on how much/well they are tracking time
  showTargetBar: boolean; //Eventually have some kind of way to tell user that x% of hours have been entered for day/week
  showTargetToggle: boolean; //Maybe give user option to toggle between day/week
  targetType:  string; //Day, Week, Both?
  targetValue: number; //Hours for typical day/week

  // 7 - Slider Options
  showTimeSlider: boolean; //true allows you to define end time and slider for how long you spent
  timeSliderInc: number; //incriment of time slider
  timeSliderMax: number; //max of time slider

  // 9 - Other web part options
  webPartScenario: string; //Choice used to create mutiple versions of the webpart.

  pivotSize: string;
  pivotFormat: string;
  pivotOptions: string;

    */

export class IntroPage {
  public getPropertyPanePage(webPartProps: ITrackMyTimeWebPartProps, _onClickCreateTime, _onClickCreateProject, _onClickUpdateTitles ): IPropertyPanePage {


    return <IPropertyPanePage>
    { // <page1>
      header: {
        description: strings.PropertyPaneAbout
      },
      displayGroupsAsAccordion: true,
      groups: [
        { groupName: 'Web Part Info',
          isCollapsed: true ,
          groupFields: [
            PropertyPaneLabel('About Text', {
              text: 'This webpart gets helps track your time using SharePoint :).'
            }),

            PropertyPaneLink('About Link' , {
              text: 'Github Repo:  ' + links.gitRepoTrackMyTime.desc ,
              href: links.gitRepoTrackMyTime.href,
              target: links.gitRepoTrackMyTime.target,
            }),
          ]
        },


                
        // 2 - Source and destination list information
        {  groupName: 'Create-Verify Lists',
            isCollapsed: true ,
            groupFields: [

            PropertyPaneLabel('Notice', {
              text: 'NOTE:  It may take 5-20 seconds to create/verify list.  Do NOT close browser or interupt while it is creating lists.'
            }),

            PropertyPaneLabel('Notice', {
              text: ''
            }),

            PropertyPaneButton('CreateTTIMProjectList',  
            {  
             text: "Create/Verify Projects List",
             buttonType: PropertyPaneButtonType.Primary,
             onClick: _onClickCreateProject
            }),

            PropertyPaneLabel('Notice', {
              text: ''
            }),

            PropertyPaneButton('CreateTTIMTimeList',
            {  
             text: "Create/Verify TrackMyTime List",  
             buttonType: PropertyPaneButtonType.Primary,
             onClick: _onClickCreateTime
            }),
            
            PropertyPaneLabel('Project List', {
              text: webPartProps.projectListConfirmed ? 'Checking for ' + webPartProps.projectListTitle : 'Verify or Create your PROJECT list!'
            }),

            PropertyPaneLabel('Time List', {
              text: webPartProps.timeTrackListConfirmed ? 'Checking for ' + webPartProps.timeTrackListTitle : 'Verify or Create your TIME list!'
            }),

            
            PropertyPaneButton('UpdateTitles',
            {  
             text: "Update Column Titles",  
             description: "Copy list title to WebPart",
             buttonType: PropertyPaneButtonType.Compound,
             onClick: _onClickUpdateTitles
            }),

            PropertyPaneTextField('projectListFieldTitles', {
              label: 'Advanced Field Settings',
              description: 'For changing webpart field titles',
              multiline: true,
            }),
/*
            PropertyPaneLabel('FieldInfo', {
              text: webPartProps.projectListFieldTitles
            }),
*/

          ]}, // this group




        // 2 - Source and destination list information    
        { groupName: 'Your list info',
        isCollapsed: true ,
        groupFields: [
          PropertyPaneTextField('projectListWeb', {
              label: strings.FieldLabel_ProjectListWeb
          }),
          PropertyPaneTextField('projectListTitle', {
            label: strings.FieldLabel_ProjectListTitle
          }),
          PropertyPaneTextField('timeTrackListWeb', {
            label: strings.FieldLabel_TimeTrackListWeb
          }),
          PropertyPaneTextField('timeTrackListTitle', {
            label: strings.FieldLabel_TimeTrackListTitle
          }),
        ]}, // this group
/* */
        
        // 9 - Other web part options
        { groupName: 'Pivot Styles (headings)',
          isCollapsed: true ,
          groupFields: [
            PropertyPaneDropdown('pivotSize', <IPropertyPaneDropdownProps>{
              label: strings.FieldLabel_PivSize,
              options: pivotOptionsGroup.pivSizeChoices,
            }),
            PropertyPaneDropdown('pivotFormat', <IPropertyPaneDropdownProps>{
              label: strings.FieldLabel_PivFormat,
              options: pivotOptionsGroup.pivFormatChoices,
            }),
            PropertyPaneDropdown('pivotOptions', <IPropertyPaneDropdownProps>{
              label: strings.FieldLabel_PivOptions,
              options: pivotOptionsGroup.pivOptionsChoices,
              disabled: true,
            }),
          ]}, // this group

        ]}; // Groups
  } // getPropertyPanePage()
}

export let introPage = new IntroPage();