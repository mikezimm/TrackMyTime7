define([], function() {
  return {

    "PropertyPaneAbout": "Minimal Webpart Settings",
    "PropertyPaneDescription": "Advanced Settings",
    "BasicGroupName": "Group Name",
    "DescriptionFieldLabel": "Description Field",

    // 0 - Context
    "DefaultProjectListTitle": "Projects", // DO NOT CHANGE THIS IN DIFFERENT LANGUAGES
    "DefaultTrackMyTimeListTitle": "TrackMyTime", // DO NOT CHANGE THIS IN DIFFERENT LANGUAGES

    // 1 - Analytics options - Optional
    "FieldLabel_AnalyticsWeb": "Site where analytics are maintained",
    "FieldLabel_AnalyticsList": "List Title where analytics are maintained",

    "analyticsList": "TilesCycleTesting",
    "analyticsWeb": "https://mcclickster.sharepoint.com/sites/Templates/SiteAudit/",
    "minClickWeb": "",


    // 2 - Source and destination list information
    "FieldLabel_ProjectListTitle": "Project List Title",
    "FieldLabel_ProjectListWeb": "Project List Site URL",

    "FieldLabel_TimeTrackListTitle": "Time Tracking List Title",
    "FieldLabel_TimeTrackListWeb": "Time Tracking Site URL",

    // 3 - General how accurate do you want this to be
    "PropPaneGroupLabel_Accuracy": "General accuracy",
    "FieldLabel_RoundTime": "Incriment to round time to", //Up 5 minutes, Down 5 minutes, No Rounding,
    "FieldLabel_ForceCurrentUser": "Allow Proxy entry", //
    "FieldLabel_ConfirmPrompt": "Confirm all entries", //

    // 4 -Project options
    "PropPaneGroupLabel_ProjectOptions": "Project options",
    "FieldLabel_OnlyActiveProjects": "Only read in active projects",
    "FieldLabel_AllowUserProjects": "Allow User Projects (direct from history)",  // Use to allow getting list of user write-in projects
    "FieldLabel_ProjectMasterPriority": "Master Project Priority", //Use to determine what projects float to top.... your most recent?  last day?
    "FieldLabel_ProjectUserPriority": "User Project Priority", //Use to determine what projects float to top.... your most recent?  last day?


    "FieldLabel_DefaultProjectsOrHistory": "Default projects:  Projects or History?", //Label to ask for default setting: Projects or User History?
    "FieldLabel_SyncProjectPivotsOnToggle": "Keep Projects and History pivots in sync", //always keep pivots in sync when toggling projects/history

    "FieldLabel_Yours": "Yours", //Heading and label for "Your" projects or history
    "FieldLabel_YourTeam": "Your Team", //Heading and label for "Your Team's" projects or history
    "FieldLabel_Others": "Others", //Heading and label for "Your Team's" projects or history
    "ToggleLabel_Projects": "Projects", //Projects or Time History
    "ToggleLabel_History": "History", //Projects or Time History

    // 5 - UI Defaults
    "PropPaneGroupLabel_UIDefaults": "UI Defaults",
    "FieldLabel_DefaultProjectPicker": "Default Project Category", //Recent, Your Projects, All Projects etc...
    "FieldLabel_DefaultTimePicker": "Default Time Entry format", //SinceLast, Slider, Manual???
    "FieldLabel_LocationChoices": "Location choices - separate with ;", //Office, Customer, Traveling, Home
    "FieldLabel_DefaultLocation": "Default Location", //

    // 6 - User Feedback:
    "PropPaneGroupLabel_UserFeedback": "User Feedback",
    "FieldLabel_ShowElapsedTimeSinceLast":  "Show elapsed time since last entry", //Day, Week, Both?
    "FieldLabel_ShowTargetBar":  "Show Target bar", //Day, Week, Both?
    "FieldLabel_ShowTargetToggle":  "Show Targets", //Day, Week, Both?
    "FieldLabel_DailyTarget":  "Target hours per Day to track", //Day, Week, Both? 
    "FieldLabel_WeeklyTarget":  "Target hours per Week to track", //Day, Week, Both?

    // 7 - Slider Options
    "PropPaneGroupLabel_SliderOptions": "Start-End Slider Options",
    "FieldLabel_ShowTimeSlider": "Show Time Slider",
    "FieldLabel_TimeSliderInc": "Incriment of time slider (minutes)",
    "FieldLabel_TimeSliderMax": "Max of time slider (hours)",

    
    // 9 - Other web part options
    "FieldLabel_WebPartScenario": "Should come from webpart", //Choice used to create mutiple versions of the webpart.
    "FieldLabel_ToggleTextOff": "Off",
    "FieldLabel_ToggleTextOn": "On",

    "FieldLabel_PivSize": "Pivot size",
    "FieldLabel_PivFormat": "Pivot format",    
    "FieldLabel_PivOptions": "Pivot options",

    //Testing
    "T_help_ThisMessage": "T_help_ThisMessage",
    "T_help2_ThisMessage": "T_help2_ThisMessage",
    "T_help3_ThisMessage": "T_help3_ThisMessage",
    "T_tool_ThisMessage": "T_tool_ThisMessage",
  }
});