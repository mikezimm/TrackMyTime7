import * as React from 'react';

import { IChartData, IChartSeries} from '../ITrackMyTime7State';

import * as strings from 'TrackMyTime7WebPartStrings';

import * as links from './AllLinks';

import { ChartControl, ChartType } from '@pnp/spfx-controls-react/lib/ChartControl';
import { CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';
import { IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

import { ITrackMyTime7Props } from '../ITrackMyTime7Props';
import { ITrackMyTime7State } from '../ITrackMyTime7State';
import styles from './InfoPane.module.scss';

import * as choiceBuilders from '../fields/choiceFieldBuilder';

import { Toggle } from 'office-ui-fabric-react/lib/Toggle';

import Errors from './Errors';
import Basics from './Basics';
import Advanced from './Advanced';

import InfoDevelopers from './Developers';
import GettingStarted from './GettingStarted';
import FuturePlans from './FuturePlans';

export interface IInfoPageProps {
    showInfo: boolean;
    allLoaded: boolean;
    parentProps: ITrackMyTime7Props;
    parentState: ITrackMyTime7State;
    toggleDebug: any;

}

export interface IInfoPageState {
    selectedChoice: string;
    lastChoice: string;

}

export default class InfoPage extends React.Component<IInfoPageProps, IInfoPageState> {


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

public constructor(props:IInfoPageProps){
    super(props);
    this.state = { 
        selectedChoice: 'gettingStarted',
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

    public render(): React.ReactElement<IInfoPageProps> {

        if ( this.props.allLoaded && this.props.showInfo ) {
            console.log('infoPages.tsx', this.props, this.state);

            let pageChoices = choiceBuilders.creatInfoChoices(this.state.selectedChoice, this._updateChoice.bind(this));
            let thisPage = null;

            if ( this.state.selectedChoice === 'gettingStarted' ) {
                thisPage = <GettingStarted 
                    parentProps={  this.props.parentProps }
                    parentState={  this.props.parentState }
                    allLoaded={ this.props.allLoaded }
                    showInfo={ this.props.showInfo }
                ></GettingStarted>;
            } else if ( this.state.selectedChoice === 'basics' ) {
                thisPage = <Basics 
                    parentProps={  this.props.parentProps }
                    parentState={  this.props.parentState }
                    allLoaded={ this.props.allLoaded }
                    showInfo={ this.props.showInfo }
                ></Basics>;
            } else if ( this.state.selectedChoice === 'advanced' ) {
                thisPage = <Advanced 
                    parentProps={  this.props.parentProps }
                    parentState={  this.props.parentState }
                    allLoaded={ this.props.allLoaded }
                    showInfo={ this.props.showInfo }
                ></Advanced>;
            } else if ( this.state.selectedChoice === 'futurePlans' ) {
                thisPage = <FuturePlans 
                    parentProps={  this.props.parentProps }
                    parentState={  this.props.parentState }
                    allLoaded={ this.props.allLoaded }
                    showInfo={ this.props.showInfo }
                ></FuturePlans>;
            } else if ( this.state.selectedChoice === 'dev' ) {
                thisPage = <InfoDevelopers 
                    parentProps={  this.props.parentProps }
                    parentState={  this.props.parentState }
                    allLoaded={ this.props.allLoaded }
                    showInfo={ this.props.showInfo }
                ></InfoDevelopers>;
            } else if ( this.state.selectedChoice === 'errors' ) {
                thisPage = <Errors 
                    parentProps={  this.props.parentProps }
                    parentState={  this.props.parentState }
                    allLoaded={ this.props.allLoaded }
                    showInfo={ this.props.showInfo }
                ></Errors>;
            }

/*
            https://www.freecodecamp.org/news/a-complete-beginners-guide-to-react-router-include-router-hooks/
            const Contact = () => (
                <Fragment>
                <h1>Contact</h1>
                <FakeText />
                </Fragment>
                );
*/

            /*
            else if ( this.state.selectedChoice === 'advanced' ) {
                thisPage = <FuturePlans 
                    parentProps={  this.props.parentProps }
                    parentState={  this.props.parentState }
                    allLoaded={ this.props.allLoaded }
                    showInfo={ this.props.showInfo }
                ></FuturePlans>;
            } else if ( this.state.selectedChoice === 'errors' ) {
                thisPage = <FuturePlans 
                    parentProps={  this.props.parentProps }
                    parentState={  this.props.parentState }
                    allLoaded={ this.props.allLoaded }
                    showInfo={ this.props.showInfo }
                ></FuturePlans>;

            }
            */

            //toggleDebug

            const stackButtonTokensBody: IStackTokens = { childrenGap: 40 };

            let toggleDebug = <Toggle label="" 
            onText={ 'Debug colors' } 
            offText={ 'Default colors' } 
            onChange={this.props.toggleDebug.bind(this)} 
            checked={this.props.parentState.debugColors}
            styles={{ root: { width: 160, paddingTop: 13, paddingLeft: 20, } }}
            />;

            return (
                <div className={ styles.infoPane }>
                    <Stack padding={20} horizontal={true} horizontalAlign={"space-between"} tokens={stackButtonTokensBody}> {/* Stack for Projects and body */}
                        { pageChoices }
                        { toggleDebug }
                    </Stack>
                    { thisPage }
                </div>
            );
            
        } else {
            //console.log('infoPages.tsx return null');
            return ( null );
        }

    }   //End Public Render


/***
 *         db    db d8888b.       .o88b. db   db  .d88b.  d888888b  .o88b. d88888b 
 *         88    88 88  `8D      d8P  Y8 88   88 .8P  Y8.   `88'   d8P  Y8 88'     
 *         88    88 88oodD'      8P      88ooo88 88    88    88    8P      88ooooo 
 *         88    88 88~~~        8b      88~~~88 88    88    88    8b      88~~~~~ 
 *         88b  d88 88           Y8b  d8 88   88 `8b  d8'   .88.   Y8b  d8 88.     
 *         ~Y8888P' 88            `Y88P' YP   YP  `Y88P'  Y888888P  `Y88P' Y88888P 
 *                                                                                 
 *                                                                                 
 */

private _updateChoice(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption){

    let currentChoice = this.state.selectedChoice;
    let newChoice = option.key;

    this.setState({ 
        lastChoice: currentChoice,
        selectedChoice: newChoice,

     });
  }

}