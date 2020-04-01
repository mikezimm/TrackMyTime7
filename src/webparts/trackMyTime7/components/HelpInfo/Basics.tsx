import * as React from 'react';

import * as strings from 'TrackMyTime7WebPartStrings';

import { Link, ILinkProps } from 'office-ui-fabric-react';

import * as links from './AllLinks';

import { CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';
import { IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

import { ITrackMyTime7Props } from '../ITrackMyTime7Props';
import { ITrackMyTime7State } from '../ITrackMyTime7State';
import styles from './InfoPane.module.scss';

export interface IBasicsProps {
    showInfo: boolean;
    allLoaded: boolean;
    parentProps: ITrackMyTime7Props;
    parentState: ITrackMyTime7State;

}

export interface IBasicsState {
    selectedChoice: string;
    lastChoice: string;
}

export default class Basics extends React.Component<IBasicsProps, IBasicsState> {


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

public constructor(props:IBasicsProps){
    super(props);
    this.state = { 
        selectedChoice: 'projectList',
        lastChoice: '',

    };

    // because our event handler needs access to the component, bind 
    //  the component to the function so it can get access to the
    //  components properties (this.props)... otherwise "this" is undefined
    // this.onLinkClick = this.onLinkClick.bind(this);

    
  }


  public componentDidMount() {
    
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
    /*
    if (rebuildTiles === true) {
      this._updateStateOnPropsChange({});
    }
    */

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

    public render(): React.ReactElement<IBasicsProps> {

        if ( this.props.allLoaded && this.props.showInfo ) {
            console.log('infoPages.tsx', this.props, this.state);

/***
 *              d888888b db   db d888888b .d8888.      d8888b.  .d8b.   d888b  d88888b 
 *              `~~88~~' 88   88   `88'   88'  YP      88  `8D d8' `8b 88' Y8b 88'     
 *                 88    88ooo88    88    `8bo.        88oodD' 88ooo88 88      88ooooo 
 *                 88    88~~~88    88      `Y8b.      88~~~   88~~~88 88  ooo 88~~~~~ 
 *                 88    88   88   .88.   db   8D      88      88   88 88. ~8~ 88.     
 *                 YP    YP   YP Y888888P `8888Y'      88      YP   YP  Y888P  Y88888P 
 *                                                                                     
 *                                                                                     
 */

            let thisPage = null;
            thisPage =     <div className={styles.infoPane}>

            <h3>Please submit any issues or suggestions on github (requires free account)</h3>
            { links.gitRepoTrackMyTime.issues }
        
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
                <li><span className={styles.iColNamV}>Category1/2:</span>Are designed for generic labels that can span multiple projects.  An example would be "Create Specification" which may be a phase in many projects.  This field will have some charts tailored to this use case.</li>
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
        
            <h3>FUTURE Plans - See that page for more details</h3>
              <ul>
                <li><span className={styles.iColNam}>Using Project list like a Task list:</span>See Future Plans for more details</li>
                <li><span className={styles.iColNam}>CC (Carbon Copy) Time Entries</span>See Future Plans for more details</li>
              </ul>

        
          </div>;


/***
 *              d8888b. d88888b d888888b db    db d8888b. d8b   db 
 *              88  `8D 88'     `~~88~~' 88    88 88  `8D 888o  88 
 *              88oobY' 88ooooo    88    88    88 88oobY' 88V8o 88 
 *              88`8b   88~~~~~    88    88    88 88`8b   88 V8o88 
 *              88 `88. 88.        88    88b  d88 88 `88. 88  V888 
 *              88   YD Y88888P    YP    ~Y8888P' 88   YD VP   V8P 
 *                                                                 
 *                                                                 
 */

            return (
                <div className={ styles.infoPane }>
                    { thisPage }
                </div>
            );
            
        } else {
            console.log('infoPages.tsx return null');
            return ( null );
        }

    }   //End Public Render



}