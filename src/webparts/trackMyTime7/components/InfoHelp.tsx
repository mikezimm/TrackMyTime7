

import * as React from 'react';

import { DateTimePicker, DateConvention, TimeConvention, TimeDisplayControlType } from '@pnp/spfx-controls-react/lib/dateTimePicker';

import {IProject, ILink, ISmartText, ITimeEntry, IProjectTarget, IUser, IProjects, IProjectInfo, IEntryInfo, IEntries, ITrackMyTime7State, ISaveEntry} from './ITrackMyTime7State';

import { ITrackMyTime7Props } from './ITrackMyTime7Props';
import * as strings from 'TrackMyTime7WebPartStrings';

import styles from './TrackMyTime7.module.scss';


export interface IHelpInfoProps {

}

export interface IHelpInfoState {

}

export default class HelpPanel extends React.Component<IHelpInfoProps, IHelpInfoState> {

  public constructor(props:IHelpInfoProps){
    super(props);
    //let projWeb = this.cleanURL(this.props.projectListWeb ? this.props.projectListWeb : props.pageContext.web.absoluteUrl);
    //let timeWeb = this.cleanURL(this.props.timeTrackListWeb ? this.props.timeTrackListWeb : props.pageContext.web.absoluteUrl);
    this.state = { 



    };

    // because our event handler needs access to the component, bind 
    //  the component to the function so it can get access to the
    //  components properties (this.props)... otherwise "this" is undefined
    //this.onLinkClick = this.onLinkClick.bind(this);

    
  }


  public componentDidMount() {
    //this._getListItems();
    
  }

  public render(): JSX.Element {
    /*
    const previewProps: IDocumentCardPreviewProps = {
      previewImages: [
        {
          previewImageSrc: String(require('./document-preview.png')),
          iconSrc: String(require('./icon-ppt.png')),
          width: 318,
          height: 196,
          accentColor: '#ce4b1f'
        }
      ],
    };
  */
    return (
      <div>

      </div>
    );
  }

}

export function creatingProjectsGuide(parentProps:ITrackMyTime7Props , parentState: ITrackMyTime7State){

    //Got example from:  https://sharepoint.github.io/sp-dev-fx-controls-react/controls/DateTimePicker/
  return (
    // Uncontrolled
    <div className={styles.infoPane}>
    <h2>Creating Projects in TrackMyTime, how they work</h2>
      <p>Projects can be created and used in any way you want.  This guide just explains some of the special features of different columns, and how the webpart uses them to your advantage.</p>
    <h3>SPECIAL Columns:  These have special uses and may overlap depending on how you use them.</h3>
      <p><b>Story and Chapter have special use for charts.</b>  These may look like a duplicate of Project and Category but there is a method to the madness.  
      Category and Project ID are intended to be visible and editible when entering a time.  
      In addition, The Activity column can auto-populate Category and ProjectID columns based on the URL which may make 
      those columns different TypE CaSe making inconsistant chart labels.  
      Story and Chapter are only visible/editable on the Project list and therefore will provide more consistancy.  
      So the moral of the story... Think of Story and Chapter columns as a way to tell a Story through built in charts.  Story is the book, Chapter can be the buckets you break your time into.  
      Again these may be duplicates of Category or Project depending on how you use them which is ok.  They just provide a way to keep the chart labels exactly as you want.</p>
      <ul>
        <li><span className={styles.iColNamV}>Category1/2:</span>Is designed for generic labels that can span multiple projects.  An example would be "Create Specification" which may be a phase in many projects.  This field will have some charts tailored to this use case.</li>
        <li><span className={styles.iColNamV}>ProjectID1/2:</span>Has multiple use cases.  You can use it for a Project Number like a category.  But it's special purpose is for specific "transaction" type detail.  For instance, the Drawing Number, Specification that you are working on for that time entry.</li>
        <li><span className={styles.iColNamV}>Activity (Time list):</span>Has special functionality.  If you paste a link in this column, it can autopopulate Project, Category and Comments columns for you.</li>
        <li><span className={styles.iColNamH}>Story:</span>Not required for all Projects, but can be used to tell a "Story" of how your time was spent on a specific project.</li>
        <li><span className={styles.iColNamH}>Chapter:</span>Not required for all Projects, but can be used to bucket your time on a "Story" in charts.</li>
      </ul>
      
    <h3>GENERAL Columns:  These help identify/filter projects in the webpart.</h3>
      <ul>
        <li><span className={styles.iColNam}>Title:</span>This is the text visible in the webpart.  Must be unique per item in Project List.</li>
        <li><span className={styles.iColNam}>Active:</span>If Active=No, project will automatically be moved to "InActive" heading.</li>
        <li><span className={styles.iColNam}>Everyone:</span>If Everyone=Yes, project will only be found in Everyone heading. Use this for generic tasks like "Training", "Emails", "Break".</li>
        <li><span className={styles.iColNam}>Leader:</span>Only one leader is allowed per project item.  These projects can be found in "Yours" heading.</li>
        <li><span className={styles.iColNam}>Team:</span>Multiple people are allowed in this column.  If your name is in this column, the project will under "Your Team" heading.</li>
        <li><span className={styles.iColNam}>Comments:</span>The world is your canvas, just use it.</li>
      </ul>

    <h3>FUTURE USE Project List Activity Columns:  Must be used with Property Pane Rule(s)</h3>
      <p>Activity links on Time entry form can be created using these 2 fields on the Project list.  Set up Choices in Activity Type.  Then create URL rules in Property Pane.  To use, select the Activity Type, then type in an activity.</p>
      <ul>
        <li><span className={styles.iColNamU}>Activity Type:</span>Define Choices in column settings like:  <b>GeoTestOrder</b>  and Drawing.  Then Select on Project Item</li>
        <li><span className={styles.iColNamU}>Prop Pane Rule:</span>https://plm.autoliv.int:10090/enovia/common/emxNavigator.jsp?type=GEOTestOrder&amp;name=?<b>&lt;&lt;GeoTestOrder&gt;&gt;</b>&amp;rev=-&amp;return=specific</li>
        <li><span className={styles.iColNamU}>Activity:</span>Type in the Geo Test Order such as <b>T2001000664</b>.</li>
        <li><span className={styles.iColNamU}>Result in webpart:</span>Link to here:  https://plm.autoliv.int:10090/enovia/common/emxNavigator.jsp?type=GEOTestOrder&name=<b>T2001000664</b>&rev=-&return=specific</li>
      </ul>

    <h3>FUTURE Use columns (Projects as Tasks):  These may be used in the future for advanced functionality.</h3>
      <ul>
        <li><span className={styles.iColNamU}>Status:</span>Project column to be used as alternative to 'Active' column.</li>
        <li><span className={styles.iColNamU}>Due Date:</span>Project column to be used if using Project list as a task list.</li>
      </ul>

    <h3>FUTURE Use columns:  These may be used in the future for advanced functionality.</h3>
      <ul>
        <li><span className={styles.iColNamU}>TimeTarget:</span>To be used in the future for charting time against a target.</li>
        <li><span className={styles.iColNamU}>CCList:</span>Intent is to have webpart be able to copy time entry to an additional list based on selected project.  This way you could have all your items in one place, but also "report" the same entry to another list at the same time.</li>
        <li><span className={styles.iColNamU}>CCEmail:</span>Intent is to have ability to send an email when creating item with a project that has a CCEmail.</li>
      </ul>

  </div>
  );
}

/**
 * This is to be updated when I get time.
 * @param parentProps 
 * @param parentState 
 */
export function projectIDGuide(parentProps:ITrackMyTime7Props , parentState: ITrackMyTime7State){

  //Got example from:  https://sharepoint.github.io/sp-dev-fx-controls-react/controls/DateTimePicker/
return (
  // Uncontrolled
  <div className={styles.infoPane}>
    <h2>Creating Projects in TrackMyTime, how they work</h2>
      <p>Projects can be created and used in any way you want.  This guide just explains some of the special features of different columns, and how the webpart uses them to your advantage.</p>
    <h3>SPECIAL Columns:  These have special uses and may overlap depending on how you use them.</h3>
      <p><b>Story and Chapter have special use for charts.</b>  These may look like a duplicate of Project and Category but there is a method to the madness.  
      Category and Project ID are intended to be visible and editible when entering a time.  
      In addition, The Activity column can auto-populate Category and ProjectID columns based on the URL which may make 
      those columns different TypE CaSe making inconsistant chart labels.  
      Story and Chapter are only visible/editable on the list and therefore will provide more consistancy.  
      So the moral of the story... Think of Story and Chapter columns as a way to tell a Story through built in charts.  Story is the book, Chapter can be the buckets you break your time into.  
      Again these may be duplicates of Category or Project depending on how you use them which is ok.  They just provide a way to keep the chart labels exactly as you want.</p>
      <ul>
        <li><span className={styles.iColNamV}>Category1/2:</span>Is designed for generic labels that can span multiple projects.  An example would be "Create Specification" which may be a phase in many projects.  This field will have some charts tailored to this use case.</li>
        <li><span className={styles.iColNamV}>ProjectID1/2:</span>Has multiple use cases.  You can use it for a Project Number like a category.  But it's special purpose is for specific "transaction" type detail.  For instance, the Drawing Number, Specification that you are working on for that time entry.</li>
        <li><span className={styles.iColNamV}>Activity (Time list):</span>Has special functionality.  If you paste a link in this column, it can autopopulate Project, Category and Comments columns for you.</li>
        <li><span className={styles.iColNamH}>Story:</span>Not required for all Projects, but can be used to tell a "Story" of how your time was spent on a specific project.</li>
        <li><span className={styles.iColNamH}>Chapter:</span>Not required for all Projects, but can be used to bucket your time on a "Story" in charts.</li>
      </ul>
    <h3>Project List Activity Columns:  Must be used with Property Pane Rule(s)</h3>
      <p>Activity links on Time entry form can be created using these 2 fields on the Project list.  Set up Choices in Activity Type.  Then create URL rules in Property Pane.  To use, select the Activity Type, then type in an activity.</p>
      <ul>
        <li><span className={styles.iColNamU}>Activity Typ:</span>Define Choices in column settings like:  GeoTestOrder  and Drawing.  Then Select on Project Item</li>
        <li><span className={styles.iColNamU}>Prop Pane Rule:</span>https://plm.autoliv.int:10090/enovia/common/emxNavigator.jsp?type=GEOTestOrder&amp;name=?&lt??&ltGeoTestOrder?&gt?&gt&amp;rev=-&amp;return=specific</li>
        <li><span className={styles.iColNamU}>Activity:</span>Type in the Build Order or Drawing Number.</li>
        <li><span className={styles.iColNamU}>Result in webpart:</span>Link to here:  https://plm.autoliv.int:10090/enovia/common/emxNavigator.jsp?type=GEOTestOrder&name=T2001000664&rev=-&return=specific</li>
      </ul>

    <h3>GENERAL Columns:  These help identify/filter projects in the webpart.</h3>
      <ul>
        <li><span className={styles.iColNam}>Title:</span>This is the text visible in the webpart.  Must be unique per item in Project List.</li>
        <li><span className={styles.iColNam}>Active:</span>If Active=No, project will automatically be moved to "InActive" heading.</li>
        <li><span className={styles.iColNam}>Everyone:</span>If Everyone=Yes, project will only be found in Everyone heading. Use this for generic tasks like "Training", "Emails", "Break".</li>
        <li><span className={styles.iColNam}>Leader:</span>Only one leader is allowed per project item.  These projects can be found in "Yours" heading.</li>
        <li><span className={styles.iColNam}>Team:</span>Multiple people are allowed in this column.  If your name is in this column, the project will under "Your Team" heading.</li>
        <li><span className={styles.iColNam}>Comments:</span>The world is your canvas, just use it.</li>
      </ul>
    <h3>FUTURE Use columns (Projects as Tasks):  These may be used in the future for advanced functionality.</h3>
      <ul>
        <li><span className={styles.iColNamU}>Status:</span>Project column to be used as alternative to 'Active' column.</li>
        <li><span className={styles.iColNamU}>Due Date:</span>Project column to be used if using Project list as a task list.</li>
      </ul>
    <h3>FUTURE Use columns:  These may be used in the future for advanced functionality.</h3>
      <ul>
        <li><span className={styles.iColNamU}>TimeTarget:</span>To be used in the future for charting time against a target.</li>
        <li><span className={styles.iColNamU}>CCList:</span>Intent is to have webpart be able to copy time entry to an additional list based on selected project.  This way you could have all your items in one place, but also "report" the same entry to another list at the same time.</li>
        <li><span className={styles.iColNamU}>CCEmail:</span>Intent is to have ability to send an email when creating item with a project that has a CCEmail.</li>
      </ul>
  </div>
);
}


/*
export function creatDateTimeUnControledX(parentProps:ITrackMyTime7Props , parentState: ITrackMyTime7State, field: IFieldDef, isSaveDisabled:boolean = false){

  //Got example from:  https://sharepoint.github.io/sp-dev-fx-controls-react/controls/DateTimePicker/
return (
  // Uncontrolled
''
);
}
*/