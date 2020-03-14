import * as React from 'react';

import { IChartData, IChartSeries} from '../ITrackMyTime7State';

import * as strings from 'TrackMyTime7WebPartStrings';

import { ChartControl, ChartType } from '@pnp/spfx-controls-react/lib/ChartControl';
import { CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';

import styles from '../TrackMyTime7.module.scss';

import { create1SeriesCharts, createMultiSeries1ScaleCharts, creatLineChart } from './charts';
import { IDataOptions } from './chartsPage';

export interface IChartUsageProps {
    chartData: IChartData;
    showCharts: boolean;
    allLoaded: boolean;
    story: string;
    user: string;
    index: number;
    WebpartHeight?:  number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
    WebpartWidth?:   number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
    dataOptions?: IDataOptions;
}

export interface IChartUsageState {
    showIntro: boolean;
    showDetails: boolean;
    index: number;
}

export default class ChartUsage extends React.Component<IChartUsageProps, IChartUsageState> {


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

public constructor(props:IChartUsageProps){
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

  public componentDidUpdate(prevProps: IChartUsageProps){

    let rebuildCharts = false;
    
    if (prevProps.story !== this.props.story || this.props.index !== prevProps.index ) {
        rebuildCharts = true;
        console.log('Usage cdu');
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

    public render(): React.ReactElement<IChartUsageProps> {

        console.log('Usage render');
        if ( this.props.allLoaded && this.props.showCharts && this.props.chartData != null ) {
            console.log('Usage.tsx', this.props, this.state);

            const stackChartTokens: IStackTokens = { childrenGap: 30 };
    
            let stacked2 = this.props.chartData.coreTimeS.cores.map( s => s );
            console.log('stacked2', stacked2);
            let chartYearlyCoreTime = createMultiSeries1ScaleCharts('Core time', true, true, stacked2, 
                    this.props.chartData.storyIndex, ChartType.Line, this.props.WebpartWidth, this.props.dataOptions);


            let chartLocation = create1SeriesCharts( this.props.chartData.location, ChartType.Doughnut, this.props.dataOptions ) ;    
            let chartContemp = create1SeriesCharts( this.props.chartData.contemp, ChartType.Doughnut, this.props.dataOptions ) ;   
            let chartEntryType = create1SeriesCharts( this.props.chartData.entryType, ChartType.Doughnut, this.props.dataOptions ) ; 
            let chartKeyChanges = create1SeriesCharts( this.props.chartData.keyChanges, ChartType.HorizontalBar, this.props.dataOptions ) ;
            let chartCoreTime = create1SeriesCharts( this.props.chartData.coreTimeS.coreTime, ChartType.HorizontalBar, this.props.dataOptions ) ;

            return (
                <div>
                    <Stack horizontal={true} wrap={true} horizontalAlign={"stretch"} tokens={stackChartTokens}>

                        <Stack.Item align="stretch" className={styles.chartPadding}>
                            { chartEntryType }
                        </Stack.Item>
                        <Stack.Item align="stretch" className={styles.chartPadding}>
                            { chartContemp }
                        </Stack.Item>
                        <Stack.Item align="stretch" className={styles.chartPadding}>
                            { chartLocation }
                        </Stack.Item>
                        <Stack.Item align="stretch" className={styles.chartPadding}>
                            { chartKeyChanges }
                        </Stack.Item>
                        <Stack.Item align="stretch" className={styles.chartPadding}>
                            { chartCoreTime }
                        </Stack.Item>
                        

                    </Stack>

                    <div className={styles.chartHeight300}>
                        { chartYearlyCoreTime }
                    </div>
                    
                </div>

            );
            
        } else {
            console.log('chartsClass.tsx return null');
            return ( null );
        }

    }   //End Public Render

}