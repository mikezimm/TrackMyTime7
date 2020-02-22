import * as React from 'react';

import * as strings from 'TrackMyTime7WebPartStrings';

import { Link, ILinkProps } from 'office-ui-fabric-react';

import * as links from './AllLinks';   //              { links.gitRepoTrackMyTime.issues }

import { CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';
import { IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

import { ITrackMyTime7Props } from '../ITrackMyTime7Props';
import { ITrackMyTime7State } from '../ITrackMyTime7State';
import styles from './InfoPane.module.scss';

export interface IAdvancedProps {
    showInfo: boolean;
    allLoaded: boolean;
    parentProps: ITrackMyTime7Props;
    parentState: ITrackMyTime7State;

}

export interface IAdvancedState {
    selectedChoice: string;
    lastChoice: string;
}

export default class Advanced extends React.Component<IAdvancedProps, IAdvancedState> {


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

public constructor(props:IAdvancedProps){
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

    public render(): React.ReactElement<IAdvancedProps> {

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
            let projectID0 = <tr><td>ProjectID1/2</td><td>{links.devDocsText}</td><td>See documentation link for additional syntax options.</td></tr>;
            let projectID1 = <tr><td></td><td>PrefixText...</td><td>Text followed by 3 dots will always include the PrefixText and then let you type whatever you want after that.</td></tr>;
            let projectID2 = <tr><td></td><td>mask=aa99</td><td>Start column with 'mask=', followed by text.  Use 'a' to require a letter and '9' for any number.  Any other characters become part of the result value.</td></tr>;
            let projectID3 = <tr><td></td><td>mask=aa99</td><td>This example will force the user to enter 2 letters followed by 2 numbers.</td></tr>;
            let projectID4 = <tr><td></td><td>mask=(999) 999-9999</td><td>This example will force user to enter a phone number in US Format</td></tr>;
            let projectID5 = <tr><td>ProjectID1/2<br/>Category1/2</td><td>hideme;ThisProject</td><td>Begin ProjectID Value with 'hideme;' and it will hide that column from the entry form and auto-paste the remaining text in the saved item.  In this case, you will not see the field in the entry form and the text 'ThisProject' will be pasted into the save entry for this field.</td></tr>;


            

            let Category0 = <tr><td>Category1/2</td><td></td><td></td></tr>;

            let options0 = <tr><td>Options</td><td>prop1=val1;prop2=val2</td><td>Sets Project list formatting.  Properties should be <b>separated by ; with = between property and setting</b>.  Use standard css syntax for colors and sizes... examples:  32px, x-large, green, #33333</td></tr>;
            let options1 = <tr><td></td><td>size=20px;icon=Mail</td><td>size sets the font-size.  icon adds an {links.devDocsIcon} to left of Project Title</td></tr>;
            let options2 = <tr><td></td><td>fWeight=bold;fStyle=italic</td><td>size sets font-weight and font-style</td></tr>;
            let options3 = <tr><td></td><td>fcolor=red;bgColor=yellow</td><td>sets font-color to red, icon-color to green, background to yellow</td></tr>;

            thisPage = <div>
                <h2></h2>
                <table className={styles.infoTable}>
                    <tr><th>Column</th><th>Example</th><th>What it does</th></tr>

                    { projectID0 }
                    { projectID1 }
                    { projectID2 }
                    { projectID3 }
                    { projectID4 }
                    { projectID5 }

                    { Category0 }

                    { options0 }
                    { options1 }
                    { options2 }
                    { options3 }
                          
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