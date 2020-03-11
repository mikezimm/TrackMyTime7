import * as React from 'react';

import * as strings from 'TrackMyTime7WebPartStrings';

import * as links from './AllLinks';

import { Link, ILinkProps } from 'office-ui-fabric-react';
import { CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';
import { IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

import { ITrackMyTime7Props } from '../ITrackMyTime7Props';
import { ITrackMyTime7State } from '../ITrackMyTime7State';
import styles from './InfoPane.module.scss';

export interface IInfoDevelopersProps {
    showInfo: boolean;
    allLoaded: boolean;
    parentProps: ITrackMyTime7Props;
    parentState: ITrackMyTime7State;

}

export interface IInfoDevelopersState {
    selectedChoice: string;
    lastChoice: string;
}

export default class InfoDevelopers extends React.Component<IInfoDevelopersProps, IInfoDevelopersState> {


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

public constructor(props:IInfoDevelopersProps){
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

    public render(): React.ReactElement<IInfoDevelopersProps> {

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

            thisPage = <div>
                <h2></h2>
                <table className={styles.infoTable}>
                    <tr><th>MS Dev Docs</th><th>Github</th><th>Description</th></tr>
                    <tr><td>{links.devDocsWeb}</td><td>{links.gitRepoSPFxContReact}</td><td>MSFT Dev Docs for Fabric React UI Components</td></tr>
                    <tr><td>{links.devDocsIcon}</td><td></td><td>Icons used webpart and also available for Project Options</td></tr>                                
                    <tr><td>{links.devDocsText}</td><td></td><td>Used for text input on entry form</td></tr>
                    <tr><td>{links.devDocsDate}</td><td>{links.gitSampleReactDate}</td><td>Used for Manual Time Entry</td></tr>                                
                    <tr><td>{links.devDocsSlider}</td><td></td><td>Used for Time Slider</td></tr>
                    <tr><td>{links.devDocsToggle}</td><td></td><td>Used for Toggle function</td></tr>
                    <tr><td>{links.devDocsChoice}</td><td></td><td>Used for Choice selection</td></tr>


                    
                    <tr><td>{links.devDocsButton}</td><td></td><td>This is used for Save Entry, Clear Form buttons</td></tr>
                    <tr><td>{links.devDocsStack}</td><td></td><td>Used in general for layout of components</td></tr>
                    <tr><td>{links.devDocsList}</td><td>{links.gitSampleReactList}</td><td>Used for Projects and History List</td></tr>
                    <tr><td>{links.devDocsPivo}</td><td></td><td>Used to select Project Filter</td></tr>

                    <tr><td>{links.devDocsLink}</td><td></td><td>Used for Links</td></tr>
                    

                    <tr><td>{links.chartJSSamples}</td><td></td><td>Used for all charts</td></tr>                    

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
