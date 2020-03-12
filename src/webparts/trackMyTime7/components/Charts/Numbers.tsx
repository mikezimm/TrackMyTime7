import * as React from 'react';

import { IChartData, IChartSeries} from '../ITrackMyTime7State';

import * as strings from 'TrackMyTime7WebPartStrings';

import * as links from '../HelpInfo/AllLinks';

import { ChartControl, ChartType } from '@pnp/spfx-controls-react/lib/ChartControl';
import { CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';

import styles from '../TrackMyTime7.module.scss';
import stylesC from './chartsPage.module.scss';
import stylesI from '../HelpInfo/InfoPane.module.scss';
import WebPartLinks from '../HelpInfo/WebPartLinks';

import { create1SeriesCharts, creatLineChart } from './charts';
import { IDataOptions } from './chartsPage';

export interface IChartNumbersProps {
    chartData: IChartData;
    showCharts: boolean;
    allLoaded: boolean;
    story: string;
    user: string;
    index: number;
    WebpartHeight?:  number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
    WebpartWidth?:   number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
    dataOptions?: IDataOptions;

    projectListURL?: string; //WebPartLinks
    projectListName?: string;
    timeTrackerListURL?: string;
    timeTrackListName?: string;

}

export interface IChartNumbersState {
    showIntro: boolean;
    showDetails: boolean;
    index: number;
}

export default class ChartNumbers extends React.Component<IChartNumbersProps, IChartNumbersState> {


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

public constructor(props:IChartNumbersProps){
    super(props);
    this.state = { 
        showIntro: true,
        showDetails: false,
        index: this.props.chartData.index,
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

  public componentDidUpdate(prevProps: IChartNumbersProps){

    let rebuildCharts = false;
    
    if (prevProps.story !== this.props.story || this.props.index !== prevProps.index ) {
        rebuildCharts = true;
        console.log('Numbers cdu');
    }
    if (prevProps.user !== this.props.user || this.props.index !== prevProps.index ) {
        rebuildCharts = true;
        console.log('Usage cdu');
    }  

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

    public render(): React.ReactElement<IChartNumbersProps> {

        console.log('Numbers render');
        if ( this.props.allLoaded && this.props.showCharts && this.props.chartData != null ) {

            const stackChartTokens: IStackTokens = { childrenGap: 30 };

            const whosData = this.props.chartData == null ? null :                 
                <tr><td>{'Who\'s entries'}</td><td>{this.props.chartData.users.join(', ')}</td></tr>;

            const whatData = this.props.chartData == null ? null :                 
                <tr><td>{'What entries'}</td><td>Selected Story/Chapter:  {this.props.story !== 'None' ? this.props.story : 'Everyone\'s'}</td></tr>;
            

            const totalSums = this.props.chartData.allYears.totalS;
            const totalHours = this.props.chartData == null ? null : 
                <tr><td>{'Filtered hours'}</td><td>{ totalSums.toFixed(1) }</td></tr>;

            const totalCounts = this.props.chartData.allYears.totalC;
            const totalCount = this.props.chartData == null ? null :                 
                <tr><td>{'Filtered count'}</td><td>{ totalCounts }</td></tr>;

            const timeRange = this.props.chartData == null ? null :                 
                <tr><td>{'Entire time range'}</td><td>{ this.props.chartData.dateRange.join(' - ') }</td></tr>;


            const userSummary = this.props.chartData.users.length == 0 ? null :  
            this.props.chartData.usersSummary.map( u => { 
                return <tr><td>{ u.Id }</td><td>{ u.title }</td>
                <td>{ u.count + ' or ' + ((u.count / totalCounts)*100).toFixed(1) + ' %'}</td>
                <td>{ u.hours.toFixed(1) + ' or ' + ((u.hours / totalSums)*100).toFixed(1) + ' %' }</td>
                <td>{ u.lastEntryText + ' ( -' + u.daysAgo + ' )' }</td>
                <td>{ u.stories.map( s => { return s; }).join(', ') }</td>
                </tr>; }

            );
            
            const stackTokensBody: IStackTokens = { childrenGap: 20 };

            return (
                <div>
                    <Stack horizontal={false} wrap={true} tokens={stackChartTokens}> 

                        <h2>Overall summary of selected data</h2>
                        <WebPartLinks
                            projectListURL={ this.props.projectListURL }
                            projectListName={ this.props.projectListName }
                            timeTrackerListURL={ this.props.timeTrackerListURL }
                            timeTrackListName={ this.props.timeTrackListName }
                        ></WebPartLinks>

                       <table className={stylesI.infoTable}>
                            <tr><th>{'Topic'}</th><th>{'Summary'}</th></tr>
                            { whosData }
                            { whatData }
                            { timeRange }
                            { totalHours }
                            { totalCount }

                        </table>

                        <table className={stylesI.infoTable}>
                            <tr><th>{'ID'}</th><th>{'Name'}</th><th>{'Count'}</th><th>{'Hours'}</th><th>{'Last Entry'}</th><th>{'Stories'}</th></tr>
                            { userSummary }

                        </table>

                    </Stack>

                </div>

            );
            
        } else {
            console.log('Numbers.tsx return null');
            return ( null );
        }

    }   //End Public Render

}