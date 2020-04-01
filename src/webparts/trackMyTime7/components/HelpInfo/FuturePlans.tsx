import * as React from 'react';

import * as strings from 'TrackMyTime7WebPartStrings';

import { Link, ILinkProps } from 'office-ui-fabric-react';

import * as links from './AllLinks';

import { CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';
import { IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

import { ITrackMyTime7Props } from '../ITrackMyTime7Props';
import { ITrackMyTime7State } from '../ITrackMyTime7State';
import styles from './InfoPane.module.scss';

export interface IFuturePlansProps {
    showInfo: boolean;
    allLoaded: boolean;
    parentProps: ITrackMyTime7Props;
    parentState: ITrackMyTime7State;

}

export interface IFuturePlansState {
    selectedChoice: string;
    lastChoice: string;
}

export default class FuturePlans extends React.Component<IFuturePlansProps, IFuturePlansState> {


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

public constructor(props:IFuturePlansProps){
    super(props);
    this.state = { 
        selectedChoice: 'snapShot',
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

    public render(): React.ReactElement<IFuturePlansProps> {

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
                        
            <h3>FUTURE Use columns (Projects as Tasks):  These may be used in the future for advanced functionality.</h3>
              <ul>
                <li><span className={styles.iColNamU}>Status:</span>Project column to be used as alternative to 'Active' column.</li>
                <li><span className={styles.iColNamU}>Due Date:</span>Date Project/Task is due.</li>
                <li><span className={styles.iColNamU}>Completed:</span>Date Project/Task was completed.</li>
                <li><span className={styles.iColNamU}>Completed By:</span>Person who completed Project/Task.</li>
              </ul>
        
            <h3>FUTURE Use columns:  These may be used in the future for advanced functionality.</h3>
              <ul>
                <li><span className={styles.iColNamU}>TimeTarget:</span>To be used in the future for charting time against a target.</li>
                <li><span className={styles.iColNamU}>CCList:</span>Intent is to have webpart be able to copy time entry to an additional list based on selected project.  This way you could have all your items in one place, but also "report" the same entry to another list at the same time.</li>
                <li><span className={styles.iColNamU}>CCEmail:</span>Intent is to have ability to send an email when creating item with a project that has a CCEmail.</li>
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