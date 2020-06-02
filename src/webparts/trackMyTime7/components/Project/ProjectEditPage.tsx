import * as React from 'react';

import * as strings from 'TrackMyTime7WebPartStrings';

//import * as links from './AllLinks';

import { ITrackMyTime7Props } from '../ITrackMyTime7Props';
import { ITrackMyTime7State, IProjectOptions, IProject, IUser, IProjectColumns } from '../ITrackMyTime7State';

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

import { statusChoices, activityTMTChoices} from '../TrackMyTime7';

// Initialize icons in case this example uses them
initializeIcons();

import styles from './ProjectPage.module.scss';
import stylesT from '../TrackMyTime7.module.scss';

export enum ProjectMode { False, Edit, Copy, New }

const getProjectModeLabel =  (mode: ProjectMode): string =>  {

  if (mode === ProjectMode.New ) { return "New"; }
  if (mode === ProjectMode.Edit ) { return "Edit"; }
  if (mode === ProjectMode.Copy ) { return "Copy"; }

  return "What?";

};

export interface IProjectPageProps {
    showProjectScreen: ProjectMode;
    _closeProjectEdit: any;
    selectedProject: IProject;
    projectFields: IProjectFormFields;
    wpContext: WebPartContext;

    // 2 - Source and destination list information
    projectListTitle: string;
    projectListWeb: string;

    projColumns: IProjectColumns;

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
    testItems?: any;
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


const emptyString = (value: string | Date) : string => { return "";};

const getErrorMessage = (value: string, testString: string, minLength: number, required: boolean, projectMode: ProjectMode): string => {
  let mess = '';

  if ( value == null ) {

  } else if (required && value.length === 0){
    mess = 'New Value is required!';

  } else if (value.length < minLength ){
    mess = 'Title is a little to short to be meaningful :)';

  } else if (value.indexOf('Copy of') > -1){
    mess = 'Remove the word Copy from value';

  } else if ( projectMode === ProjectMode.Copy || projectMode === ProjectMode.New ){
    if ( testString.replace('Copy of ','') === value ) { mess = "Value must be new"; }
    else if ( testString.replace('Copy of ','Copyof') === value ) { mess = "Remove 'Copyof'"; }
    else if ( testString.replace('Copy of ','Copy of') === value ) { mess = "Remove 'Copy of'"; }
    else if ( testString.replace('Copy of ','Copy') === value ) { mess = "Remove 'Copy'"; } 
    else if ( testString.replace('Copy of ','Copy ') === value ) { mess = "Remove 'Copy '"; } 
    else if ( testString.replace('Copy of ','of ') === value ) { mess = "Remove 'of '"; } 
    else if ( testString.replace('Copy of ',' of ') === value ) { mess = "Remove ' of '"; } 
    else if ( testString.replace('Copy of ','f ') === value ) { mess = "Remove 'f '"; } 
    else if ( testString.replace('Copy of ',' ') === value ) { mess = "Remove leading spaces"; } 
    else if ( testString.replace('Copy of ','  ') === value ) { mess = "Remove leading spaces"; } 
    else if ( testString.replace('Copy of ','   ') === value ) { mess = "Remove leading spaces"; } 
    else if ( testString.replace('Copy of ','    ') === value ) { mess = "Remove leading spaces"; } 
    else if ( testString.replace('Copy of ','     ') === value ) { mess = "Your kidding right???"; } 
    else if ( testString === value ) {
      mess = 'Value must be new!';
    }
  } else if ( projectMode === ProjectMode.Edit ){

  }
  return mess;
};

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
        let selectedProject : IProject = JSON.parse(JSON.stringify(this.props.selectedProject));
        this.state = {
            selectedProject:  selectedProject,
            showProjectScreen : this.props.showProjectScreen,
            showTask: projectEditOptions.indexOf('task') > -1 ? true : false,
            showActivity: projectEditOptions.indexOf('activity') > -1 ? true : false,
            showReporting: projectEditOptions.indexOf('reporting') > -1 ? true : false,
            showPeople: projectEditOptions.indexOf('people') > -1 ? true : false,
            showAdvanced: projectEditOptions.indexOf('advanced') > -1 ? true : false,
            projectEditOptions: projectEditOptions,
            testItems: null,
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

        let isSaveButtonDisabled = !this.checkEnableSave();
        let saveLabel = "Save";
        let testLabel = "Test";
        if (this.props.showProjectScreen === ProjectMode.New) { saveLabel = "Create New"; }
        if (this.props.showProjectScreen === ProjectMode.Edit) { saveLabel = "Update"; }
        if (this.props.showProjectScreen === ProjectMode.Copy) { saveLabel = "Save Copy"; }

        let testItems = this.state.testItems == null ? null : <div><div><h2>Here is the save object :)</h2></div><div>{ JSON.stringify(this.state.testItems) }</div></div>;

        const buttons: ISingleButtonProps[] =
        [{  disabled: false,  checked: true, primary: false,
            label: "Cancel", buttonOnClick: this.cancelForm.bind(this),
        },{ 
            disabled: isSaveButtonDisabled,  checked: true, primary: false,
            label: "Reset form", buttonOnClick: this.clearForm.bind(this),
        },{
          disabled: isSaveButtonDisabled, checked: true, primary: true,
          label: testLabel, buttonOnClick: this.testSaveProject.bind(this),
        },{
            disabled: isSaveButtonDisabled, checked: true, primary: true,
            label: saveLabel, buttonOnClick: this.saveProject.bind(this),
        }];


          let projectFields = this.props.projectFields;
          let resetFields  = this.props.showProjectScreen !== ProjectMode.Copy ? null : 
            <h3><mark>NOTE:</mark> These fields are cleared when creating a Copy:<span>&nbsp;</span>
            {[
              projectFields.CompletedByTMT.title,
              projectFields.CompletedDateTMT.title,
              projectFields.StatusTMT.title,
              ].join('; ')}
            </h3> ;

        let pageTitle = <div style={{ paddingTop: '0px' }}>
          <h2>{"Track My Time:  Project " + getProjectModeLabel(this.state.showProjectScreen) }</h2>
          <h3>{ this.state.selectedProject === null ? 'New Project' : this.state.selectedProject.titleProject}</h3>
          { resetFields }
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
            { testItems }
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
        let selectedProject : IProject = JSON.parse(JSON.stringify(this.props.selectedProject));
        let projectEditOptions = this.props.selectedProject.projOptions.projectEditOptions.split(';');

        this.setState({ 
          selectedProject: selectedProject,
          showTask: projectEditOptions.indexOf('task') > -1 ? true : false,
          showActivity: projectEditOptions.indexOf('activity') > -1 ? true : false,
          showReporting: projectEditOptions.indexOf('reporting') > -1 ? true : false,
          showPeople: projectEditOptions.indexOf('people') > -1 ? true : false,
          showAdvanced: projectEditOptions.indexOf('advanced') > -1 ? true : false,
          projectEditOptions: projectEditOptions,
          testItems: null,
        });

        alert('Project form has been reset to how it started.');
        //this.props._closeProjectEdit();
    }

    private checkEnableSave() {

      let saveTest: any = false;
      let didProjectChange = false;
      let didTogglesChange = false;
      let currentProjOptions = '';

      //This should always be in alphabetical order to work because we sort the items when read in from project list.
      if ( this.state.showActivity) {currentProjOptions += 'activity;'; }
      if ( this.state.showAdvanced) {currentProjOptions += 'advanced;'; }
      if ( this.state.showPeople) {currentProjOptions += 'people;'; }
      if ( this.state.showReporting) {currentProjOptions += 'reporting;'; }
      if ( this.state.showTask) {currentProjOptions += 'task;'; }

      if ( currentProjOptions.length > 0 ) { currentProjOptions = currentProjOptions.substring(0,currentProjOptions.length -1) ; }

      if ( currentProjOptions !== this.props.selectedProject.projOptions.projectEditOptions ) {
        didTogglesChange = true;
        //alert('Project Edit Options have changed!');
      }

      if (JSON.stringify(this.props.selectedProject) !== JSON.stringify(this.state.selectedProject) ) { 
        didProjectChange = true;
        //alert('Something has changed!  Not saving anything.');
      } 

      if ( didProjectChange || didTogglesChange ) { saveTest = true; }

      let titleMessage = getErrorMessage(this.state.selectedProject.titleProject,this.props.selectedProject.titleProject, 5, true, this.props.showProjectScreen);
      let activityMessage = getErrorMessage(this.state.selectedProject.projOptions.activity,this.props.selectedProject.projOptions.activity, 0, false, this.props.showProjectScreen);

      //Added this to change error message if both the old and new value of activity are empty.
      //This way it does not give you message 'Value must be new' if there was not a value to begin with.
      if ( this.props.showProjectScreen === ProjectMode.Copy ) {
        if (this.state.selectedProject.projOptions.activity === '' && this.props.selectedProject.projOptions.activity === '' && activityMessage != '' ) { activityMessage = ''; }
        if ( titleMessage !== '' || activityMessage !== '' ) { saveTest = false; }
      }

      return saveTest;

    }

    private testSaveProject() {
      console.log('saved form');

      if ( this.checkEnableSave() ) {

        let saveProject = this.buildProjectToSave(this.props.selectedProject, this.state.selectedProject, this.props.showProjectScreen );

        this.setState({ 
          testItems: saveProject,
        });

        /*
        const projectWeb = Web(this.props.projectListWeb);

        projectWeb.lists.getByTitle(this.props.projectListTitle).items.add( saveProject ).then((response) => {

        });

        this.props._closeProjectEdit();
        */
      }


  }

  private saveProject() {
      console.log('saved form');

      if ( this.checkEnableSave() ) {

        let saveProject = this.buildProjectToSave(this.props.selectedProject, this.state.selectedProject, this.props.showProjectScreen );

        this.setState({ 
          testItems: null,
        });

        /*
        const projectWeb = Web(this.props.projectListWeb);

        projectWeb.lists.getByTitle(this.props.projectListTitle).items.add( saveProject ).then((response) => {

        });

        this.props._closeProjectEdit();
        */
      }
    }

    private buildProjectToSave( oldProject: IProject, newProject: IProject, mode: ProjectMode ){

      let saveItem: any = { };
      saveItem = this.updateSaveObjectTitle( saveItem, this.props.projectFields.Title, oldProject, newProject, mode);
      saveItem = this.updateSaveObjectTitle( saveItem, this.props.projectFields.CCEmail, oldProject, newProject, mode);
      saveItem = this.updateSaveObjectTitle( saveItem, this.props.projectFields.CCList, oldProject, newProject, mode);
      saveItem = this.updateSaveObjectTitle( saveItem, this.props.projectFields.StatusTMT, oldProject, newProject, mode);
      saveItem = this.updateSaveObjectTitle( saveItem, this.props.projectFields.ActivityTMT, oldProject, newProject, mode);
      saveItem = this.updateSaveObjectTitle( saveItem, this.props.projectFields.ActivityType, oldProject, newProject, mode);
      saveItem = this.updateSaveObjectTitle( saveItem, this.props.projectFields.Story, oldProject, newProject, mode);
      saveItem = this.updateSaveObjectTitle( saveItem, this.props.projectFields.Chapter, oldProject, newProject, mode);

      saveItem = this.updateSaveObjectTitle( saveItem, this.props.projectFields.ProjectEditOptions, oldProject, newProject, mode);
      saveItem = this.updateSaveObjectTitle( saveItem, this.props.projectFields.Category1, oldProject, newProject, mode);
      saveItem = this.updateSaveObjectTitle( saveItem, this.props.projectFields.Category2, oldProject, newProject, mode);
      saveItem = this.updateSaveObjectTitle( saveItem, this.props.projectFields.ProjectID1, oldProject, newProject, mode);
      saveItem = this.updateSaveObjectTitle( saveItem, this.props.projectFields.ProjectID2, oldProject, newProject, mode);

      saveItem = this.updateSaveObjectTitle( saveItem, this.props.projectFields.Everyone, oldProject, newProject, mode);

      saveItem = this.updateSaveObjectTitle( saveItem, this.props.projectFields.DueDateTMT, oldProject, newProject, mode);
      saveItem = this.updateSaveObjectTitle( saveItem, this.props.projectFields.CompletedDateTMT, oldProject, newProject, mode);

      saveItem = this.updateSaveObjectTitle( saveItem, this.props.projectFields.Team, oldProject, newProject, mode);
      saveItem = this.updateSaveObjectTitle( saveItem, this.props.projectFields.Leader, oldProject, newProject, mode);
      saveItem = this.updateSaveObjectTitle( saveItem, this.props.projectFields.CompletedByTMT, oldProject, newProject, mode);

      saveItem = this.updateSaveObjectTitle( saveItem, this.props.projectFields.OptionsTMT, oldProject, newProject, mode);
      saveItem = this.updateSaveObjectTitle( saveItem, this.props.projectFields.TimeTarget, oldProject, newProject, mode);
      saveItem = this.updateSaveObjectTitle( saveItem, this.props.projectFields.SortOrder, oldProject, newProject, mode);

      console.log('Will save this object to ID ' + this.props.selectedProject.id , saveItem);

      return saveItem;

    }

    private updateSaveObjectTitle(saveItem, field:  IFieldDef, oldProject: IProject, newProject: IProject, mode: ProjectMode){

      let origVal = this.getProbjectValue(field, oldProject);
      let newVal = this.getProbjectValue(field, newProject);

      if ( mode === ProjectMode.Copy || mode === ProjectMode.New ) {

        if ( newVal === null ) {

        } else if (field.type === "User" || field.type === "MultiUser" ) {
          saveItem[field.column + "Id"] = newVal;

        } else {
          saveItem[field.column] = newVal;

        }

      } else if (field.type === "Date"  ) {
        //Add column and value to object
        //For some reason, dates need to be compared on string level.
        let origStr = new Date(origVal).toLocaleDateString();
        let newStr = new Date(newVal).toLocaleDateString();
        if (origStr !== newStr ) {
          console.log('updating ' + field.title + ' from ' + origVal + ' to ' + newVal);
          saveItem[field.column] = newVal;
        }

      } else if (field.type === "User" ) {
        //Add column and value to object
        if (JSON.stringify(origVal) !== JSON.stringify(newVal) ) {
          console.log('updating ' + field.title + ' from ' + origVal + ' to ' + newVal);
          saveItem[field.column + "Id"] = newVal;
        }

      } else if (field.type === "MultiUser" ) {
        //Add column and value to object
        if ( JSON.stringify(origVal) !== JSON.stringify(newVal) ) {
          console.log('updating ' + field.title + ' from ' + origVal + ' to ' + newVal);
          saveItem[field.column + "Id"] = newVal;
        }
      } else if (origVal !== newVal ) {
        //Add column and value to object
        console.log('updating ' + field.title + ' from ' + origVal + ' to ' + newVal);
        saveItem[field.column] = newVal;
      }

      return saveItem;
    }

    private getProbjectValue(field: IFieldDef, project:IProject ) {
      let fieldName = field.name;
      let objVal = project[fieldName];
      let val = null;
      if (fieldName === "category1" || fieldName === "category2" )  { val = objVal == null ? null : objVal.join(';'); }
      else if (fieldName === "projectID1" || fieldName === "projectID2" || fieldName === "timeTarget" )  { val = objVal.projListValue == null ? null : objVal.projListValue ; }
      else if ( fieldName === "projOptions" )  { val = objVal.optionString == null ? null : objVal.optionString; }
      else if ( fieldName === "activityType" )  { val = project.projOptions.type == null ? null : project.projOptions.type;  }
      else if ( fieldName === "activity" )  { val = project.projOptions.activity == null ? null : project.projOptions.activity;  }
      else if ( fieldName === "projectEditOptions" )  { val = project.projOptions.projectEditOptions == null ? null : project.projOptions.projectEditOptions;  }

      else if (field.type === 'User') { val = objVal == null ? null : { results: [objVal.ID] }; }      
      else if (field.type === 'MultiUser') { 
        if ( objVal == null ) {
          val = null; }
        else {
          let peopleIDs = { results: [] };
          if ( objVal ) { peopleIDs = { results: objVal.map( u => { return u.ID; } ) } ; }
          val = peopleIDs;
        }  
      }
      else if (field.type === 'Boolean') { val = objVal == null ? null : objVal; }
      else if (field.type === 'Text') { val = objVal == null ? null : objVal; }
      else if (field.type === 'Choice') { val = objVal == null ? null : objVal; }
      else if (field.type === 'Date') { val = objVal == null ? null : new Date(objVal); }

      return val;

    }

    private saveThisField( field:  IFieldDef, oldProject: IProject, newProject: IProject, mode: ProjectMode ) {

      let fieldName = field.name;

      /*

      if (fieldName === "category1" || fieldName === "category2" )  { selectedProject[fieldName] = fieldVal == null ? null : fieldVal.split(';'); }
      else if (fieldName === "projectID1" || fieldName === "projectID2" )  { selectedProject[fieldName].value = fieldVal; }
      else if ( fieldName === "timeTarget" )  { selectedProject[fieldName].value = fieldVal; }
      else if ( fieldName === "projOptions" )  { selectedProject[fieldName].optionString = fieldVal; }
      else if (this.props.projectFields[fieldID].type === 'Text') { selectedProject[fieldName] = fieldVal; }
      else if (this.props.projectFields[fieldID].type === 'Date') { selectedProject[fieldName] = fieldVal; }
*/

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
        else if (field.name === "projectID1" || field.name === "projectID2" )  { defaultValue = this.state.selectedProject[field.name].projListValue; }
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

        const getTitleErrorMessage =  (value: string) : string => {
          let mess = getErrorMessage(value,this.props.selectedProject.projOptions.activity, 0, false, this.props.showProjectScreen);

          //Add this only for activity in Copy mode so it does not show error message when it's blank.
          if ( this.props.showProjectScreen === ProjectMode.Copy && field.name === "activity" ) {
            if (defaultValue === '' && this.props.selectedProject.projOptions.activity === '')  { mess = ''; }
          }
          return mess;
        };

        let thisField = <div id={ pageIDPref + field.column }><TextField
            className={ stylesT.textField }
            styles={ getStyles  } //this.getReportingStyles
            defaultValue={ defaultValue }
            label={ field.title }
            autoComplete='off'
            onChanged={ _onChange }
            onGetErrorMessage={ field.name !== "activity" ? emptyString : getTitleErrorMessage }
            validateOnFocusIn
            validateOnFocusOut
            multiline= { field.name === "activity" ? true : false }
            autoAdjustHeight= { true }

        /></div>;
      

        return thisField;
    }

    private createDateField(field: IFieldDef, _onChange: any, required: boolean, getStyles : IStyleFunctionOrObject<ITextFieldStyleProps, ITextFieldStyles>) {

        const getDateErrorMessage = (value: Date): string => {
          let mess = value == null ? "Don't forget Date!" : "";
          return mess;
        };

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
                //onGetErrorMessage={ required === true ? getDateErrorMessage : emptyString }
                onGetErrorMessage={ required === true && timeStamp == null ? emptyString : getDateErrorMessage }
            /></div>
        );

    }

    private createPeopleField(field: IFieldDef, maxCount: number, _onChange: any, getStyles : IStyleFunctionOrObject<ITextFieldStyleProps, ITextFieldStyles>) {

      let users: IUser[] = maxCount === 1 ? [this.state.selectedProject[field.name]] : this.state.selectedProject[field.name];

      let emails: string[] = users == null ? [] : users.map( u => {
        if ( u == null ) { 
          console.log('Null User Structure for createPeopleField', users, u);
          //alert('Unknown User Structure for createPeopleField: ' +  JSON.stringify(u));
          return null;
        }
     
        let uName = u.Name;

        if ( uName == undefined ) { // Added because when you remove the person in react comp, the user still is there, the name just gets removed.
          console.log('createPeopleField - did you remove a person from the array?', users, u);
          alert('createPeopleField - did you remove a person from the array?' +  JSON.stringify(u));
          return null;
        }

        if (uName.indexOf('|') > -1 && uName.indexOf('@') > 0 ) {
          //This is an ID structure from reading in from the list:  "i:0#.f|membership|clicky.mcclickster@mcclickster.onmicrosoft.com"
          let uProps = uName.split('|');
          let expectedEmailIndex = 2;
          if (uProps.length === 3 && uProps[expectedEmailIndex].indexOf('@') > -1) {
            console.log('User ' + uProps[expectedEmailIndex] + ' is made up of :', this.state.selectedProject[field.name] );
            return uProps[expectedEmailIndex];
          }
        }
        console.log('Unknown User Structure for createPeopleField', u);
        alert('Unknown User Structure for createPeopleField: ' +  JSON.stringify(u));

        return null;
      });

        return (
            // Uncontrolled
            <div id={ pageIDPref + field.column } style={{ width: fieldWidth }}>
                <PeoplePicker
                    context={this.props.wpContext}
                    defaultSelectedUsers={ emails }
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

private removeStringFromArray(str: string, arr: string[]) {

  let filteredProjectEditOptions = arr.filter( (el) => {
    return el != str;
  });

  return filteredProjectEditOptions;
}

private _updateToggleState(ev: EventTarget){
  var element2 = event.target as HTMLElement;
  var element3 = event.currentTarget as HTMLElement;
  let fieldID = this._findNamedElementID(element2);
  let selectedProject = this.state.selectedProject;

  if (fieldID == null ) { fieldID = this._findNamedElementID(element3); } 
  if( this.state['show' + fieldID] === null ) {
      alert('Had some kind of problem with this.props.projectFields[' + fieldID + ']'); 
      console.log('_genericFieldUpdate projectFields error:', fieldID, this.props.projectFields);
  }
  let thisNewProp = !this.state['show' + fieldID];
  //selectedProject.titleProject = newValue;
  console.log('_updateToggleTask: to ', fieldID, thisNewProp, ev);

  let thisProjEditString : string = this.state.selectedProject.projOptions.projectEditOptions;
  let thisProjEditArray : string[] = thisProjEditString.split(';');

  if( thisNewProp === false ){
    //Must be removed from project
    thisProjEditString = this.removeStringFromArray( fieldID.toLowerCase(), thisProjEditArray ).join(';');

  } else {
    //Must be added to project
    thisProjEditArray.push( fieldID.toLowerCase());
    thisProjEditString = thisProjEditArray.sort().join(';');

  }

  selectedProject.projOptions.projectEditOptions = thisProjEditString;

  //The purpose of this if loop is to sync Reporting and People columns since People are nested under Reporting element.
  if (fieldID === 'Reporting' && thisNewProp === false) {
    this.setState({ ['show' + fieldID]: thisNewProp, showPeople: false, selectedProject: selectedProject });

  } else if (fieldID === 'People'  && thisNewProp === true) {
    this.setState({ ['show' + fieldID]: thisNewProp, showReporting: true, selectedProject: selectedProject });

  } else {
    this.setState({ ['show' + fieldID]: thisNewProp, selectedProject: selectedProject });

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

    
    const getTitleErrorMessage = (value: string): string => {
      let mess = getErrorMessage(value,this.props.selectedProject.titleProject, 5, true, this.props.showProjectScreen);
      return mess;
    };

    let title = <div style= {{ paddingBottom: 20 }}>
      <TextField
        defaultValue={ this.state.selectedProject.titleProject }
        label={ this.props.projectFields.Title.title }
        placeholder={ "Enter " + this.props.projectFields.Title.title }
        autoComplete='off'
        onChanged={ this._updateProjectTitle.bind(this) }
        onGetErrorMessage={getTitleErrorMessage}
        required={ true }
        validateOnFocusIn
        validateOnFocusOut
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
    let newUsers: IUser[] = this.convertReactPPnewValueToIUser(newValue);
    console.log('_updateLeader:', newValue);
    selectedProject.leader = newUsers[0];
    selectedProject.leaderId = newUsers[0] != null ? newUsers[0].id : null;
    this.setState({ selectedProject: selectedProject });
  }

  private _updateTeam(newValue){
    let selectedProject = this.state.selectedProject;
    //selectedProject.team = newValue;
    let newUsers: IUser[] = this.convertReactPPnewValueToIUser(newValue);
    console.log('_updateTeam:', newValue);
    selectedProject.team = newUsers;
    selectedProject.teamIds = newUsers != null ? newUsers.map( u => { return u.id; }) : null;    
    this.setState({ selectedProject: selectedProject });
  }  


  private convertReactPPnewValueToIUser(newValue) {

    let newUsers : IUser[] = newValue.map( u => {

      if ( u == null ) { 
          console.log('Null User Structure for convertReactPPnewValueToIUser', newValue, u);
          alert('Unknown User Structure for convertReactPPnewValueToIUser: ' +  JSON.stringify(u));
          return null;
        }
        let uName = u.loginName;
        let thisUser: IUser = null;
        if (uName.indexOf('|') > -1 && uName.indexOf('@') > 0 ) {
          //This is an ID structure from reading in from the list:  "i:0#.f|membership|clicky.mcclickster@mcclickster.onmicrosoft.com"
          let uProps = uName.split('|');
          let expectedEmailIndex = 2;
          if (uProps.length === 3 && uProps[expectedEmailIndex].indexOf('@') > -1) {
            console.log('User ' + uProps[expectedEmailIndex] + ' is made from :', newValue );

            //This needs to match up with structure required in the this.createPeopleField
            return {
              id: u.id,
              ID: u.id,
              Id: u.id,
              Title: u.text,
              title: u.text,
              email: uProps[expectedEmailIndex],
              loginName: uName,
              Name: uName,
            }
              ;
          } else {
            alert('Unknown User Structure for convertReactPPnewValueToIUser: (expecting @ symbol in array split by |.  ' +  JSON.stringify(u));
            return null;
          }

        }
        console.log('Unknown User Structure for convertReactPPnewValueToIUser', u);
        alert('Unknown User Structure for convertReactPPnewValueToIUser: ' +  JSON.stringify(u));

        return null;

      });

      return newUsers;
    
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
    let useActivityChoices = this.props.projColumns.activityTMTChoices != null ? this.props.projColumns.activityTMTChoices : activityTMTChoices;
    let activityType = this._createDropdownField(this.props.projectFields.ActivityType, useActivityChoices, this._updateActivityType.bind(this), this.getActivityStyles );
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

    let useStatusChoices = this.props.projColumns.statusChoices != null ? this.props.projColumns.statusChoices : activityTMTChoices;
    let status = this._createDropdownField(this.props.projectFields.StatusTMT, useStatusChoices, this._updateStatusChange.bind(this), this.getTaskStyles );
    let isDueDateRequired: boolean = true;
    let dueDate = this.createDateField(this.props.projectFields.DueDateTMT, this._updateDueDate.bind(this), isDueDateRequired, this.getTaskStyles );
    let completedDate = this.createDateField(this.props.projectFields.CompletedDateTMT, this._updateCompleteDate.bind(this), false, this.getTaskStyles );
    let completedBy = this.createPeopleField(this.props.projectFields.CompletedByTMT , 1, this._updateCompletedBy.bind(this), this.getPeopleStyles );

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
    let newUsers: IUser[] = this.convertReactPPnewValueToIUser(newValue);
    console.log('_updateCompletedBy:', newValue);
    selectedProject.completedBy = newUsers[0];
    selectedProject.completedById = newUsers[0] != null ? newUsers[0].id : null;
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
    else if (fieldName === "projectID1" || fieldName === "projectID2" )  { selectedProject[fieldName].projListValue = fieldVal; }
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
