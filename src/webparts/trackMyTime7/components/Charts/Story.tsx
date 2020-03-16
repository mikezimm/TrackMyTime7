import * as React from 'react';

import { IChartData, IChartSeries} from '../ITrackMyTime7State';

import * as strings from 'TrackMyTime7WebPartStrings';

import { ChartControl, ChartType } from '@pnp/spfx-controls-react/lib/ChartControl';
import { CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';

import styles from '../TrackMyTime7.module.scss';
import stylesC from './chartsPage.module.scss';

import { create1SeriesCharts, creatLineChart, createMultiSeries1ScaleCharts, create1TallSeriesCharts } from './charts';
import { IDataOptions } from './chartsPage';

export interface IChartStoryProps {
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

export interface IChartStoryState {
    showIntro: boolean;
    showDetails: boolean;
    index: number;
}

export default class ChartStory extends React.Component<IChartStoryProps, IChartStoryState> {


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

public constructor(props:IChartStoryProps){
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

  public componentDidUpdate(prevProps: IChartStoryProps){

    let rebuildCharts = false;
    
    if (prevProps.story !== this.props.story || this.props.index !== prevProps.index ) {
        rebuildCharts = true;
        console.log('Story cdu');
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

    public render(): React.ReactElement<IChartStoryProps> {

        //console.log('Story render');
        if ( this.props.allLoaded && this.props.showCharts && this.props.chartData != null ) {
            //console.log('Story.tsx', this.props, this.state);

            const stackChartTokens: IStackTokens = { childrenGap: 30 };


            let stacked = [this.props.chartData.stories.stories[0], this.props.chartData.stories.stories[2]];
            let stacked2 = this.props.chartData.stories.stories.map( s => s );
            //console.log('stacked2', stacked2);
            let chartYearlyStory = createMultiSeries1ScaleCharts('Stories', true, true, stacked2, 
                    this.props.chartData.storyIndex, ChartType.Line, this.props.WebpartWidth, this.props.dataOptions);

            let chartClass = null;
            let chaptersLength = this.props.chartData.stories.chapters.length;

            let WebpartRatio = this.props.WebpartWidth /( 800 );

            if ( chaptersLength < 2 || this.props.WebpartWidth < 600 ) {  //Single or no charts or narrow screen (not big enough for 2 charts), width = 100%
                chartClass = stylesC.chartW100;
                WebpartRatio = this.props.WebpartWidth / 300;

            } else if ( chaptersLength === 2 || chaptersLength === 4 ) { // 2 or 4 set to 50%
                chartClass = stylesC.chartW45;

            } else if ( chaptersLength > 3 ) {
                chartClass = stylesC.chartW33;

            } else {
                chartClass = stylesC.chartW100;
            }

            console.log('chartClass', chaptersLength, chartClass);

            let chapters = this.props.chartData.stories.chapters.map(
                s => {
                    let theseChapters = s.labels.length === 0 || s.totalS === 0 ? null : create1TallSeriesCharts( s, ChartType.HorizontalBar, WebpartRatio, this.props.dataOptions, chartClass );
                    return ( theseChapters );
                }
            );

            
            let noChapters = this.props.chartData.stories.chapters.map(
                s => {
                    let theseChapters = s.labels.length === 0 || s.totalS === 0 ? <li>{ s.title }</li> : null;
                    return ( theseChapters );
                }
            );
            
            let noChaptersTable = <div>
                <ul> { noChapters } </ul>
            </div>;

            return (
                <div>
                    <div className={styles.chartHeight300}>
                        { chartYearlyStory }
                    </div>
                    { noChaptersTable }
                    <Stack horizontal={true} wrap={true} horizontalAlign={"stretch"} tokens={stackChartTokens}>
                        { chapters }
                    </Stack>
                </div>

            );
            
        } else {
            console.log('chartsClass.tsx return null');
            return ( null );
        }

    }   //End Public Render

}