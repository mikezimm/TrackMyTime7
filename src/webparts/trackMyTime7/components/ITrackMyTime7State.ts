
import { ITrackMyTime7Props } from './ITrackMyTime7Props';

import { IFormFields, IProjectFormFields } from './fields/fieldDefinitions';
import { ITheTime } from '../../../services/dateServices';

import { ProjectMode } from './Project/ProjectEditPage';

import { ISmartLinkDef } from './ActivityURL/ActivityURLMasks';
import { ISelectedStory, ISelectedUser, } from './Charts/chartsPage';
import { string } from 'prop-types';

import { TMTDialogMode, FieldChange } from './TrackMyTime7';

import { IPickedWebBasic, IPickedList, IMyProgress,
  IPivot, IMyPivots, ILink, IUser, IMyFonts, IMyIcons, 
  IRefinerRules, IRefinerStatType, RefinerStatTypes, IRefinerStat, IRefinerStats, RefineRuleValues, IItemRefiners, IRefiners, IRefinerLayer, 
  buildKeyText, refinerRuleItems,
  ICustViewDef, 
  QuickCommandsTMT,
  IQuickCommands, IQuickButton, 
  ILabelColor, ICSSChartTypes, CSSChartTypes, ISeriesSort, ICSSChartSeries, 
  IChartSeries, ICharNote, 

} from '../../../services/IReUsableInterfaces';

export interface IEntries {
  entries: ITimeEntry[];
}

export interface IEntryInfo {

  all: ITimeEntry[]; //All Entries
  user: ITimeEntry[]; //Current user's entries
  your: ITimeEntry[]; //Current user's entries
  team: ITimeEntry[]; //Current user's entries
  everyone: ITimeEntry[]; //Current user's entries
  other: ITimeEntry[]; //Current user's entries

  session? :ITimeEntry[]; //Session (page in browser) user's entries
  today? : ITimeEntry[]; //Today's user's entries
  week? : ITimeEntry[]; //This week's user's entries

  userKeys: string[]; //Current user's entry keys
  userPriority: ITimeEntry[]; //Current user's priority entries
  current: ITimeEntry[]; //All 'Current' entries
  lastFiltered: ITimeEntry[]; //Last filtered for search
  lastEntry: ITimeEntry[];
  newFiltered: ITimeEntry[]; //new filtered for search
  dateRange?: number[];
  firstItem?: ITheTime;
  
}

/**
 * ISaveEntry is basic entry needed to CREATE a new list item
 * Eventually upon save, this will turn into a full ITimeEntry
 */
export interface ISaveEntry {
    //Values that would come from Project item

    titleProject: string;
    thisTimeObj?: ITheTime;
    comments?: ISmartText;
    category1?: string[];
    category2?: string[];
    leader?: IUser;  //Likely single person column
    team?: IUser[];  //Likely multi person column
    leaderId?: number;
    teamIds?: number[];

    //For new chart page:
    story?: string;
    chapter?: string;
  
    //This block for use in the history list component
    projectID1?: ISmartText;  //Example Project # - look for strings starting with * and ?
    projectID2?: ISmartText;  //Example Cost Center # - look for strings starting with * and ?
  
    //Values that relate to project list item
    sourceProject?: ILink; //Link back to the source project list item.
    sourceProjectRef?: string;
    activity?: ILink; //Link to the activity you worked on
    ccList?: ILink; //Link to CC List to copy item
    ccEmail?: string; //Email to CC List to copy item 
  
    //Values specific to Time Entry
  
    userId?: number;
    userTitle?: string;
    startTime?: any; //Time stamp
    endTime?: any; // Time stamp

    //Saves what entry option was used... Since Last, Slider, Manual
    entryType?: string;

    timeEntryTBD1?: string;
    timeEntryTBD2?: string;
    timeEntryTBD3?: string;  

    //Other settings and information
    location?: string; // Location
    settings?: string;
  
}

/**
 * ITimeEntry is basic entry as if read from the list (history)
 */
export interface ITimeEntry extends ISaveEntry {


    //Values that would come from Project item
    id?: any; //Item ID on list
    editLink? : ILink; //Link to view/edit item link

    //This block for use in the history list component
    userInitials?: string;
    listCategory?: string; 
    listTimeSpan?: string;
    listProjects?: string;
    listTracking?: string; 
    listComments?: string;
    active?: boolean;  //Used to indicate inactive projects

  
    filterFlags?: string[]; // what flags does this match?  yourRecent, allRecent etc...
    timeGroup?: string; //Used for grouping the list of entries

    coreTime?: string;
    hoursEarly?: number;
    hoursLate?: number;
    hoursWeekEnd?: number;
    hoursHoliday?: number;
    hoursNormal?: number;
    hoursUnknown?: number;
    searchString?: string;  //LowerCase search string for charts
    searchStringPC?: string;  //Proper Case search string for charts

    //Values that relate to project list item

    //Values specific to Time Entry
    user: IUser;  //Single person column
    duration?: string; //Number  -- May not be needed based on current testing with start and end dates.
    age?: number; //Days since End Time
    keyChange: string;
    keyChanges?: string[];

    options?: string;
    //Saves what entry option was used... Since Last, Slider, Manual
  
    deltaT?: any; //Could be used to indicate how many hours entry was made (like now, or 10 2 days in the past)

    //Other settings and information

    created?: Date;
    modified?: Date;
    createdBy?: String;
    modifiedBy?: String;
    createdByID?: String;
    modifiedByID?: String;

    wasModified?: boolean;
    modifiedByUser?: boolean;
    createdByUser?: boolean;


}

export interface ISmartText {
  value: string;
  projListValue: string;
  required: boolean;
  hidden: boolean;
  default: string;
  defaultIsPrefix: boolean;
  prefix?: string;
  title?: string; //Required for building text fields
  name?: string; //Required for building text fields
  mask?: string; //Required for building text fields 
}

export interface IProjectTarget {
  projListValue: string;
  value: string; //value from field - ; separated options which could be parsed
  daily?: number; //Maybe have function see if something like daily=4 means 4 hours per day?
  weekly?: number; //Maybe have function see if something like weekly=8 means 8 hours per week?
  total?: number; //Maybe have function see if something like total=40 means 40 hours total?
  dailyStatus?: boolean;
  weeklyStatus?: boolean;
  totalStatus?: boolean;
}


export interface IProjectOptions{

  // To be used for if Project Activity URL is used. Syntax:  title=Title Type Activity;
  // title special words:  Replace..., IgnoreTitle, Derive
  // Special shortcuts:  title=Replace...TypeActivity - replace Title only if it's value is ...
  // Special shortcuts:  title=Replace...TypeActivity - replace Title only if it's value is ... 
  // Special shortcuts:  title=NoTitleType-Activity - replaces Project Title with just the Type-Activity values
  // Special shortcuts:  title=DeriveType-Activity - uses just Title column to derive Type and Activity fields (not recommended or programmed yet)
  // projActivityRule: string;  //title=NoTitleType-Activity

  showLink: boolean;
  title?: string;
  type?: string;
  activity?: string;
  href?: string;
  firstActivity?: string;

  optionString?: string;
  optionArray?: string[];
  bgColor?: string;
  font?: IMyFonts;
  icon?: IMyIcons;
  projectEditOptions?: string;

}

export interface IProjectAction {
  verb?: string;
  details?: string;
  commandLabel?: string;
  icon?: string;
  status?: string;
  subText?: string;
  prompt?: string;
  setDate?: boolean; //FieldChange;
  setUser?: boolean; //FieldChange;
  dialog?: TMTDialogMode;
}

export interface IProjectHistory extends IProjectAction {
  userName?: string;
  timeStamp?: string;
}

export interface IProject {
  //Values that would come from Project item
  projectType?: string; //master or user
  id?: any; //Item ID on list
  editLink? : ILink; //Link to view/edit item link
  titleProject?: string;
  comments?: ISmartText; // syntax similar to ProjID?
  active?: boolean;  //Used to indicate inactive projects
  everyone?: boolean; //Used to designate this option should be available to everyone.
  sortOrder?: number; //Used to prioritize in choices.... ones with number go first in order, followed by empty
  key?: string;
  category1?: string[];
  category2?: string[];
  leader?: IUser;  //Likely single person column
  team?: IUser[];  //Likely multi person column
  leaderId?: number;
  teamIds?: number[];
  story?: string;
  chapter?: string;

  filterFlags?: string[]; // what flags does this match?  yourRecent, allRecent etc...

  projectID1?: ISmartText;  //Example Project # - look for strings starting with * and ?
  projectID2?: ISmartText;  //Example Cost Center # - look for strings starting with * and ?

  timeTarget?: IProjectTarget;
  projOptions?: IProjectOptions;
  defProjEditOptions?: string;

  history?: string;

  //This might be computed at the time page loads
  lastEntry?: any;  //Should be a time entry

  //Values that relate to project list item
  sourceProject?: ILink; //Link back to the source project list item.
  sourceProjectRef?: string; //Link back to the source project list item.
  ccList?: ILink; //Link to CC List to copy item
  ccEmail?: string; //Email to CC List to copy item 

  //Task related fields:
  status?: string;
  dueDate?: Date;
  completedDate?: Date;
  completedBy?: IUser;
  completedById?: number;

  created?: Date;
  modified?: Date;
  createdBy?: Number;
  modifiedBy?: Number;

}

export interface IProjects {
  projects: IProject[];
}

export interface IProjectInfo {

  all: IProject[];
  master: IProject[]; //Projects coming from the Projects list
  masterKeys: string[];
  user: IProject[]; //Projects coming from TrackMyTime list
  userKeys: string[];
  masterPriority: IProject[]; //Projects visible based on settings
  userPriority: IProject[]; //Projects visible based on settings
  current: IProject[]; //Makes up the choices
  lastFiltered: IProject[];
  lastProject: IProject[];
  newFiltered: IProject[];
  
}
/*  2020-12-14:  Moved to IReUsable but will need to adjust object labels
export interface IMyPivots {
  projects: IPivot[];
  history: IPivot[];
}
*/

export interface IUserSummary { 
  title: string; 
  Id: string; 
  count: number; 
  hours: number;
  normal: number;
  percent: number; 
  stories: string[];
  lastEntry: number;
  lastEntryText: string;
  daysAgo: number;
 }

export interface IChartData {
  filter?: string;
  contemp?: IChartSeries;  
  location?: IChartSeries;
  keyChanges?: IChartSeries;
  categories?: IChartSeries[];
  today?: IChartSeries[];
  thisWeek?: IChartSeries[];
  thisMonth?: IChartSeries[];
  thisYear?: IChartSeries[];  
  thisTest?: IChartSeries[];  
  allYears?: IChartSeries;
  allMonths?: IChartSeries;
  allWeeks?: IChartSeries;
  allDays?: IChartSeries;
  entryType?: IChartSeries;
  coreTimeS?: ICoreTimes;  //This is the flexible array of core time per day

  filterItems?: string[];
  
  stories?: IStories;
  index: number;
  storyIndex: number;

  users?: string[];
  usersSummary?: IUserSummary[];
  dateRange?: string[];

  warnNotesAll: ICharNote[];
  errorNotesAll: ICharNote[];

}


export interface ICoreTimes {
  cores?: ICoreTime[];
  coreTime?: ICoreTime;
  titles?: string[];
}

export interface ICoreTime extends IChartSeries {

}

export interface IStories {
  stories?: IStory[];
  chapters?: IStory[];
  titles?: string[];
}

export interface IStory extends IChartSeries {

}

export interface IPropsActivityURL {
  // To be used for if Project Activity URL is used. Syntax:  title=Title Type Activity;
  // title special words:  Replace..., IgnoreTitle, Derive
  // Special shortcuts:  title=Replace...TypeActivity - replace Title only if it's value is ...
  // Special shortcuts:  title=Replace...TypeActivity - replace Title only if it's value is ... 
  // Special shortcuts:  title=NoTitleType-Activity - replaces Project Title with just the Type-Activity values
  // Special shortcuts:  title=DeriveType-Activity - uses just Title column to derive Type and Activity fields (not recommended or programmed yet)
  // projActivityRule: string;  //title=NoTitleType-Activity

  //projActivityRule
  rule: string;
  rules: string[];
  titleMap: string;  //String with replace variables like Title, Type and Activity
  titleRule: string;

}

export interface IProjectColumns {

  statusChoices?: string[];
  activityTMTChoices?: string[];
  category1Choices?: string[];
  category2Choices?: string[];  

  statusDefault?: string;
  activityTMTDefault?: string;
  category1Default?: string;
  category2Default?: string;  

  
  optionsTMTCalc?: string;
  activtyURLCalc?: string;

}

export interface ITrackMyTime7State {

  // 0 - Context
  //currentUser?: IUser;  //Current user information
  WebpartHeight?:  number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
  WebpartWidth?:   number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/

      
  pivots?: IMyPivots;

  projects?: IProjectInfo;
  entries?: IEntryInfo;
  fields?: IFormFields; //List of field defininitions for making form fields
  projectFields?: IProjectFormFields;
  
  // 1 - Analytics options
  endTime?: ITheTime;

  loadData?: {
    user: any;
    projects: any[];
    entries: any[];
  };
  // 2 - Source and destination list information
  projectListURL?: string; //Get from list item
  timeTrackerListURL?: string; //Get from list item

  projectListWeb?: string; //Get from list item
  timeTrackerListWeb?: string; //Get from list item

  projectListName: string;  // Static Name of list (for URL) - used for links and determined by first returned item
  timeTrackListName: string;  // Static Name of list (for URL) - used for links and determined by first returned item

  // 3 - General how accurate do you want this to be

  // 4 -Project options
  pivtTitles?:string[];
  filteredCategory?: string;
  pivotDefSelKey?: string;
  onlyActiveProjects?: boolean; //Only read in active projects.

  userCounts?: any;  // user based (from trackTimeList) projects that are assigned to current user.
  projectCounts?: any;  // project based (from trackTimeList) projects that are assigned to current user.
  allCounts?: any;

  projectType?:boolean; //Projects = 0 History = 1
  syncProjectPivotsOnToggle; //always keep pivots in sync when toggling projects/history

  projActivityRule?: IPropsActivityURL;

  projColumns: IProjectColumns;

  // 5 - UI Defaults
  currentProjectPicker: string; //User selection of defaultProjectPicker:  Recent, Your Projects, All Projects etc...
  currentTimePicker: string; //User selection of :defaultTimePicker  SinceLast, Slider, Manual???
  locationChoice: string;  //semi-colon separated choices
  smartLinkRules: ISmartLinkDef[];

  // 6 - User Feedback:
  currentUser?: IUser;  //Current user information
  showElapsedTimeSinceLast?: boolean;  // Idea is that it can be like a clock showing how long it's been since your last entry.
  lastEntry?: ITimeEntry;  //Should be a time entry
  lastEndTime?: ITheTime; //Should be latest timestamp of the current user... used to create start time for next entry.
  blinkOnProject?: number; //Tells text fields to blink when project is clicked on and values reset
  blinkOnActivity?: number; //Tells text fields to blink when project is clicked on and values reset
  coreStart?: number; //Used for calculating hours in core times
  coreEnd?: number; //Used for calculating hours in core times
  coreWeekend?: boolean; //Used for calculating hours in core times 

  elapsedTime?: any;  //Elapsed Time since last entry

  allEntries?: ITimeEntry[]; //List of all entries
  filteredEntries?: ITimeEntry[]; //List of recent entries

  chartData?: IChartData;
  showCharts?: boolean;
  selectedStory?: ISelectedStory;
  selectedUser?: ISelectedUser;
  userFilter?: 'all' | 'user'; 
  chartStringFilter?: string;
  

  formEntry: ISaveEntry;
  // 7 - Slider Options
  timeSliderValue: number; //incriment of time slider

  //These maybe other choices end user can use to find projects?
  projectMasterPriorityChoice?: string;  //Yours, Team, Others - Choice is the current one selected
  projectUserPriorityChoice?: string;  //Yours, Team, Others - Choice is the current one selected

  // 9 - Other web part options

  showProjectScreen?: ProjectMode;

  selectedProjectIndex?: number;  //Index of selected project
  selectedProjectIndexArr?: number[];  //Index of selected project
  selectedProject: IProject;      //2020-05-22:  Copying into separate object to pass to Project Edit screen.
  lastSelectedProjectIndex?: number;  //Index of selected project
  lastTrackedClick?: string;  //Added to trap the bug where you change pivots after you click and unclick a project.
  clickHistory?: string[];
  loadStatus?: string;
  allLoaded?: boolean;

  loadOrder?: string; //This just tells us what order the rest calls came back

  projectsLoadStatus?: string;
  projectsLoadError?: string;
  projectsListError: boolean;
  projectsItemsError: boolean;

  timeTrackerLoadStatus?: string;
  timeTrackerLoadError?: string;
  timeTrackerListError: boolean;
  timeTrackerItemsError: boolean;

  userLoadStatus?: string;

  errTitle?: string;
  showTips?: boolean;
  loadError?: string;
  debugColors?: boolean;

  listError?: boolean;
  itemsError?: boolean;

  searchType?: string;
  searchShow?: boolean;
  searchCount?: number;
  searchWhere?: string;

  dialogMode?: TMTDialogMode;

}
