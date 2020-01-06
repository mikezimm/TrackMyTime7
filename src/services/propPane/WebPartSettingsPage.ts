import {
    IPropertyPanePage,
    PropertyPaneLabel,
    IPropertyPaneLabelProps,
    PropertyPaneHorizontalRule,
    PropertyPaneTextField, IPropertyPaneTextFieldProps,
    PropertyPaneLink, IPropertyPaneLinkProps,
    PropertyPaneDropdown, IPropertyPaneDropdownProps,
    IPropertyPaneDropdownOption,
    PropertyPaneSlider,
    PropertyPaneToggle
  } from '@microsoft/sp-webpart-base';
  import { PropertyFieldMultiSelect } from '@pnp/spfx-property-controls/lib/PropertyFieldMultiSelect';
  
  import * as strings from 'TrackMyTime7WebPartStrings';
  import { pivotOptionsGroup, trackTimeOptionsGroup } from './index';
  
  export class WebPartSettingsPage {

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
  FieldLabel_LocationChoices: string;  // Office, Customer, Traveling, Home
  FieldLabel_DefaultLocation: string; // 

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


    public getPropertyPanePage(webPartProps): IPropertyPanePage {
      return <IPropertyPanePage>        { // <page2>
        header: {
          displayGroupsAsAccordion: true,
          description: strings.PropertyPaneDescription,
        },
        groups: [

          /** 3 - General how accurate do you want this to be
            roundTime: string; //Up 5 minutes, Down 5 minutes, No Rounding;
            forceCurrentUser: boolean; //false allows you to put in data for someone else
            confirmPrompt: boolean;  //Make user press confirm
          */
          { groupName: strings.PropPaneGroupLabel_Accuracy,
          groupFields: [
            
            PropertyPaneSlider('stressMultiplier', {
              label: 'TESTING ONLY - Compound Entry count',
              min: 1,
              max: 10,
              value: 1,
              step: 1,
            }),

            PropertyPaneDropdown('roundTime', <IPropertyPaneDropdownProps>{
              label: strings.FieldLabel_RoundTime,
              options: trackTimeOptionsGroup.roundTimeChoices,
            }),

            PropertyPaneToggle('forceCurrentUser', {
              label: strings.FieldLabel_ForceCurrentUser,
              offText: strings.FieldLabel_ToggleTextOff,
              onText: strings.FieldLabel_ToggleTextOn,
            }),

            PropertyPaneToggle('confirmPrompt', {
              label: strings.FieldLabel_ConfirmPrompt,
              offText: strings.FieldLabel_ToggleTextOff,
              onText: strings.FieldLabel_ToggleTextOn
            }),

          ]}, // this group
       
          /** 4 -Project options
            allowUserProjects: boolean; //Will build list of ProjectsUser based on existing data from TrackMyTime list
            projectMasterPriority: string; //Use to determine what projects float to top.... your most recent?  last day?
            projectUserPriority: string; //Use to determine what projects float to top.... your most recent?  last day?
          */

          { groupName: strings.PropPaneGroupLabel_ProjectOptions,
            isCollapsed: webPartProps.setSize === "This does nothing yet" ? true : false ,

            groupFields: [
              PropertyPaneToggle('onlyActiveProjects', {
                label: strings.FieldLabel_OnlyActiveProjects,
                offText: strings.FieldLabel_ToggleTextOff,
                onText: strings.FieldLabel_ToggleTextOn
              }),

              PropertyPaneToggle('allowUserProjects', {
                label: strings.FieldLabel_AllowUserProjects,
                offText: strings.FieldLabel_ToggleTextOff,
                onText: strings.FieldLabel_ToggleTextOn
              }),

              //Projects = 0 History = 1
              PropertyPaneToggle('projectType', {
                label: strings.FieldLabel_DefaultProjectsOrHistory,
                offText: strings.ToggleLabel_Projects,
                onText: strings.ToggleLabel_History
              }),

              PropertyPaneToggle('syncProjectPivotsOnToggle', {
                label: strings.FieldLabel_SyncProjectPivotsOnToggle,
                offText: strings.FieldLabel_ToggleTextOff,
                onText: strings.FieldLabel_ToggleTextOn
              }),

              PropertyPaneDropdown('projectMasterPriority', <IPropertyPaneDropdownProps>{
                label: strings.FieldLabel_ProjectMasterPriority,
                options: trackTimeOptionsGroup.projectMasterPriorityChoices,
              }),

              PropertyPaneDropdown('projectUserPriority', <IPropertyPaneDropdownProps>{
                label: strings.FieldLabel_ProjectUserPriority,
                options: trackTimeOptionsGroup.projectUserPriorityChoices,
              }),   
              
              

            ]}, // this group

          /** 5 - UI Defaults
            defaultProjectPicker: string; //Recent, Your Projects, All Projects etc...
            defaultTimePicker: string; //SinceLast, Slider, Manual???
          */

          { groupName: strings.PropPaneGroupLabel_UIDefaults,
           isCollapsed: webPartProps.setSize === "This does nothing yet" ? true : false ,
          groupFields: [

            PropertyPaneDropdown('defaultProjectPicker', <IPropertyPaneDropdownProps>{
              label: strings.FieldLabel_DefaultProjectPicker,
              options: trackTimeOptionsGroup.defaultProjectPickerChoices,
            }),

            PropertyPaneDropdown('defaultTimePicker', <IPropertyPaneDropdownProps>{
              label: strings.FieldLabel_DefaultTimePicker,
              options: trackTimeOptionsGroup.defaultTimePickerChoices,
            }),              

            PropertyPaneTextField('locationChoices', {
              label: strings.FieldLabel_LocationChoices
            }),
            
            PropertyPaneTextField('defaultLocation', {
              label: strings.FieldLabel_DefaultLocation
            }),

          ]}, // this group


          /** 6 - User Feedback:
            showElapsedTimeSinceLast: boolean;  // Idea is that it can be like a clock showing how long it's been since your last entry.

            // Target will be used to provide user feedback on how much/well they are tracking time
            showTargetBar: boolean; //Eventually have some kind of way to tell user that x% of hours have been entered for day/week
            showTargetToggle: boolean; //Maybe give user option to toggle between day/week
            dailyTarget: number; // Target hours per day to have tracked in a day - FieldLabel_DailyTarget
            weeklyTarget:  number;  // Target hours per day to have tracked in a week - FieldLabel_WeeklyTarget
          */

         { groupName: strings.PropPaneGroupLabel_UserFeedback,
          isCollapsed: webPartProps.setSize === "This does nothing yet" ? true : false ,
         groupFields: [

            PropertyPaneToggle('showElapsedTimeSinceLast', {
              label: strings.FieldLabel_ShowElapsedTimeSinceLast,
              offText: strings.FieldLabel_ToggleTextOff,
              onText: strings.FieldLabel_ToggleTextOn
            }),
                        
            PropertyPaneToggle('showTargetToggle', {
              label: strings.FieldLabel_ShowTargetToggle,
              offText: strings.FieldLabel_ToggleTextOff,
              onText: strings.FieldLabel_ToggleTextOn
            }),

            PropertyPaneToggle('showTargetBar', {
              disabled: webPartProps.showTargetToggle === true ? false : true,
              label: strings.FieldLabel_ShowTargetBar,
              offText: strings.FieldLabel_ToggleTextOff,
              onText: strings.FieldLabel_ToggleTextOn
            }),

            PropertyPaneSlider('dailyTarget', {
              disabled: webPartProps.showTargetToggle === true ? false : true,
              label: strings.FieldLabel_DailyTarget,
              min: 0,
              max: 10,
              step: 2,
            }),

            PropertyPaneSlider('weeklyTarget', {
              disabled: webPartProps.showTargetToggle === true ? false : true,
              label: strings.FieldLabel_WeeklyTarget,
              min: 0,
              max: 48,
              step: 8,
            }),       

         ]}, // this group


          /** 7 - Slider Options
            showTimeSlider: boolean; //true allows you to define end time and slider for how long you spent
            timeSliderInc: number; //incriment of time slider
            timeSliderMax: number; //max of time slider
          */

         { groupName: strings.PropPaneGroupLabel_SliderOptions,
          isCollapsed: webPartProps.setSize === "This does nothing yet" ? true : false ,
         groupFields: [

          PropertyPaneToggle('showTimeSlider', {
            label: strings.FieldLabel_ShowTimeSlider,
            offText: strings.FieldLabel_ToggleTextOff,
            onText: strings.FieldLabel_ToggleTextOn
          }),

          PropertyPaneDropdown('timeSliderInc', <IPropertyPaneDropdownProps>{
            disabled: webPartProps.showTimeSlider === true ? false : true,
            label: strings.FieldLabel_TimeSliderInc,
            options: trackTimeOptionsGroup.timeSliderIncChoices,
          }),    
/*
          PropertyPaneSlider('timeSliderInc', {
            disabled: webPartProps.showTimeSlider === true ? false : true,
            label: strings.FieldLabel_TimeSliderInc,
            min: 5,
            max: 60,
            step: 5,
          }),
*/
          PropertyPaneSlider('timeSliderMax', {
            disabled: webPartProps.showTimeSlider === true ? false : true,
            label: strings.FieldLabel_TimeSliderMax,
            min: 1,
            max: 10,
            value: 5,
            step: 1,
          }),
            
         ]}, // this group

      ]}; // Groups 
    } // getPropertyPanePage()

  } // WebPartSettingsPage
  
  export let webPartSettingsPage = new WebPartSettingsPage();