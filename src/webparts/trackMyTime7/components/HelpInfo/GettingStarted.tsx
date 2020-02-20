import * as React from 'react';

import * as strings from 'TrackMyTime7WebPartStrings';

import { Link, ILinkProps } from 'office-ui-fabric-react';

import * as links from './AllLinks';

import { CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';
import { IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

import { ITrackMyTime7Props } from '../ITrackMyTime7Props';
import { ITrackMyTime7State } from '../ITrackMyTime7State';
import styles from './InfoPane.module.scss';

export interface IGettingStartedProps {
    showInfo: boolean;
    allLoaded: boolean;
    parentProps: ITrackMyTime7Props;
    parentState: ITrackMyTime7State;

}

export interface IGettingStartedState {
    selectedChoice: string;
    lastChoice: string;
}

export default class GettingStarted extends React.Component<IGettingStartedProps, IGettingStartedState> {


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

public constructor(props:IGettingStartedProps){
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

    public render(): React.ReactElement<IGettingStartedProps> {

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

            <h2><mark>Before you start:</mark>  Set your time zone in Office 365 Personal settings</h2>
            
            Go to { links.blogSPTimeZone } and scroll down to Personal Setting Option 2, set your personal regional time zone:<br/>

            If you do not do this first, your times will be saved in the site's local time zone and will cause the webpart not to work properly.<br/>
            NOTE:  This will also insure that wherever you go in SharePoint, things will be converted to your local time :).

            <h2>First:  Create a Project List and TrackMyTime List in your site</h2>
                <ol>
                    <li>Go to <b>WebPart Properties</b> - Edit Page, Edit Webpart.</li>
                    <li>Expand <b>Create-Verify Lists</b> section.</li>
                    <li>Press <b>Create-Verify Projects List</b> button.</li>
                    <li>Press <b>Create-Verify TrackMyTime List</b> button.</li>
                    <li>Exit <b>WebPart Properties</b></li>
                    <li><b>Save</b> this page.</li>
                    <li><b>Refresh</b> this page.</li>
                </ol>

            <h2>Second:  Create some Projects in the Projects list</h2>
                <ol>
                    <li>Go to <b>Project List</b> section in this guide and review what the columns do.</li>
                    <li>Go to your <Link href={this.props.parentState.projectListURL} target='_blank'>{ this.props.parentProps.projectListTitle }
                        </Link> and create some new Projects.
                    </li>
                </ol>

            <h2>Third:  Start Tracking your Time!</h2>
                <ol>
                    <li><b>Refresh</b> this page.</li>
                    <li>Select a <b>Project</b> from the list on the left side.  If you do not see any, click the tabs in upper left to find one</li>
                    <li>Select a <b>Time Entry Mode</b> in upper right</li>
                    <li><b>Fill in any details</b> you want to save.</li>
                    <li>Press <b>Save Item</b> button.</li>
                </ol>
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