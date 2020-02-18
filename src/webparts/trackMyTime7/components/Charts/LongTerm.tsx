import * as React from 'react';

import { IChartData, IChartSeries} from '../ITrackMyTime7State';

import * as strings from 'TrackMyTime7WebPartStrings';

import { ChartControl, ChartType } from '@pnp/spfx-controls-react/lib/ChartControl';
import { CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';

import styles from '../TrackMyTime7.module.scss';

import { create1SeriesCharts, creatLineChart } from './charts';

export interface IChartLongTermProps {
    chartData: IChartData;
    showCharts: boolean;
    allLoaded: boolean;
}

export interface IChartLongTermState {
    choice: string;
    showIntro: boolean;
    showDetails: boolean;
}

export default class ChartLongTerm extends React.Component<IChartLongTermProps, IChartLongTermState> {


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

public constructor(props:IChartLongTermProps){
    super(props);
    this.state = { 
        choice: 'string',
        showIntro: true,
        showDetails: false,

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

    public render(): React.ReactElement<IChartLongTermProps> {

        if ( this.props.allLoaded && this.props.showCharts ) {
            console.log('chartsClass.tsx', this.props, this.state);

            const stackChartTokens: IStackTokens = { childrenGap: 30 };

            let chartThisWeek = create1SeriesCharts( this.props.chartData.thisWeek[0], ChartType.Bar ) ;
            let chartThisMonth = create1SeriesCharts( this.props.chartData.thisMonth[0], ChartType.Bar ) ;
            let chartThisYear0 = create1SeriesCharts( this.props.chartData.thisYear[0], ChartType.Bar ) ;
            let chartThisYear1 = create1SeriesCharts( this.props.chartData.thisYear[1], ChartType.Bar ) ;
    
            let chartDailyHistory = create1SeriesCharts( this.props.chartData.allDays, ChartType.Line ) ;
            let chartWeeklyHistory = create1SeriesCharts( this.props.chartData.allWeeks, ChartType.Line ) ;
            let chartMonthlyHistory = create1SeriesCharts( this.props.chartData.allMonths, ChartType.Line ) ;
            let chartYearlyHistory = create1SeriesCharts( this.props.chartData.allYears, ChartType.Line ) ;    
    
            let chartCategory1 = create1SeriesCharts( this.props.chartData.categories[0], ChartType.HorizontalBar ) ;    
            let chartCategory2 = create1SeriesCharts( this.props.chartData.categories[1], ChartType.HorizontalBar ) ;    
            let chartLocation = create1SeriesCharts( this.props.chartData.location, ChartType.Doughnut ) ;    
            let chartContemp = create1SeriesCharts( this.props.chartData.contemp, ChartType.Doughnut ) ;   
    
            let chartEntryType =  create1SeriesCharts( this.props.chartData.entryType, ChartType.Doughnut ) ;   

            return (
                <div>
                    <Stack horizontal={true} wrap={true} horizontalAlign={"stretch"} tokens={stackChartTokens}>
                        <Stack.Item align="stretch" className={styles.chartPadding}>
                            { chartThisWeek }
                        </Stack.Item>
                        <Stack.Item align="stretch" className={styles.chartPadding}>
                            { chartThisMonth }
                        </Stack.Item>
                        <Stack.Item align="stretch" className={styles.chartPadding}>
                            { chartThisYear0 }
                        </Stack.Item>
                        <Stack.Item align="stretch" className={styles.chartPadding}>
                            { chartThisYear1 }
                        </Stack.Item>

                        <Stack.Item align="stretch" className={styles.chartPadding}>
                            { chartWeeklyHistory }
                        </Stack.Item>
                        <Stack.Item align="stretch" className={styles.chartPadding}>
                            { chartMonthlyHistory }
                        </Stack.Item>            
                        <Stack.Item align="stretch" className={styles.chartPadding}>
                            { chartYearlyHistory }
                        </Stack.Item>

                        <Stack.Item align="stretch" className={styles.chartPadding}>
                            { chartCategory1 }
                        </Stack.Item>
                        <Stack.Item align="stretch" className={styles.chartPadding}>
                            { chartCategory2 }
                        </Stack.Item>
                        <Stack.Item align="stretch" className={styles.chartPadding}>
                            { chartEntryType }
                        </Stack.Item>
                        <Stack.Item align="stretch" className={styles.chartPadding}>
                            { chartContemp }
                        </Stack.Item>
                        <Stack.Item align="stretch" className={styles.chartPadding}>
                            { chartLocation }
                        </Stack.Item>
                    </Stack>

                    <div className={styles.chartHeight}>
                    { chartDailyHistory }
                    </div>
                </div>

            );
            
        } else {
            console.log('chartsClass.tsx return null');
            return ( null );
        }

    }   //End Public Render

}