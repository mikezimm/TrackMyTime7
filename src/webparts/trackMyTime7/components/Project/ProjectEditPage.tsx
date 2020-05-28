import * as React from 'react';

import * as strings from 'TrackMyTime7WebPartStrings';

//import * as links from './AllLinks';

import { ITrackMyTime7Props } from '../ITrackMyTime7Props';
import { ITrackMyTime7State, IProjectOptions, IProject } from '../ITrackMyTime7State';

import { Fabric, Stack, IStackTokens, initializeIcons } from 'office-ui-fabric-react';
import {CommandBarButton,} from "office-ui-fabric-react/lib/Button";

import ButtonCompound from '../createButtons/ICreateButtons';
import { IButtonProps, ISingleButtonProps, IButtonState } from "../createButtons/ICreateButtons";
import { createIconButton } from "../createButtons/IconButton";

import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

import { IFormFields, IProjectFormFields, IFieldDef } from '../fields/fieldDefinitions';
import { dateConvention ,showMonthPickerAsOverlay,showWeekNumbers,timeConvention,showGoToToday,timeDisplayControlType} from '../fields/dateFieldBuilder';
import { DateTimePicker, DateConvention, TimeConvention, TimeDisplayControlType } from '@pnp/spfx-controls-react/lib/dateTimePicker';
import { Toggle, IToggleStyleProps, IToggleStyles } from 'office-ui-fabric-react/lib/Toggle';

import * as formBuilders from '../fields/textFieldBuilder';
import * as choiceBuilders from '../fields/choiceFieldBuilder';
import * as sliderBuilders from '../fields/sliderFieldBuilder';
import * as smartLinks from '../ActivityURL/ActivityURLMasks';
import * as dateBuilders from '../fields/dateFieldBuilder';
import { TextField,  IStyleFunctionOrObject, ITextFieldStyleProps, ITextFieldStyles } from "office-ui-fabric-react";

import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";

import { WebPartContext } from '@microsoft/sp-webpart-base';

import { Web } from "@pnp/sp/presets/all";

// Initialize icons in case this example uses them
initializeIcons();

import styles from './ProjectPage.module.scss';
import stylesT from '../TrackMyTime7.module.scss';

export enum ProjectMode { False, Edit, Copy, New }

export interface IProjectPageProps {
    showProjectScreen: ProjectMode;
    _closeProjectEdit: any;
    selectedProject: IProject;
    projectFields: IProjectFormFields;
    wpContext: WebPartContext;

    // 2 - Source and destination list information
    projectListTitle: string;
    projectListWeb: string;

}

export interface IProjectPageState {
    showProjectScreen?: ProjectMode;
    selectedProject?: IProject;
    showTask?:boolean;
    showActivity?: boolean;
    showReporting?: boolean;
    showPeople?: boolean;
    showAdvanced?: boolean;
    projectEditOptions?: string[];
}

const pageIDPref = 'ProjectTMT';
const colorReporting = {primary:'purple',light:'lavender'};
const colorTask = {primary:'darkgreen',light:'lightgreen'};
const colorPeople = {primary:'darkred',light:'#fdc0b9'};
const colorAdvanced = {primary:'#663500',light:'wheat'};
const colorActivity = {primary:'blue',light:'powderblue'};
const colorCC = {primary:'blue',light:'powderblue'};

const stackFormRowTokens: IStackTokens = { childrenGap: 10 };
const fieldWidth = 200;

const stylesToggleRoot = { width: 130, paddingTop: 13 } ; // { root: { width: 120, paddingTop: 13 } };
const stylesToggleBase = {root: stylesToggleRoot , pill: null, container: null, thumb: null, label: null};

//Syntax for adding const:  https://stackoverflow.com/a/52084409/4210807
const stylesReportToggle: IToggleStyles = { text: {color: colorReporting.primary, fontWeight: 700 } , ...stylesToggleBase };
const stylesTaskToggle: IToggleStyles = { text: {color: colorTask.primary, fontWeight: 700 } , ...stylesToggleBase };
const stylesPeopleToggle: IToggleStyles = { text: {color: colorPeople.primary, fontWeight: 700 } , ...stylesToggleBase };
const stylesAdvancedToggle: IToggleStyles = { text: {color: colorAdvanced.primary, fontWeight: 700 } , ...stylesToggleBase };
const stylesActivityToggle: IToggleStyles = { text: {color: colorActivity.primary, fontWeight: 700 } , ...stylesToggleBase };
const stylesCCToggle: IToggleStyles = { text: {color: colorCC.primary, fontWeight: 700 } , ...stylesToggleBase };

const statusChoices = [`0. Review`, `1. Plan`, `2. In Process`, `3. Verify`, `4. Complete`, `8. Parking lot`, `9. Cancelled`,`9. Closed`];
const activityTMTChoices = [`TMT Issue`, `Socialiis Issue`];

export function getChoiceKey(val: string) {

    if (val === null) {  
      console.log('getChoiceKey is null');
      return'valueIsNull'; }
    else if (val === undefined) {  
      console.log('getChoiceKey is undefined');
      return'valueIsNull'; }
    else {
      return val.replace(' ','SPACE').replace('.','DOT').replace('~','TILDE').replace('~','COMMA');
    }

}

export default class MyProjectPage extends React.Component<IProjectPageProps, IProjectPageState> {


  private createStateProject(showProjectScreen: ProjectMode, selectedProject: IProject) {

    let stateProject: IProject = JSON.parse(JSON.stringify(selectedProject));
    
    if ( showProjectScreen === ProjectMode.New) {

      stateProject.titleProject = null;

      //Reporting columns
      stateProject.category1 = null;
      stateProject.category2 = null;
      stateProject.projectID1.value = null;
      stateProject.projectID2.value = null;
      stateProject.story = null;
      stateProject.chapter = null;

      //Activity Columns
      stateProject.projOptions.type = null;
      stateProject.projOptions.activity = null;

      //People Columns
      stateProject.everyone = false;
      stateProject.leader = null;
      stateProject.team = null;

      //Task Columns
      stateProject.status = null;
      stateProject.dueDate = null;
      stateProject.completedDate = null;
      stateProject.completedBy = null;
      
      //Advanced Columns
      stateProject.ccEmail = null;
      stateProject.ccList = null;
      stateProject.projOptions.optionString = null;
      stateProject.sortOrder = null;

    } else if ( showProjectScreen === ProjectMode.Copy) {
      stateProject.titleProject = "Copy of " + stateProject.titleProject;
      stateProject.status = null;
      stateProject.dueDate = null;
      stateProject.completedDate = null;
      stateProject.completedBy = null;
      stateProject.projOptions.activity = null;
    } 

    return stateProject;

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

    constructor(props: IProjectPageProps) {
        super(props);

        let projectEditOptions = this.props.selectedProject.projOptions.projectEditOptions.split(';');
    
        this.state = {
            selectedProject: this.createStateProject(this.props.showProjectScreen, this.props.selectedProject),
            showProjectScreen : this.props.showProjectScreen,
            showTask: projectEditOptions.indexOf('task') > -1 ? true : false,
            showActivity: projectEditOptions.indexOf('activity') > -1 ? true : false,
            showReporting: projectEditOptions.indexOf('reporting') > -1 ? true : false,
            showPeople: projectEditOptions.indexOf('people') > -1 ? true : false,
            showAdvanced: projectEditOptions.indexOf('advanced') > -1 ? true : false,
            projectEditOptions: projectEditOptions,
          };

        this._genericFieldUpdate = this._genericFieldUpdate.bind(this);
        this._updateDueDate = this._updateDueDate.bind(this);
        this._updateCompleteDate = this._updateCompleteDate.bind(this);        

        this._updateLeader = this._updateLeader.bind(this);    
        this._updateTeam = this._updateTeam.bind(this);    

        this._updateCompletedBy = this._updateCompletedBy.bind(this);   

        this._updateStatusChange = this._updateStatusChange.bind(this);   

        this._updateActivityID = this._updateActivityID.bind(this);   
        this._updateActivityType = this._updateActivityType.bind(this);   
        
    }
        
    public componentDidMount() {
        //this._getListItems();
        
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

    public componentDidUpdate(prevProps: IProjectPageProps): void {
      //this._updateWebPart(prevProps);
    }


      /**
     * Set the current zone width
     */
    private _updateWebPart = (prevProps: IProjectPageProps) => {

      let projectEditOptions = this.props.selectedProject.projOptions.projectEditOptions.split(';');

        this.state = {
          selectedProject: this.createStateProject(this.props.showProjectScreen, this.props.selectedProject),
          showProjectScreen : this.props.showProjectScreen,
          showTask: projectEditOptions.indexOf('task') > -1 ? true : false,
          showActivity: projectEditOptions.indexOf('activity') > -1 ? true : false,
          showReporting: projectEditOptions.indexOf('reporting') > -1 ? true : false,
          showPeople: projectEditOptions.indexOf('people') > -1 ? true : false,
          showAdvanced: projectEditOptions.indexOf('advanced') > -1 ? true : false,
          projectEditOptions: projectEditOptions,
        };
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

    public render(): React.ReactElement<IProjectPageProps> {
        
        console.log('Rendering Project Edit Page');
        console.log('projectFields:', this.props.projectFields);
        console.log('props.selectedProject:', this.props.selectedProject);
        console.log('state:', this.state);
        console.log('state.selectedProject:', this.state.selectedProject);

        let isSaveButtonDisabled = false;
        let saveLabel = "Save";
        if (this.props.showProjectScreen === ProjectMode.New) { saveLabel = "Create New"; }
        if (this.props.showProjectScreen === ProjectMode.Edit) { saveLabel = "Update"; }
        if (this.props.showProjectScreen === ProjectMode.Copy) { saveLabel = "Save Copy"; }

        const buttons: ISingleButtonProps[] =
        [{  disabled: false,  checked: true, primary: false,
            label: "Cancel", buttonOnClick: this.cancelForm.bind(this),
        },{ 
            disabled: false,  checked: true, primary: false,
            label: "Reset form", buttonOnClick: this.clearForm.bind(this),
        },{
            disabled: isSaveButtonDisabled, checked: true, primary: true,
            label: saveLabel, buttonOnClick: this.saveProject.bind(this),
          },];

        let pageTitle = <div style={{ paddingTop: '0px' }}>
          <h2>{"Track My Time:  Project " + this.state.showProjectScreen }</h2>
          <h3>{ this.state.selectedProject === null ? 'New Project' : this.state.selectedProject.titleProject}</h3>
        </div>;

        let saveButtons = 
        <div style={{ paddingTop: '20px' }}>
            <ButtonCompound
            buttons={buttons} horizontal={true}
            />
        </div>;

        let columnToggles = this.buildToggles(true);
        let projectTitle = this.buildProjectTtitle(true);
        let reportingFields = this.state.showReporting ? this.buildReportingFields(true) : null;
        let advancedFields = this.state.showAdvanced ? this.buildAdvancedFields(true) : null;
        let taskFields = this.state.showTask ? this.buildTaskFields(true) : null;
        let activityFields = this.state.showActivity ? this.buildActivityFields(true) : null;
        //let peopleFields = this.state.showPeople ? this.buildPeopleFields(true) : null;

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

        // <div className={ styles.container }></div>
        return (
        <div className={ styles.projectPage }>
            { pageTitle }
            { columnToggles }
            { projectTitle }
            <Stack horizontal={true} wrap={true} horizontalAlign={"center"} tokens={stackFormRowTokens}>{/* Stack for Buttons and Fields */}
              { reportingFields }
              { /*peopleFields*/ }  
            </Stack>
            <Stack horizontal={true} wrap={true} horizontalAlign={"center"} tokens={stackFormRowTokens}>{/* Stack for Buttons and Fields */}
 
                { activityFields }  
                { taskFields }  
                { advancedFields }   
            </Stack>    
            { saveButtons }
        </div>
        );

    }


    /***
 *    d8888b. db    db d888888b d888888b  .d88b.  d8b   db      d88888b db    db d8b   db  .o88b. d888888b d888888b  .d88b.  d8b   db .d8888. 
 *    88  `8D 88    88 `~~88~~' `~~88~~' .8P  Y8. 888o  88      88'     88    88 888o  88 d8P  Y8 `~~88~~'   `88'   .8P  Y8. 888o  88 88'  YP 
 *    88oooY' 88    88    88       88    88    88 88V8o 88      88ooo   88    88 88V8o 88 8P         88       88    88    88 88V8o 88 `8bo.   
 *    88~~~b. 88    88    88       88    88    88 88 V8o88      88~~~   88    88 88 V8o88 8b         88       88    88    88 88 V8o88   `Y8b. 
 *    88   8D 88b  d88    88       88    `8b  d8' 88  V888      88      88b  d88 88  V888 Y8b  d8    88      .88.   `8b  d8' 88  V888 db   8D 
 *    Y8888P' ~Y8888P'    YP       YP     `Y88P'  VP   V8P      YP      ~Y8888P' VP   V8P  `Y88P'    YP    Y888888P  `Y88P'  VP   V8P `8888Y' 
 *                                                                                                                                            
 *                                                                                                                                            
 */


    private cancelForm() {
        console.log('canceled form');
        this.props._closeProjectEdit();
    }

    private clearForm() {
        console.log('cleared form');
        let selectedProject = this.createStateProject(this.props.showProjectScreen, this.props.selectedProject);
        this.setState({ selectedProject: selectedProject });
        alert('Project form has been reset to how it started.');
        //this.props._closeProjectEdit();
    }

    private saveProject() {
        console.log('saved form');

        let saveTest: any = false;
        let didProjectChange = false;
        let didTogglesChange = false;
        let currentProjOptions = '';
        if ( this.state.showActivity) {currentProjOptions += 'activity;'; }
        if ( this.state.showAdvanced) {currentProjOptions += 'advanced;'; }
        if ( this.state.showPeople) {currentProjOptions += 'people;'; }
        if ( this.state.showReporting) {currentProjOptions += 'reporting;'; }
        if ( this.state.showTask) {currentProjOptions += 'task;'; }

        if ( currentProjOptions.length > 0 ) { currentProjOptions = currentProjOptions.substring(0,currentProjOptions.length -1) ; }

        if ( currentProjOptions !== this.props.selectedProject.projOptions.projectEditOptions ) {
          didTogglesChange = true;
          alert('Project Edit Options have changed!');

        }

        if (JSON.stringify(this.props.selectedProject) !== JSON.stringify(this.state.selectedProject) ) { 
          didProjectChange = true;
          alert('Something has changed!  Not saving anything.');

        } 
        
        if ( saveTest ) {

          let saveProject = this.buildProjectToSave(this.props.selectedProject, this.state.selectedProject, this.props.showProjectScreen );
          /*
          const projectWeb = Web(this.props.projectListWeb);
  
          projectWeb.lists.getByTitle(this.props.projectListTitle).items.add().then((response) => {
  
          });
  
          this.props._closeProjectEdit();
          */
        }


    }

    private buildProjectToSave( oldProject: IProject, newProject: IProject, mode: ProjectMode ){

      let saveItem: any = { };
      saveItem = this.saveThisField( this.props.projectFields.Title, oldProject, newProject, mode);

    }

    private saveThisField( field:  IFieldDef, oldProject: IProject, newProject: IProject, mode: ProjectMode ) {


    }

/***
 *    d8888b. db    db d888888b db      d8888b.      d88888b d888888b d88888b db      d8888b. .d8888. 
 *    88  `8D 88    88   `88'   88      88  `8D      88'       `88'   88'     88      88  `8D 88'  YP 
 *    88oooY' 88    88    88    88      88   88      88ooo      88    88ooooo 88      88   88 `8bo.   
 *    88~~~b. 88    88    88    88      88   88      88~~~      88    88~~~~~ 88      88   88   `Y8b. 
 *    88   8D 88b  d88   .88.   88booo. 88  .8D      88        .88.   88.     88booo. 88  .8D db   8D 
 *    Y8888P' ~Y8888P' Y888888P Y88888P Y8888D'      YP      Y888888P Y88888P Y88888P Y8888D' `8888Y' 
 *                                                                                                    
 *                                                                                                    
 */

    private createTextField(field: IFieldDef, _onChange: any, getStyles : IStyleFunctionOrObject<ITextFieldStyleProps, ITextFieldStyles>) {
        let defaultValue = null;
        if (field.name === "category1" || field.name === "category2" )  { defaultValue = this.state.selectedProject[field.name] === null ? '' : this.state.selectedProject[field.name].join(';'); }
        else if (field.name === "projectID1" || field.name === "projectID2" )  { defaultValue = this.state.selectedProject[field.name].value; }
        else if (field.name === "timeTarget" )  { 
            defaultValue = this.state.selectedProject[field.name] === null ? '' : this.state.selectedProject[field.name].value;
            console.log('createTextField: ' + field.name,this.state.selectedProject );
         }
         else if (field.name === "optionString")  { 
            defaultValue = this.state.selectedProject[field.name] === null ? '' : this.state.selectedProject.projOptions.optionString;
            console.log('createTextField: ' + field.name,this.state.selectedProject );

         } else if (field.name === "activity") {
            defaultValue = this.state.selectedProject[field.name] === null ? '' : this.state.selectedProject.projOptions.activity;

        } 
        else if (field.type === 'Text') { defaultValue = this.state.selectedProject[field.name]; }
        else if (field.type === 'Smart') { defaultValue = this.state.selectedProject[field.name].value; }
        else if (field.type === 'Time') { defaultValue = this.state.selectedProject[field.name].value; }
        else if (field.type === 'Link') { defaultValue = this.state.selectedProject[field.name].value; }

        let thisField = <div id={ pageIDPref + field.column }><TextField
            className={ stylesT.textField }
            styles={ getStyles  } //this.getReportingStyles
            defaultValue={ defaultValue }
            label={ field.title }
            autoComplete='off'
            onChanged={ _onChange }
        /></div>;

        return thisField;
    }

    private createDateField(field: IFieldDef, _onChange: any, getStyles : IStyleFunctionOrObject<ITextFieldStyleProps, ITextFieldStyles>) {

        let timeStamp = this.state.selectedProject[field.name];
        if (timeStamp != null) { timeStamp = new Date(timeStamp); }

        return (
            // Uncontrolled
            <div id={ pageIDPref + field.column } style={{ width: fieldWidth }}>
            
            <DateTimePicker 
                label={field.title}
                value={timeStamp}
                onChange={_onChange}
                dateConvention={DateConvention.Date} showMonthPickerAsOverlay={showMonthPickerAsOverlay}
                showWeekNumbers={showWeekNumbers} timeConvention={timeConvention}
                showGoToToday={showGoToToday} timeDisplayControlType={timeDisplayControlType}
                showLabels={false}

    
            /></div>
        );

    }

    private createPeopleField(field: IFieldDef, maxCount: number, _onChange: any, getStyles : IStyleFunctionOrObject<ITextFieldStyleProps, ITextFieldStyles>) {

        return (
            // Uncontrolled
            <div id={ pageIDPref + field.column } style={{ width: fieldWidth }}>
                <PeoplePicker
                    context={this.props.wpContext}
                    //defaultSelectedUsers?: string[];
                    titleText={ field.title }
                    personSelectionLimit={maxCount}
                    //groupName={"Team Site Owners"} // Leave this blank in case you want to filter from all users
                    showtooltip={false}
                    isRequired={false}
                    disabled={false}
                    selectedItems={_onChange}
                    showHiddenInUI={false}
                    principalTypes={[PrincipalType.User]}
                    resolveDelay={1000} 
                    ensureUser={true}
                /></div>
        );

    }

    private _createDropdownField(field: IFieldDef, choices: string[], _onChange: any, getStyles : IStyleFunctionOrObject<ITextFieldStyleProps, ITextFieldStyles>) {
        const dropdownStyles: Partial<IDropdownStyles> = {
            dropdown: { width: fieldWidth }
          };



          let sOptions: IDropdownOption[] = choices == null ? null : 
            choices.map(val => {
                  return {
                      key: getChoiceKey(val),
                      text: val,
                  };
              });

          let keyVal = null;
          if ( field.name === "status" ) { keyVal = this.state.selectedProject[field.name]; } 
          if ( field.name === "activityType" ) { keyVal = this.state.selectedProject.projOptions.type; } 

          let thisDropdown = sOptions == null ? null : <div
              //style={{  paddingTop: 10  }}
                ><Dropdown 
                label={ field.title }
                selectedKey={ getChoiceKey(keyVal) }
                onChange={ _onChange }
                options={ sOptions } 
                styles={ dropdownStyles }
              />
            </div>;

        return thisDropdown;

    }

        
    private buildSimpleToggle( thisLabel, _onChange: any, checked: boolean, thisStyle: IToggleStyles ) {
      let toggleTask = <div id={ pageIDPref + thisLabel }>
        <Toggle label="" 
          onText={ thisLabel } 
          offText={ thisLabel } 
          onChange={ _onChange } 
          checked={ checked }
          styles={ thisStyle }
        /></div>;

      return toggleTask;
    }

    /***
 *    d8888b. db    db d888888b db      d8888b.      d888888b  .d88b.   d888b   d888b  db      d88888b .d8888. 
 *    88  `8D 88    88   `88'   88      88  `8D      `~~88~~' .8P  Y8. 88' Y8b 88' Y8b 88      88'     88'  YP 
 *    88oooY' 88    88    88    88      88   88         88    88    88 88      88      88      88ooooo `8bo.   
 *    88~~~b. 88    88    88    88      88   88         88    88    88 88  ooo 88  ooo 88      88~~~~~   `Y8b. 
 *    88   8D 88b  d88   .88.   88booo. 88  .8D         88    `8b  d8' 88. ~8~ 88. ~8~ 88booo. 88.     db   8D 
 *    Y8888P' ~Y8888P' Y888888P Y88888P Y8888D'         YP     `Y88P'   Y888P   Y888P  Y88888P Y88888P `8888Y' 
 *                                                                                                             
 *                                                                                                             
 */


private buildToggles(isVisible: boolean) {

  let toggleTask = this.buildSimpleToggle('Task', this._updateToggleState.bind(this) , this.state.showTask, stylesTaskToggle );
  let toggleActivity = this.buildSimpleToggle('Activity', this._updateToggleState.bind(this) , this.state.showActivity, stylesActivityToggle );
  let toggleReporting = this.buildSimpleToggle('Reporting', this._updateToggleState.bind(this) , this.state.showReporting, stylesReportToggle );
  let togglePeople = this.buildSimpleToggle('People', this._updateToggleState.bind(this) , this.state.showPeople, stylesPeopleToggle );
  let toggleAdvanced = this.buildSimpleToggle('Advanced', this._updateToggleState.bind(this) , this.state.showAdvanced, stylesAdvancedToggle );

  let fields =
  <div style={{ backgroundColor: 'lightGray', padding: 10, paddingBottom: 20  }} className={styles.toggleRow}>
  <Stack horizontal={true} wrap={true} horizontalAlign={ "space-evenly"} tokens={stackFormRowTokens}>{/* Stack for Buttons and Fields */}

  { toggleReporting }
  { togglePeople }
  { toggleActivity }
  { toggleTask }
  { toggleAdvanced }
  </Stack></div>;  {/* Stack for Buttons and Fields */}

  return fields;

}


private _updateToggleState(ev: EventTarget){
  var element2 = event.target as HTMLElement;
  var element3 = event.currentTarget as HTMLElement;
  let fieldID = this._findNamedElementID(element2);
  if (fieldID == null ) { fieldID = this._findNamedElementID(element3); } 
  if( this.state['show' + fieldID] === null ) {
      alert('Had some kind of problem with this.props.projectFields[' + fieldID + ']'); 
      console.log('_genericFieldUpdate projectFields error:', fieldID, this.props.projectFields);
  }
  let thisProp = !this.state['show' + fieldID];
  //selectedProject.titleProject = newValue;
  console.log('_updateToggleTask: to ', fieldID, thisProp, ev);
  if (fieldID === 'Reporting' && thisProp === false) {
    this.setState({ ['show' + fieldID]: thisProp, showPeople: false });

  } else if (fieldID === 'People'  && thisProp === true) {
    this.setState({ ['show' + fieldID]: thisProp, showReporting: true });
  } else {
    this.setState({ ['show' + fieldID]: thisProp });
  }

}



/***
 *    d888888b d888888b d888888b db      d88888b      d88888b d888888b d88888b db      d8888b. .d8888. 
 *    `~~88~~'   `88'   `~~88~~' 88      88'          88'       `88'   88'     88      88  `8D 88'  YP 
 *       88       88       88    88      88ooooo      88ooo      88    88ooooo 88      88   88 `8bo.   
 *       88       88       88    88      88~~~~~      88~~~      88    88~~~~~ 88      88   88   `Y8b. 
 *       88      .88.      88    88booo. 88.          88        .88.   88.     88booo. 88  .8D db   8D 
 *       YP    Y888888P    YP    Y88888P Y88888P      YP      Y888888P Y88888P Y88888P Y8888D' `8888Y' 
 *                                                                                                     
 *                                                                                                     
 */

  private buildProjectTtitle(isVisible: boolean) {

    let title = <div style= {{ paddingBottom: 20 }}>
      <TextField
        defaultValue={ this.state.selectedProject.titleProject }
        label={ this.props.projectFields.Title.title }
        placeholder={ "Enter " + this.props.projectFields.Title.title }
        autoComplete='off'
        onChanged={ this._updateProjectTitle.bind(this) }
        required={ true }
    /></div>;

    return title;
  }

  private _updateProjectTitle(newValue: string){
    let ev = event.target;
    let selectedProject = this.state.selectedProject;
    if ( newValue == '') { newValue = null; }
    selectedProject.titleProject = newValue;
    this.setState({ selectedProject: selectedProject });
  }

/***
 *    d8888b. d88888b d8888b.  .d88b.  d8888b. d888888b d888888b d8b   db  d888b       d88888b d888888b d88888b db      d8888b. .d8888. 
 *    88  `8D 88'     88  `8D .8P  Y8. 88  `8D `~~88~~'   `88'   888o  88 88' Y8b      88'       `88'   88'     88      88  `8D 88'  YP 
 *    88oobY' 88ooooo 88oodD' 88    88 88oobY'    88       88    88V8o 88 88           88ooo      88    88ooooo 88      88   88 `8bo.   
 *    88`8b   88~~~~~ 88~~~   88    88 88`8b      88       88    88 V8o88 88  ooo      88~~~      88    88~~~~~ 88      88   88   `Y8b. 
 *    88 `88. 88.     88      `8b  d8' 88 `88.    88      .88.   88  V888 88. ~8~      88        .88.   88.     88booo. 88  .8D db   8D 
 *    88   YD Y88888P 88       `Y88P'  88   YD    YP    Y888888P VP   V8P  Y888P       YP      Y888888P Y88888P Y88888P Y8888D' `8888Y' 
 *                                                                                                                                      
 *                                                                                                                                      
 */

    //Format copied from:  https://developer.microsoft.com/en-us/fluentui#/controls/web/textfield
    private getReportingStyles( props: ITextFieldStyleProps): Partial<ITextFieldStyles> {
        const { required } = props;
        return { fieldGroup: [ { width: fieldWidth }, { borderColor: colorReporting.primary, }, ], };
    }


  private buildReportingFields(isVisible: boolean) {

    let category1 = this.createTextField(this.props.projectFields.Category1, this._genericFieldUpdate.bind(this), this.getReportingStyles );
    let category2 = this.createTextField(this.props.projectFields.Category2, this._genericFieldUpdate.bind(this), this.getReportingStyles );
    let projectID1 = this.createTextField(this.props.projectFields.ProjectID1, this._genericFieldUpdate.bind(this), this.getReportingStyles );
    let projectID2 = this.createTextField(this.props.projectFields.ProjectID2, this._genericFieldUpdate.bind(this), this.getReportingStyles );
    let chapter = this.createTextField(this.props.projectFields.Chapter, this._genericFieldUpdate.bind(this), this.getReportingStyles );
    let story = this.createTextField(this.props.projectFields.Story, this._genericFieldUpdate.bind(this), this.getReportingStyles );

    let peopleFields = this.state.showPeople ? this.buildPeopleFields(true) : null;

    let fields =
    <div style={{ backgroundColor: colorReporting.light, padding: 10, paddingBottom: 20, display: 'inline-block' }}>
    <Stack horizontal={true} wrap={true} horizontalAlign={"center"} tokens={stackFormRowTokens}>{/* Stack for Buttons and Fields */}
      <Stack horizontal={false} wrap={true} horizontalAlign={"center"} tokens={stackFormRowTokens}>{/* Stack for Buttons and Fields */}
        { category1 }
        { category2 }
      </Stack>
      <Stack horizontal={false} wrap={true} horizontalAlign={"center"} tokens={stackFormRowTokens}>{/* Stack for Buttons and Fields */}
      { projectID1 }
      { projectID2 }
      </Stack>
      <Stack horizontal={false} wrap={true} horizontalAlign={"center"} tokens={stackFormRowTokens}>{/* Stack for Buttons and Fields */}
        { story }
        { chapter }
      </Stack>
      { peopleFields }
    </Stack></div>;  {/* Stack for Buttons and Fields */}

    return fields;

  }

  /***
 *    d8888b. d88888b  .d88b.  d8888b. db      d88888b      d88888b d888888b d88888b db      d8888b. .d8888. 
 *    88  `8D 88'     .8P  Y8. 88  `8D 88      88'          88'       `88'   88'     88      88  `8D 88'  YP 
 *    88oodD' 88ooooo 88    88 88oodD' 88      88ooooo      88ooo      88    88ooooo 88      88   88 `8bo.   
 *    88~~~   88~~~~~ 88    88 88~~~   88      88~~~~~      88~~~      88    88~~~~~ 88      88   88   `Y8b. 
 *    88      88.     `8b  d8' 88      88booo. 88.          88        .88.   88.     88booo. 88  .8D db   8D 
 *    88      Y88888P  `Y88P'  88      Y88888P Y88888P      YP      Y888888P Y88888P Y88888P Y8888D' `8888Y' 
 *                                                                                                           
 *                                                                                                           
 */

private getPeopleStyles( props: ITextFieldStyleProps): Partial<ITextFieldStyles> {
    const { required } = props;
    return { fieldGroup: [ { width: fieldWidth }, { borderColor: colorPeople.primary, }, ], };
}

private buildPeopleFields(isVisible: boolean) {

  let toggleEveryone = <Toggle label="" 
    onText={ 'Everyone' } 
    offText={ 'Everyone' } 
    onChange={this._updateEveryone.bind(this)} 
    checked={this.state.selectedProject.everyone}
    styles={{ root: { width: fieldWidth, paddingTop: 13, } }}
  />;

    //let everyone = this.createTextField(this.props.projectFields.Everyone, this._genericFieldUpdate.bind(this), this.getPeopleStyles );
    let leader = this.createPeopleField(this.props.projectFields.Leader, 1, this._updateLeader.bind(this), this.getPeopleStyles );
    let team = this.createPeopleField(this.props.projectFields.Team, 5, this._updateTeam.bind(this), this.getPeopleStyles );

    let fields =
    <div 
      style={{ backgroundColor: colorPeople.light, padding: 10, paddingBottom: 20 }}
    >
    <Stack horizontal={true} wrap={true} horizontalAlign={"center"} tokens={stackFormRowTokens}>{/* Stack for Buttons and Fields */}
        { toggleEveryone }
        <Stack horizontal={false} wrap={true} horizontalAlign={"center"} tokens={stackFormRowTokens}>{/* Stack for Buttons and Fields */}
          { leader }
          { team }
          {  }
        </Stack>
    </Stack></div>;  {/* Stack for Buttons and Fields */}

    return fields;

  }

  private _updateEveryone(){
    let selectedProject = this.state.selectedProject;
    selectedProject.everyone = !selectedProject.everyone;
    console.log('_updateEveryone set to:', selectedProject.everyone);
    this.setState({ selectedProject: selectedProject });
  }
  
  private _updateLeader(newValue){
    let selectedProject = this.state.selectedProject;
    //selectedProject.leader = newValue;
    console.log('_updateLeader:', newValue);
    this.setState({ selectedProject: selectedProject });
  }

  private _updateTeam(newValue){
    let selectedProject = this.state.selectedProject;
    //selectedProject.team = newValue;
    console.log('_updateTeam:', newValue);
    this.setState({ selectedProject: selectedProject });
  }  

 

 /***
 *     .d8b.   .o88b. d888888b d888888b db    db d888888b d888888b db    db      d88888b d888888b d88888b db      d8888b. .d8888. 
 *    d8' `8b d8P  Y8 `~~88~~'   `88'   88    88   `88'   `~~88~~' `8b  d8'      88'       `88'   88'     88      88  `8D 88'  YP 
 *    88ooo88 8P         88       88    Y8    8P    88       88     `8bd8'       88ooo      88    88ooooo 88      88   88 `8bo.   
 *    88~~~88 8b         88       88    `8b  d8'    88       88       88         88~~~      88    88~~~~~ 88      88   88   `Y8b. 
 *    88   88 Y8b  d8    88      .88.    `8bd8'    .88.      88       88         88        .88.   88.     88booo. 88  .8D db   8D 
 *    YP   YP  `Y88P'    YP    Y888888P    YP    Y888888P    YP       YP         YP      Y888888P Y88888P Y88888P Y8888D' `8888Y' 
 *                                                                                                                                
 *                                                                                                                                
 */

private getActivityStyles( props: ITextFieldStyleProps): Partial<ITextFieldStyles> {
    const { required } = props;
    return { fieldGroup: [ { width: fieldWidth }, { borderColor: colorActivity.primary, }, ], };
}

private buildActivityFields(isVisible: boolean) {
    let activityType = this._createDropdownField(this.props.projectFields.ActivityType, activityTMTChoices, this._updateActivityType.bind(this), this.getActivityStyles );
    let activity = this.createTextField(this.props.projectFields.ActivityTMT, this._updateActivityID.bind(this), this.getActivityStyles );

    let fields =
    <div 
    //    <div style={{ backgroundColor: colorTask.light, padding: 10, paddingBottom: 20 }}>
      style={{ backgroundColor: colorActivity.light, padding: 10, paddingBottom: 20 }}
    >
    <Stack horizontal={false} wrap={true} horizontalAlign={"center"} tokens={stackFormRowTokens}>{/* Stack for Buttons and Fields */}
        { activityType }
        { activity }
        {  }
        {  }
    </Stack></div>;  {/* Stack for Buttons and Fields */}

    return fields;

  }

  private _updateActivityType = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    console.log(`_updateStatusChange: ${item.text} ${item.selected ? 'selected' : 'unselected'}`);

    let selectedProject = this.state.selectedProject;
    selectedProject.projOptions.type = item.text === '' ? null : item.text;
    this.setState({ selectedProject: selectedProject });
  }

  private _updateActivityID ( ev: EventTarget )  {
    console.log(`_updateActivityID: ${ev}`);
    let fieldVal : any = ev;
    if (fieldVal === '') {  fieldVal = null ; }
    let selectedProject = this.state.selectedProject;
    selectedProject.projOptions.activity = fieldVal;
    this.setState({ selectedProject: selectedProject });
  }

 /***
 *    d888888b  .d8b.  .d8888. db   dD      d88888b d888888b d88888b db      d8888b. .d8888. 
 *    `~~88~~' d8' `8b 88'  YP 88 ,8P'      88'       `88'   88'     88      88  `8D 88'  YP 
 *       88    88ooo88 `8bo.   88,8P        88ooo      88    88ooooo 88      88   88 `8bo.   
 *       88    88~~~88   `Y8b. 88`8b        88~~~      88    88~~~~~ 88      88   88   `Y8b. 
 *       88    88   88 db   8D 88 `88.      88        .88.   88.     88booo. 88  .8D db   8D 
 *       YP    YP   YP `8888Y' YP   YD      YP      Y888888P Y88888P Y88888P Y8888D' `8888Y' 
 *                                                                                           
 *                                                                                           
 */

private getTaskStyles( props: ITextFieldStyleProps): Partial<ITextFieldStyles> {
    const { required } = props;
    return { fieldGroup: [ { width: fieldWidth }, { borderColor: colorTask.primary, }, ], };
}

private buildTaskFields(isVisible: boolean) {

    let status = this._createDropdownField(this.props.projectFields.StatusTMT, statusChoices, this._updateStatusChange.bind(this), this.getTaskStyles );
    let dueDate = this.createDateField(this.props.projectFields.DueDateTMT, this._updateDueDate.bind(this), this.getTaskStyles );
    let completedDate = this.createDateField(this.props.projectFields.CompletedDateTMT, this._updateCompleteDate.bind(this), this.getTaskStyles );
    let completedBy = this.createPeopleField(this.props.projectFields.CompletedByTMT, 1, this._updateCompletedBy.bind(this), this.getPeopleStyles );

    let fields =
    <div style={{ backgroundColor: colorTask.light, padding: 10, paddingBottom: 20 }}>
    <Stack horizontal={true} wrap={true} horizontalAlign={"center"} tokens={stackFormRowTokens}>{/* Stack for Buttons and Fields */}
      <Stack horizontal={false} wrap={false} horizontalAlign={"center"} tokens={stackFormRowTokens}>{/* Stack for Buttons and Fields */}
          { status }
          { dueDate }
        </Stack>
        <Stack horizontal={false} wrap={false} horizontalAlign={"center"} tokens={stackFormRowTokens}>{/* Stack for Buttons and Fields */}
          { completedDate }
          { completedBy }
        </Stack>
    </Stack></div>;  {/* Stack for Buttons and Fields */}

    return fields;

  }

  private _updateStatusChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    console.log(`_updateStatusChange: ${item.text} ${item.selected ? 'selected' : 'unselected'}`);

    let selectedProject = this.state.selectedProject;
    selectedProject.status = item.text === '' ? null : item.text;
    this.setState({ selectedProject: selectedProject });

 //   let storyIndex = this.state.chartData.stories.titles.indexOf(item.text);
 //   let storyTitle = storyIndex === -1 ? 'None' : this.state.chartData.stories.titles[storyIndex];

    //let thisStory = {key: storyTitle, text: storyTitle};
    //this.processChartData(this.state.selectedUser,['what??'],10,'string',thisStory, null, this.state.chartStringFilter );

    //this.props._updateStory({key: storyTitle, text: storyTitle});
    //let newUserFilter = this.state.userFilter;
    //NOTE:  This is a duplicate call under componentDidUpdate but is required to redraw charts on story change.
    //this.processChartData(newUserFilter,['what??'],10,'string',item, null);
  }

  private _updateCompletedBy(newValue){
    let selectedProject = this.state.selectedProject;
    //selectedProject.team = newValue;
    console.log('_updateCompletedBy:', newValue);
    this.setState({ selectedProject: selectedProject });
  }  

  private _updateDueDate(newValue: string){
    let selectedProject = this.state.selectedProject;
    selectedProject.dueDate = newValue != null ? new Date(newValue) : null;
    this.setState({ selectedProject: selectedProject });
  }

  private _updateCompleteDate(newValue: string){
    let selectedProject = this.state.selectedProject;
    selectedProject.completedDate = newValue != null ? new Date(newValue) : null;
    this.setState({ selectedProject: selectedProject });
  }  

/***
 *     .d8b.  d8888b. db    db  .d8b.  d8b   db  .o88b. d88888b d8888b.      d88888b d888888b d88888b db      d8888b. .d8888. 
 *    d8' `8b 88  `8D 88    88 d8' `8b 888o  88 d8P  Y8 88'     88  `8D      88'       `88'   88'     88      88  `8D 88'  YP 
 *    88ooo88 88   88 Y8    8P 88ooo88 88V8o 88 8P      88ooooo 88   88      88ooo      88    88ooooo 88      88   88 `8bo.   
 *    88~~~88 88   88 `8b  d8' 88~~~88 88 V8o88 8b      88~~~~~ 88   88      88~~~      88    88~~~~~ 88      88   88   `Y8b. 
 *    88   88 88  .8D  `8bd8'  88   88 88  V888 Y8b  d8 88.     88  .8D      88        .88.   88.     88booo. 88  .8D db   8D 
 *    YP   YP Y8888D'    YP    YP   YP VP   V8P  `Y88P' Y88888P Y8888D'      YP      Y888888P Y88888P Y88888P Y8888D' `8888Y' 
 *                                                                                                                            
 *                                                                                                                            
 */

 
    //Format copied from:  https://developer.microsoft.com/en-us/fluentui#/controls/web/textfield
    private getAdvancedStyles( props: ITextFieldStyleProps): Partial<ITextFieldStyles> {
        const { required } = props;
        return { fieldGroup: [ { width: fieldWidth }, { borderColor: colorAdvanced.primary, }, ], };
    }

  private buildAdvancedFields(isVisible: boolean) {

    let email = this.createTextField(this.props.projectFields.CCEmail, this._genericFieldUpdate.bind(this), this.getAdvancedStyles );
    let list = this.createTextField(this.props.projectFields.CCList, this._genericFieldUpdate.bind(this), this.getAdvancedStyles );
    let options = this.createTextField(this.props.projectFields.OptionsTMT, this._genericFieldUpdate.bind(this), this.getAdvancedStyles );
    let timetarget = this.createTextField(this.props.projectFields.TimeTarget, this._genericFieldUpdate.bind(this), this.getAdvancedStyles );
    let sort = this.createTextField(this.props.projectFields.SortOrder, this._genericFieldUpdate.bind(this), this.getAdvancedStyles );

    let fields =
    <div style={{ backgroundColor: colorAdvanced.light, padding: 10, paddingBottom: 20 }}>
    <Stack horizontal={true} wrap={true} horizontalAlign={"center"} tokens={stackFormRowTokens}>{/* Stack for Buttons and Fields */}
      <Stack horizontal={false} wrap={true} horizontalAlign={"center"} tokens={stackFormRowTokens}>{/* Stack for Buttons and Fields */}
        { email }
        { list }
      </Stack>
      <Stack horizontal={false} wrap={true} horizontalAlign={"center"} tokens={stackFormRowTokens}>{/* Stack for Buttons and Fields */}
        { options }
        { timetarget }
        { sort }
      </Stack>
    </Stack></div>;  {/* Stack for Buttons and Fields */}

    return fields;

  }

 
  /***
 *     d888b  d88888b d8b   db d88888b d8888b. d888888b  .o88b.      d88888b d888888b d88888b db      d8888b.      db    db d8888b. d8888b.  .d8b.  d888888b d88888b 
 *    88' Y8b 88'     888o  88 88'     88  `8D   `88'   d8P  Y8      88'       `88'   88'     88      88  `8D      88    88 88  `8D 88  `8D d8' `8b `~~88~~' 88'     
 *    88      88ooooo 88V8o 88 88ooooo 88oobY'    88    8P           88ooo      88    88ooooo 88      88   88      88    88 88oodD' 88   88 88ooo88    88    88ooooo 
 *    88  ooo 88~~~~~ 88 V8o88 88~~~~~ 88`8b      88    8b           88~~~      88    88~~~~~ 88      88   88      88    88 88~~~   88   88 88~~~88    88    88~~~~~ 
 *    88. ~8~ 88.     88  V888 88.     88 `88.   .88.   Y8b  d8      88        .88.   88.     88booo. 88  .8D      88b  d88 88      88  .8D 88   88    88    88.     
 *     Y888P  Y88888P VP   V8P Y88888P 88   YD Y888888P  `Y88P'      YP      Y888888P Y88888P Y88888P Y8888D'      ~Y8888P' 88      Y8888D' YP   YP    YP    Y88888P 
 *                                                                                                                                                                   
 *                                                                                                                                                                   
   * Things that did not work:
   * 
   * private _genericFieldUpdate(event: { target: HTMLInputElement; }){
   *    var element = event.target as HTMLElement;
   *    let ev2 = event.target;
   *    -- also when creating field, tried removing this:  .bind(this)
   *    ALL RESULTS were just the text value.
   * 
   */

   private _findNamedElementID(element2: HTMLElement){
    let fieldID = null;
    let testElement = element2;
    if (testElement.id != null && testElement.id.indexOf(pageIDPref) === 0 ) { return testElement.id.replace(pageIDPref,''); } else { testElement = testElement.parentElement ; }
    if (testElement.id != null && testElement.id.indexOf(pageIDPref) === 0 ) { return testElement.id.replace(pageIDPref,''); } else { testElement = testElement.parentElement ; }
    if (testElement.id != null && testElement.id.indexOf(pageIDPref) === 0 ) { return testElement.id.replace(pageIDPref,''); } else { testElement = testElement.parentElement ; }
    if (testElement.id != null && testElement.id.indexOf(pageIDPref) === 0 ) { return testElement.id.replace(pageIDPref,''); } else { testElement = testElement.parentElement ; }
    if (testElement.id != null && testElement.id.indexOf(pageIDPref) === 0 ) { return testElement.id.replace(pageIDPref,''); } else { testElement = testElement.parentElement ; }
    if (testElement.id != null && testElement.id.indexOf(pageIDPref) === 0 ) { return testElement.id.replace(pageIDPref,''); } else { testElement = testElement.parentElement ; }
    if (testElement.id != null && testElement.id.indexOf(pageIDPref) === 0 ) { return testElement.id.replace(pageIDPref,''); } else { testElement = testElement.parentElement ; }
    if (testElement.id != null && testElement.id.indexOf(pageIDPref) === 0 ) { return testElement.id.replace(pageIDPref,''); } else { testElement = testElement.parentElement ; }
    if (testElement.id != null && testElement.id.indexOf(pageIDPref) === 0 ) { return testElement.id.replace(pageIDPref,''); } else { testElement = testElement.parentElement ; }
    if (testElement.id != null && testElement.id.indexOf(pageIDPref) === 0 ) { return testElement.id.replace(pageIDPref,''); } else { testElement = testElement.parentElement ; }
    if (testElement.id != null && testElement.id.indexOf(pageIDPref) === 0 ) { return testElement.id.replace(pageIDPref,''); } else { testElement = testElement.parentElement ; }
    if (testElement.id != null && testElement.id.indexOf(pageIDPref) === 0 ) { return testElement.id.replace(pageIDPref,''); } else { testElement = testElement.parentElement ; }
    if (testElement.id != null && testElement.id.indexOf(pageIDPref) === 0 ) { return testElement.id.replace(pageIDPref,''); } else { testElement = testElement.parentElement ; }
    if (testElement.id != null && testElement.id.indexOf(pageIDPref) === 0 ) { return testElement.id.replace(pageIDPref,''); } else { testElement = testElement.parentElement ; }
    if (testElement.id != null && testElement.id.indexOf(pageIDPref) === 0 ) { return testElement.id.replace(pageIDPref,''); } else { testElement = testElement.parentElement ; }
    if (testElement.id != null && testElement.id.indexOf(pageIDPref) === 0 ) { return testElement.id.replace(pageIDPref,''); } else { testElement = testElement.parentElement ; }
    return fieldID;

   }


  private _genericFieldUpdate(ev: EventTarget){

    var element2 = event.target as HTMLElement;
    var element3 = event.currentTarget as HTMLElement;
    let fieldID = this._findNamedElementID(element2);
    if (fieldID == null ) { fieldID = this._findNamedElementID(element3); } 
    if( this.props.projectFields[fieldID] == null ) {
        alert('Had some kind of problem with this.props.projectFields[' + fieldID + ']'); 
        console.log('_genericFieldUpdate projectFields error:', fieldID, this.props.projectFields);
    }
    let fieldName = this.props.projectFields[fieldID].name;
    if (fieldID == null || fieldID == '') { 
        alert('Had some kind of problem with genericFieldUpdate'); 
        console.log('_genericFieldUpdate error:', ev, element2);
    }
    let fieldVal : any = ev;
    if (fieldVal === '') {  fieldVal = null ; }
    let selectedProject = this.state.selectedProject;

    if (fieldName === "category1" || fieldName === "category2" )  { selectedProject[fieldName] = fieldVal == null ? null : fieldVal.split(';'); }
    else if (fieldName === "projectID1" || fieldName === "projectID2" )  { selectedProject[fieldName].value = fieldVal; }
    else if ( fieldName === "timeTarget" )  { selectedProject[fieldName].value = fieldVal; }
    else if ( fieldName === "projOptions" )  { selectedProject[fieldName].optionString = fieldVal; }
    else if (this.props.projectFields[fieldID].type === 'Text') { selectedProject[fieldName] = fieldVal; }
    else if (this.props.projectFields[fieldID].type === 'Date') { selectedProject[fieldName] = fieldVal; }
    //else if (field.type === 'Smart') { defaultValue = this.state.selectedProject[fieldID].value; }
    //else if (field.type === 'Time') { defaultValue = this.state.selectedProject[fieldID].value; }
    //else if (field.type === 'Link') { defaultValue = this.state.selectedProject[fieldID].value; }

    this.setState({ selectedProject: selectedProject });

  }




/***
 *    d8b   db  .d88b.  d888888b      d8b   db d88888b d88888b d8888b. d88888b d8888b. 
 *    888o  88 .8P  Y8. `~~88~~'      888o  88 88'     88'     88  `8D 88'     88  `8D 
 *    88V8o 88 88    88    88         88V8o 88 88ooooo 88ooooo 88   88 88ooooo 88   88 
 *    88 V8o88 88    88    88         88 V8o88 88~~~~~ 88~~~~~ 88   88 88~~~~~ 88   88 
 *    88  V888 `8b  d8'    88         88  V888 88.     88.     88  .8D 88.     88  .8D 
 *    VP   V8P  `Y88P'     YP         VP   V8P Y88888P Y88888P Y8888D' Y88888P Y8888D' 
 *                                                                                     
 *    Replaced by private _genericFieldUpdate                                                                                 
 */


private _updateCategory1(newValue: string){
    //let ev = event.target;  This gives the object target, but I can't reference it in Typescript
    let selectedProject = this.state.selectedProject;
    selectedProject.category1 = newValue.split(';');
    this.setState({ selectedProject: selectedProject });
  }

  private _updateCategory2(newValue: string){
    let selectedProject = this.state.selectedProject;
    selectedProject.category2 = newValue.split(';');
    this.setState({ selectedProject: selectedProject });
  }

  private _updateProjectID1(newValue: string){
    let selectedProject = this.state.selectedProject;
    selectedProject.projectID1.value = newValue;
    this.setState({ selectedProject: selectedProject });
  }

  private _updateProjectID2(newValue: string){
    let selectedProject = this.state.selectedProject;
    selectedProject.projectID2.value = newValue;
    this.setState({ selectedProject: selectedProject });
  }

  private _updateStory(newValue: string){
    let selectedProject = this.state.selectedProject;
    selectedProject.story = newValue;
    this.setState({ selectedProject: selectedProject });
  }

  private _updateChapter(newValue: string){
    let selectedProject = this.state.selectedProject;
    selectedProject.chapter = newValue;
    this.setState({ selectedProject: selectedProject });
  }



}    
