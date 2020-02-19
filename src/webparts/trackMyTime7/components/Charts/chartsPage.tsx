import * as React from 'react';

import { IChartData, IChartSeries} from '../ITrackMyTime7State';

import * as strings from 'TrackMyTime7WebPartStrings';

import { ChartControl, ChartType } from '@pnp/spfx-controls-react/lib/ChartControl';
import { CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';
import { IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

import styles from '../TrackMyTime7.module.scss';

import { create1SeriesCharts, creatLineChart } from './charts';

import LongTerm from './LongTerm';
import Snapshot from './Snapshot';
import Story from './Story';
import Usage from './Usage';




import * as choiceBuilders from '../fields/choiceFieldBuilder';

export interface IChartPageProps {
    chartData: IChartData;
    showCharts: boolean;
    allLoaded: boolean;
}

export interface IChartPageState {
    selectedChoice: string;
    lastChoice: string;
}

export default class ChartsPage extends React.Component<IChartPageProps, IChartPageState> {


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

public constructor(props:IChartPageProps){
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

    public render(): React.ReactElement<IChartPageProps> {

        if ( this.props.allLoaded && this.props.showCharts ) {
            console.log('chartsClass.tsx', this.props, this.state);

            let pageChoices = choiceBuilders.creatChartChoices(this.state.selectedChoice, this._updateChoice.bind(this));

            let thisPage = null;
            
            if ( this.state.selectedChoice === 'longTerm' ) {
                thisPage = <div><LongTerm 
                    allLoaded={ this.props.allLoaded }
                    showCharts={ this.props.showCharts }
                    chartData={ this.props.chartData }
                ></LongTerm></div>;
            } else if ( this.state.selectedChoice === 'snapShot' ) {
                thisPage = <div><Snapshot 
                    allLoaded={ this.props.allLoaded }
                    showCharts={ this.props.showCharts }
                    chartData={ this.props.chartData }
                ></Snapshot></div>;
            } else if ( this.state.selectedChoice === 'story' ) {
                thisPage = <div><Story 
                    allLoaded={ this.props.allLoaded }
                    showCharts={ this.props.showCharts }
                    chartData={ this.props.chartData }
                ></Story></div>;
            } else if ( this.state.selectedChoice === 'usage' ) {
                thisPage = <div><Usage 
                    allLoaded={ this.props.allLoaded }
                    showCharts={ this.props.showCharts }
                    chartData={ this.props.chartData }
                ></Usage></div>;
            }

            return (
                <div className={ styles.infoPane }>
                    { pageChoices }
                    { thisPage }
                </div>
            );
            
        } else {
            console.log('chartsClass.tsx return null');
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