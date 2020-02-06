import * as React from 'react';
import styles from './TrackMyTime7.module.scss';
import { ITrackMyTime7Props } from './ITrackMyTime7Props';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp';

//Updated Jan 5, 2020 per https://pnp.github.io/pnpjs/getting-started/
import { Web } from "@pnp/sp/presets/all";

import { Pivot, PivotItem, PivotLinkSize, PivotLinkFormat } from 'office-ui-fabric-react/lib/Pivot';
import { Label, ILabelStyles } from 'office-ui-fabric-react/lib/Label';
import { IStyleSet } from 'office-ui-fabric-react/lib/Styling';

import { IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

import { DefaultButton, autobind, getLanguage, ZIndexes } from 'office-ui-fabric-react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';

import * as strings from 'TrackMyTime7WebPartStrings';
import Utils from './utils';

import { saveTheTime, saveAnalytics } from '../../../services/createAnalytics';
import { getAge, getDayTimeToMinutes, getBestTimeDelta, getLocalMonths, getTimeSpan, getGreeting,
          getNicks, makeTheTimeObject, getTimeDelta, monthStr3, weekday3} from '../../../services/dateServices';

import {IProject, ILink, ISmartText, ITimeEntry, IProjectTarget, IUser, IProjects, IProjectInfo, 
        IEntryInfo, IEntries, IMyPivots, IPivot, ITrackMyTime7State, ISaveEntry,
        IChartData, IChartSeries } from './ITrackMyTime7State';

import { pivotOptionsGroup, } from '../../../services/propPane';
import { getHelpfullError, } from '../../../services/ErrorHandler';


import { buildFormFields } from './fields/fieldDefinitions';
import { creatCharts } from './Charts/charts';


import ButtonCompound from './createButtons/ICreateButtons';
import { IButtonProps,ISingleButtonProps,IButtonState } from "./createButtons/ICreateButtons";
import { CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';

import * as listBuilders from './ListView/ListView';
import * as formBuilders from './fields/textFieldBuilder';
import * as choiceBuilders from './fields/choiceFieldBuilder';
import * as sliderBuilders from './fields/sliderFieldBuilder';
import * as smartLinks from './ActivityURL/ActivityURLMasks';
import * as dateBuilders from './fields/dateFieldBuilder';
  
const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
  root: { marginTop: 10 }
};

export default class TrackMyTime7 extends React.Component<ITrackMyTime7Props, ITrackMyTime7State> {

/***
 *          .o88b.  .d88b.  d8b   db .d8888. d888888b 
 *         d8P  Y8 .8P  Y8. 888o  88 88'  YP `~~88~~' 
 *         8P      88    88 88V8o 88 `8bo.      88    
 *         8b      88    88 88 V8o88   `Y8b.    88    
 *         Y8b  d8 `8b  d8' 88  V888 db   8D    88    
 *          `Y88P'  `Y88P'  VP   V8P `8888Y'    YP    
 *                                                    
 *                                                    
 */

  private createEntryInfo() {

    let entryInfo = {} as IEntryInfo;
    entryInfo.all = []; //All Entries
    entryInfo.user = []; //Current user's entries
    entryInfo.session = []; //Current user's entries
    entryInfo.today = []; //Current user's entries
    entryInfo.week = []; //Current user's entries
    entryInfo.userKeys = []; //Current user's entry keys
    entryInfo.userPriority = []; //Current user's priority entries
    entryInfo.current = []; //All 'Current' entries
    entryInfo.lastFiltered = []; //Last filtered for search
    entryInfo.lastEntry = []; 
    entryInfo.newFiltered = []; //New filtered for search
    
    return entryInfo;

  }

  private createLink(){
    let link : ILink = {
      Description: '',
      Url: '',
    };

    return link;

  }
  private createSmartText(title, name) {
    let smart : ISmartText = {
      value: '',
      required: false,
      default: '',
      defaultIsPrefix: false,
      prefix: '',
      title: title, //Required for building text fields
      name: name, //Required for building text fields
      mask: '',  //Required for building text fields
    };
    return smart;
  }

  private createUser() {
    let user : IUser = {
      title: "",
      initials: "",  //Single person column
      email: "",  //Single person column
      id: null,
      Id: null,
      ID: null,
      isSiteAdmin:null,
      LoginName: "",
    };
    return user;

  }

  private createPivotData(){
    // Using https://stackoverflow.com/questions/3103962/converting-html-string-into-dom-elements
    let pivots : IMyPivots = {
      projects: 
        [
          { headerText: "Yours",
            filter: "your",
            itemKey: "your",
            data: "Projects where you are the Leader",
          },
          { headerText: "Your Team",
            filter: "team",
            itemKey: "team",
            data: "Projects where you are in the Team",
          },
          { headerText: "Everyone",
            filter: "everyone",
            itemKey: "everyone",
            data: "Projects where Everyone is marked Yes - overrides other categories",
          },
          { headerText: "Others",
            filter: "otherPeople",
            itemKey: "otherPeople",
            data: "Projects where you are not the Leader, nor in the team, and not marked Everyone",
          },
        ]
      ,
      history: 
        [
          { headerText: "Yours",
            filter: "your",
            itemKey: "your",
            data: "History where you are the User",
          },
          { headerText: "Your Team",
            filter: "team",
            itemKey: "team",
            data: "History where you are part of the Team, but not the User",
          },
          { headerText: "Everyone",
            filter: "everyone",
            itemKey: "everyone",
            data: "Currently not in use",
          },
          { headerText: "Others",
            filter: "otherPeople",
            itemKey: "otherPeople",
            data: "History where you are not the Leader, nor in the team, and not marked Everyone",
          },
        ]
      ,
    };

    return pivots;

  }

  private createFormEntry() {

    //https://stackoverflow.com/a/37802516/4210807

    let form : ISaveEntry = {

    titleProject:'Tell me what you are doing here :)',
    comments: this.createSmartText('Comments','comments'),
    
    category1:[],
    category2:[],
    leader:this.createUser(),
    team:[],
    leaderId:null,
    teamIds:[],
    projectID1:this.createSmartText('Project ID1','projectID1'),
    projectID2:this.createSmartText('Project ID2','projectID2'),
    sourceProject:this.createLink(),
    sourceProjectRef: '',
    activity:this.createLink(),
    ccList:this.createLink(),
    ccEmail:'',
    userId: null,
    startTime:'',
    endTime:'',
    entryType:this.props.defaultTimePicker,
    timeEntryTBD1:'',
    timeEntryTBD2:'',
    timeEntryTBD3:'',
    location:this.props.defaultLocation,
    settings:'',

    };

    return form;

  }

  private errTitles() {
    let options = [
      'Oh Snap! We have a slight problem!',
      'Houston, We have a problem!',
      'Typo Alert!',
      'Uhhmm... I have an issue!',
      'Not sure what to say except...',
      'We call these possible Typos...',
      'Typos cost 1 Gazzilion lost electrons every year...',
      'My AutoCorrect never fails... but...',
      'May I call you ' + this.props.pageContext.user.displayName + '?',
      'But but but... I know humans don\'t make mistakes',
      'Please dial ++ (888)-TyposRUs'
    ];

    return options[Math.floor(Math.random() * options.length)];

  }

  private createprojectInfo() {

    let projectInfo = {} as IProjectInfo;

    projectInfo.master = [];
    projectInfo.user = [];
    projectInfo.masterPriority = [];
    projectInfo.userPriority = [];
    projectInfo.current = [];
    projectInfo.lastFiltered = [];
    projectInfo.lastProject = [];
    projectInfo.all = [];
    projectInfo.newFiltered = []; //New filtered for search

    return projectInfo;

  }

  private cleanURL(originalURL: String) {

    let newURL = originalURL.toLowerCase();
    if ( newURL.indexOf('/sitepages/') > 0 ) { return newURL.substring(0, newURL.indexOf('/sitepages/') + 1) ; }
    if ( newURL.indexOf('/lists/') > 0 ) { return newURL.substring(0, newURL.indexOf('/lists/') + 1) ; }
    if ( newURL.indexOf('/siteassets/') > 0 ) { return newURL.substring(0, newURL.indexOf('/siteassets/') + 1) ; }
    if ( newURL.indexOf('/_layouts/') > 0 ) { return newURL.substring(0, newURL.indexOf('/_layouts/') + 1) ; }
    if ( newURL.indexOf('/documents/') > 0 ) { return newURL.substring(0, newURL.indexOf('/documents/') + 1) ; }
    if ( newURL.indexOf('/shared documents/') > 0 ) { return newURL.substring(0, newURL.indexOf('/shared documents/') + 1) ; }
    if ( newURL.indexOf('/shared%20documents/') > 0 ) { return newURL.substring(0, newURL.indexOf('/shared%20documents/') + 1) ; }
    if ( newURL.indexOf('/forms/') > 0 ) { 
      newURL = newURL.substring(0, newURL.indexOf('/forms/'));
      newURL = newURL.substring(0, newURL.indexOf('/') + 1);
      return newURL;
    }
    if ( newURL.indexOf('/pages/') > 0 ) { return newURL.substring(0, newURL.indexOf('/pages/') + 1) ; }
    if ( newURL.substring(newURL.length) !== '/' ) { return newURL + '/'; }

    return newURL;

  }

/***
 *          .o88b.  .d88b.  d8b   db .d8888. d888888b d8888b. db    db  .o88b. d888888b  .d88b.  d8888b. 
 *         d8P  Y8 .8P  Y8. 888o  88 88'  YP `~~88~~' 88  `8D 88    88 d8P  Y8 `~~88~~' .8P  Y8. 88  `8D 
 *         8P      88    88 88V8o 88 `8bo.      88    88oobY' 88    88 8P         88    88    88 88oobY' 
 *         8b      88    88 88 V8o88   `Y8b.    88    88`8b   88    88 8b         88    88    88 88`8b   
 *         Y8b  d8 `8b  d8' 88  V888 db   8D    88    88 `88. 88b  d88 Y8b  d8    88    `8b  d8' 88 `88. 
 *          `Y88P'  `Y88P'  VP   V8P `8888Y'    YP    88   YD ~Y8888P'  `Y88P'    YP     `Y88P'  88   YD 
 *                                                                                                       
 *                                                                                                       
 */

  public constructor(props:ITrackMyTime7Props){
    super(props);
    let projWeb = this.cleanURL(this.props.projectListWeb ? this.props.projectListWeb : props.pageContext.web.absoluteUrl);
    let timeWeb = this.cleanURL(this.props.timeTrackListWeb ? this.props.timeTrackListWeb : props.pageContext.web.absoluteUrl);
    this.state = { 

      // 1 - Analytics options

      // 2 - Source and destination list information
      projectListURL: projWeb + 'lists/' + this.props.projectListTitle, //Get from list item
      timeTrackerListURL: timeWeb + 'lists/' + this.props.timeTrackListTitle, //Get from list item

      projectListWeb: projWeb, //Get from list item
      timeTrackerListWeb: timeWeb, //Get from list item

      projectListName: this.props.projectListTitle,  // Static Name of list (for URL) - used for links and determined by first returned item
      timeTrackListName: this.props.timeTrackListTitle,  // Static Name of list (for URL) - used for links and determined by first returned item

      // 3 - General how accurate do you want this to be

      // 4 -Project options
      pivots: this.createPivotData(),
      projects: this.createprojectInfo(),
      entries: this.createEntryInfo(),
      
      loadData: {
        user: null,
        projects: [],
        entries: [],
      },

      chartData: null,

      fields: buildFormFields(this.props, this.state),

      pivtTitles:['Yours', 'Your Team','Everyone','Others'],
      filteredCategory: this.props.defaultProjectPicker,
      pivotDefSelKey:"",
      onlyActiveProjects: this.props.onlyActiveProjects,
      projectType: this.props.projectType,
      syncProjectPivotsOnToggle: this.props.syncProjectPivotsOnToggle, //always keep pivots in sync when toggling projects/history

      // 5 - UI Defaults
      currentProjectPicker: '', //User selection of defaultProjectPicker:  Recent, Your Projects, All Projects etc...
      currentTimePicker: this.props.defaultTimePicker, //User selection of :defaultTimePicker  SinceLast, Slider, Manual???
      locationChoice: '',  //semi-colon separated choices
      blinkOnProject: 0, //Tells text fields to blink when project is clicked on and values reset
      blinkOnActivity: 0, //Tells text fields to blink when project is clicked on and values reset
      smartLinkRules: smartLinks.buildSmartLinkRules(this.props),

      // 6 - User Feedback:
      showElapsedTimeSinceLast: true,  // Idea is that it can be like a clock showing how long it's been since your last entry.
      elapsedTime: 0,   //Elapsed Time since last entry

      allEntries: [], // List of all entries
      filteredEntries: [],  //List of recent entries
      lastEndTime: null,
      formEntry: null,

      // 7 - Slider Options
      timeSliderValue: 0,  //incriment of time slider
      projectMasterPriorityChoice: this.props.projectMasterPriority, //Use to determine what projects float to top.... your most recent?  last day?
      projectUserPriorityChoice: this.props.projectUserPriority,  //Use to determine what projects float to top.... your most recent?  last day?

      // 9 - Other web part options

      loadOrder: "",
      projectsLoadStatus:"Loading",
      projectsLoadError: "",
      projectsListError: false,
      projectsItemsError: false,

      timeTrackerLoadStatus:"Loading",
      timeTrackerLoadError: "",
      timeTrackerListError: false,
      timeTrackerItemsError: false,

      userLoadStatus:"Loading",
      errTitle: this.errTitles(),
      showTips: "none",
      loadError: "",
      allLoaded: false,

      listError: false,
      itemsError: false,

      searchType: '',
      searchShow: true,
      searchCount: 0,
      searchWhere: '',

    };

    // because our event handler needs access to the component, bind 
    //  the component to the function so it can get access to the
    //  components properties (this.props)... otherwise "this" is undefined
    this.onLinkClick = this.onLinkClick.bind(this);
    this.toggleType = this.toggleType.bind(this);
    this.toggleTips = this.toggleTips.bind(this);
    this.minimizeTiles = this.minimizeTiles.bind(this);
    this.searchMe = this.searchMe.bind(this);
    this.showAll = this.showAll.bind(this);
    this.toggleLayout = this.toggleLayout.bind(this);
    this.onChangePivotClick = this.onChangePivotClick.bind(this);


    this.trackMyTime = this.trackMyTime.bind(this);
    this.clearMyInput = this.clearMyInput.bind(this);

    this._updateComments = this._updateComments.bind(this);

    
  }


  public componentDidMount() {
    this._getListItems();
    
  }


  /***
 *         d8888b. d888888b d8888b.      db    db d8888b. d8888b.  .d8b.  d888888b d88888b 
 *         88  `8D   `88'   88  `8D      88    88 88  `8D 88  `8D d8' `8b `~~88~~' 88'     
 *         88   88    88    88   88      88    88 88oodD' 88   88 88ooo88    88    88ooooo 
 *         88   88    88    88   88      88    88 88~~~   88   88 88~~~88    88    88~~~~~ 
 *         88  .8D   .88.   88  .8D      88b  d88 88      88  .8D 88   88    88    88.     
 *         Y8888D' Y888888P Y8888D'      ~Y8888P' 88      Y8888D' YP   YP    YP    Y88888P 
 *                                                                                         
 *                                                                                         
 */

  public componentDidUpdate(prevProps){

    let rebuildTiles = false;
    if (this.props.defaultProjectPicker !== prevProps.defaultProjectPicker) {  rebuildTiles = true ; }

    if (rebuildTiles === true) {
      this._updateStateOnPropsChange({});
    }
  }

/***
 *         d8888b. d888888b db    db  .d88b.  d888888b .d8888. 
 *         88  `8D   `88'   88    88 .8P  Y8. `~~88~~' 88'  YP 
 *         88oodD'    88    Y8    8P 88    88    88    `8bo.   
 *         88~~~      88    `8b  d8' 88    88    88      `Y8b. 
 *         88        .88.    `8bd8'  `8b  d8'    88    db   8D 
 *         88      Y888888P    YP     `Y88P'     YP    `8888Y' 
 *                                                             
 *                                                             
 */

  public createProjectChoices(thisState){
    let projectHeading: JSX.Element = <div>
        <h2> { this.state.projectType === false ? 'Pick from the Project List' : 'Or... Your recent history'}</h2>
      </div>;
    let elemnts = [];

    if (thisState.projects.all[0]){
      elemnts = 
        thisState.projects.newFiltered.map(project => (
        <div>
          { project.projectType } <span>: </span>{ project.titleProject } <span> - </span>{ project.category1 } <span> - </span>{ project.category2 }
        </div>
        ));
    } 

    return ( 
      <Stack horizontal={false} wrap={false}>{/* Stack for Projects */}
        {projectHeading}
        {elemnts} 
      </Stack>
      );
  }



  public createPivotObject(setPivot, display){
    let pivotPart = 
    <Pivot 
      style={{ flexGrow: 1, paddingLeft: '10px', display: display }}
      linkSize= { pivotOptionsGroup.getPivSize(this.props.pivotSize) }
      linkFormat= { pivotOptionsGroup.getPivFormat(this.props.pivotFormat) }
      onLinkClick= { this.onLinkClick.bind(this) }  //{this.specialClick.bind(this)}
      selectedKey={ setPivot }
      headersOnly={true}>
        {this.createPivots(this.state,this.props)}
    </Pivot>;
    return pivotPart;
  }

  /***
 *         d8888b. db    db d888888b db      d8888b. d88888b d8888b. .d8888. 
 *         88  `8D 88    88   `88'   88      88  `8D 88'     88  `8D 88'  YP 
 *         88oooY' 88    88    88    88      88   88 88ooooo 88oobY' `8bo.   
 *         88~~~b. 88    88    88    88      88   88 88~~~~~ 88`8b     `Y8b. 
 *         88   8D 88b  d88   .88.   88booo. 88  .8D 88.     88 `88. db   8D 
 *         Y8888P' ~Y8888P' Y888888P Y88888P Y8888D' Y88888P 88   YD `8888Y' 
 *                                                                           
 *                                                                           
 */

  public createHistoryItems(thisState){
    let elemnts = [];
    if (thisState.filteredEntries[0]){
      elemnts = thisState.filteredEntries.map(project => (
        <div>
          { project.titleProject } { project.startTime } { project.endTime }
        </div>
        ));
    }
    return ( elemnts );
  }

  public createProjectTypeToggle(thisState){

    let togglePart = <Toggle label="" 
      onText={strings.ToggleLabel_History } 
      offText={strings.ToggleLabel_Projects} 
      onChange={this.toggleType.bind(this)} 
      checked={this.state.projectType}
      styles={{ root: { width: 120, paddingTop: 13, } }}
      />;
    return togglePart;

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

  public render(): React.ReactElement<ITrackMyTime7Props> {

    const isSinceEntry = this.state.currentTimePicker === 'sinceLast' ? true : false;   
    const isSliderEntry = this.state.currentTimePicker === 'slider' ? true : false;
    const isManualEntry = this.state.currentTimePicker === 'manual' ? true : false;

    let setPivot = !this.state.projectType ? this.state.projectMasterPriorityChoice :this.state.projectUserPriorityChoice ;
    //console.log('render setPivot:', setPivot);
    console.log('Public render props:', this.props);
    console.log('Public render state:', this.state);

    /**
     * this section was added to keep pivots in sync when syncProjectPivotsOnToggle === true
     */
    let display1 = this.state.projectType === true ? "block" :"none";
    let display2 = this.state.projectType === true ? "none" :"block";
    let choice1 = this.state.projectMasterPriorityChoice;
    let choice2 = this.state.projectUserPriorityChoice;

    if (this.state.syncProjectPivotsOnToggle){
      display1 = "block";
      display2 = "none";
      choice1 = this.state.projectMasterPriorityChoice;
      choice2 = this.state.projectMasterPriorityChoice;
    }

    const stackButtonTokensBody: IStackTokens = { childrenGap: 40 };
    const stackButtonTokens: IStackTokens = { childrenGap: 40 };
    const stackFormRowTokens: IStackTokens = { childrenGap: 20 };
    const stackFormRowsTokens: IStackTokens = { childrenGap: 10 };
    const stackManualDateTokens: IStackTokens = { childrenGap: 20 };

    let hoursSinceLastTime = 0;
    if ( this.state.timeTrackerLoadStatus === "Complete" ) {
      hoursSinceLastTime = getTimeDelta( this.state.lastEndTime.theTime, new Date() , 'hours');
    }

    let isSaveDisabled = false;
    if ( this.state.currentTimePicker === 'slider' ) {
      if ( this.state.timeSliderValue == 0 ) { isSaveDisabled = true; }

      // Also need to add if the slider would put the start time before the last end time.
    } else if ( this.state.currentTimePicker === 'sinceLast' ) {
      if ( hoursSinceLastTime > this.props.timeSliderMax / 60 ) { isSaveDisabled = true; }

    } // else if  -- Need to add logic when Manual and days not filled out

    let entryOptions = choiceBuilders.creatEntryTypeChoices(this.props,this.state, this._updateEntryType.bind(this));
    let theTime;
    if (this.state.timeTrackerLoadStatus === "Complete") {
      if (this.state.currentTimePicker === 'sinceLast') {

        theTime = <div className={( isSaveDisabled ? styles.timeError : styles.timeInPast )}>
          From: { getDayTimeToMinutes(this.state.lastEndTime.theTime) } until NOW<br/>
          {( isSaveDisabled ? <div>Is to far in the past.</div> : "" )}
          {( isSaveDisabled ? <div>Use Slider or Manual Mode to save time.</div> : "" )}
          </div>; 

      } else if  (this.state.currentTimePicker === 'slider' ) 
        if (this.state.timeSliderValue > 0 ) {
           //The START time IS NOW and the end time is in the future (based on slider)
           theTime = <div className={ styles.timeInFuture }>From NOW until: { getDayTimeToMinutes(this.state.formEntry.endTime) }</div>;
        } else if ( this.state.timeSliderValue < 0 )  {
          //The END time IS NOW and the end time is in the past (based on slider)
          theTime = <div className={ styles.timeInPast }>From { getDayTimeToMinutes(this.state.formEntry.startTime) } until NOW</div>;
        } else { // Value can not be zero or the save button should not be visible.
          theTime = <div className={ styles.timeError }>Adjust the slider before saving</div>;
        } else if ( this.state.currentTimePicker === 'start' ) {
          theTime = <div>Creates zero minutes entry to start your day</div>;
        }
    
      

    } else { theTime = ""; }

    const projectsWebError = this.props.projectListWeb.indexOf(this.props.tenant) > -1 ? '' :
    <div>
        <p>Your Project List is not in this Tenanat...</p>
        <ul>
          <li>{ this.props.projectListWeb } &lt;&lt;== Project Web</li>
          <li>{ this.props.tenant } &lt;&lt;== Should have this in it</li>
        </ul>

    </div>;

    const timeWebError = this.props.timeTrackListWeb.indexOf(this.props.tenant) > -1 ? '' :
    <div>
        <p>Your TimeTrack List is not in this Tenanat...</p>
        <ul>
          <li>{ this.props.timeTrackListWeb } &lt;&lt;== TrackTime List Web</li>
          <li>{ this.props.tenant } &lt;&lt;== Should have this in it</li>
        </ul>
    </div>;

    const projectsListError = this.state.projects.master.length !== 0 ? '' :
      <div>
        <ul>
          <li>Is this the right Projects List URL? <b>{ this.props.projectListWeb }</b></li>
          <li>Is this the right Projects List Title? <b>{ this.props.projectListTitle }</b></li>
          <li>
            <a href={this.state.projectListURL} target='_blank'>
              <span>Check your Project list here</span>
            </a>
          </li>
        </ul>
      </div>;

    const timeListError = this.state.projects.user.length !== 0 ? '' :
    <div>
      <ul>
        <li>Is this the right TrackYourTime List URL? <b>{ this.props.timeTrackListWeb }</b></li>
        <li>Is this the right TrackYourTime List Title? <b>{ this.props.timeTrackListTitle }</b></li>
        <li>
          <a href={this.state.timeTrackerListURL} target='_blank'>
            <span>Check your TrackTime list here</span>
          </a>
        </li>
      </ul>
    </div>;

    const listError = this.state.listError === false ? '' :
      <div style={{ paddingTop: '0px' }}>
        <h2>{ this.state.errTitle }</h2>
        <h3>Here are the error(s) we received</h3>
        <p><mark>{ this.state.loadError }</mark></p>
        <h3>Here are some suggestions</h3>
          {projectsWebError} 
          {projectsListError}
          {timeWebError}
          {timeListError}

      </div>;
    

    const noProjectsFound = this.state.projectType !== false && this.state.projectsLoadStatus === 'Complete' ? '' :
    <div style={{ paddingTop: '0px' }}>
      <h2>No Projects found in "{this.state.filteredCategory}" :(</h2>
      <h3>Get started by checking for other projects</h3>
      <ul>
      <li>Click on the other Project Categories like</li>
        <ol>
          <li>{this.state.pivots.projects[0].headerText}</li>
          <li>{this.state.pivots.projects[1].headerText}</li>
          <li>{this.state.pivots.projects[2].headerText}</li>
          <li>{this.state.pivots.projects[3].headerText}</li>
        </ol>
      </ul>
      <h3>Can't find any? Create a new one!</h3>
      <ol>
        <li>
          <a href={this.state.projectListURL} >
            <span>Go to your list: { this.props.projectListTitle }</span>
          </a>
        </li>
        <li>Create some new projects</li>
        <li>Make yourself the Leader for easy access</li>
        <li>Mark generic ones 'Everyone' so they are easy to find</li>
      </ol>
    </div>;


    const buttons: ISingleButtonProps[] =
      [/*
        {
        disabled: isSaveDisabled,  
        checked: true, 
        primary: true,
        label: "Start Time",
        secondary: "Create start ime",
        buttonOnClick: this.startMyTime.bind(this),
      },*/
{
        disabled: false,  
        checked: true, 
        primary: false,
        label: "Clear item",
        secondary: "Press to clear form",
        buttonOnClick: this.clearMyInput.bind(this),
      },      {
        disabled: isSaveDisabled,  
        checked: true, 
        primary: true,
        label: "Save item",
        secondary: "Press to Create entry",
        buttonOnClick: this.trackMyTime.bind(this),
      },

      ];

    let saveButtons = 
    <div style={{ paddingTop: '20px' }}>
      <ButtonCompound
        buttons={buttons} horizontal={true}
      />
    </div>;
     
    let timeSlider = isSliderEntry ? sliderBuilders.createSlider(this.props,this.state, this._updateTimeSlider.bind(this)) : '';
    let comments = formBuilders.createThisField(this.props,this.state, this.state.fields.Comments, isSaveDisabled, this._updateComments.bind(this));
    let projectTitle = formBuilders.createThisField(this.props,this.state,this.state.fields.Title, isSaveDisabled,  this._updateProjectTitle.bind(this));
    let projectID1 = formBuilders.createThisField(this.props,this.state, this.state.fields.ProjectID1, isSaveDisabled,  this._updateProjectID1.bind(this));
    let projectID2 = formBuilders.createThisField(this.props,this.state, this.state.fields.ProjectID2, isSaveDisabled,  this._updateProjectID2.bind(this));

    let activity = formBuilders.createThisField(this.props,this.state, this.state.fields.Activity, isSaveDisabled,  this._updateActivity.bind(this));

    let startDate = isManualEntry ? dateBuilders.creatDateTimeControled(this.props,this.state,this.state.fields.Start, false, this._updateStart.bind(this)) : '';
    let endDate = isManualEntry ? dateBuilders.creatDateTimeControled(this.props,this.state,this.state.fields.End, false, this._updateEnd.bind(this)) : '';

    //let entryType = formBuilders.createThisField(this.props,this.state, this.state.fields., this._updateEntryType.bind(this));
    
    let listProjects = null;
    if (this.state.listError) { listProjects = listError; }
    else if ( this.state.projectsLoadStatus === 'Complete' && this.state.projects.newFiltered.length===0 ) {
      listProjects =  noProjectsFound;
    } else {
      listProjects = listBuilders.projectBuilder(this.props,this.state,this.state.projects.newFiltered, this._getSelectedProject.bind(this));
    }

    let listBuild = listBuilders.listViewBuilder(this.props,this.state,this.state.entries.newFiltered);

    let userName = this.state.currentUser
      ? getNicks(this.state.currentUser) + " ( Id: " + this.state.currentUser.Id + " ) entry count: " + this.state.allEntries.length
      : "";

    let chartX = this.state.allLoaded && this.state.chartData != null ? creatCharts(this.props,this.state, this.state.chartData.thisMonth[0]) : '';

/***
 *                   d8888b. d88888b d888888b db    db d8888b. d8b   db 
 *                   88  `8D 88'     `~~88~~' 88    88 88  `8D 888o  88 
 *                   88oobY' 88ooooo    88    88    88 88oobY' 88V8o 88 
 *                   88`8b   88~~~~~    88    88    88 88`8b   88 V8o88 
 *                   88 `88. 88.        88    88b  d88 88 `88. 88  V888 
 *                   88   YD Y88888P    YP    ~Y8888P' 88   YD VP   V8P 
 *                                                                      
 *                                                                      
 */


    return (
      <div className={ styles.trackMyTime7 }>
        <div className={ styles.container }>
        <div className={styles.floatLeft}>

            { this.createPivotObject(choice2, display2)  }
            { this.createPivotObject(choice1, display1)  }

            { /*this.createPivotObject(setPivot, "block") */ }
            <div><span style={{fontSize: 20, paddingRight: 30,}}>{ getGreeting(this.state.currentUser)}</span></div>
            { this.createProjectTypeToggle(this.state) }
           
        </div>

          <div>

            <Stack padding={20} horizontal={true} horizontalAlign={"space-between"} tokens={stackButtonTokensBody}> {/* Stack for Projects and body */}
              { /* this.createProjectChoices(this.state) */ }
              <Stack horizontal={false} horizontalAlign={"start"} tokens={stackFormRowsTokens}>{/* Stack for Pivot Help and Projects */}
                { this.getPivotHelpText(this.state, this.props)}
                { listProjects }
              </Stack>  {/* Stack for Pivot Help and Projects */}

              <Stack horizontal={false} horizontalAlign={"end"} tokens={stackFormRowsTokens}>{/* Stack for Buttons and Fields */}
                { entryOptions }
                { (timeSlider) }
                <Stack horizontal={true} wrap={true} horizontalAlign={"end"} tokens={stackManualDateTokens}>{/* Stack for Buttons and Fields */}
                { startDate }
                { endDate }
                </Stack>  {/* Stack for Buttons and Fields */}
                { theTime }
                { projectTitle }
                { activity }
                { comments }
                { /* entryType */ }
                <Stack horizontal={true} tokens={stackFormRowTokens}>{ projectID1 }{ projectID2 }</Stack>

                { saveButtons }
                { chartX }
              </Stack>  {/* Stack for Buttons and Fields */}

            </Stack> {/* Stack for Projects and body */}
          </div>

          <div></div><div><br/><br/></div>
          <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
            <div><h2>Recent TrackYourTime History { userName }</h2></div>
            {(listBuild)}
            { /* this.createHistoryItems(this.state) */ }
          </div>


        </div>
      </div>
    );
  }


  /***
 *          d888b  d88888b d888888b      d8888b. d8888b.  .d88b.     d88b d88888b  .o88b. d888888b .d8888. 
 *         88' Y8b 88'     `~~88~~'      88  `8D 88  `8D .8P  Y8.    `8P' 88'     d8P  Y8 `~~88~~' 88'  YP 
 *         88      88ooooo    88         88oodD' 88oobY' 88    88     88  88ooooo 8P         88    `8bo.   
 *         88  ooo 88~~~~~    88         88~~~   88`8b   88    88     88  88~~~~~ 8b         88      `Y8b. 
 *         88. ~8~ 88.        88         88      88 `88. `8b  d8' db. 88  88.     Y8b  d8    88    db   8D 
 *          Y888P  Y88888P    YP         88      88   YD  `Y88P'  Y8888P  Y88888P  `Y88P'    YP    `8888Y' 
 *                                                                                                         
 *                                                                                                         
 */

  private _getProjectIndexFromArray(val,prop,array){

    for (let index = 0; index < array.length; index++) {
      if (array[index][prop] === val) {
        //console.log('Found index: ', index);
        return index;
      }
    }
  }

  private _getSelectedProject(items: any[]){

    if (this.state.userLoadStatus !== 'Complete') { return; }
    if (this.state.timeTrackerLoadStatus !== 'Complete') { return; }
    if (this.state.userLoadStatus !== 'Complete') { return; }
    if (event) { event.preventDefault(); }
    if (items.length === 0 ) { return; }

    console.log('Selected items:', items);
    
    let item : IProject;

    for (let p of this.state.projects.newFiltered ) {
      if (p.id === items[0].id) {
        item = p;
      }
    }

    let selectedProjectIndex = this._getProjectIndexFromArray(item.id,'id',this.state.projects.newFiltered);
    if (selectedProjectIndex === this.state.selectedProjectIndex) { return ;}

    let formEntry = this.state.formEntry;
    formEntry.sourceProjectRef = [this.state.projectListURL, this.state.projectListName, item.id,].join(' || ');
    formEntry.sourceProject = {
      Description: '( ' + item.id + ' ) ' + item.titleProject ,
      Url: this.state.projectListURL + '/DispForm.aspx?ID=' + item.id ,
    };
    formEntry.titleProject = item.titleProject;
    formEntry.projectID1  = item.projectID1;
    formEntry.projectID2  = item.projectID2;
    formEntry.category1  = item.category1;
    formEntry.category2  = item.category2;
    formEntry.leaderId  = item.leaderId;
    formEntry.leader  = item.leader;
    formEntry.team  = item.team;
    formEntry.teamIds  = item.teamIds;
    formEntry.ccEmail  = item.ccEmail;
    formEntry.ccList  = item.ccList;

    this.setState({ formEntry:formEntry, 
      blinkOnProject: this.state.blinkOnProject === 1 ? 2 : 1,
      selectedProjectIndex : selectedProjectIndex,
      lastSelectedProjectIndex: this.state.selectedProjectIndex,
     });  

  }

/***
 *         db    db d8888b.      .d8888. db      d888888b d8888b. d88888b d8888b. 
 *         88    88 88  `8D      88'  YP 88        `88'   88  `8D 88'     88  `8D 
 *         88    88 88oodD'      `8bo.   88         88    88   88 88ooooo 88oobY' 
 *         88    88 88~~~          `Y8b. 88         88    88   88 88~~~~~ 88`8b   
 *         88b  d88 88           db   8D 88booo.   .88.   88  .8D 88.     88 `88. 
 *         ~Y8888P' 88           `8888Y' Y88888P Y888888P Y8888D' Y88888P 88   YD 
 *                                                                                
 *                                                                                
 */
  
  private _updateTimeSlider(newValue: number){
    let formEntry = this.state.formEntry;

    let now = new Date();
    let then = new Date();
    then.setMinutes(then.getMinutes() + newValue);

    if (newValue < 0) {

      formEntry.startTime = then.toLocaleString();     
      formEntry.endTime = now.toLocaleString();

    } else if (newValue > 0 ) {
      formEntry.startTime = now.toLocaleString();
      formEntry.endTime = then.toLocaleString();

    }

    this.setState({
      timeSliderValue: newValue,
      formEntry: formEntry,
      blinkOnProject: 0,
    });
  }

/***
 *         db    db d8888b.       .d8b.   .o88b. d888888b d888888b db    db d888888b d888888b db    db 
 *         88    88 88  `8D      d8' `8b d8P  Y8 `~~88~~'   `88'   88    88   `88'   `~~88~~' `8b  d8' 
 *         88    88 88oodD'      88ooo88 8P         88       88    Y8    8P    88       88     `8bd8'  
 *         88    88 88~~~        88~~~88 8b         88       88    `8b  d8'    88       88       88    
 *         88b  d88 88           88   88 Y8b  d8    88      .88.    `8bd8'    .88.      88       88    
 *         ~Y8888P' 88           YP   YP  `Y88P'    YP    Y888888P    YP    Y888888P    YP       YP    
 *                                                                                                     
 *                                                                                                     
 */
  
  private _updateActivity(newValue: string){

    if (this.state.timeTrackerLoadStatus !== 'Complete' || 
      this.state.userLoadStatus !== 'Complete'  || 
      this.state.projectsLoadStatus !== 'Complete' ) {
        return;
      }

    let formEntry = this.state.formEntry;
    let result = smartLinks.convertSmartLink(newValue, this.state.smartLinkRules);

    if ( result ) {
      formEntry.comments.value = result.commentText ? result.commentText : null;
      formEntry.activity.Description = result.activityDesc ? result.activityDesc : null;
      formEntry.activity.Url = newValue ? newValue : null ;
      formEntry.category1 = [ result.category1 ] ? [ result.category1 ] : null;
      formEntry.category2 = [ result.category2 ] ? [ result.category2 ] : null;
      formEntry.projectID1.value = result.projectID1 ? result.projectID1 : null;
      formEntry.projectID2.value = result.projectID2 ? result.projectID2 : null;
      console.log('updated formEntry: ', formEntry);
    } else {
      console.log('Did not update anthing based on activity.');
    }


    this.setState({ formEntry:formEntry, blinkOnProject: 0,});
  }

/***
 *         db    db d8888b.      .88b  d88.  .d8b.  d8b   db db    db  .d8b.  db      
 *         88    88 88  `8D      88'YbdP`88 d8' `8b 888o  88 88    88 d8' `8b 88      
 *         88    88 88oodD'      88  88  88 88ooo88 88V8o 88 88    88 88ooo88 88      
 *         88    88 88~~~        88  88  88 88~~~88 88 V8o88 88    88 88~~~88 88      
 *         88b  d88 88           88  88  88 88   88 88  V888 88b  d88 88   88 88booo. 
 *         ~Y8888P' 88           YP  YP  YP YP   YP VP   V8P ~Y8888P' YP   YP Y88888P 
 *                                                                                    
 *                                                                                    
 */

  private _updateStart(newValue){
    console.log('_updateStart:', typeof newValue, newValue);
    let formEntry = this.state.formEntry;
    formEntry.startTime = newValue.toLocaleString();
    console.log('_updateStart:', formEntry.startTime);   
    this.setState({ formEntry:formEntry, blinkOnProject: 0,});
  }

  private _updateEnd(newValue){
    console.log('_updateEnd:', typeof newValue, newValue);
    let formEntry = this.state.formEntry;
    formEntry.endTime = newValue.toLocaleString();
    console.log('_updateStart:', formEntry.endTime);   
    this.setState({ formEntry:formEntry, blinkOnProject: 0,});
  }

  /***
 *         db    db d8888b.      d888888b d88888b db    db d888888b 
 *         88    88 88  `8D      `~~88~~' 88'     `8b  d8' `~~88~~' 
 *         88    88 88oodD'         88    88ooooo  `8bd8'     88    
 *         88    88 88~~~           88    88~~~~~  .dPYb.     88    
 *         88b  d88 88              88    88.     .8P  Y8.    88    
 *         ~Y8888P' 88              YP    Y88888P YP    YP    YP    
 *                                                                  
 *                                                                  
 */

  private _updateComments(newValue: string){
    let formEntry = this.state.formEntry;
    formEntry.comments.value = newValue;
    this.setState({ formEntry:formEntry, blinkOnProject: 0,});
  }

  private _updateProjectTitle(newValue: string){
    let formEntry = this.state.formEntry;
    formEntry.titleProject = newValue;
    this.setState({ formEntry:formEntry, blinkOnProject: 0, });
  }

/***
 *         db    db d8888b.      d8888b. d8888b.  .d88b.     d88b d88888b  .o88b. d888888b 
 *         88    88 88  `8D      88  `8D 88  `8D .8P  Y8.    `8P' 88'     d8P  Y8 `~~88~~' 
 *         88    88 88oodD'      88oodD' 88oobY' 88    88     88  88ooooo 8P         88    
 *         88    88 88~~~        88~~~   88`8b   88    88     88  88~~~~~ 8b         88    
 *         88b  d88 88           88      88 `88. `8b  d8' db. 88  88.     Y8b  d8    88    
 *         ~Y8888P' 88           88      88   YD  `Y88P'  Y8888P  Y88888P  `Y88P'    YP    
 *                                                                                         
 *                                                                                         
 */

  private _updateProjectID1(newValue: string){
    let formEntry = this.state.formEntry;
    formEntry.projectID1.value = newValue;
    this.setState({ formEntry:formEntry, blinkOnProject: 0, });
  }

  private _updateProjectID2(newValue: string){
    let formEntry = this.state.formEntry;
    formEntry.projectID2.value = newValue;
    this.setState({ formEntry:formEntry, blinkOnProject: 0, });
  }

/***
 *         db    db d8888b.      d88888b d8b   db d888888b d8888b. db    db      d888888b db    db d8888b. d88888b 
 *         88    88 88  `8D      88'     888o  88 `~~88~~' 88  `8D `8b  d8'      `~~88~~' `8b  d8' 88  `8D 88'     
 *         88    88 88oodD'      88ooooo 88V8o 88    88    88oobY'  `8bd8'          88     `8bd8'  88oodD' 88ooooo 
 *         88    88 88~~~        88~~~~~ 88 V8o88    88    88`8b      88            88       88    88~~~   88~~~~~ 
 *         88b  d88 88           88.     88  V888    88    88 `88.    88            88       88    88      88.     
 *         ~Y8888P' 88           Y88888P VP   V8P    YP    88   YD    YP            YP       YP    88      Y88888P 
 *                                                                                                                 
 *                                                                                                                 
 */

  private _updateEntryType(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption){

    let formEntry = this.state.formEntry;
    formEntry.entryType = option.key;
    console.log('_updateEntryType: this.state', this.state);
    console.log('_updateEntryType: formEntry', formEntry);
    console.log('_updateEntryType: formEntry.entryType', formEntry.entryType);

    this.setState({ 
      formEntry:formEntry, 
      currentTimePicker : option.key,
      blinkOnProject: 0,
     });
  }
  
/***
 *         d8b   db  .d88b.  d888888b      db    db .d8888. d88888b d8888b. 
 *         888o  88 .8P  Y8. `~~88~~'      88    88 88'  YP 88'     88  `8D 
 *         88V8o 88 88    88    88         88    88 `8bo.   88ooooo 88   88 
 *         88 V8o88 88    88    88         88    88   `Y8b. 88~~~~~ 88   88 
 *         88  V888 `8b  d8'    88         88b  d88 db   8D 88.     88  .8D 
 *         VP   V8P  `Y88P'     YP         ~Y8888P' `8888Y' Y88888P Y8888D' 
 *                                                                          
 *                                                                          
 */


 
public toggleTips = (item: any): void => {
  //This sends back the correct pivot category which matches the category on the tile.

  let newshowTips = this.state.showTips === 'none' ? 'yes' : 'none';

  this.setState({
    showTips: newshowTips,
  });

} //End toggleTips  

  private searchMe = (item: PivotItem): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;
    console.log(e);
    let searchType = "";
    let newSearchShow =  e.altKey === true ? true : !this.state.searchShow;
    let searchCount = this.state.projects.lastFiltered.length;
    let searchWhere = this.state.searchWhere;
    if (e.altKey) { 
      searchType = "all";
      newSearchShow = true;
      //searchCount = this.state.projects.all.length;
      searchWhere = ' in all categories';
    }
    
    let projects = this.state.projects;
    //projects.lastFiltered = (searchType === 'all' ? this.state.projects.all : this.state.lastFilteredProjects );

    console.log('newSearchShow: ', newSearchShow, searchType);
    this.setState({
      searchType: searchType,
      searchShow: ( e.altKey === true ? true : !this.state.searchShow ),
      projects: projects,
      searchCount: searchCount,
      searchWhere: searchWhere,
      blinkOnProject: 0,
    });

    
  } //End searchMe

  public searchForItems = (item): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;
 
    console.log('searchForItems: e',e);
    console.log('searchForItems: item', item);
    console.log('searchForItems: this', this);
    /*
    */

    let searchItems = [];
    if (this.state.searchType === 'all'){
      searchItems =this.state.projects.all;
    } else {
      searchItems =this.state.projects.lastFiltered;
    }
    let searchCount = searchItems.length;
    let newFilteredProjects = [];
    for (let thisItem of searchItems) {
      let fileName = thisItem.href.substring(thisItem.href.lastIndexOf('/'));

      let searchString = 'title:' + thisItem.title.toLowerCase() + 'tescription:' + thisItem.description.toLowerCase() + 'href:' + fileName;
      if(searchString.indexOf(item.toLowerCase()) > -1) {
        //console.log('fileName', fileName);
        newFilteredProjects.push(thisItem);
      }
    }

    searchCount = newFilteredProjects.length;

    let projects = this.state.projects;
    //projects.lastFiltered = (searchType === 'all' ? this.state.projects.all : this.state.lastFilteredProjects );

    this.setState({
      projects: projects,
      searchCount: searchCount,
    });


    return ;
    
  } //End searchForItems


  
  public onChangePivotClick = (item): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;

    this._updateStateOnPropsChange({

    });

  } //End onClick

  private showAll = (item: PivotItem): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;
    if (e.altKey && e.shiftKey && !e.ctrlKey) { 

    } else if (e.ctrlKey) { 

    } else {
      let newFilteredProjects = [];
      for (let thisItem of this.state.projects.all) {
          let showthisItem = true;
          if (showthisItem === true) {newFilteredProjects.push(thisItem) ; }
      }

      let projects = this.state.projects;
      projects.lastFiltered = (this.state.searchType === 'all' ? this.state.projects.all : this.state.projects.lastFiltered );

      this.setState({
        projects: projects,
        searchCount: this.state.projects.all.length,
        pivotDefSelKey: "-100",
        searchWhere: ' in all categories',
        blinkOnProject: 0,
      });
    }
    
  }

  private minimizeTiles = (item: PivotItem): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;
    console.log(e);
    if (e.altKey && e.shiftKey && !e.ctrlKey) { 

      if (strings.analyticsWeb.indexOf(this.props.tenant) === 0 ) {
        let openThisWindow = strings.analyticsWeb + '/lists/' + strings.analyticsList;
        window.open(openThisWindow, '_blank');
        event.preventDefault();
      } else {

        console.log('the analyticsWeb is not in the same tenant...',strings.analyticsWeb,this.props.tenant);

      }
    } else if (e.ctrlKey) { 

      if (strings.minClickWeb.indexOf(this.props.tenant) === 0 ) {
        let openThisWindow = strings.minClickWeb + this.props.pageContext.web.absoluteUrl;
        window.open(openThisWindow, '_blank');
        event.preventDefault();
      } else {

        console.log('the minClickWeb is not in the same tenant...',strings.minClickWeb,this.props.tenant);

      }
    } else {
      let newFilteredProjects = [];
      let projects = this.state.projects;
      projects.newFiltered = [];
      projects.lastFiltered = projects.all;

      this.setState({
        projects: projects,
        searchCount: this.state.projects.all.length,
        pivotDefSelKey: "-100",
        searchWhere: ' in all categories',
        blinkOnProject: 0,
      });
    }
    


  } //End onClick

  public toggleLayout = (item: any): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    /*
    let setLayout = this.state.setLayout;

    if (setLayout === "Card") {
      setLayout = this.props.setSize
    } else if (setLayout === "List") {
      setLayout = "Card"
    } else {       setLayout = "List" }

    this.setState({
      setLayout: setLayout,
    });
    */

  } //End toggleTips  




/***
 *          .d88b.  d8b   db      db      d888888b d8b   db db   dD       .o88b. db      d888888b  .o88b. db   dD 
 *         .8P  Y8. 888o  88      88        `88'   888o  88 88 ,8P'      d8P  Y8 88        `88'   d8P  Y8 88 ,8P' 
 *         88    88 88V8o 88      88         88    88V8o 88 88,8P        8P      88         88    8P      88,8P   
 *         88    88 88 V8o88      88         88    88 V8o88 88`8b        8b      88         88    8b      88`8b   
 *         `8b  d8' 88  V888      88booo.   .88.   88  V888 88 `88.      Y8b  d8 88booo.   .88.   Y8b  d8 88 `88. 
 *          `Y88P'  VP   V8P      Y88888P Y888888P VP   V8P YP   YD       `Y88P' Y88888P Y888888P  `Y88P' YP   YD 
 *                                                                                                                
 *                                                                                                                
 */

  public onLinkClick = (item): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;

    if (e.ctrlKey) {
      //Set clicked pivot as the hero pivot
      this._updateStateOnPropsChange({heroCategory: item.props.headerText});

    } else if (e.altKey) {
      //Enable-disable ChangePivots options
      this.setState({
        
      });

    } else {

      console.log('onLinkClick: this.state', this.state);
      
      let thisFilter = [];
      let pivots = this.state.projectType === false ? this.state.pivots.projects : this.state.pivots.history;  

      for (let p of pivots){
        if ( p.headerText === item.props.headerText ) {
          thisFilter.push(p.filter);
        }
      }
      console.log('pivots', pivots);
      console.log('thisFilter', thisFilter);

      let projects = this.state.projects;
      projects.lastFiltered = projects.newFiltered;
      let filterThese = this.state.projectType ? projects.user : projects.master ;
      projects.newFiltered = this.getTheseProjects(filterThese, thisFilter);
      //projects.lastFiltered = (searchType === 'all' ? this.state.projects.all : this.state.lastFilteredProjects );

      let newProjectMasterPriorityChoice = !this.state.projectType ? thisFilter[0] : this.state.projectMasterPriorityChoice;
      let newProjectUserPriorityChoice = this.state.projectType ? thisFilter[0] : this.state.projectUserPriorityChoice;
      
      if ( this.state.syncProjectPivotsOnToggle ) {
        newProjectMasterPriorityChoice = thisFilter[0];
        newProjectUserPriorityChoice = thisFilter[0];        
      }

      this.setState({
        filteredCategory: item.props.headerText,
        projectMasterPriorityChoice: newProjectMasterPriorityChoice,
        projectUserPriorityChoice: newProjectUserPriorityChoice,
        projects: projects,
        //searchCount: newFilteredProjects.length,
        searchType: '',
        searchWhere: ' in ' + item.props.headerText,
        //pivotDefSelKey: defaultSelectedKey,
        blinkOnProject: 0,

      });

    }

  } //End onClick


/***
 *          d888b  d88888b d888888b      d888888b db   db d88888b .d8888. d88888b      d8888b. d8888b.  .d88b.     d88b 
 *         88' Y8b 88'     `~~88~~'      `~~88~~' 88   88 88'     88'  YP 88'          88  `8D 88  `8D .8P  Y8.    `8P' 
 *         88      88ooooo    88            88    88ooo88 88ooooo `8bo.   88ooooo      88oodD' 88oobY' 88    88     88  
 *         88  ooo 88~~~~~    88            88    88~~~88 88~~~~~   `Y8b. 88~~~~~      88~~~   88`8b   88    88     88  
 *         88. ~8~ 88.        88            88    88   88 88.     db   8D 88.          88      88 `88. `8b  d8' db. 88  
 *          Y888P  Y88888P    YP            YP    YP   YP Y88888P `8888Y' Y88888P      88      88   YD  `Y88P'  Y8888P  
 *                                                                                                                      
 *                                                                                                                      
 */

  public getTheseProjects(startingProjects: IProject[], filterFlags : string[]){

    //console.log('getTheseProjects: filterFlags', filterFlags);

    let filteredProjects: IProject[] = [];

    if (filterFlags.length === 0) {
      return startingProjects;
    }

    for (let thisItem of startingProjects) {
      if (Utils.arrayContainsArray(thisItem.filterFlags,filterFlags)) {
        filteredProjects.push(thisItem);
      }
    }
    console.log('getTheseProjects: filteredProjects', filteredProjects);
    return filteredProjects;
  }
  

  /**
   * This builds unique string key based on properties passed in through this.props.projectKey
   * @param project 
   */
  private getProjectKey(project){

    let key = "";
    for (let k of this.props.projectKey ){
      //console.log('timeTrackData',timeTrackData[k])
      let partialKey = project[k];
      if ( k === 'comments' || k === 'projectID1' || k === 'projectID2' || k === 'timeTarget') {
        //These properties have custom object model to them so we need to check the .value
        if ( project[k] ) { partialKey = project[k].value ; } else { partialKey = '' ; }
      }
      if ( typeof partialKey === 'object') {
        if (partialKey) { key += partialKey.join(' '); }
      } else if (partialKey) { key += partialKey;}
      key += ' ';
    }

    return key;

  }

  private convertToProject(timeTrackData){

    let thisProject: IProject = {

        //Values that would come from Project item
      projectType: 'User', //master or user
      id: timeTrackData.id, //Item ID on list
      editLink: timeTrackData.editLink, //Link to view/edit item link
      titleProject: timeTrackData.titleProject,
      comments: timeTrackData.comments, // syntax similar to ProjID?
      active: timeTrackData.active,  //Used to indicate inactive projects
      everyone: timeTrackData.everyone, //Used to designate this option should be available to everyone.
      sort: timeTrackData.sort, //Used to prioritize in choices.... ones with number go first in order, followed by empty
      key: this.getProjectKey(timeTrackData),

      category1: timeTrackData.category1,
      category2: timeTrackData.category2,
      leader: timeTrackData.leader,  //Likely single person column
      team: timeTrackData.team,  //Likely multi person column
      leaderId: timeTrackData.leaderId,
      teamIds: timeTrackData.teamIds ? timeTrackData.teamIds : [] ,

      filterFlags: [], // what flags does this match?  yourRecent, allRecent etc...

      projectID1: timeTrackData.projectID1,  //Example Project # - look for strings starting with * and ?
      projectID2: timeTrackData.projectID2,  //Example Cost Center # - look for strings starting with * and ?

      timeTarget: timeTrackData.timeTarget,

      //This might be computed at the time page loads
      lastEntry: timeTrackData.lastEntry,  //Should be a time entry

      //Values that relate to project list item
      sourceProject: timeTrackData.sourceProject, //Link back to the source project list item.
      sourceProjectRef: timeTrackData.sourceProjectRef, //Link back to the source project list item.
      ccList: timeTrackData.ccList, //Link to CC List to copy item
      ccEmail: timeTrackData.ccEmail, //Email to CC List to copy item 

      created: timeTrackData.created,
      modified: timeTrackData.modified,
      createdBy: timeTrackData.createdBy,
      modifiedBy: timeTrackData.modifiedBy,

    };

    return thisProject;

  }


  /***
 *         d888888b  .d88b.   d888b   d888b  db      d88888b      d888888b db    db d8888b. d88888b 
 *         `~~88~~' .8P  Y8. 88' Y8b 88' Y8b 88      88'          `~~88~~' `8b  d8' 88  `8D 88'     
 *            88    88    88 88      88      88      88ooooo         88     `8bd8'  88oodD' 88ooooo 
 *            88    88    88 88  ooo 88  ooo 88      88~~~~~         88       88    88~~~   88~~~~~ 
 *            88    `8b  d8' 88. ~8~ 88. ~8~ 88booo. 88.             88       88    88      88.     
 *            YP     `Y88P'   Y888P   Y888P  Y88888P Y88888P         YP       YP    88      Y88888P 
 *                                                                                                  
 *                                                                                                  
 */

  public toggleType = (item): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;
    
    if (e.ctrlKey) {
      //Set clicked pivot as the hero pivot
    } else if (e.altKey) {
      //Enable-disable ChangePivots options
    } else {
    }

    let newProjectType = !this.state.projectType;
    console.log('toggleType: item', item);
    console.log('toggleType from ' +  this.state.projectType + ' to ' + newProjectType);
    let projects = this.state.projects;

    projects.lastFiltered = projects.newFiltered;
    let filterThese = newProjectType ? projects.user : projects.master ;

    let setPivot = newProjectType ? this.state.projectUserPriorityChoice  :this.state.projectMasterPriorityChoice ;
    projects.newFiltered = this.getTheseProjects(filterThese, [setPivot]);
    
    this.setState({
      projectType: newProjectType,
      projects: projects,
      blinkOnProject: 0,
    });


    return; 


  } //End onClick


/***
 *         d8888b. db    db d888888b d888888b  .d88b.  d8b   db       .o88b. db      d888888b  .o88b. db   dD .d8888. 
 *         88  `8D 88    88 `~~88~~' `~~88~~' .8P  Y8. 888o  88      d8P  Y8 88        `88'   d8P  Y8 88 ,8P' 88'  YP 
 *         88oooY' 88    88    88       88    88    88 88V8o 88      8P      88         88    8P      88,8P   `8bo.   
 *         88~~~b. 88    88    88       88    88    88 88 V8o88      8b      88         88    8b      88`8b     `Y8b. 
 *         88   8D 88b  d88    88       88    `8b  d8' 88  V888      Y8b  d8 88booo.   .88.   Y8b  d8 88 `88. db   8D 
 *         Y8888P' ~Y8888P'    YP       YP     `Y88P'  VP   V8P       `Y88P' Y88888P Y888888P  `Y88P' YP   YD `8888Y' 
 *                                                                                                                    
 *                                                                                                                    
 */

  /**
   * This should save an item
   */
  public trackMyTime = () : void => {
    //alert('trackMyTime');
    this.saveMyTime (this.state.formEntry , 'master');

  }

  public startMyTime = () : void => {
    //alert('trackMyTime');
    this.saveMyTime (this.state.formEntry , 'master');

  }

  public clearMyInput = () : void => {

    let formEntry =this.createFormEntry();
    //console.log('formEntry: currentUser', formEntry);
    this.setState({  
      formEntry: formEntry,
    });

    //this.saveMyTime (this.state.entries.all[0] , 'master');
    alert('We cleared all unsaved data.');
  }


  /***
 *         d8888b. d888888b db    db  .d88b.  d888888b .d8888. 
 *         88  `8D   `88'   88    88 .8P  Y8. `~~88~~' 88'  YP 
 *         88oodD'    88    Y8    8P 88    88    88    `8bo.   
 *         88~~~      88    `8b  d8' 88    88    88      `Y8b. 
 *         88        .88.    `8bd8'  `8b  d8'    88    db   8D 
 *         88      Y888888P    YP     `Y88P'     YP    `8888Y' 
 *                                                             
 *                                                             
 */

  //http://react.tips/how-to-create-reactjs-components-dynamically/ - based on createImage
  public createPivot(pivT: IPivot) {

      return (
        <PivotItem 
          headerText={pivT.headerText} 
          itemKey={pivT.itemKey}
        >
        </PivotItem>
      );
  }

  public createPivots(thisState,thisProps){
    let pivots = this.state.projectType === false ? this.state.pivots.projects : this.state.pivots.history;  
    let piv2 = pivots.map(this.createPivot);
    return (
      piv2
    );
  }

  
  private getPivotHelpText (parentState: ITrackMyTime7State, parentProps: ITrackMyTime7Props) {
          
    let helpText = null;
    let pivots = parentState.projectType === false ? parentState.pivots.projects : parentState.pivots.history;  
    let setPivot = !this.state.projectType ? this.state.projectMasterPriorityChoice :this.state.projectUserPriorityChoice ;


    for (let p of pivots){
      if ( setPivot === p.itemKey ) {
        //https://stackoverflow.com/questions/3103962/converting-html-string-into-dom-elements
        // DOES NOT WORK helpText = new DOMParser().parseFromString(p.data, "text/xml");
        helpText = p.data;
      }
    }
    //return "";

    return <div className={ styles.pivotLabel }>{ helpText }</div>;

  }




/***
 *         db    db d8888b. d8888b.  .d8b.  d888888b d88888b      .d8888. d888888b  .d8b.  d888888b d88888b 
 *         88    88 88  `8D 88  `8D d8' `8b `~~88~~' 88'          88'  YP `~~88~~' d8' `8b `~~88~~' 88'     
 *         88    88 88oodD' 88   88 88ooo88    88    88ooooo      `8bo.      88    88ooo88    88    88ooooo 
 *         88    88 88~~~   88   88 88~~~88    88    88~~~~~        `Y8b.    88    88~~~88    88    88~~~~~ 
 *         88b  d88 88      88  .8D 88   88    88    88.          db   8D    88    88   88    88    88.     
 *         ~Y8888P' 88      Y8888D' YP   YP    YP    Y88888P      `8888Y'    YP    YP   YP    YP    Y88888P 
 *                                                                                                          
 *                                                                                                          
 */

  private _updateStateOnPropsChange(params: any ): void {
    this.setState({

    });
  }

  /***
 *         d888888b .88b  d88. d888888b      d88888b db    db d8b   db  .o88b. d888888b d888888b  .d88b.  d8b   db .d8888. 
 *         `~~88~~' 88'YbdP`88 `~~88~~'      88'     88    88 888o  88 d8P  Y8 `~~88~~'   `88'   .8P  Y8. 888o  88 88'  YP 
 *            88    88  88  88    88         88ooo   88    88 88V8o 88 8P         88       88    88    88 88V8o 88 `8bo.   
 *            88    88  88  88    88         88~~~   88    88 88 V8o88 8b         88       88    88    88 88 V8o88   `Y8b. 
 *            88    88  88  88    88         88      88b  d88 88  V888 Y8b  d8    88      .88.   `8b  d8' 88  V888 db   8D 
 *            YP    YP  YP  YP    YP         YP      ~Y8888P' VP   V8P  `Y88P'    YP    Y888888P  `Y88P'  VP   V8P `8888Y' 
 *                                                                                                                         
 *                                                                                                                         
 */

  public buildSmartText (makeThisSmart) {

    let projectText : string = makeThisSmart ;
    let isRequired : boolean = ( projectText && projectText.indexOf("\*") === 0 ) ? true : false ;
    let projectString = isRequired ? makeThisSmart.substring(1) : makeThisSmart;
    let isDefault : boolean = (projectString && projectString.indexOf("\?") === 0 ) ? true : false ;

    projectString = isDefault ? projectString.substring(1) : projectString;
    let lastIndexOfDots : number = projectString ? projectString.lastIndexOf("...") : -1;
    let defaultIsPrefix = lastIndexOfDots > -1 ? true : false;

    let prefix : string = (projectString && lastIndexOfDots === projectString.length -3 ) ? projectString.substring(0,lastIndexOfDots) : null ;
    let mask : string = (makeThisSmart && makeThisSmart.indexOf('mask=')===0) ? makeThisSmart.replace('mask=','') : '';
    let thisProj : ISmartText = {
      value: defaultIsPrefix ? "" : makeThisSmart,
      required: isRequired,
      default: projectString ,
      defaultIsPrefix: defaultIsPrefix,
      prefix: prefix,
      mask: mask,
    };

    return thisProj;
  }


  
/***
 *             d888b  d88888b d888888b db      d888888b .d8888. d888888b d888888b d888888b d88888b .88b  d88. .d8888. 
 *            88' Y8b 88'     `~~88~~' 88        `88'   88'  YP `~~88~~'   `88'   `~~88~~' 88'     88'YbdP`88 88'  YP 
 *            88      88ooooo    88    88         88    `8bo.      88       88       88    88ooooo 88  88  88 `8bo.   
 *            88  ooo 88~~~~~    88    88         88      `Y8b.    88       88       88    88~~~~~ 88  88  88   `Y8b. 
 *            88. ~8~ 88.        88    88booo.   .88.   db   8D    88      .88.      88    88.     88  88  88 db   8D 
 *    C88888D  Y888P  Y88888P    YP    Y88888P Y888888P `8888Y'    YP    Y888888P    YP    Y88888P YP  YP  YP `8888Y' 
 *                                                                                                                    
 *                                                                                                                    
 */


  //Added for Get List Data:  https://www.youtube.com/watch?v=b9Ymnicb1kc
  @autobind 

  //    private async loadListItems(): Promise<IPivotTileItemProps[]> {
  private _getListItems(): void {

    let useProjectList: string = strings.DefaultProjectListTitle;
    if ( this.props.projectListTitle ) {
      useProjectList = this.props.projectListTitle;
    }

    let useProjectWeb: string = this.state.projectListWeb;

    let useTrackMyTimeList: string = strings.DefaultTrackMyTimeListTitle;
    if ( this.props.timeTrackListTitle ) {
      useTrackMyTimeList = this.props.timeTrackListTitle;
    }

    let useTrackMyTimeWeb: string = this.state.timeTrackerListWeb;
   
    //const fixedURL = Utils.fixURLs(this.props.listWebURL, this.props.pageContext);

    let projectSort: string = "SortOrder";
    let trackTimeSort: string = "StartTime";

//    let projectRestFilter: string = "Team eq '" + 20 + "'";
//    let trackTimeRestFilter: string = "User eq '" + 20 + "'";

    let projectRestFilter: string = "";
    let trackTimeRestFilter: string = "";

    let selectCols: string = "*";
    let expandThese = "";
    let peopleColumns = ["Author","Editor","Team","Leader"];
    let peopleProps = ["Title","ID","Name","EMail","UserName"];
    let allColumns = [];

    for (let peep of peopleColumns){
      for (let pro of peopleProps){
        allColumns.push(peep + "/" +  pro);
      }     
    }

    let expColumns = this.getExpandColumns(allColumns);
    let selColumns = this.getSelectColumns(allColumns);
 
    selColumns.length > 0 ? selectCols += "," + selColumns.join(",") : selectCols = selectCols;
    if (expColumns.length > 0) { expandThese = expColumns.join(","); }

    let expandTheseTrack = expandThese + ',User';
    let selectColsTrack = selectCols + ',User/Title,User/ID,User/Name,User/EMail,User/UserName';   

    //Updated Jan 5, 2020 per https://pnp.github.io/pnpjs/getting-started/
    const projectWeb = Web(useProjectWeb);
    const trackTimeWeb = Web(useTrackMyTimeWeb);

    let batch: any = sp.createBatch();

    let loadProjectItems = new Array<IProject>();
    let loadTrackMyTimeItems = new Array<ITimeEntry>();

    let trackMyProjectsInfo = {
      projectData: loadProjectItems,
      timeTrackData: loadTrackMyTimeItems,
    };

/**
 * projectWeb.lists.getByTitle(useProjectList).items
 * 
 * Another way.... go by full URL
 * http://www.ktskumar.com/2017/04/get-list-based-url-using-pnp-javascript-library/
 * $pnp.sp.web.getList("/sites/development/Lists/sample").items
 * projectWeb.getList("/sites/Templates/Tmt/Lists/TrackMyTime/").items
 * projectWeb.getList("/sites/Templates/Tmt/Lists/Projects").items
 * projectWeb.getList().items
 */


 /***
 *                         d888b  d88888b d888888b      db    db .d8888. d88888b d8888b. 
 *                        88' Y8b 88'     `~~88~~'      88    88 88'  YP 88'     88  `8D 
 *                        88      88ooooo    88         88    88 `8bo.   88ooooo 88oobY' 
 *                        88  ooo 88~~~~~    88         88    88   `Y8b. 88~~~~~ 88`8b   
 *                        88. ~8~ 88.        88         88b  d88 db   8D 88.     88 `88. 
 *                         Y888P  Y88888P    YP         ~Y8888P' `8888Y' Y88888P 88   YD 
 *                                                                                       
 *                                                                                       
 */

    //From https://www.ktskumar.com/2018/11/get-current-user-using-pnp-library-spfx/
    //Removed r: CurrentUser with @pnp/sp v2.
    //sp.web.currentUser.inBatch(batch).get().then((r: CurrentUser) => {
    // This did not seem to work when on another site:
    // sp.web.currentUser.inBatch(batch).get().then((r) => {
    // trackTimeWeb.currentUser.inBatch(batch).get().then((r) => {
    //  console.log('sp.web:', sp.web);
    //  console.log('sp.web.currentUser:', sp.web.currentUser);    

    sp.web.currentUser.inBatch(batch).get().then((r) => {

      let currentUser : IUser = {
        title: r['Title'] , //
        initials: r['Title'].split(" ").map((n)=>n[0]).join(""), //Single person column
        email: r['Email'] , //Single person column
        id: r['Id'] , //
        Id: r['Id'] , //
        ID: r['Id'] , //        
        isSiteAdmin: r['IsSiteAdmin'],
        LoginName: r['LoginName'],
      };

      let formEntry =this.createFormEntry();
      //console.log('formEntry: currentUser', formEntry);
      this.setState({  
        formEntry: formEntry,
        loadOrder: (this.state.loadOrder === "") ? 'User' : this.state.loadOrder + ' > User',
        currentUser: currentUser,
        userLoadStatus: "Complete"
      });

      if (this.state.projectsLoadStatus === "Pending") {
        this.processProjects(this.state.loadData.projects);
      }

      if (this.state.timeTrackerLoadStatus === "Pending") {
        this.processTimeEntries(this.state.loadData.entries);
      }

    }).catch((e) => {
      console.log('ERROR:  catch sp.web.currentUser');
      this.processCatch(e);
    });

/***
 *                         d888b  d88888b d888888b      d8888b. d8888b.  .d88b.     d88b d88888b  .o88b. d888888b .d8888. 
 *                        88' Y8b 88'     `~~88~~'      88  `8D 88  `8D .8P  Y8.    `8P' 88'     d8P  Y8 `~~88~~' 88'  YP 
 *                        88      88ooooo    88         88oodD' 88oobY' 88    88     88  88ooooo 8P         88    `8bo.   
 *                        88  ooo 88~~~~~    88         88~~~   88`8b   88    88     88  88~~~~~ 8b         88      `Y8b. 
 *                        88. ~8~ 88.        88         88      88 `88. `8b  d8' db. 88  88.     Y8b  d8    88    db   8D 
 *                         Y888P  Y88888P    YP         88      88   YD  `Y88P'  Y8888P  Y88888P  `Y88P'    YP    `8888Y' 
 *                                                                                                                        
 *                                                                                                                        
 */

    projectWeb.lists.getByTitle(useProjectList).items
    .select(selectCols).expand(expandThese).filter(projectRestFilter).orderBy(projectSort,true).inBatch(batch).getAll()
    .then((response) => {
      console.log('useProjectList', response);
      //console.log('fetched Project Info:', response);
      trackMyProjectsInfo.projectData = response.map((p) => {
        //https://stackoverflow.com/questions/13142635/how-can-i-create-an-object-based-on-an-interface-file-definition-in-typescript
        let daily: any = false;
        let weekly: any = false;
        let total: any = false;

        if (p.TimeTarget) {
          let options = p.TimeTarget.split(';');
          for (let opt of options) {
            let thisOption = opt.split('=');
            if (thisOption[1] && thisOption[0].toLowerCase() === 'daily') {
              daily = parseInt(thisOption[1]);
            } else if (thisOption[1] && thisOption[0].toLowerCase() === 'weekly') {
              weekly = parseInt(thisOption[1]);
            } else if (thisOption[1] && thisOption[0].toLowerCase() === 'total') {
              total = parseInt(thisOption[1]);
            }
          }
        }

        let targetInfo : IProjectTarget = {
          value: p.TimeTarget,
          daily: daily ? daily : 0,
          weekly: weekly ? weekly : 0,
          total: total ? total : 0,
          dailyStatus: daily ? true : false,
          weeklyStatus: weekly ? true : false,
          totalStatus: total ? true : false,
        };


        let leader : IUser = {
          title: 'p.' , //
          initials: 'p.' , //Single person column
          email: 'p.' , //Single person column
          id: p.LeaderId , //
          Id: p.LeaderId , //
          ID: p.LeaderId , //          
        };

        let team : IUser = {
          title: 'p.' , //
          initials: 'p.' , //Single person column
          email: 'p.' , //Single person column
          id: p.TeamId , //
          Id: p.TeamId , //
          ID: p.TeamId , //  
        };

        let project : IProject = {
          projectType: 'Master',
          id: p.Id,
          editLink: null , //Link to view/edit item link
          titleProject: p.Title,
          comments: this.buildSmartText(p.Comments),
          active: p.Active,
          everyone: p.Everyone,
          sort: p.Sort,

          category1: p.Category1,
          category2: p.Category2,

          leader: p.Leader ,
          team: p.Team,

          leaderId: p.LeaderId,
          teamIds: p.TeamId,

          filterFlags: [],

          projectID1: this.buildSmartText(p.ProjectID1),
          projectID2: this.buildSmartText(p.ProjectID2),

          timeTarget: targetInfo,
          ccEmail: p.CCEmail,
          ccList: p.CCList,
        
          //Values that relate to project list item
          // sourceProject: , //Add URL back to item
        };

        return project;

      });
      //console.log('trackMyProjectsInfo:', trackMyProjectsInfo);

      if (this.state.userLoadStatus === "Complete") {
        this.processProjects(trackMyProjectsInfo.projectData);

      } else {

        let loadData = this.state.loadData;
        loadData.projects = trackMyProjectsInfo.projectData;

        this.setState({  
          loadOrder: (this.state.loadOrder === "") ? 'Project' : this.state.loadOrder + ' > Project',
          loadData:loadData,
          projectsLoadStatus: "Pending",
        });

        loadData = null;
      }

    }).catch((e) => {
      console.log('ERROR:  projectWeb.lists.getByTitle(useProjectList)',useProjectList, e);
      let projErrMessage = getHelpfullError(e);
      this.setState({  loadStatus: projErrMessage, loadError: this.state.loadError + '.  ' + projErrMessage, listError: true, projectsListError: true, projectsLoadError: projErrMessage,});
      this.processCatch(e);
    });


  /***
 *                         d888b  d88888b d888888b      d888888b d888888b .88b  d88. d88888b 
 *                        88' Y8b 88'     `~~88~~'      `~~88~~'   `88'   88'YbdP`88 88'     
 *                        88      88ooooo    88            88       88    88  88  88 88ooooo 
 *                        88  ooo 88~~~~~    88            88       88    88  88  88 88~~~~~ 
 *                        88. ~8~ 88.        88            88      .88.   88  88  88 88.     
 *                         Y888P  Y88888P    YP            YP    Y888888P YP  YP  YP Y88888P 
 *                                                                                           
 *                                                                                           
 */  

    trackTimeWeb.lists.getByTitle(useTrackMyTimeList).items
    .select(selectColsTrack).expand(expandTheseTrack).filter(trackTimeRestFilter).orderBy(trackTimeSort,false).top(400).get()
    .then((response) => {

      console.log('useTrackMyTimeList', response);


      /**
       * This loop loosely increases performance by compounding number of entries.
        * End test performance loop
      */

      if (this.props.stressMultiplier > 1) {
        for (let i = 0; i < this.props.stressMultiplier; i++ ) {
          //trackMyProjectsInfo.timeTrackData = trackMyProjectsInfo.timeTrackData.concat(trackMyProjectsInfo.timeTrackData);
          response = response.concat(response);
        }
      }

      trackMyProjectsInfo.timeTrackData = response.map((item) => {
        //https://stackoverflow.com/questions/13142635/how-can-i-create-an-object-based-on-an-interface-file-definition-in-typescript
        
        let listCategory = "";
        if ( item.Category1 !== null && item.Category1 ) {
          listCategory += item.Category1.join(', ');
        }
        if ( item.Category2 !== null && item.Category2 ) {
          listCategory += item.Category2.join(', ');
        }

        let listProjects = "";
        if ( item.ProjectID1 !== null ) {
          listProjects += item.ProjectID1;
        }
        if ( item.ProjectID2 !== null ) {
          listProjects = listProjects !== "" ? listProjects += ", " : listProjects;
          listProjects += item.ProjectID2 + ' ';
        }   

        
        let listComments = item.Comments ? item.Comments : "";

        let timeEntry : ITimeEntry = {

            //Values that would come from Project item
          id: item.Id ,
          editLink: null , //Link to view/edit item link
          titleProject : item.Title ,
          comments: this.buildSmartText(item.Comments),
          category1 : item.Category1 ,
          category2 : item.Category2 ,

          leader : item.Leader ,  //Likely single person column
          team : item.Team ,  //Likely multi person column

          leaderId: item.LeaderId,
          teamIds: item.TeamId,

          filterFlags: [],

          projectID1 : this.buildSmartText(item.ProjectID1) ,  //Example Project # - look for strings starting with * and ?
          projectID2 : this.buildSmartText(item.ProjectID2) ,  //Example Cost Center # - look for strings starting with * and ?

          //Values that relate to project list item
          sourceProject : item.SourceProject , //Link back to the source project list item.
          sourceProjectRef : item.SourceProjectRef , //Link back to the source project list item.
          activity: item.Activity ,  //Link to the activity you worked on

          //Values specific to Time Entry
          user : item.User ,  //Single person column
          userId : item.UserId ,  //Single person column
          startTime : item.StartTime , //Time stamp
          endTime : item.EndTime , // Time stamp
          duration : item.Hours , //Number  -- May not be needed based on current testing with start and end dates.
          age: getAge(item.EndTime,"days"),
          //Saves what entry option was used... Since Last, Slider, Manual
          entryType : item.EntryType ,
          deltaT : item.DeltaT , //Could be used to indicate how many hours entry was made (like now, or 10 2 days in the past)
          timeEntryTBD1 : '' ,
          timeEntryTBD2 : '' ,
          timeEntryTBD3 : '' ,

          //This block for use in the history list component
          //Getting initials using:  https://stackoverflow.com/a/45867959/4210807
          userInitials: item.User.Title.split(" ").map((n)=>n[0]).join(""),
          listCategory: listCategory,
          listTimeSpan: getTimeSpan(item.StartTime, item.EndTime),
          listProjects: listProjects,
          listTracking: '',
          listComments: listComments,

          //Other settings and information
          created: new Date(item.Created),
          modified: new Date(item.Modified),
          createdBy: item.Author.Title,
          modifiedBy: item.Editor.Title,

          createdByID: item.Author.ID,
          modifiedByID: item.Editor.ID,

          wasModified: item.Created === item.Modified ? false : true ,
          modifiedByUser: item.UserId === item.Editor.ID ? true : false,
          createdByUser: item.UserId === item.Author.ID ? true : false,

          location : item.Location,
          settings : item.Settings,

          ccEmail: item.CCEmail,
          ccList: item.CCList,

        };
        //this.saveMyTime(timeEntry,'master');
        return timeEntry;

      });
      
      if (this.state.userLoadStatus === "Complete") {
        this.processTimeEntries(trackMyProjectsInfo.timeTrackData);

      } else {

        let loadData = this.state.loadData;
        loadData.entries = trackMyProjectsInfo.timeTrackData;

        this.setState({  
          loadOrder: (this.state.loadOrder === "") ? 'Entries' : this.state.loadOrder + ' > Entries',
          loadData:loadData,
          timeTrackerLoadStatus: "Pending",
        });

        loadData = null;
      }

    }).catch((e) => {
      console.log('ERROR:  trackTimeWeb.lists.getByTitle(useTrackMyTimeList)',useTrackMyTimeList, e);
      let projTimeMessage = getHelpfullError(e);
      this.setState({  loadStatus: projTimeMessage, loadError: this.state.loadError + '.  ' + projTimeMessage, listError: true, timeTrackerListError: true, timeTrackerLoadError: projTimeMessage,});
      this.processCatch(e);
    });

    return batch.execute().then(() => {

      //this.processResponse(trackMyProjectsInfo);
      //return trackMyProjectsInfo;
    });

  }  


/***
 *          .o88b.  .d8b.  d888888b  .o88b. db   db 
 *         d8P  Y8 d8' `8b `~~88~~' d8P  Y8 88   88 
 *         8P      88ooo88    88    8P      88ooo88 
 *         8b      88~~~88    88    8b      88~~~88 
 *         Y8b  d8 88   88    88    Y8b  d8 88   88 
 *          `Y88P' YP   YP    YP     `Y88P' YP   YP 
 *                                                  
 *                                                  
 */

  private processCatch(e) {
    console.log("Can't load data");
    //var m = e.status === 404 ? "Tile List not found: " + useTileList : "Other message";
    //alert(m);
    let errMessage = getHelpfullError(e);
    console.log(e);
    console.log(e.status);
    console.log(e.message);
    let sendMessage = e.status + " - " + e.message;
    //this.setState({  loadStatus: "Not sure what happened!", loadError: e.message, listError: true, });
    this.setState({  loadStatus: errMessage, loadError: errMessage, listError: true, });
  }


/***
 *         d8888b. d8888b.  .d88b.   .o88b. d88888b .d8888. .d8888.          
 *         88  `8D 88  `8D .8P  Y8. d8P  Y8 88'     88'  YP 88'  YP          
 *         88oodD' 88oobY' 88    88 8P      88ooooo `8bo.   `8bo.            
 *         88~~~   88`8b   88    88 8b      88~~~~~   `Y8b.   `Y8b.          
 *         88      88 `88. `8b  d8' Y8b  d8 88.     db   8D db   8D          
 *         88      88   YD  `Y88P'   `Y88P' Y88888P `8888Y' `8888Y'          
 *                                                                           
 *                                                                           
 *         d8888b. d8888b.  .d88b.     d88b d88888b  .o88b. d888888b .d8888. 
 *         88  `8D 88  `8D .8P  Y8.    `8P' 88'     d8P  Y8 `~~88~~' 88'  YP 
 *         88oodD' 88oobY' 88    88     88  88ooooo 8P         88    `8bo.   
 *         88~~~   88`8b   88    88     88  88~~~~~ 8b         88      `Y8b. 
 *         88      88 `88. `8b  d8' db. 88  88.     Y8b  d8    88    db   8D 
 *         88      88   YD  `Y88P'  Y8888P  Y88888P  `Y88P'    YP    `8888Y' 
 *                                                                           
 *                                                                           
 */

  private processProjects(projectData){
    //projectData
    //console.log('projectData:  ', projectData);

    /**
     * Things we need to do during intial state
     * Populate all these arrays:
     * 
          all: IProject[];
          master: IProject[]; //Projects coming from the Projects list
          masterPriority: IProject[]; //Projects visible based on settings
          
          current: IProject[]; //Makes up the choices
          lastFiltered: IProject[];
          lastProject: IProject[];
          newFiltered: IProject[];
            
      *   Put them into state.projects
      */
     let master: IProject[] = [];
     let masterKeys: string[] = [];

     let userId = this.state.currentUser.id;

     //console.log('processProjects: userId',userId, typeof userId);
     //console.log('projectData[1].leaderId:', projectData[1].leaderId, typeof projectData[1].leaderId);

     for (let i = 0; i < projectData.length; i++ ) {
      let countThese = "all";
      let fromProject = projectData[i];
      let yours, team :boolean = false;

      //Check if project is tagged to you
      if (fromProject.teamIds && fromProject.teamIds.indexOf(userId) > -1 ) { team = true; }
      if (fromProject.leaderId === userId ) { yours = true; }
      if (fromProject.everyone) { fromProject.filterFlags.push('everyone') ; countThese = 'everyone'; }
      else if (yours) { fromProject.filterFlags.push('your') ; countThese = 'your'; }
      else if (team) { fromProject.filterFlags.push('team') ; countThese = 'team'; }
      else { fromProject.filterFlags.push('otherPeople') ; countThese = 'otherPeople'; }
      fromProject.key = this.getProjectKey(fromProject);
      if (masterKeys.indexOf(fromProject.key) < 0) { 
        //This is a new project, add
        master.push(fromProject);
        masterKeys.push(fromProject.key);
      }
    }

     let all: IProject[] = master.concat(this.state.projects.all);
     let stateProjects = this.state.projects;

     stateProjects.all = all;
     stateProjects.master = master;
     stateProjects.masterKeys = masterKeys;

     let filterThese = this.state.projectType ? stateProjects.user : stateProjects.master ;

     let setPivot = !this.state.projectType ? this.state.projectMasterPriorityChoice :this.state.projectUserPriorityChoice ;
     stateProjects.newFiltered = this.getTheseProjects(filterThese, [setPivot]);
     stateProjects.lastFiltered = this.state.projectType === false ? master : stateProjects.user ;

     let masterPriority: IProject[] = [];

    this.setState({  
      loadOrder: (this.state.loadOrder === "") ? 'Process Projects' : this.state.loadOrder + ' > Process Projects',
      projects: stateProjects,
      projectsLoadStatus:"Complete",
      projectsLoadError: "",
      projectsListError: false,
      projectsItemsError: false,
      allLoaded: (this.state.userLoadStatus === 'Complete' && this.state.timeTrackerLoadStatus === 'Complete') ? true : false,
    });
  }

  private createNewProjectCounts() {
    function createMe(){
      let yourCounts = {
        total: 0,
        today: 0,
        week: 0,
        month: 0,
        quarter: 0,
        recent: 0,
      };
      return yourCounts;
    }
    let counts = {
      all: createMe(),
      team: createMe(),
      your: createMe(),
      otherPeople: createMe(),
    };

    return counts;

  }


/***
 *         d8888b. d8888b.  .d88b.   .o88b. d88888b .d8888. .d8888.      
 *         88  `8D 88  `8D .8P  Y8. d8P  Y8 88'     88'  YP 88'  YP      
 *         88oodD' 88oobY' 88    88 8P      88ooooo `8bo.   `8bo.        
 *         88~~~   88`8b   88    88 8b      88~~~~~   `Y8b.   `Y8b.      
 *         88      88 `88. `8b  d8' Y8b  d8 88.     db   8D db   8D      
 *         88      88   YD  `Y88P'   `Y88P' Y88888P `8888Y' `8888Y'      
 *                                                                       
 *                                                                       
 *         d888888b d888888b .88b  d88. d88888b                          
 *         `~~88~~'   `88'   88'YbdP`88 88'                              
 *            88       88    88  88  88 88ooooo                          
 *            88       88    88  88  88 88~~~~~                          
 *            88      .88.   88  88  88 88.                              
 *            YP    Y888888P YP  YP  YP Y88888P                          
 *                                                                       
 *                                                                       
 */

  private processTimeEntries(timeTrackData : ITimeEntry[]){
    //trackMyProjectsInfo
    //console.log('timeTrackData:  ', timeTrackData);
    
    /**
      * Things we need to do during intial state
      * Populate all these arrays:
      *    user: IProject[]; //Projects coming from TrackMyTime list
      *    userPriority: IProject[]; //Projects visible based on settings
      *   Put them into state.projects
    */
    let counts = this.createNewProjectCounts();
    let userKeys : string[] = [];
    let allEntries: ITimeEntry[] = timeTrackData;
    let yourEntries: ITimeEntry[] = [];
    let teamEntries: ITimeEntry[] = [];
    let everyoneEntries: ITimeEntry[] = [];
    let otherEntries: ITimeEntry[] = [];

    let sessionEntries: ITimeEntry[] = [];
    let todayEntries: ITimeEntry[] = [];
    let user: IProject[] = [];
    let userPriority: IProject[] = [];

    let stateProjects = this.state.projects;
    let stateEntries: IEntryInfo = this.state.entries;

    let userId = this.state.currentUser.id;
     //console.log('processTimeEntries: userId',userId, typeof userId);
     //console.log('timeTrackData[1].userId:', timeTrackData[1].userId, typeof timeTrackData[1].userId);

    let thisUserParam = this.props.urlVars['User'];
    let thisUser = this.state.currentUser.title;
    if (thisUser) {
      //alert("User found thisUser: " + JSON.stringify(thisUser) )
     }
    else if (thisUserParam) {
      //alert("User found thisUserParam: " + JSON.stringify(thisUserParam) );
    } else { //alert("NOT found: " );
    }

    let lastEndTime = makeTheTimeObject("2007");
    let nowEndTime = makeTheTimeObject(null);
    //console.log(JSON.stringify(lastEndTime));
    //alert(lastEndTime);

    let recentDays = 4;

    for (let i = 0; i < timeTrackData.length; i++ ) {
      let thisEntry : ITimeEntry = timeTrackData[i];
      let countThese = "all";
      let fromProject = this.convertToProject(thisEntry);
      let yours, team, today, week, month, quarter, recent :boolean = false;
      let thisEndTime = makeTheTimeObject(thisEntry.endTime); 
      thisEntry.thisTimeObj = makeTheTimeObject(thisEntry.startTime); 
      //alert(thisEndTime);
      //Check if timeTrackData is tagged to you
      if (thisEntry.userId === userId ) { yours = true; } 
      if (yours) { 
        fromProject.filterFlags.push('your');
        thisEntry.filterFlags.push('your');
        countThese = 'your'; 
        //Checks for latest end time
        if ( thisEndTime.milliseconds > lastEndTime.milliseconds  ) {
          //Only update lastEndTime if it's in the past.
          if ( thisEndTime.milliseconds < nowEndTime.milliseconds) {
            lastEndTime = thisEndTime;
          }
        }
      }

      //Check if project is tagged to you
      if (fromProject.teamIds.indexOf(userId) > -1 ) { team = true; } 
      if (fromProject.leaderId === userId ) { team = true; } 
      

      if (!yours  && team) { 
        fromProject.filterFlags.push('team');
        thisEntry.filterFlags.push('team');
        countThese = 'team'; 
      }

      if (!yours && !team) { 
        fromProject.filterFlags.push('otherPeople');
        thisEntry.filterFlags.push('otherPeople');
        countThese = 'otherPeople';
      }

      let daysSince = thisEntry.age;
      counts[countThese].total ++;

      if ( daysSince <= 0 ) { today = true;
        fromProject.filterFlags.push('today') ;
        thisEntry.filterFlags.push('today') ;
        thisEntry.timeGroup = '0. These went Back to the Future :)';
        counts[countThese].today ++ ; }
      else if ( daysSince <= 1 ) { today = true;
        fromProject.filterFlags.push('today') ;
        thisEntry.filterFlags.push('today') ;
        thisEntry.timeGroup = '1. Ended Today';
        counts[countThese].today ++ ; }
      else if ( daysSince <= 7 ) { week = true;
        fromProject.filterFlags.push('week') ;
        thisEntry.filterFlags.push('week') ;
        thisEntry.timeGroup = '2. Ended Past Week';
        counts[countThese].week ++ ; }
      else if ( daysSince <= 31 ) { month = true;
        fromProject.filterFlags.push('month') ;
        thisEntry.filterFlags.push('month') ;
        thisEntry.timeGroup = '3. Ended Past Month';
        counts[countThese].month ++ ; }
      else if ( daysSince <= 91 ) { month = true;
        fromProject.filterFlags.push('quarter') ;
        thisEntry.filterFlags.push('quarter') ;
        thisEntry.timeGroup = '4. Ended Past Quarter';
        counts[countThese].quarter ++ ; }
      else if ( daysSince <= 365 ) { month = true;
        fromProject.filterFlags.push('quarter') ;
        thisEntry.filterFlags.push('quarter') ;
        thisEntry.timeGroup = '5. Ended Past Year';
        counts[countThese].quarter ++ ; }
      else if ( daysSince <= 730*4 ) { month = true;
        fromProject.filterFlags.push('quarter') ;
        thisEntry.filterFlags.push('quarter') ;
        thisEntry.timeGroup = '6. Ended a LONG time ago';
        counts[countThese].quarter ++ ; }
      else if ( daysSince <= recentDays ) { recent = true;
        fromProject.filterFlags.push('recent') ;
        thisEntry.filterFlags.push('recent') ;
        thisEntry.timeGroup = '5. Ended Who knows when :)';
        counts[countThese].recent ++ ;
       }
                  
      if (userKeys.indexOf(fromProject.key) < 0) { 
        //This is a new project, add
        user.push(fromProject);
        userKeys.push(fromProject.key);
      }
/*

      allEntries.push(thisEntry);
*/
      if (thisEntry.filterFlags.indexOf('today') > -1) { 
        todayEntries.push(thisEntry);
      }
      if (thisEntry.filterFlags.indexOf('your') > -1) { 
        yourEntries.push(thisEntry);
      }
      if (thisEntry.filterFlags.indexOf('team') > -1) { 
        teamEntries.push(thisEntry);
      }
      if (thisEntry.filterFlags.indexOf('everyone') > -1) { 
        everyoneEntries.push(thisEntry);
      }
      if (thisEntry.filterFlags.indexOf('otherPeople') > -1) { 
        everyoneEntries.push(thisEntry);
      } 

    }
    


    //console.log('nowEndTime', JSON.stringify(nowEndTime));
    if ( lastEndTime.milliseconds > nowEndTime.milliseconds  ) {
      lastEndTime = nowEndTime;
    }

   let all: IProject[] = this.state.projects.all.concat(user);
   stateProjects.all = all;
   stateProjects.user = user;

   let filterThese = this.state.projectType ? stateProjects.user : stateProjects.master ;
   let setPivot = !this.state.projectType ? this.state.projectMasterPriorityChoice :this.state.projectUserPriorityChoice ;
   stateProjects.newFiltered = this.getTheseProjects(filterThese, [setPivot]);
   stateProjects.lastFiltered = stateProjects.newFiltered ;

   stateProjects.userKeys = userKeys;

       /* 2019-12-17: Testing here     2019-12-17: Testing here   */
    stateEntries.all = allEntries;
    stateEntries.user = yourEntries;
    stateEntries.your = yourEntries;
    stateEntries.team = teamEntries;
    stateEntries.everyone = everyoneEntries;
    stateEntries.other = otherEntries;  
    stateEntries.today = todayEntries;
    stateEntries.newFiltered = allEntries;
    stateEntries.lastFiltered = allEntries;  

    //Change from sinceLast if the time is longer than x- hours ago.
    let hoursSinceLastTime = this.state.currentTimePicker === 'sinceLast' && getTimeDelta( lastEndTime.theTime, new Date() , 'hours');
    console.log('currentTimePicker state:', this.state);
    console.log('currentTimePicker hoursSinceLastTime:', hoursSinceLastTime);

    let currentTimePicker = 
    ( hoursSinceLastTime >  2 ) 
    ?  'slider'
    : this.state.currentTimePicker ;

    let formEntry = this.state.formEntry;
    formEntry.entryType = currentTimePicker;

   this.setState({
    loadOrder: (this.state.loadOrder === "") ? 'Process Entries' : this.state.loadOrder + ' > Process Entries',
    projects: stateProjects,
    userCounts: counts,
    entries: stateEntries,
    currentTimePicker: currentTimePicker,
    lastEndTime: lastEndTime,
    allEntries: timeTrackData,
    filteredEntries: timeTrackData,
    timeTrackerLoadStatus:"Complete",
    timeTrackerLoadError: "",
    timeTrackerListError: false,
    timeTrackerItemsError: false,
    formEntry: formEntry,
    allLoaded: (this.state.userLoadStatus === 'Complete' && this.state.projectsLoadStatus === 'Complete') ? true : false,
   });

   this.processChartData('user',['what??'],10,'string',true);

  }

/***
 *         .d8888.  .d8b.  db    db d88888b      d888888b d888888b .88b  d88. d88888b 
 *         88'  YP d8' `8b 88    88 88'          `~~88~~'   `88'   88'YbdP`88 88'     
 *         `8bo.   88ooo88 Y8    8P 88ooooo         88       88    88  88  88 88ooooo 
 *           `Y8b. 88~~~88 `8b  d8' 88~~~~~         88       88    88  88  88 88~~~~~ 
 *         db   8D 88   88  `8bd8'  88.             88      .88.   88  88  88 88.     
 *         `8888Y' YP   YP    YP    Y88888P         YP    Y888888P YP  YP  YP Y88888P 
 *                                                                                    
 *                                                                                    
 */

  private saveMyTime (trackTimeItem: ISaveEntry , masterOrRemote : string) {
    //trackTimeItem = current this.state.formEntry

    let teamId = { results: [] };
    if (trackTimeItem.teamIds) { teamId = { results: trackTimeItem.teamIds } ; }

    let category1 = { results: [] };
    if (trackTimeItem.category1) { category1 = { results: trackTimeItem.category1 } ; }

    let category2 = { results: [] };
    if (trackTimeItem.category2) { category2 = { results: trackTimeItem.category2 } ; }

    let itemStartTime;
    let itemEndTime;

    if (this.state.currentTimePicker === 'sinceLast') {
      itemStartTime = new Date(this.state.lastEndTime.theTime).toLocaleString();
      itemEndTime = new Date().toLocaleString();

    } else if (this.state.currentTimePicker === 'slider') {
      itemStartTime = this.state.formEntry.startTime;
      itemEndTime = this.state.formEntry.endTime;

    } else if (this.state.currentTimePicker === 'manual') {
      console.log('saveMyTime start', this.state.formEntry.startTime);
      console.log('saveMyTime end', this.state.formEntry.endTime);
      itemStartTime = this.state.formEntry.startTime;
      itemEndTime = this.state.formEntry.endTime;   

    } else if (this.state.currentTimePicker === 'start') {

      itemStartTime = new Date().toLocaleString();
      itemEndTime = new Date().toLocaleString();   
      console.log('startMyTime start', itemStartTime);
      console.log('startMyTime end', itemEndTime);
    } else {
      
      itemStartTime = new Date(this.state.lastEndTime.theTime).toLocaleString();
      itemEndTime = new Date().toLocaleString();
    }

    let comments = trackTimeItem.comments ? trackTimeItem.comments.value : null;
    let projectID1 = trackTimeItem.projectID1 ? trackTimeItem.projectID1.value : null;
    let projectID2 = trackTimeItem.projectID2 ? trackTimeItem.projectID2.value : null;

    if (trackTimeItem.comments.defaultIsPrefix) {comments = trackTimeItem.comments.prefix + comments; }
    if (trackTimeItem.projectID1.defaultIsPrefix) {projectID1 = trackTimeItem.projectID1.prefix + projectID1; }
    if (trackTimeItem.projectID2.defaultIsPrefix) {projectID2 = trackTimeItem.projectID2.prefix + projectID2; }


    let Activity = {
      Description: trackTimeItem.activity.Description ?  trackTimeItem.activity.Description : null,
      Url: trackTimeItem.activity.Url ? trackTimeItem.activity.Url : null,
    };

    let saveThisItem = {
        //Values that would come from Project item
        //editLink : ILink, //Link to view/edit item link
        Title: trackTimeItem.titleProject,
        Comments: comments,
        Category1: category1,
        Category2: category2,
        LeaderId: trackTimeItem.leaderId,  //Likely single person column
        TeamId: teamId,  //Likely multi person column

        ProjectID1: projectID1,  //Example Project # - look for strings starting with * and ?
        ProjectID2: projectID2,  //Example Cost Center # - look for strings starting with * and ?

        //Values that relate to project list item
        SourceProject: trackTimeItem.sourceProject, //Link back to the source project list item.
        SourceProjectRef: trackTimeItem.sourceProjectRef, //Link back to the source project list item.
        Activity: Activity, //Link to the activity you worked on
        //CCList: trackTimeItem.ccList, //Link to CC List to copy item
        //CCEmail: trackTimeItem.ccEmail, //Email to CC List to copy item 
        
        //Values specific to Time Entry
        UserId: this.state.currentUser.Id,  //Single person column
        StartTime: itemStartTime, //Time stamp
        EndTime: itemEndTime, // Time stamp
        //Duration: trackTimeItem.duration, //Number  -- May not be needed based on current testing with start and end dates.

        //Saves what entry option was used... Since Last, Slider, Manual
        EntryType: trackTimeItem.entryType,
        DeltaT: 999, //Could be used to indicate how many hours entry was made (like now, or 10 2 days in the past)
        //timeEntryTBD1: string,
        //timeEntryTBD2: string,
        //timeEntryTBD3: string,  

        //Other settings and information
        Location: trackTimeItem.location, // Location
        Settings: trackTimeItem.settings,

    };
/*
    const allKeys = Object.keys(saveThisItem);
    let saveThisItemNew = {}; 
    for (let key of allKeys){
      let thisElement = saveThisItem[key];
      if (saveThisItem[key]) { saveThisItemNew.push( {key : thisElement})}
    }
    */
     
    let useTrackMyTimeList: string = strings.DefaultTrackMyTimeListTitle;
    if ( this.props.timeTrackListTitle ) {
      useTrackMyTimeList = this.props.timeTrackListTitle;
    }
  
    let useTrackMyTimeWeb: string = this.state.timeTrackerListWeb;

    //console.log('this.props',this.props);
    //console.log('this.state',this.state);
    console.log('trackTimeItem',trackTimeItem);
    console.log('saveThisItem',saveThisItem);
    
    //Updated Jan 5, 2020 per https://pnp.github.io/pnpjs/getting-started/
    const trackTimeWeb = Web(useTrackMyTimeWeb);

    if (masterOrRemote === 'master'){
      trackTimeWeb.lists.getByTitle(useTrackMyTimeList).items.add( saveThisItem ).then((response) => {
        //Reload the page
        console.log('save response', response);

          this.addThisItemToState(trackTimeItem,masterOrRemote, response);
          alert('save successful');
        }).catch((e) => {
        //Throw Error
          alert(e);
      });
    } else if (masterOrRemote === 'remote'){
      trackTimeWeb.getList("/sites/Templates/Tmt/Lists/TrackMyTime/").items.add( saveThisItem ).then((response) => {
        //Reload the page
        //location.reload();
          alert('save successful');
        }).catch((e) => {
        //Throw Error
          alert(e);
      });

    }

  }

  /***
 *          .d8b.  d8888b. d8888b.      d888888b d888888b d88888b .88b  d88. 
 *         d8' `8b 88  `8D 88  `8D        `88'   `~~88~~' 88'     88'YbdP`88 
 *         88ooo88 88   88 88   88         88       88    88ooooo 88  88  88 
 *         88~~~88 88   88 88   88         88       88    88~~~~~ 88  88  88 
 *         88   88 88  .8D 88  .8D        .88.      88    88.     88  88  88 
 *         YP   YP Y8888D' Y8888D'      Y888888P    YP    Y88888P YP  YP  YP 
 *                                                                           
 *                                                                           
 *         d888888b  .d88b.       .d8888. d888888b  .d8b.  d888888b d88888b  
 *         `~~88~~' .8P  Y8.      88'  YP `~~88~~' d8' `8b `~~88~~' 88'      
 *            88    88    88      `8bo.      88    88ooo88    88    88ooooo  
 *            88    88    88        `Y8b.    88    88~~~88    88    88~~~~~  
 *            88    `8b  d8'      db   8D    88    88   88    88    88.      
 *            YP     `Y88P'       `8888Y'    YP    YP   YP    YP    Y88888P  
 *                                                                           
 *                                                                           
 */
  private addThisItemToState (trackTimeItem: ISaveEntry , masterOrRemote : string, response) {

    if (masterOrRemote === 'master') {
      console.log('trackTimeItem', trackTimeItem);
      let created = new Date();

      let listCategory = "";
      if ( trackTimeItem.category1 !== null && trackTimeItem.category1 ) {
        listCategory += trackTimeItem.category1.join(', ');
      }
      if ( trackTimeItem.category2 !== null && trackTimeItem.category2 ) {
        listCategory += trackTimeItem.category2.join(', ');
      }
      let listTimeSpan = getTimeSpan(trackTimeItem.startTime, trackTimeItem.endTime);
      let listComments = trackTimeItem.comments ? trackTimeItem.comments.value : "";
      let listProjects = "";
      if ( trackTimeItem.projectID1 !== null && trackTimeItem.projectID1.value ) {
        listProjects += trackTimeItem.projectID1.value + ' ';
      }
      if ( trackTimeItem.projectID2 !== null && trackTimeItem.projectID2.value ) {
        listProjects += trackTimeItem.projectID2.value + ' ';
      }   

      let newEntry : ITimeEntry = {...trackTimeItem,
        user: this.state.currentUser,
        userInitials: "You!",
        userId: response.data.UserId,
        filterFlags: ["your","session"],
        timeGroup: "0. This browser session",
        duration: getTimeDelta( trackTimeItem.endTime , trackTimeItem.startTime , 'hours').toString(),
        age: getAge(trackTimeItem.endTime,"days"),
        deltaT: response.data.DeltaT,
        created: created,
        modified: created,
        createdBy: this.state.currentUser.Id,
        modifiedBy: this.state.currentUser.Id,
        listCategory: listCategory,
        listComments: listComments,
        listTimeSpan: listTimeSpan,
        listProjects: listProjects,
        id: response.data.Id,
        entryType: response.data.EntryType,
        comments: this.buildSmartText(response.data.Comments),
        projectID1 : this.buildSmartText(response.data.ProjectID1) ,  //Example Project # - look for strings starting with * and ?
        projectID2 : this.buildSmartText(response.data.ProjectID2) ,  //Example Cost Center # - look for strings starting with * and ?
      
      };

      let entries = this.state.entries;

      let thisEntry: ITimeEntry[] = [];
      thisEntry.push(newEntry);
      entries.all = thisEntry.concat(entries.all);
      entries.lastFiltered = thisEntry.concat(entries.lastFiltered);
      entries.user = thisEntry.concat(entries.user);
      entries.session = thisEntry.concat(entries.session);      
      entries.newFiltered = thisEntry.concat(entries.newFiltered);   

      let filteredEntries:  ITimeEntry[] = [];
      filteredEntries.push(newEntry);
      filteredEntries = filteredEntries.concat(this.state.filteredEntries);
      console.log( 'newEntry', newEntry);
      let lastEndTime = makeTheTimeObject(newEntry.endTime); 

      this.setState({
        entries:entries,
        filteredEntries:filteredEntries,
        lastEndTime: lastEndTime,
      });
    } else {
      //Currently do nothing
    }
  }


  /**
   * Copied from Pivot-Tiles
   * @param thisProps 
   * @param findMe 
   * @param findOp 
   */
  private getKeysLike(thisProps,findMe,findOp){
    //Sample call:  getKeysLike(this.props,"col","begins")
    //console.log('FoundProps that ' + findOp + ' with ' + findMe);
    //console.log(thisProps);
    const allKeys = Object.keys(thisProps);
    let foundKeys = [];
    const lFind = findMe.length;

    findMe = findMe.toLowerCase();
    findOp = findOp.toLowerCase();

    if (findOp==="begins") {
      foundKeys = allKeys.filter(k => k.toLowerCase().indexOf(findMe) === 0);
    } else if (findOp === "ends") {
      foundKeys = allKeys.filter(k => k.toLowerCase().indexOf(findMe) === ( k.length - lFind));
    } else {
      foundKeys = allKeys.filter(k => k.toLowerCase().indexOf(findMe) > -1);
    }

    let foundProps = [];
    for (let thisProp of foundKeys) {
      if (thisProp && thisProp !== "" ) { foundProps.push(thisProps[thisProp]) ; }
    }

    return foundProps;
  }

/***
 *          .o88b. db   db  .d8b.  d8888b. d888888b      d8888b.  .d8b.  d888888b  .d8b.  
 *         d8P  Y8 88   88 d8' `8b 88  `8D `~~88~~'      88  `8D d8' `8b `~~88~~' d8' `8b 
 *         8P      88ooo88 88ooo88 88oobY'    88         88   88 88ooo88    88    88ooo88 
 *         8b      88~~~88 88~~~88 88`8b      88         88   88 88~~~88    88    88~~~88 
 *         Y8b  d8 88   88 88   88 88 `88.    88         88  .8D 88   88    88    88   88 
 *          `Y88P' YP   YP YP   YP 88   YD    YP         Y8888D' YP   YP    YP    YP   YP 
 *                                                                                        
 *                                                                                        
 */


 /**
  * 
  * @param who  Filter for who's data to read in
  * @param what TBD but goal would be like Categories of some sort
  * @param when TBD but Time Period
  * @param scale TBD but would be like maybe Days, Weeks, Months etc..
  * @param isSum Default is to count.  If True, it sums values
  */
  //processChartData('all',['catA','catB'])
  public processChartData(who: string, what: string[], when: number, scale: string, isSum: boolean | false ){

    function createISeries(title): IChartSeries {
      return {
        title: title,
        values: [],
        labels: [],
        total: 0,
      };
    }

    let sourceData: ITimeEntry[] = this.state.entries[who];

    let chartPreData: IChartData = {
      thisYear: [createISeries(who + ' This Year (mo)'),createISeries('This Year (wk)')],
      thisMonth: [createISeries(who + ' This Month')],
      thisWeek: [createISeries(who + ' This Week')],
    };
    let chartPostData: IChartData = {};

    let chartDataVal: number [] = [];   
    let chartDataLabel: any [] = []; 
    let runningTotal: number = 0;

    for ( let item of sourceData) {
      //
      let dur = Number(item.duration); //Hours per entry
      let theTime = item.thisTimeObj;
      runningTotal += dur;
      //console.log('theTime:',item.id,runningTotal, item.startTime,theTime.year,theTime.month,theTime.week,theTime.date,theTime.day,theTime.hour,theTime.isThisYear,theTime.isThisMonth,theTime.isThisWeek,theTime.isToday);


      if (item.thisTimeObj.isThisYear) {
        //Build up yearData Series 0
        let yearDataM = chartPreData.thisYear[0];
        //console.log('yearData',yearDataM);
        if ( yearDataM.values[item.thisTimeObj.month] == null ) { yearDataM.values[item.thisTimeObj.month] = 0; }
        yearDataM.values[item.thisTimeObj.month] += isSum ? dur : 1;
        yearDataM.total += isSum ? dur : 1;

        //Build up yearData Series 1
        let yearDataW = chartPreData.thisYear[1];
        //console.log('yearData',yearDataW);
        if ( yearDataW.values[item.thisTimeObj.week] == null ) { yearDataW.values[item.thisTimeObj.week] = 0; }
        yearDataW.values[item.thisTimeObj.week] += isSum ? dur : 1;
        yearDataW.total += isSum ? dur : 1;
      }
 
      if (item.thisTimeObj.isThisMonth) {
        //Build up monthData Series 0
        let monthData = chartPreData.thisMonth[0];
        //console.log('yearData',monthData);
        if ( monthData.values[item.thisTimeObj.date] == null ) { monthData.values[item.thisTimeObj.date] = 0; }
        monthData.values[item.thisTimeObj.date] += isSum ? dur : 1;
        monthData.total += isSum ? dur : 1;
      }

      if (item.thisTimeObj.isThisWeek) {
        //Build up weekData Series 0
        let weekData = chartPreData.thisWeek[0];
        //console.log('yearData',weekData);
        if ( weekData.values[item.thisTimeObj.day] == null ) { weekData.values[item.thisTimeObj.day] = 0; }
        weekData.values[item.thisTimeObj.day] += isSum ? dur : 1;
        weekData.total += isSum ? dur : 1;
      }

      //console.log('chartPreData',chartPreData);

    }




/*
*/

    function addLabels(series: IChartSeries, labels: string, firstIndex: number) {
      let labelArray = labels.split(';');
      //console.log('labelArray:', labelArray);
      chartDataLabel = Object.keys(series['values']);
      console.log('chartDataLabel',chartDataLabel);
      let newValues : number[] = [];
      let newLabels : string[] = [];
      for ( let item of chartDataLabel) {
        let label = '';
        if ( item != null ) {
          if (firstIndex < 4 ) { //This is a relative index
            label = labelArray[Number(item) + firstIndex];
          } else if ( firstIndex === 52) { //Just conver to a number version of the index
            label = ("0" + item).slice(-2) ;
          } else { //Must be an error but put the label as itself
            console.log('unknown label conversion error:', series, labels,firstIndex);
            label = item;
          }
          newValues.push(series.values[item]);
          newLabels.push(label);
        }
      }
      series.labels = newLabels;
      series.values = newValues;
      return series;
    }


    chartPreData.thisYear[0] = addLabels(chartPreData.thisYear[0],monthStr3['en-us'].join(';'),0); //Months of year
    chartPreData.thisYear[1] = addLabels(chartPreData.thisYear[1],weekday3['en-us'].join(';'),52); // Week Numbers of Year
    chartPreData.thisMonth[0] = addLabels(chartPreData.thisMonth[0],weekday3['en-us'].join(';'),52);  // Days of Month
    chartPreData.thisWeek[0] = addLabels(chartPreData.thisWeek[0],weekday3['en-us'].join(';'),0);  // Days of the week



     console.log('chartPreData',chartPreData);
  //   console.log('chartDataVal',chartDataVal);

    this.setState({ 
      loadOrder: this.state.loadOrder + ' > Charts',
      chartData: chartPreData,
    //  chartData: chartData,
     });  

  //  console.log('chartData', chartData);

    return;

  }






  /***
 *          d888b  d88888b d8b   db d88888b d8888b.  .d8b.  db                           
 *         88' Y8b 88'     888o  88 88'     88  `8D d8' `8b 88                           
 *         88      88ooooo 88V8o 88 88ooooo 88oobY' 88ooo88 88                           
 *         88  ooo 88~~~~~ 88 V8o88 88~~~~~ 88`8b   88~~~88 88                           
 *         88. ~8~ 88.     88  V888 88.     88 `88. 88   88 88booo.                      
 *          Y888P  Y88888P VP   V8P Y88888P 88   YD YP   YP Y88888P                      
 *                                                                                       
 *                                                                                       
 *         d88888b db    db  .o88b. d8b   db d888888b d888888b  .d88b.  d8b   db .d8888. 
 *         88'     88    88 d8P  Y8 888o  88 `~~88~~'   `88'   .8P  Y8. 888o  88 88'  YP 
 *         88ooo   88    88 8P      88V8o 88    88       88    88    88 88V8o 88 `8bo.   
 *         88~~~   88    88 8b      88 V8o88    88       88    88    88 88 V8o88   `Y8b. 
 *         88      88b  d88 Y8b  d8 88  V888    88      .88.   `8b  d8' 88  V888 db   8D 
 *         YP      ~Y8888P'  `Y88P' VP   V8P    YP    Y888888P  `Y88P'  VP   V8P `8888Y' 
 *                                                                                       
 *                                                                                       
 */

  /**
   * Copied from Pivot-Tiles
   * @param lookupColumns 
   */
  private getSelectColumns(lookupColumns){

    let baseSelectColumns = [];

    for (let thisColumn of lookupColumns) {
      // Only look at columns with / in the name
      if (thisColumn && thisColumn.indexOf("/") > -1 ) {
        let isLookup = thisColumn.indexOf("/");
        if(isLookup) {
          baseSelectColumns.push(thisColumn);
        }
      }
    }
    return baseSelectColumns;
  }

  /**
   * Copied from Pivot-Tiles
   * @param lookupColumns 
   */
  private getExpandColumns(lookupColumns){

    let baseExpandColumns = [];

    for (let thisColumn of lookupColumns) {
      // Only look at columns with / in the name
      if (thisColumn && thisColumn.indexOf("/") > -1 ) {
        let splitCol = thisColumn.split("/");
        let leftSide = splitCol[0];
        if(baseExpandColumns.indexOf(leftSide) < 0) {
          baseExpandColumns.push(leftSide);
        }
      }
    }
    return baseExpandColumns;
  }

}

