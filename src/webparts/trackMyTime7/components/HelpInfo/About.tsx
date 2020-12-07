import * as React from 'react';

import * as strings from 'TrackMyTime7WebPartStrings';

import * as links from './AllLinks';

import { Link, ILinkProps } from 'office-ui-fabric-react';
import { CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';
import { IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

import { ITrackMyTime7Props } from '../ITrackMyTime7Props';
import { ITrackMyTime7State } from '../ITrackMyTime7State';

import WebPartLinks from './WebPartLinks';
import { IWebPartLinksProps, IWebPartLinksState } from './WebPartLinks';

import styles from './InfoPane.module.scss';

export interface IInfoAboutMeProps {
    showInfo: boolean;
    allLoaded: boolean;
    parentProps: ITrackMyTime7Props;
    parentState: ITrackMyTime7State;

}

export interface IInfoAboutMeState {
    selectedChoice: string;
    lastChoice: string;
}

export default class InfoAboutMe extends React.Component<IInfoAboutMeProps, IInfoAboutMeState> {


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

public constructor(props:IInfoAboutMeProps){
    super(props);
    this.state = { 
        selectedChoice: 'About',
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

    public render(): React.ReactElement<IInfoAboutMeProps> {

        if ( this.props.allLoaded && this.props.showInfo ) {
            console.log('About.tsx', this.props, this.state);

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
            
            const stackTokensBody: IStackTokens = { childrenGap: 20 };

            let thisPage = null;

            thisPage = <div>
                <WebPartLinks
                    projectListURL={ this.props.parentState.projectListURL }
                    projectListName={ this.props.parentState.projectListName }
                    timeTrackerListURL={ this.props.parentState.timeTrackerListURL }
                    timeTrackListName={ this.props.parentState.timeTrackListName }
                ></WebPartLinks>

                <h2>Version History</h2>
                {/* 3 files to update version number:  package-solution.json, package-lock.json, package.json*/}
                <table className={styles.infoTable}>
                    <tr><th>Date</th><th>Version</th><th>Focus</th><th>Notes</th></tr>
                    <tr><td>2020-08-14</td><td>{'1.1.0.1'}</td>Early Access Banner, others<td></td><td>Add Early Access banner, fix save timeTarget and optionString</td></tr>
                    <tr><td>2020-08-14</td><td>{'1.0.0.17'}</td><td>Bug fix</td><td>Styling bug fixes.</td></tr>
                    <tr><td>2020-06-17</td><td>{'1.0.0.15'}</td><td>Project Edit</td><td>Add Project Edit screen, Project quick actions, requires 2 ne Project List columns.</td></tr>
                    <tr><td>2020-04-01</td><td>{'1.0.0.11'}</td><td>Activity URL</td><td>Add Activity URL based on Project Task.  ActivityType, Activity, ActivityURL^</td></tr>
                    <tr><td>2020-03-18</td><td>{'1.0.0.10'}</td><td>Charts</td><td>Add Core Time, Revise Story charts, Add Chapter charts, Search to chart data.</td></tr>
                    <tr><td>2020-03-11</td><td>{'1.0.0.9'}</td><td>Charts</td><td>Fix user summary Hours, Add Last Entry.  Fix Time display error.</td></tr>
                    <tr><td></td><td>{'1.0.0.8'}</td><td>Charts</td><td>Add Story and User filters.  Add Details toggle.  Add About and Numbers page.</td></tr>
                    <tr><td></td><td>{'1.0.0.7'}</td><td>Charts/Help</td><td>Initial addition of Charts and Help</td></tr>
                </table>
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
