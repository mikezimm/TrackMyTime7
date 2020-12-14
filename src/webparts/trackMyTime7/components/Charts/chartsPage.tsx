import * as React from 'react';

import { ITrackMyTime7State, IChartData, ITimeEntry, IStories, ICoreTimes, IEntryInfo, IUserSummary } from '../ITrackMyTime7State';

import { IUser, ILink, IChartSeries, ICharNote,  } from '../../../../services/IReUsableInterfaces';

import { ITheTime } from '../../../../services/dateServices';

import { getAge, getDayTimeToMinutes, getBestTimeDelta, getLocalMonths, getTimeSpan, getGreeting,
    getNicks, makeTheTimeObject, getTimeDelta, monthStr3, weekday3, createDeltaDateArrays} from '../../../../services/dateServices';

import { camelize, } from '../../../../services/stringServices';

import * as strings from 'TrackMyTime7WebPartStrings';

import { ChartControl, ChartType } from '@pnp/spfx-controls-react/lib/ChartControl';
import { CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';
import { IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';

import styles from '../TrackMyTime7.module.scss';
import stylesC from './chartsPage.module.scss';
import stylesI from '../HelpInfo/InfoPane.module.scss';

import { create1SeriesCharts, creatLineChart } from './charts';

import LongTerm from './LongTerm';
import Snapshot from './Snapshot';
import Story from './Story';
import Usage from './Usage';
import Numbers from './Numbers';

import * as choiceBuilders from '../fields/choiceFieldBuilder';
import { createIconButton } from "../createButtons/IconButton";

import { any } from 'prop-types';

export interface ISelectedStory { key: string | number | undefined; text: string; }
export interface ISelectedUser { key: string | number | undefined; text: string; }

export interface IDataOptions {
    chartAllDetails?: boolean;
    chartTrace?: boolean;
    chartChanges?: boolean;  
    chartWarnings?: boolean;  
    chartErrors?: boolean;  
    chartItems?: boolean;
}

export interface IChartPageProps {
    showCharts: boolean;
    allLoaded: boolean;
    entries: IEntryInfo;
    entryCount: number;
    defaultStory?: string;
    defaultUser?: string;
    today: ITheTime;
    selectedStory: ISelectedStory;
    selectedUser: ISelectedUser;
    chartStringFilter: string;
    _updateStory: any;
    _updateUserFilter: any;
    _updateChartFilter: any;
    _getMoreItems: any;

    WebpartHeight?:  number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
    WebpartWidth?:   number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
    userFilter?: 'all' | 'user'; 
    
    parentState: ITrackMyTime7State;

}

export interface IChartPageState {
    selectedChoice: string;
    lastChoice: string;
    lastStory:  ISelectedStory;
    lastUser:  ISelectedUser;

    selectedStory: ISelectedStory;
    selectedUser: ISelectedUser;
    chartStringFilter: string;

    chartData?: IChartData;
    processedChartData: boolean;
    WebpartHeight?:  number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
    WebpartWidth?:   number;    //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
    userFilter?: 'all' | 'user';

    chartDetails?: boolean;

    dataOptions?: IDataOptions;

}

export interface ISearchObject {
    bucket: string;
    label: string;
    value: number;
    orig: string;
    rev: string;
    valid: boolean;
}
export const defStory: ISelectedStory = {
    key: "None",
    text: "None",
};

export const curUser: ISelectedUser = {
  key: "user",
  text: "User",
};

export const allUser: ISelectedUser = {
  key: "all",
  text: "All",
};

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
        selectedChoice: 'numbers',
        lastChoice: '',
        lastStory: defStory,
        lastUser: curUser,
        selectedStory: this.props.selectedStory ? this.props.selectedStory : {key: this.props.defaultStory, text: this.props.defaultStory},
        selectedUser: this.props.selectedUser ? this.props.selectedUser : curUser ,
        chartStringFilter: this.props.chartStringFilter ? this.props.chartStringFilter : null ,
        
        chartData: null,
        processedChartData: false,
        //Size courtesy of https://www.netwoven.com/2018/11/13/resizing-of-spfx-react-web-parts-in-different-scenarios/
        WebpartHeight: this.props.WebpartHeight,
        WebpartWidth: this.props.WebpartWidth,
        userFilter: this.props.userFilter != null ? this.props.userFilter : 'user',

        chartDetails: false,

        dataOptions: {
          chartAllDetails: false,
          chartTrace: false,
          chartChanges: false, 
          chartWarnings: false, 
          chartErrors: false, 
          chartItems: false,
        }

    };

    // because our event handler needs access to the component, bind 
    //  the component to the function so it can get access to the
    //  components properties (this.props)... otherwise "this" is undefined
    // this.onLinkClick = this.onLinkClick.bind(this);

    this._onUserChange = this._onUserChange.bind(this);
    this._onStoryChange = this._onStoryChange.bind(this);
    this._updateStory = this._updateStory.bind(this);
    this._updateUserFilter = this._updateUserFilter.bind(this);
    this._updateChartFilter = this._updateChartFilter.bind(this);    
    
    console.log('chartsPage Props:', this.props);
  }


  public componentDidMount() {

    if (this.props.allLoaded && this.props.showCharts && !this.state.processedChartData ) {
      console.log('chartsPage componentDidMount 0 Props:', this.props);
      this.processChartData(this.props.selectedUser,['what??'],10,'string', this.props.selectedStory, null, this.props.chartStringFilter );
    }
          /*

      */

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
    
    //let rebuildTiles = false;
    if ( !this.props.allLoaded || !this.props.showCharts ) {
      
    } else if ( this.props.allLoaded && this.props.showCharts && !this.state.processedChartData ) {
      console.log('chartsPage componentDidUpdate 1 Props:', this.props);
      this.processChartData(this.props.selectedUser,['what??'],10,'string', this.props.selectedStory, null, this.props.chartStringFilter );

    } else if ( this.props.selectedStory.text !== prevProps.selectedStory.text ) {
      console.log('chartsPage componentDidUpdate 2 Props:', this.props);
      //NOTE:  This is a duplicate call under _updateStory but is required to redraw charts on story change.
      this.processChartData(this.props.selectedUser,['what??'],10,'string', this.props.selectedStory, null, this.props.chartStringFilter );
      this.processChartData(this.props.selectedUser,['what??'],10,'string', this.props.selectedStory, null, this.props.chartStringFilter );

    } else if ( this.props.selectedUser.text !== prevProps.selectedUser.text ) {
      console.log('chartsPage componentDidUpdate 3 Props:', this.props);
      //NOTE:  This is a duplicate call under _updateStory but is required to redraw charts on story change.
      this.processChartData(this.props.selectedUser,['what??'],10,'string', this.props.selectedStory, null, this.props.chartStringFilter );
      this.processChartData(this.props.selectedUser,['what??'],10,'string', this.props.selectedStory, null, this.props.chartStringFilter );

    } else if ( this.props.chartStringFilter !== prevProps.chartStringFilter ) {
      console.log('chartsPage componentDidUpdate 3 Props:', this.props);
      //NOTE:  This is a duplicate call under _updateChartFilter but is required to redraw charts on story change.
      this.processChartData(this.props.selectedUser,['what??'],10,'string', this.props.selectedStory, null, this.props.chartStringFilter );
      this.processChartData(this.props.selectedUser,['what??'],10,'string', this.props.selectedStory, null, this.props.chartStringFilter );

    } else if ( this.props.entryCount !== prevProps.entryCount ) {
      console.log('chartsPage componentDidUpdate 3 Props:', this.props);
      //NOTE:  This is a duplicate call under _updateChartFilter but is required to redraw charts on story change.
      this.processChartData(this.props.selectedUser,['what??'],10,'string', this.props.selectedStory, null, this.props.chartStringFilter );
      this.processChartData(this.props.selectedUser,['what??'],10,'string', this.props.selectedStory, null, this.props.chartStringFilter );
    }

    

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

        if ( this.props.allLoaded && this.props.showCharts && this.state.processedChartData === true ) {
            console.log('chartsClass.tsx', this.props, this.state);

            const dropdownStyles: Partial<IDropdownStyles> = {
              dropdown: { width: 150 }
            };

            let sOptions: IDropdownOption[] = this.state.chartData == null ? null : 
                this.state.chartData.stories.titles.map(val => {
                    return {
                        key: val,
                        text: val,
                    };
                });
            

            sOptions.unshift(defStory);

            let storyDropdown = sOptions == null ? null : <div
                style={{  paddingTop: 10  }}
                  ><Dropdown 
                  placeholder="Select a Story" 
                  label="" 
                  selectedKey={ this.props.selectedStory ? this.props.selectedStory.key : undefined }
                  onChange={ this._onStoryChange }
                  options={ sOptions } 
                  styles={{  dropdown: { width: 175 }   }}
                />
              </div>;
              let uOptions = [curUser, allUser];
              let userDropdown = uOptions == null ? null : <div
              style={{  paddingTop: 10  }}
                ><Dropdown 
                placeholder="Select Data" 
                label="" 
                selectedKey={ this.props.selectedUser.key ? this.props.selectedUser.key : undefined }
                onChange={ this._onUserChange }
                options={ uOptions } 
                styles={{  dropdown: { width: 175 }   }}
              />
              </div>;
/*
            let toggleUser = <Toggle label="" 
              onText={ 'All' } 
              offText={ 'You' } 
              onChange={ this.toggleUserFilter } 
              checked={ this.state.userFilter === 'user' ? false : true }
              styles={{ root: { width: 120, paddingTop: 13, } }}
            />;
*/

            let toggleDetails = <Toggle label="" 
              onText={ 'Details' } 
              offText={ 'No Details' } 
              onChange={ this.toggleChartDetails } 
              checked={ this.state.chartDetails }
              styles={{ root: { width: 140, paddingTop: 13, } }}
            />;

/*
            chartTrace: false,
            chartChanges: false,
            chartWarnings: false,
            chartErrors: false,
*/

            const togAllDetails = <Toggle label="" 
              onText={ 'All Details' } 
              offText={ 'No Details' } 
              onChange={ this.toggleAllDetails } 
              checked={ this.state.dataOptions.chartAllDetails }
              styles={{ root: { width: 140, paddingTop: 13, } }}
            />;

            const togTrace = <Toggle label="" 
              onText={ 'Trace data' } 
              offText={ 'No Trace' } 
              onChange={ this.toggleTrace } 
              checked={ this.state.dataOptions.chartTrace }
              styles={{ root: { width: 140, paddingTop: 13, } }}
            />;

            const togChanges = <Toggle label="" 
              onText={ 'Changes' } 
              offText={ 'No Changes' } 
              onChange={ this.toggleChanges } 
              checked={ this.state.dataOptions.chartChanges }
              styles={{ root: { width: 140, paddingTop: 13, } }}
            />;

            const togWarnings = <Toggle label="" 
              onText={ 'Warnings' } 
              offText={ 'No Warnings' } 
              onChange={ this.toggleWarnings } 
              checked={ this.state.dataOptions.chartWarnings }
              styles={{ root: { width: 150, paddingTop: 13, } }}
            />;

            const togErrors = <Toggle label="" 
              onText={ 'Errors' } 
              offText={ 'No Errors' } 
              onChange={ this.toggleErrors } 
              checked={ this.state.dataOptions.chartErrors }
              styles={{ root: { width: 140, paddingTop: 13, } }}
            />;

            const togItems = <Toggle label="" 
              onText={ 'Items' } 
              offText={ 'No Items' } 
              onChange={ this.toggleItems } 
              checked={ this.state.dataOptions.chartItems }
              styles={{ root: { width: 140, paddingTop: 13, } }}
            />;

            const searchBox = <SearchBox 
              placeholder="Search chart data     - ie:  text,    Story:Track,    ?last20days,    ?first20items"
              onChange={ this._onChartFilterChange }
              onSearch={ this._onChartFilterChange }
              onClear={ this._onChartFilterClear }
              underlined={true}
              styles={{ root: { marginTop: 10, marginBottom: 10 } }}
            />;

              const moreItemsStyles = {
                root: {padding:'10px !important', marginTop: '6px', backgroundColor: 'white', id: 'ZZZZZChart1234'},//color: 'green' works here
                icon: { 
                    fontWeight: 900,
                    //color: item.font.color ? item.font.color :'#00457e', //This will set icon color
                },
            };

            let getMoreItems = createIconButton('Add','Get more items',this.props._getMoreItems.bind(this), null, moreItemsStyles, false );
            
            const ColoredLine = ({ color }) => ( <hr style={{ color: color, backgroundColor: color, height: 1 }}/> );

            const stackToggleTokensBody: IStackTokens = { childrenGap: 20 };
            let detailToggles = <div className={ [stylesC.toggleDetailsBar, this.state.chartDetails ? stylesC.showDetailToggles : stylesC.hideDetailToggles].join(' ') }>
              <ColoredLine color="gray" />
              <Stack padding={0} horizontal={true} horizontalAlign={"space-between"} tokens={stackToggleTokensBody }> {/* Stack for Chart Toggles */}
                { togAllDetails }
                { togTrace }
                { togChanges }
                { togWarnings }
                { togErrors }
                { togItems }
                { getMoreItems }
              </Stack>
              { searchBox }
            </div>;

            const pageWarnItems = !this.state.dataOptions.chartWarnings || this.state.chartData.warnNotesAll.length < 1 ? null : 
                this.state.chartData.warnNotesAll.map( w => { return <tr><td>{'W'}</td><td>{w.parent}</td><td>{ w.source}</td><td>{w.note}</td></tr>; });

            const pageErrItems = !this.state.dataOptions.chartErrors || this.state.chartData.errorNotesAll.length < 1 ? null : 
                this.state.chartData.errorNotesAll.map( w => { return <tr><td>{'E'}</td><td>{w.parent}</td><td>{ w.source}</td><td>{w.note}</td></tr>; });

            const pageWarnTips = pageWarnItems == null ? null : <p>Common 'Warnings' include inconsistent categories or labels which we can not consolidate for you.
                Although we take the liberty to remove spaces and hyphens, we can not determine the best ProperCase for you.  
                If you want to fix them using this information, look for the TrackMyTime list column under 'Series' heading and search for values under 'Items'.  Common in-consistancies include ProperCase vs PROPERCASE.</p>;

            const pageNotes = pageWarnItems != null || pageErrItems != null ? <div>
              <h2>Error/Warning summary for all data</h2>
              <table className={stylesI.infoTable}>
                <tr><th>{'Type'}</th><th>{'Series'}</th><th>{'Item'}</th><th>{'Comments'}</th></tr>
                { pageErrItems }
                { pageWarnItems }
              </table>
              { pageWarnTips }
            </div> : null;


            //this.state.dataOptions.chartItems
            const chartItemsX = !this.state.dataOptions.chartItems ? null : 
              this.state.chartData.filterItems.map( d => { return <tr><td>{d}</td></tr>; });
            
            let tableTitle = this.state.chartData.filterItems.length + ' Items found';
            if ( this.state.chartStringFilter != null ) { tableTitle += ' with: '+ this.props.chartStringFilter; }

            const chartItems = !this.state.dataOptions.chartItems ? null : <div>
              <h2>{ tableTitle } </h2>
                <table className={stylesI.infoTable}>
                  <tr><th>{'Searched Items'}</th></tr>
                  { chartItemsX }
                </table>
              </div>;

            let pageChoices = choiceBuilders.creatChartChoices(this.state.selectedChoice, this._updateChoice.bind(this));

            let thisPage = null;
            
            if ( this.state.chartData != null ){
                if ( this.state.selectedChoice === 'longTerm' ) {
                    thisPage = <div><LongTerm 
                        index={ this.state.chartData.index }
                        story={ this.state.selectedStory.text }
                        user={ this.state.selectedUser.text }
                        allLoaded={ this.props.allLoaded }
                        showCharts={ this.props.showCharts }
                        chartData={ this.state.chartData }
                        WebpartHeight={ this.state.WebpartHeight }
                        WebpartWidth={ this.state.WebpartWidth }
                        dataOptions={ this.state.dataOptions }
                    ></LongTerm></div>;

                } else if ( this.state.selectedChoice === 'snapShot' ) {
                    thisPage = <div><Snapshot 
                      index={ this.state.chartData.index }
                        story={ this.state.selectedStory.text }
                        user={ this.state.selectedUser.text }
                        allLoaded={ this.props.allLoaded }
                        showCharts={ this.props.showCharts }
                        chartData={ this.state.chartData }
                        WebpartHeight={ this.state.WebpartHeight }
                        WebpartWidth={ this.state.WebpartWidth }
                        dataOptions={ this.state.dataOptions }
                    ></Snapshot></div>;

                } else if ( this.state.selectedChoice === 'story' ) {
                    thisPage = <div><Story 
                        index={ this.state.chartData.index }
                        story={ this.state.selectedStory.text }
                        user={ this.state.selectedUser.text }
                        allLoaded={ this.props.allLoaded }
                        showCharts={ this.props.showCharts }
                        chartData={ this.state.chartData }
                        WebpartHeight={ this.state.WebpartHeight }
                        WebpartWidth={ this.state.WebpartWidth }
                        dataOptions={ this.state.dataOptions }
                    ></Story></div>;

                } else if ( this.state.selectedChoice === 'usage' ) {
                    thisPage = <div><Usage 
                        index={ this.state.chartData.index }
                        story={ this.state.selectedStory.text }
                        user={ this.state.selectedUser.text }
                        allLoaded={ this.props.allLoaded }
                        showCharts={ this.props.showCharts }
                        chartData={ this.state.chartData }
                        WebpartHeight={ this.state.WebpartHeight }
                        WebpartWidth={ this.state.WebpartWidth }
                        dataOptions={ this.state.dataOptions }
                    ></Usage></div>;

                  } else if ( this.state.selectedChoice === 'numbers' ) {
                    thisPage = <div><Numbers 
                        index={ this.state.chartData.index }
                        story={ this.state.selectedStory.text }
                        user={ this.state.selectedUser.text }
                        allLoaded={ this.props.allLoaded }
                        showCharts={ this.props.showCharts }
                        chartData={ this.state.chartData }
                        WebpartHeight={ this.state.WebpartHeight }
                        WebpartWidth={ this.state.WebpartWidth }
                        dataOptions={ this.state.dataOptions }
                        projectListURL={ this.props.parentState.projectListURL }
                        projectListName={ this.props.parentState.projectListName }
                        timeTrackerListURL={ this.props.parentState.timeTrackerListURL }
                        timeTrackListName={ this.props.parentState.timeTrackListName }

                    ></Numbers></div>;
                    }
            }

            const stackButtonTokensBody: IStackTokens = { childrenGap: 20 };

            return (
                <div className={ [stylesI.infoPane, stylesC.chartsPage].join(' ') }>
                    <div className={stylesC.mainBar}>
                      <Stack padding={0} horizontal={true} wrap={true} horizontalAlign={"space-between"} tokens={stackButtonTokensBody}> {/* Stack for Projects and body */}

                      { pageChoices }

                        <Stack padding={0} horizontal={true} horizontalAlign={"space-between"} tokens={stackButtonTokensBody}> {/* Stack for Projects and body */}
                          { toggleDetails }
                          { userDropdown }
                          { storyDropdown }

                        </Stack>
                      </Stack>
                    </div>
                    { detailToggles }
                    { thisPage }
                    { pageNotes }
                    { chartItems }

                    <ColoredLine color="gray" />
                </div>
            );
            
        } else {
            //console.log('chartsClass.tsx return null');
            return ( null );
        }

    }   //End Public Render


/***
 *         d88888b d888888b db      d888888b d88888b d8888b.      d8888b.  .d8b.  d888888b  .d8b.  
 *         88'       `88'   88      `~~88~~' 88'     88  `8D      88  `8D d8' `8b `~~88~~' d8' `8b 
 *         88ooo      88    88         88    88ooooo 88oobY'      88   88 88ooo88    88    88ooo88 
 *         88~~~      88    88         88    88~~~~~ 88`8b        88   88 88~~~88    88    88~~~88 
 *         88        .88.   88booo.    88    88.     88 `88.      88  .8D 88   88    88    88   88 
 *         YP      Y888888P Y88888P    YP    Y88888P 88   YD      Y8888D' YP   YP    YP    YP   YP 
 *                                                                                                 
 *                                                                                                 
 */

//    public toggleUserFilter = (item): void => {
  
    public _onUserChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {

      //this.props._updateStory(item);
      //NOTE:  This is a duplicate call under componentDidUpdate but is required to redraw charts on story change.
      let thisUser = item.text.toLowerCase() === 'all' ? allUser : curUser;
      console.log(`_onUserChange: ${item.text} ${item.selected} ${thisUser}`);
      this.processChartData(thisUser,['what??'],10,'string',this.state.selectedStory, null, this.state.chartStringFilter );

      this.props._updateUserFilter(thisUser);
      //this.processChartData(newUserFilter,['what??'],10,'string',currentStory, null);

    }


    private _onStoryChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        console.log(`_onStoryChange: ${item.text} ${item.selected ? 'selected' : 'unselected'}`);
        let storyIndex = this.state.chartData.stories.titles.indexOf(item.text);
        let storyTitle = storyIndex === -1 ? 'None' : this.state.chartData.stories.titles[storyIndex];

        let thisStory = {key: storyTitle, text: storyTitle};
        this.processChartData(this.state.selectedUser,['what??'],10,'string',thisStory, null, this.state.chartStringFilter );

        this.props._updateStory({key: storyTitle, text: storyTitle});
        //let newUserFilter = this.state.userFilter;
        //NOTE:  This is a duplicate call under componentDidUpdate but is required to redraw charts on story change.
        //this.processChartData(newUserFilter,['what??'],10,'string',item, null);
    }

    private _onChartFilterChange = (item): void => {

      this.processChartData(this.state.selectedUser,['what??'],10,'string',this.state.selectedStory, null, item );

      this.props._updateChartFilter( item );
      //let newUserFilter = this.state.userFilter;
      //NOTE:  This is a duplicate call under componentDidUpdate but is required to redraw charts on story change.
      //this.processChartData(newUserFilter,['what??'],10,'string',item, null);
    }

    private _onChartFilterClear = (): void => {

      this.processChartData(this.state.selectedUser,['what??'],10,'string',this.state.selectedStory, null, null );

      this.props._updateChartFilter( null );
      //let newUserFilter = this.state.userFilter;
      //NOTE:  This is a duplicate call under componentDidUpdate but is required to redraw charts on story change.
      //this.processChartData(newUserFilter,['what??'],10,'string',item, null);
    }
    

/***
 *         d888888b  .d88b.   d888b   d888b  db      d88888b      d8888b. d88888b d888888b  .d8b.  d888888b db      .d8888. 
 *         `~~88~~' .8P  Y8. 88' Y8b 88' Y8b 88      88'          88  `8D 88'     `~~88~~' d8' `8b   `88'   88      88'  YP 
 *            88    88    88 88      88      88      88ooooo      88   88 88ooooo    88    88ooo88    88    88      `8bo.   
 *            88    88    88 88  ooo 88  ooo 88      88~~~~~      88   88 88~~~~~    88    88~~~88    88    88        `Y8b. 
 *            88    `8b  d8' 88. ~8~ 88. ~8~ 88booo. 88.          88  .8D 88.        88    88   88   .88.   88booo. db   8D 
 *            YP     `Y88P'   Y888P   Y888P  Y88888P Y88888P      Y8888D' Y88888P    YP    YP   YP Y888888P Y88888P `8888Y' 
 *                                                                                                                          
 *                                                                                                                          
 */


      public toggleChartDetails = (item): void => {
        //This sends back the correct pivot category which matches the category on the tile.
        let e: any = event;
        
        if (e.ctrlKey) {
          //Set clicked pivot as the hero pivot
        } else if (e.altKey) {
          //Enable-disable ChangePivots options
        } else {
        }

        this.setState({ 
          chartDetails: !this.state.chartDetails,
        //  chartData: chartData,
         }); 
  
      } //End toggleChartDetails

      public toggleAllDetails = (item): void => {
        //Shows or hides chart details
        let newSetting = !this.state.dataOptions.chartAllDetails;
        
        this.setState({ 
          dataOptions: {
            chartAllDetails: newSetting,
            chartTrace: newSetting,
            chartChanges: newSetting,
            chartWarnings: newSetting,
            chartErrors: newSetting,
          }

         }); 
      } //End toggleAllDetails

      public toggleTrace = (item): void => {
        //Shows or hides chart details
        let newSetting = this.state.dataOptions;
        newSetting.chartTrace = !this.state.dataOptions.chartTrace;
        this.setState({ 
          dataOptions: newSetting,
         }); 
      } //End toggleTrace
     
      public toggleChanges = (item): void => {
        //Shows or hides chart details
         let newSetting = this.state.dataOptions;
         newSetting.chartChanges = !this.state.dataOptions.chartChanges;
         this.setState({ 
           dataOptions: newSetting,
          }); 
      } //End toggleChanges

            
      public toggleWarnings = (item): void => {
        //Shows or hides chart details
         let newSetting = this.state.dataOptions;
         newSetting.chartWarnings = !this.state.dataOptions.chartWarnings;
         this.setState({ 
           dataOptions: newSetting,
          }); 
      } //End toggleWarnings

            
      public toggleErrors = (item): void => {
        //Shows or hides chart details
         let newSetting = this.state.dataOptions;
         newSetting.chartErrors = !this.state.dataOptions.chartErrors;
         this.setState({ 
           dataOptions: newSetting,
          }); 
      } //End toggleErrors

      public toggleItems = (item): void => {
        //Shows or hides chart details
         let newSetting = this.state.dataOptions;
         newSetting.chartItems = !this.state.dataOptions.chartItems;
         this.setState({ 
           dataOptions: newSetting,
          }); 
      } //End toggleItems
      


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

public _updateStory = (selectedStory: ISelectedStory) : void => {
    
  this.setState({  
    selectedStory: selectedStory,
  });
}

public _updateUserFilter = (selectedUser: ISelectedUser ) : void => {

  this.setState({  
    selectedUser: selectedUser,
  });
}

public _updateChartFilter = (chartStringFilter: string ) : void => {

  this.setState({  
    chartStringFilter: chartStringFilter,
  });
}



private _updateChoice(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption){

    let currentChoice = this.state.selectedChoice;
    let newChoice = option.key;

    this.setState({ 
        lastChoice: currentChoice,
        selectedChoice: newChoice,

     });
  }



  public searchForItems = (item): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;
 
    console.log('searchForItems: e',e);
    console.log('searchForItems: item', item);
    console.log('searchForItems: this', this);
    this.processChartData(this.props.selectedUser,['what??'],10,'string', this.props.selectedStory, null, item);
//    return ;
  } //End searchForItems

  

  public clearSearch = (item): void => {
    //This sends back the correct pivot category which matches the category on the tile.
    let e: any = event;
 
    console.log('clearSearch: e',e);

      console.log('clearSearch: item', item);
      console.log('clearSearch: this', this);
          /*
    */

    return ;
    
  } //End searchForItems



/***
 *          .o88b. db   db  .d8b.  d8888b. d888888b      d8888b.  .d8b.  d888888b  .d8b.  
 *         d8P  Y8 88   88 d8' `8b 88  `8D `~~88~~'      88  `8D d8' `8b `~~88~~' d8' `8b 
 *         8P      88ooo88 88ooo88 88oobY'    88         88   88 88ooo88    88    88ooo88 
 *         8b      88~~~88 88~~~88 88`8b      88         88   88 88~~~88    88    88~~~88 
 *         Y8b  d8 88   88 88   88 88 `88.    88         88  .8D 88   88    88    88   88 
 *          `Y88P' YP   YP YP   YP 88   YD    YP         Y8888D' YP   YP    YP    YP   YP 
 *                                                                                        
 *                                                                                        
 */


 /**
  * 
  * @param who  Filter for who's data to read in
  * @param what TBD but goal would be like Categories of some sort
  * @param when TBD but Time Period
  * @param scale TBD but would be like maybe Days, Weeks, Months etc..
  * @param isSum Default is to count.  If True, it sums values
  */
  //processChartData('all',['catA','catB'])
  private processChartData(who: ISelectedUser, what: string[], when: number, scale: string, story: ISelectedStory, chapter: ISelectedStory, searchString: string | null ){

    let deltaDateArrays = createDeltaDateArrays();
    console.log('deltaDateArrays', deltaDateArrays);

    if (story != null) {
      console.log('processChartData story:', story.text);

    } else { 

      story = JSON.parse(JSON.stringify(defStory));
      console.log('processChartData story:', who, story);
      //story = this.state.selectedStory;
    }

    if (who != null) {
      console.log('processChartData who:', who.text);

    } else { 
      who = JSON.parse(JSON.stringify(curUser));
      console.log('processChartData who:', who, story);
    }


    let hideEmpty = false;  //Will include data points with no data

    let startTimer = new Date().getTime();

    function createEmptyArray(min: number, max: number, stepInc: number){
      let arr = [];
      let goUp = min < max ? true : false;
      if (min !== max) {
        for (let step = min; goUp ? step <= max : step >= max; step = step + stepInc) {
          // Runs 5 times, with values of step 0 through 4.
          arr[step] = null;
          arr[step] = null;
          arr[step] = null;
        }
      }
      return arr;
    }

    
    function createAllMonthsArray(){
      let arr = [];

      for (let m of deltaDateArrays.months.daysAgo) {
          arr[m] = null;
      }
      return arr;
    }

    function createISeries(title, axisTitle: string, min: number, max: number, stepInc: number): IChartSeries {

      let nullLabels = title === 'All Months' ? deltaDateArrays.months.daysAgoNull :
        title === 'All Years' ? deltaDateArrays.years.daysAgoNull :
        createEmptyArray(min,max,stepInc);


      return {
        title: title,
        axisTitle: axisTitle,

        //labels: JSON.parse(JSON.stringify(nullLabels)),
        //sums: JSON.parse(JSON.stringify(nullLabels)),
        //counts: JSON.parse(JSON.stringify(nullLabels)),

        labels: title === 'All Months' ? createAllMonthsArray() : createEmptyArray(min,max,stepInc),
        sums:  title === 'All Months' ? createAllMonthsArray() : createEmptyArray(min,max,stepInc),
        counts:  title === 'All Months' ? createAllMonthsArray() : createEmptyArray(min,max,stepInc),

        changes: [],
        changeNotes: [],
        warnNotes: [],
        errorNotes: [],
        totalS: 0,
        totalC: 0,
      };
    }

    /**
     * 
     * @param seriesData 
     * @param dur 
     * @param thisKey was original type number before rebuilding for using categories instead of just numbers.
     */
//    function updateThisSeries(seriesData : IChartSeries,  dur: number,  thisKey: number ) {
    function updateThisSeries(seriesData : IChartSeries,  dur: number,  thisKey ) {
      //let weekData = chartPreData.thisWeek[0];
      //console.log('yearData',weekData);
      if ( seriesData.sums[thisKey] == null ) { 
        seriesData.sums[thisKey] = 0; 
        seriesData.counts[thisKey] = 0; 
      }
      seriesData.sums[thisKey] += dur;
      seriesData.totalS += dur;
      seriesData.counts[thisKey] ++;
      seriesData.totalC ++;

      return seriesData;
    }

    function createCoreTimeS(){
      let emptyCoreTimes: ICoreTimes = {
        titles: ['Normal','Early','Late','Weekend','Holiday'],
        cores: [
          createISeries('Normal' , 'Normal', 0,365,1),
          createISeries('Early' , 'Early' , 0,365,1),
          createISeries('Late' , 'Late' , 0,365,1),
          createISeries('Weekend' , 'Weekend' , 0,365,1),
          createISeries('Holiday' , 'Holiday' , 0,365,1),
        ],
        coreTime: createISeries('Core time' , '', 0,0,0),
      };

      return emptyCoreTimes;
    }

    function createStories(){
      let emptyStories: IStories = {
        titles: [],
        stories: [],
        chapters: [],
      };
      return emptyStories;
    }

    let sourceData: ITimeEntry[] = this.props.entries[who.key];

    let daysSinceMonthStart =this.props.today.daysSinceMonthStart;
    let daysSinceNewYear =this.props.today.daysSinceNewYear;
    let daysSinceSOW =this.props.today.daysSinceMon;

    let chartPreData: IChartData = {
      filter: 'Results for ' + who.text,
      thisYear: [
        createISeries(' This Year (mo)' , '', hideEmpty ? 0 : 0 , hideEmpty ? 0 : this.props.today.month , 1),
        createISeries('This Year (wk)' , '', hideEmpty ? 1 : 1 , hideEmpty ? 1 : this.props.today.week , 1)],
      thisMonth: [createISeries('This Month' , '', hideEmpty ? 1 : 1 , hideEmpty ? 1 : this.props.today.date , 1)],
      thisWeek: [createISeries('This Week' , '', hideEmpty ? 1 : 1 , hideEmpty ? 1 : this.props.today.week , 1)],
      allDays: createISeries('All Days' , 'Days ago', hideEmpty ? 0 : 0 , hideEmpty ? 0 : 365 , 1),
      allWeeks: createISeries('All Weeks' , 'Weeks ago', hideEmpty ? daysSinceSOW : daysSinceSOW , hideEmpty ? daysSinceSOW : 365 , 7),
      allMonths: createISeries('All Months' , 'Months ago', hideEmpty ? daysSinceMonthStart : daysSinceMonthStart , hideEmpty ? daysSinceMonthStart : 365 , 31), 
      allYears: createISeries('All Years' , 'Years ago', hideEmpty ? daysSinceNewYear : daysSinceNewYear , hideEmpty ? daysSinceNewYear : 365*4 , 365), 
      categories: [createISeries('Category1' , '', 0,0,0), createISeries('Category2' , '' , 0,0,0)], 
      location: createISeries('Location' , '', 0,0,0), 
      contemp: createISeries('Contemporanious' , '', 0,0,0),
      entryType: createISeries('Entry Mode' , '', 0,0,0),     
      keyChanges: createISeries('Key changes' , '', 0,0,0),     
      stories: createStories(), 
      index: this.state.chartData == null ? 0 : this.state.chartData.index + 1,
      storyIndex: null,
      warnNotesAll: [],
      errorNotesAll: [],
      users: [],
      filterItems: [],
      usersSummary: [],
      dateRange: [],

      coreTimeS: createCoreTimeS(),  //This is the flexible array of core time per day

    };

    chartPreData.dateRange.push(new Date(this.props.entries.dateRange[0]).toLocaleString());
    chartPreData.dateRange.push(new Date(this.props.entries.dateRange[1]).toLocaleString());

    let unknownCatLabel = 'Others';
    let removeTheseCats = 'removeEmpty';
    let defaultChapter = 'Unclassified';
    let maxCats = 5;
    let consolidatedCatLabel = 'Others';
    let identifyOtherLabels = false; //May be used later to add change or warning notes to series.
    if ( consolidatedCatLabel === unknownCatLabel ) {
      identifyOtherLabels = true;
      unknownCatLabel += '^';
      consolidatedCatLabel += '*';
    }

    let chartDataLabel: any [] = []; 
    let runningTotal: number = 0;

    
    function getDaysOrItems( searchStr: string) {

      const result : ISearchObject = {
        bucket: null,
        label: null,
        value: null,
        orig: searchStr + '',
        rev: null,
        valid: false,
      };
      
      if ( searchStr.indexOf('?last') === 0 ) {
        searchStr = searchStr.replace('?last','');
        result.bucket = 'last';

      } else if ( searchStr.indexOf('?first') === 0 ) {
        searchStr = searchStr.replace('?first','');
        result.bucket = 'first';

      } 

      result.rev = searchStr;

      let searchStrItems = searchStr.lastIndexOf('items');
      let searchStrDays = searchStr.lastIndexOf('days');

      if ( searchStrItems > -1 && searchStrItems === searchStr.replace('items','').length ) {
        //This value should be # of items
        result.label = 'items';
        result.value = Number(searchStr.replace('items',''));

      } else if ( searchStrDays > -1 && searchStrDays === searchStr.replace('days','').length ) {
        //This value should be # of items
        result.label = 'days';
        result.value = Number(searchStr.replace('days',''));
      }
      
      if (result.bucket != null && result.label != null && result.value != null ) {
        result.valid = true;

      }

      console.log('getDaysOrItems result: ', result);
      return result;

    }

    let searchObj : ISearchObject = null;

    if ( searchString ) {
        searchObj = getDaysOrItems(searchString);
    }

    let sourceDataIdx = -1;

    for ( let item of sourceData ) {
      sourceDataIdx ++;
      //
      let dur = Number(item.duration); //Hours per entry
      let theTime = item.thisTimeObj;
      runningTotal += dur;
      //console.log('theTime:',item.id,runningTotal, item.startTime,theTime.year,theTime.month,theTime.week,theTime.date,theTime.day,theTime.hour,theTime.isThisYear,theTime.isThisMonth,theTime.isThisWeek,theTime.isToday);


      /**
       * Add Story data 
       */

      if (item.story != null && item.story.length > 0 ) {
        if ( chartPreData.stories.titles.indexOf(item.story) < 0) { 
          chartPreData.stories.titles.push(item.story);
          chartPreData.stories.chapters.push(
            createISeries(item.story , '', 0,0,0),
          );

          chartPreData.stories.stories.push(
            createISeries(item.story + '' , 'Days ago', hideEmpty ? 0 : 0 , hideEmpty ? 0 : 365 , 1),
          );

        }

        let storyIndex = chartPreData.stories.titles.indexOf(item.story);
        let thisStory = chartPreData.stories.chapters[storyIndex];

        //thisStory.totalC ++;
        //thisStory.totalS += Number(item.duration);

        //Automatically assign generic chapter if no is given
        if (item.chapter == null || item.chapter.length == 0 ) { item.chapter = defaultChapter; }

        if (item.chapter != null && item.chapter.length > 0 ) {
          if ( thisStory.labels.indexOf(item.chapter) < 0) { 
            thisStory.labels.push(item.chapter);
            thisStory.counts.push(0);
            thisStory.sums.push(0);
           }
          //let chapterIndex = thisStory.labels.indexOf(item.chapter);
          //let thisChapter = thisStory.labels[chapterIndex];
          //thisStory.counts[chapterIndex] ++;
          //thisStory.sums[chapterIndex] += Number(item.duration);

        }
      }


      /**
       * Start filtering the "What data here"
       */

      if (item.story != null && item.story.length > 0 ) {

        let storyIndex = chartPreData.stories.titles.indexOf(item.story);
        let thisStory = chartPreData.stories.chapters[storyIndex];
        let chapterIndex = thisStory.labels.indexOf(item.chapter);
        let thisChapter = thisStory.labels[chapterIndex];

        thisStory = updateThisSeries(thisStory, dur, chapterIndex);
        /*
        thisStory.totalC ++;
        thisStory.totalS += Number(item.duration);

        if (item.chapter != null && item.chapter.length > 0 ) {

          let chapterIndex = thisStory.labels.indexOf(item.chapter);
          let thisChapter = thisStory.labels[chapterIndex];
          thisStory.counts[chapterIndex] ++;
          thisStory.sums[chapterIndex] += Number(item.duration);

        }
        */
      }

      /**
       * Update Story series
       */
      //searchString = "2020-02";
      let includeEntry = false;
      if ( story == null || defStory.text === story.text || item.story === story.text ) {
        includeEntry = true;

        if ( searchString ) {
          if ( searchObj.valid === true ) {
            if ( searchObj.bucket === 'last' || searchObj.bucket === 'first' ) {
              if ( searchObj.label === 'items' ) {
                if ( searchObj.bucket === 'last' && sourceDataIdx > searchObj.value - 1 ) {
                  includeEntry = false;
                } else if (searchObj.bucket === 'first' && sourceDataIdx < sourceData.length - searchObj.value ) {
                  includeEntry = false;
                }
              } else if ( searchObj.label === 'days' ) {
                if (searchObj.bucket === 'last' && item.thisTimeObj.daysAgo > searchObj.value ) {
                  includeEntry = false;
                } else if (searchObj.bucket === 'first' && item.thisTimeObj.daysAgo < this.props.entries.firstItem.daysAgo - searchObj.value ) {
                  includeEntry = false;                  
                }
              }
            }

          } else if ( searchString != 'searchString' ) {
            if ( item.searchString.indexOf(searchString.toLowerCase()) === -1  ) { includeEntry = false; }
          }
        }
      }

      
      if ( includeEntry ) {

        if (item.thisTimeObj == undefined) {
            console.log('undefined days ago:', item.thisTimeObj);
        }

        chartPreData.filterItems.push(item.searchStringPC);

        let storyIndex = chartPreData.stories.titles.indexOf(item.story);
        let thisStory = chartPreData.stories.stories[storyIndex];

        if (storyIndex > -1 && item.thisTimeObj == null ) {
          console.log('problem with this item: ', item);
        }

        let thisUser = item.user.Title + ' ( ' + item.user.ID + ' )';
        let userIndex = chartPreData.users.indexOf( thisUser );
        //Create UserSummary
        if ( userIndex < 0 ) { 
          chartPreData.users.push( thisUser ); 
          userIndex = chartPreData.users.length -1 ;
          chartPreData.usersSummary.push( 
            {
              Id: item.user.ID,
              count: 0,
              hours: 0,
              normal: 0,
              percent: null,
              title: item.user.Title,
              stories: [],
              lastEntry: null,
              lastEntryText: null,
              daysAgo: null,
            }
            );
        }

        //Update UserSummary Count and Hours
        chartPreData.usersSummary[userIndex].count ++;
        chartPreData.usersSummary[userIndex].hours += dur;

        //Update UserSummary last Entry
        if ( chartPreData.usersSummary[userIndex].lastEntry == null ) {
          chartPreData.usersSummary[userIndex].lastEntry = item.thisTimeObj.milliseconds;
          chartPreData.usersSummary[userIndex].lastEntryText = item.thisTimeObj.dayMMMDD;
          chartPreData.usersSummary[userIndex].daysAgo = item.thisTimeObj.daysAgo;

        } else if ( item.thisTimeObj.milliseconds > chartPreData.usersSummary[userIndex].lastEntry ) {
          chartPreData.usersSummary[userIndex].lastEntry = item.thisTimeObj.milliseconds;              
          chartPreData.usersSummary[userIndex].lastEntryText = item.thisTimeObj.dayMMMDD;
          chartPreData.usersSummary[userIndex].daysAgo = item.thisTimeObj.daysAgo;

        }

        //Update UserSummary Story
        if ( storyIndex > -1 ) { 
          thisStory = updateThisSeries(thisStory, dur, item.thisTimeObj.daysAgo ); 
          if ( thisStory.title != null && chartPreData.usersSummary[userIndex].stories.indexOf(thisStory.title) < 0 ) { 
            chartPreData.usersSummary[userIndex].stories.push(thisStory.title);
          } 
        }

        chartPreData.allDays = updateThisSeries(chartPreData.allDays, dur, item.thisTimeObj.daysAgo);

        chartPreData.allWeeks = updateThisSeries(chartPreData.allWeeks, dur, item.thisTimeObj.daysSinceMon);
        chartPreData.allMonths = updateThisSeries(chartPreData.allMonths, dur, item.thisTimeObj.daysSinceMonthStart);
        chartPreData.allYears = updateThisSeries(chartPreData.allYears, dur, item.thisTimeObj.daysSinceNewYear);

        if (item.hoursNormal) {
          chartPreData.coreTimeS.cores[0] = updateThisSeries(chartPreData.coreTimeS.cores[0], item.hoursNormal, item.thisTimeObj.daysAgo);
        }
        if (item.hoursEarly) {
          chartPreData.coreTimeS.cores[1] = updateThisSeries(chartPreData.coreTimeS.cores[1], item.hoursEarly, item.thisTimeObj.daysAgo);
        }
      
        if (item.hoursLate) {
          chartPreData.coreTimeS.cores[2] = updateThisSeries(chartPreData.coreTimeS.cores[2], item.hoursLate, item.thisTimeObj.daysAgo);
        }
        if (item.hoursWeekEnd) {
          chartPreData.coreTimeS.cores[3] = updateThisSeries(chartPreData.coreTimeS.cores[3], item.hoursWeekEnd, item.thisTimeObj.daysAgo);
        }
        if (item.hoursHoliday) {
          chartPreData.coreTimeS.cores[4] = updateThisSeries(chartPreData.coreTimeS.cores[4], item.hoursHoliday, item.thisTimeObj.daysAgo);
        }

        chartPreData.usersSummary[userIndex].normal += item.hoursNormal;

        if (item.thisTimeObj.isThisYear) {
            chartPreData.thisYear[0] = updateThisSeries(chartPreData.thisYear[0], dur, item.thisTimeObj.month);
            chartPreData.thisYear[1] = updateThisSeries(chartPreData.thisYear[1], dur, item.thisTimeObj.week);

        }

        if (item.thisTimeObj.isThisMonth) { 
        chartPreData.thisMonth[0] = updateThisSeries(chartPreData.thisMonth[0], dur, item.thisTimeObj.date);  }

        if (item.thisTimeObj.isThisWeek) { 
        chartPreData.thisWeek[0] = updateThisSeries(chartPreData.thisWeek[0], dur, item.thisTimeObj.day);  }
        
        /**
         * This section will allow removing uncategorized data from the chart results
         * unknownCatLabel is the label you can bucket all empty category items into.
         * removeTheseCats allows you to remove specific categories from the chart results.
         * 
         * set unknownCatLabel to be "Other" to see it included.
         * set unknownCatLabel to be the same value as removeTheseCats to remove that item from the dataset
         * 
         * By default let removeTheseCats = 'removeEmpty'; unless you change it to something else.
         * 
         */
        let cat1 = item.category1 == null || item.category1[0] == null || item.category1[0] == '' ? unknownCatLabel : item.category1[0];
        if ( cat1 !== removeTheseCats ) { chartPreData.categories[0] = updateThisSeries(chartPreData.categories[0], dur, cat1); 
        } else { 
        if ( chartPreData.categories[0].title.lastIndexOf('^') !== chartPreData.categories[0].title.length -1 ) { chartPreData.categories[0].title += ' ^'; }
        }

        let cat2 = item.category2 == null || item.category2[0] == null || item.category2[0] == '' ? unknownCatLabel : item.category2[0];
        if ( cat2 !== removeTheseCats ) { chartPreData.categories[1] = updateThisSeries(chartPreData.categories[1], dur, cat2); 
        } else { 
        if ( chartPreData.categories[1].title.lastIndexOf('^') !== chartPreData.categories[1].title.length -1 ) { chartPreData.categories[1].title += ' ^'; }
        }

        let local = item.location == null || item.location == '' ? unknownCatLabel : item.location;
        if ( local !== removeTheseCats ) { chartPreData.location = updateThisSeries(chartPreData.location, dur, local); 
        } else { 
        if ( chartPreData.location.title.lastIndexOf('^') !== chartPreData.location.title.length -1 ) { chartPreData.location.title += ' ^'; }
        }

        let contemp = unknownCatLabel;
        if ( contemp !== removeTheseCats ) { chartPreData.contemp = updateThisSeries(chartPreData.contemp, dur, contemp);
        } else { 
        if ( chartPreData.contemp.title.lastIndexOf('^') !== chartPreData.contemp.title.length -1 ) { chartPreData.contemp.title += ' ^'; }
        }

        let entryType = camelize(item.entryType, true);
        chartPreData.entryType = updateThisSeries(chartPreData.entryType, dur, entryType);

        let keyChange = camelize(item.keyChange, true);
        chartPreData.keyChanges = updateThisSeries(chartPreData.keyChanges, dur, keyChange);

      }

    }

    /**
     * 
     * Summarize CoreTime categories
    */

    for (let i in chartPreData.coreTimeS.cores ) {
      chartPreData.coreTimeS.coreTime.labels.push( chartPreData.coreTimeS.cores[i].title);
      chartPreData.coreTimeS.coreTime.sums.push( chartPreData.coreTimeS.cores[i].totalS);
      chartPreData.coreTimeS.coreTime.counts.push( chartPreData.coreTimeS.cores[i].totalC);
      chartPreData.coreTimeS.coreTime.totalS += chartPreData.coreTimeS.cores[i].totalS;
      chartPreData.coreTimeS.coreTime.totalC += chartPreData.coreTimeS.cores[i].totalC;
    }

    chartPreData.coreTimeS.coreTime.warnNotes.push('Core time is considered between '  + this.props.parentState.coreStart + ':00 and '   + this.props.parentState.coreEnd + ':00 - YOUR TIME ZONE' );
    chartPreData.coreTimeS.coreTime.warnNotes.push(' --- Therefore, it MAY NOT reflect a user\'s actual time if they are not entering time in your timezone.' );

    chartPreData.coreTimeS.coreTime.warnNotes.push('Weekend: the entire entry time if the start time is on Saturday or Sunday.');
    chartPreData.coreTimeS.coreTime.warnNotes.push('Holiday: the entire entry time if the start time is on a designated holiday.');
    chartPreData.coreTimeS.coreTime.warnNotes.push('Early: the portion of the entry time BEFORE ' + this.props.parentState.coreStart + ':00 YOUR local time.');
    chartPreData.coreTimeS.coreTime.warnNotes.push('Normal: the portion of the entry time BETWEEN ' + this.props.parentState.coreStart + ':00 and '   + this.props.parentState.coreEnd + ':00 YOUR local time.');

    chartPreData.coreTimeS.coreTime.warnNotes.push('Late: the portion of the entry time AFTER ' + this.props.parentState.coreEnd + ':00 YOUR local time.');
    chartPreData.coreTimeS.coreTime.warnNotes.push('Unknown: the entire entry time if the entry is longer than a normal day of ' + (this.props.parentState.coreEnd - this.props.parentState.coreStart) + ' hours.');

    

    function removeEmptyFromEnd(series: IChartSeries, base : number, step: number) {

      chartDataLabel = Object.keys(series['sums']);

      let lastIndex = null;


      if ( series.title === 'All Months' ) {
        for ( let itemL of chartDataLabel) {
          if (series.sums[itemL] !== null) {
            //lastIndex = chartDataLabel.indexOf(itemL);
            lastIndex = parseInt(itemL);
          }
        }
      } else {
        for (let i = series.sums.length -1 + base; i > 0; i = i - step) {
          if (series.sums[i] !== null) {
            lastIndex = i;
            break;
          }
        }
      }


      if ( lastIndex + 1 < series.sums.length) { lastIndex ++ ; }
      let smallerSums = series.sums.splice(0,lastIndex );
      let smallerCounts = series.counts.splice(0,lastIndex);
      let smallerLabels = series.labels.splice(0,lastIndex);

      series.sums= smallerSums;
      series.counts= smallerCounts;
      series.labels= smallerLabels;
      //console.log('lastIndex is: ',series, lastIndex);

    }

    for ( let s of chartPreData.stories.stories) {
      removeEmptyFromEnd(s, 0, 1);
    }

    for ( let s of chartPreData.coreTimeS.cores) {
      removeEmptyFromEnd(s, 0, 1);
    }

    removeEmptyFromEnd(chartPreData.allDays, 0, 1);
    removeEmptyFromEnd(chartPreData.allWeeks, 0, 7);
    removeEmptyFromEnd(chartPreData.allMonths, 0, 1);
    removeEmptyFromEnd(chartPreData.allYears, 0, 365);
    removeEmptyFromEnd(chartPreData.thisYear[0], 1, 1);
    removeEmptyFromEnd(chartPreData.thisYear[1], 1, 1);
    removeEmptyFromEnd(chartPreData.thisMonth[0], 1, 1);
    removeEmptyFromEnd(chartPreData.thisWeek[0], 1, 1);

/*
*/

    function addLabels(series: IChartSeries, labels: string, firstIndex: number) {

      let useLabelString = labels.indexOf(';') > -1 ? true : false;
      let labelArray = useLabelString ? labels.split(';'): [''];

      //console.log('labelArray:', labelArray);
      chartDataLabel = Object.keys(series['sums']);
      //console.log('chartDataLabel',chartDataLabel);
      let newSums : number[] = [];
      let newCounts : number[] = [];
      let newLabels : string[] = [];
      for ( let itemL of chartDataLabel) {
        let label = '';
        if ( itemL != null ) {
          if (series.title === 'All Years'){
            label = deltaDateArrays.years.labelLong[chartDataLabel.indexOf(itemL)];
          } else if (series.title === 'All Months'){
            label = deltaDateArrays.months.labelLong[chartDataLabel.indexOf(itemL)];
          } else if ( !useLabelString ) {
            label = itemL.trim();
          } else if ( firstIndex === 0) { //Make like days since number
            label = (Number(itemL) + firstIndex).toString() ;
          } else if (firstIndex < 4 ) { //This is a relative index
            label = labelArray[Number(itemL) + firstIndex];
          } else if ( firstIndex === 12) { //Make like month number
            label = ("0" + itemL).slice(-2) ;
          } else if ( firstIndex === 52) { //Make like week number
            label = "w" + ("0" + itemL).slice(-2) ;
          } else if ( firstIndex === 365) { //Make like days since number
            label = ("0000" + itemL).slice(-4) ;
          } else { //Must be an error but put the label as itself
            console.log('unknown label conversion error:', series, labels,firstIndex);
            label = itemL;
          }
          newSums.push(series.sums[itemL]);
          newCounts.push(series.counts[itemL]);
          newLabels.push(label);
        }
      }
      series.labels = newLabels;
      series.sums = newSums;
      series.counts = newCounts;
      return series;
    }

    chartPreData.allYears = addLabels(chartPreData.allYears,monthStr3['en-us'].join(';'),0); //Days of year
    chartPreData.allMonths = addLabels(chartPreData.allMonths,monthStr3['en-us'].join(';'),0); //Days of year
    chartPreData.allWeeks = addLabels(chartPreData.allWeeks,monthStr3['en-us'].join(';'),0); //Days of year
    
    
    for ( let s of chartPreData.stories.stories) {
      s=addLabels(s,monthStr3['en-us'].join(';'),0); //Days of year
    }

    for ( let s of chartPreData.coreTimeS.cores) {
      s=addLabels(s,monthStr3['en-us'].join(';'),0); //Days of year
    }

    chartPreData.allDays = addLabels(chartPreData.allDays,monthStr3['en-us'].join(';'),0); //Days of year

    chartPreData.thisYear[0] = addLabels(chartPreData.thisYear[0],monthStr3['en-us'].join(';'),0); //Months of year
    chartPreData.thisYear[1] = addLabels(chartPreData.thisYear[1],weekday3['en-us'].join(';'),52); // Week Numbers of Year
    chartPreData.thisMonth[0] = addLabels(chartPreData.thisMonth[0],weekday3['en-us'].join(';'),12);  // Days of Month
    chartPreData.thisWeek[0] = addLabels(chartPreData.thisWeek[0],weekday3['en-us'].join(';'),0);  // Days of the week

    chartPreData.categories[0] = addLabels(chartPreData.categories[0],'',0);  // Category 1
    chartPreData.categories[1] = addLabels(chartPreData.categories[1],'',0);  // Category 2
    chartPreData.location = addLabels(chartPreData.location,'',0);  // Location
    chartPreData.contemp = addLabels(chartPreData.contemp,'',0);  // Contemmporanious
    chartPreData.entryType = addLabels(chartPreData.entryType,'',0);  // Entry Type

    chartPreData.keyChanges = addLabels(chartPreData.keyChanges,'',0);  // keyChanges
    

    function scrubCategories(series: IChartSeries) {
      let changeMap = [];
      let changeNotes = [];
      let warnNotes = [];
      let removeSpaces=true;
      let removeDashes=true;
      let camelCase=false;
      let allCaps = false;

      let newLabels : string[] = [];
      //let newUCLabels : string[] = []; //To compare to similar ones...
      let newCount = -1;
      for (let i in series.labels) {
        let newLabel = series.labels[i] + '';

        //https://stackoverflow.com/a/7151225/4210807 - remove white spaces from string
        if ( camelCase ) { newLabel = camelize(newLabel, true); }
        if ( removeDashes ) { newLabel = newLabel.replace(/-/g, ''); }
        if ( removeSpaces ) { newLabel = newLabel.replace(/\s/g, ''); }
        if ( allCaps ) { newLabel = newLabel.toUpperCase(); }
        
        let labelChanged = newLabel != series.labels[i] ? true : false;
        let newLabelIndex = newLabels.indexOf(newLabel);

        let similarTo = '';
        if ( newLabelIndex < 0 ) { //Label is not in the finished array, add.

          let similarToIndex = newLabels.map(

            //Sample to convert to arrow function
            //const sum1 = function(list, prop){ return list.reduce( function(a, b){ return a + b[prop];}, 0);}
            //const sum2 = (list,prop) =>  { return list.reduce((a,b) => {return (a+ b[prop])}, 0);}
            //prior to arrow function... was this:
            //function(x){ return x.toUpperCase(); }

            (x) => {return x.toUpperCase();} 
            
            ).indexOf(newLabel.toUpperCase()); //Check if this is similar to another existing label
          newLabels.push(newLabel);
          //newLabels.map(function(x){ return x.toUpperCase() }).indexOf(newLabel.toUpperCase());

          if ( similarToIndex > -1 ) {
            //newUCLabels.push(newLabel.toUpperCase());
            similarTo = series.labels[i] + ' is similar to ' + newLabels[similarToIndex] + ' at item ' + i;
            warnNotes.push(similarTo);
            chartPreData.warnNotesAll.push({
              note: similarTo,
              parent: series.title,
              source: series.labels[i],
            });
          } else {
            //Is not similar to anything
          }
          newCount ++;
          newLabelIndex = newCount;
          
        }

        changeMap.push([ i, series.labels[i], newLabelIndex, newLabel, labelChanged, similarTo ]);
        if ( labelChanged ) { changeNotes.push(series.labels[i] + ' was consolidated into ' + newLabel); }

      }

      /*
      console.log('newLabels',newLabels);
      console.log('changeMap',changeMap);
      console.log('changeNotes',changeNotes);
      console.log('warnNotes',warnNotes);
*/
      //Now re-group similar categories

      let newSums = [];
      let newCounts = [];

      for (let j in changeMap) {
        let isRow = changeMap[j][2]; //Get new array index
        newSums[isRow] = newSums[isRow] == null ? series.sums[j] : newSums[isRow] + series.sums[j] ;
        newCounts[isRow] = newCounts[isRow] == null ? series.counts[j] : newCounts[isRow] + series.counts[j] ;
      }

      let checkSums = newSums.reduce(
        //B4 Arrow Function
        //function(a, b){ return a + b; }
        (a, b) => { return a + b; }
        , 0);
      let checkCounts = newCounts.reduce(
        //B4 Arrow Function
        //function(a, b){ return a + b; }
        (a, b) => { return a + b; }
        , 0);

      let err = '';
      if (checkSums !== series.totalS && Math.abs(checkSums - series.totalS) > .01 ) { 
        err = 'Err reducing Category SUMs: ' + series.totalS + ' <> ' + checkSums;
        series.errorNotes.push(err);
        chartPreData.errorNotesAll.push({
          note: err,
          parent: series.title,
          source: series.title,
        });
        console.log(err);
      }
      if (checkCounts !== series.totalC && Math.abs(checkCounts - series.totalC) > .01 ) { 
        err = 'Err reducing Category COUNTs: ' + series.totalC + ' <> ' + checkCounts;
        series.errorNotes.push(err);
        chartPreData.errorNotesAll.push({
          note: err,
          parent: series.title,
          source: series.title,
        });
        console.log(err);
      }

      //reduce decimal places of results for label purposes
      //NOTE This map will convert numbers to text
      //newSums = newSums.map(thisSum => thisSum.toFixed(2));

      series.labels = newLabels;
      series.counts = newCounts;
      series.sums = newSums;
      series.changes = changeMap;
      series.changeNotes = changeNotes;
      series.warnNotes = warnNotes;

      return series;
    }

    //Only scrub category series... NOT Dates or periods because those are not pure number indexes
    chartPreData.categories[0] = scrubCategories(chartPreData.categories[0]);
    chartPreData.categories[1] = scrubCategories(chartPreData.categories[1]);
    chartPreData.location = scrubCategories(chartPreData.location);
    chartPreData.contemp = scrubCategories(chartPreData.contemp);
    chartPreData.entryType = scrubCategories(chartPreData.entryType);
    chartPreData.keyChanges = scrubCategories(chartPreData.keyChanges);
    

    function consolidateCategories(series: IChartSeries, maxCatsX: number, otherLabel: string) {

      /**
       * Sort biggest to smallest
       */
      let tempValues = series.sums.map( e => e);
      tempValues = tempValues.sort((a, b) => b - a);
      /**
       * Create new array consolidating all smaller ones into one label
      */
      let newLabels: string[] = [], newCounts: number[] = [], newSums = [];
      let newIndex = -1;
      let sumCheck = 0;
      let consolidatedSum = 0;

      for ( let thisSum of tempValues ) {
        let origIndex = series.sums.indexOf(thisSum);
        
        //NOTE This map will convert numbers to text
        //newSums = newSums.map(thisSum => thisSum.toFixed(2));

        if ( newIndex < maxCatsX ) { // Add to newArrays by itself
          newLabels.push(series.labels[origIndex]);
          newCounts.push(series.counts[origIndex]);
          newSums.push(series.sums[origIndex]);
          sumCheck += series.sums[origIndex];
          newIndex ++;

        } else { //Consolidate to other category
          if (newIndex === maxCatsX ) { 
            newLabels[newIndex] = otherLabel;
            consolidatedSum  += newSums[newIndex];
           }
          
          newCounts[newIndex] += series.counts[origIndex];
          newSums[newIndex] += series.sums[origIndex];
          consolidatedSum  += series.sums[origIndex];
          sumCheck += series.sums[origIndex];
        }

      }

      newSums = newSums.map( v => (v == null) ? null : v.toFixed(2) );
      /*
      console.log('newLabels', newLabels);
      console.log('newSums', newSums);
      console.log('newCounts', newCounts);
      console.log('sumCheck', sumCheck, series.totalS);
      */

      /**
       * Add condensed arrays back into object
       */
      series.changeNotes.push('Recategorized ' + consolidatedSum + ' hours into ' + otherLabel );
      series.sums = newSums;
      series.labels = newLabels;
      series.counts = newCounts;

      return series;
    }

    for (let s of chartPreData.stories.chapters) {
      s = consolidateCategories(s, 100, defaultChapter + '^');
    }

    chartPreData.categories[0] = consolidateCategories(chartPreData.categories[0], maxCats, consolidatedCatLabel);
    chartPreData.categories[1] = consolidateCategories(chartPreData.categories[1], maxCats, consolidatedCatLabel);
    chartPreData.location = consolidateCategories(chartPreData.location, maxCats, consolidatedCatLabel);
    chartPreData.contemp = consolidateCategories(chartPreData.contemp, maxCats, consolidatedCatLabel);
    chartPreData.entryType = consolidateCategories(chartPreData.entryType, maxCats, consolidatedCatLabel);
    chartPreData.keyChanges = consolidateCategories(chartPreData.keyChanges, maxCats, consolidatedCatLabel);

     //console.log('chartPreData',chartPreData);
  //   console.log('chartDataVal',chartDataVal);
    let lastStory : ISelectedStory = this.state.selectedStory;
    let lastUser : ISelectedStory = this.state.selectedUser;

    chartPreData.storyIndex = 0;
    if ( story != null && story.text !== defStory.text ) {
      chartPreData.storyIndex = chartPreData.stories.titles.indexOf(story.text);
    }
    
    this.setState({ 
      selectedStory: story,
      selectedUser: who,
      lastStory: lastStory,
      lastUser: lastUser,
      chartData: chartPreData,
      processedChartData: true,
    //  chartData: chartData,
     });  

  //  console.log('chartData', chartData);

    let endTimer = new Date().getTime();

    let delta = endTimer - startTimer;
    console.log('Time to process chart data: ' + delta );

    return;

  }


}

