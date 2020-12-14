/***
 *    .d888b.  .d88b.  .d888b.  .d88b.          db .d888b.         db   j88D                     
 *    VP  `8D .8P  88. VP  `8D .8P  88.        o88 VP  `8D        o88  j8~88                     
 *       odD' 88  d'88    odD' 88  d'88         88    odD'         88 j8' 88                     
 *     .88'   88 d' 88  .88'   88 d' 88 C8888D  88  .88'   C8888D  88 V88888D                    
 *    j88.    `88  d8' j88.    `88  d8'         88 j88.            88     88                     
 *    888888D  `Y88P'  888888D  `Y88P'          VP 888888D         VP     VP                     
 *                                                                                               
 *                                                                                               
 *    d8888b. d888888b db    db  .d88b.  d888888b      d888888b d888888b db      d88888b .d8888. 
 *    88  `8D   `88'   88    88 .8P  Y8. `~~88~~'      `~~88~~'   `88'   88      88'     88'  YP 
 *    88oodD'    88    Y8    8P 88    88    88            88       88    88      88ooooo `8bo.   
 *    88~~~      88    `8b  d8' 88    88    88            88       88    88      88~~~~~   `Y8b. 
 *    88        .88.    `8bd8'  `8b  d8'    88            88      .88.   88booo. 88.     db   8D 
 *    88      Y888888P    YP     `Y88P'     YP            YP    Y888888P Y88888P Y88888P `8888Y' 
 *                                                                                               
 *                                                                                               
 */

/**
  import { IPickedWebBasic, IPickedList, IMyProgress, 
      IPivot, IMyPivots, ILink, IUser, IMyFonts, IMyIcons, 
      IRefinerRules, IRefinerStatType, RefinerStatTypes, IRefinerStat, IRefinerStats, RefineRuleValues, IItemRefiners, IRefiners, IRefinerLayer, 
      buildKeyText, refinerRuleItems,
      ICustViewDef, 
      QuickCommandsTMT,
      IQuickCommands, IQuickButton, 
      ILabelColor, ICSSChartTypes, CSSChartTypes, ISeriesSort, ICSSChartSeries, 
      IChartSeries, ICharNote, 

  } from './IReUsableInterfaces';
*/

import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";


/***
 *     .o88b.  .d88b.  .88b  d88. .88b  d88.  .d88b.  d8b   db 
 *    d8P  Y8 .8P  Y8. 88'YbdP`88 88'YbdP`88 .8P  Y8. 888o  88 
 *    8P      88    88 88  88  88 88  88  88 88    88 88V8o 88 
 *    8b      88    88 88  88  88 88  88  88 88    88 88 V8o88 
 *    Y8b  d8 `8b  d8' 88  88  88 88  88  88 `8b  d8' 88  V888 
 *     `Y88P'  `Y88P'  YP  YP  YP YP  YP  YP  `Y88P'  VP   V8P 
 *                                                             
 *                                                             
 */


export interface IPickedWebBasic {
  title: string;
  ServerRelativeUrl: string;
  guid: string;
  url: string;
  siteIcon: string;
}

export interface IPickedList {
  title: string;
  name: string;
  guid: string;
  isLibrary: boolean;
}

export interface IMyProgress {

  time: string;
  logLabel: string;
  label: string;
  description: string;
  percentComplete?: number;
  progressHidden?: boolean;
  icon?: string;
  color?: string;
  ref?: string;
  refElement?: any;
}

export interface IPivot {
    headerText: string;
    itemKey: string;
    filter?: string;
    data?: string;
    lastIndex: number;
  }
  
  export interface IMyPivots {
    heading1: IPivot[];
    heading2?: IPivot[];
    heading3?: IPivot[];
  }

export interface ILink {
    Description: string;
    Url: string;
  }
  
export interface IUser {
  title?: string;
  Title?: string;
  initials?: string;  //Single person column
  email?: string;  //Single person column
  id?: any;
  Id?: any;
  ID?: any;
  remoteID: any;
  PrincipalType?: number;

  isSiteAdmin?:boolean;
  LoginName?: string;
  Name?: string;
  isGuest?: boolean;

  //These optional props are from the React PeoplePicker control
  imageInitials?: string; //same as Initials;         From React People Picker control
  imageUrl?: string;  //Thumbnail URL;                From React People Picker control
  loginName?: string;  //Same as LoginName and Name;  From React People Picker control
  text?: string;   //Same as Title and title;         From React People Picker control
  tertiaryText?: string; //                           From React People Picker control
  secondaryText?: string; // same as email;           From React People Picker control

}

export interface IMyFonts{

  size?: string;
  weight?: string;
  style?: string;
  color?: string;

}

export interface IMyIcons{
  hasIcon: boolean;
  name: string;
  size?: string;
  height?: string;
  width?: string;
  margin?: string;

}



 /***
 *    d8888b. d88888b d88888b d888888b d8b   db d88888b d8888b. .d8888. 
 *    88  `8D 88'     88'       `88'   888o  88 88'     88  `8D 88'  YP 
 *    88oobY' 88ooooo 88ooo      88    88V8o 88 88ooooo 88oobY' `8bo.   
 *    88`8b   88~~~~~ 88~~~      88    88 V8o88 88~~~~~ 88`8b     `Y8b. 
 *    88 `88. 88.     88        .88.   88  V888 88.     88 `88. db   8D 
 *    88   YD Y88888P YP      Y888888P VP   V8P Y88888P 88   YD `8888Y' 
 *                                                                      
 *                                                                      
 */

export interface IRefinerRules {
  rules: RefineRuleValues[];
}

export type IRefinerStatType = 'sum' | 'avg' | 'max' | 'min' | 'count' | 'daysAgo' | 'monthsAgo' | 'demo' | 'eval';
export const RefinerStatTypes = ['sum' , 'avg' , 'max' , 'min' , 'count', 'daysAgo' , 'monthsAgo' , 'eval' ]; // , ''];

export interface IRefinerStat {

  primaryField: string;
  secondField?: string;
  title: string;
  stat: IRefinerStatType;
  chartTypes: ICSSChartTypes[];
  eval?: string;
  stylesChart?: any;
  stylesTitle?: any;
  stylesRow?: any;
  stylesBlock?: any;
  stylesLabel?: any;
  stylesValue?: any;
  
}

export interface IRefinerStats {
  stats: IRefinerStat[];
}

export type RefineRuleValues =
  'parseBySemiColons' | 'textAsNumber' | 'parseByCommas' | 'groupBy10s' |  'groupBy100s' |  'groupBy1000s' |  'groupByMillions' | '<log10Group' | '>log10Group' | 'log10e3' | 'mathCeiling' | 'mathFloor' | 'mathRound' |
  'isDate' | 'groupByDays' | 'groupByDaysDDD' | 'groupByWeeks' |  'groupByMonthsMMM' |    'groupByMonthsYYMM' |'groupByYears' | 'groupByDayOfWeek' |  'groupByDateBuckets' |
  'groupByUsers' | 'invalidRules' |  ''
;


export function buildKeyText( str: RefineRuleValues) {
  return { key: str, text: str };
}

export function refinerRuleItems() {

    let options = [];
    options.push( buildKeyText( 'parseBySemiColons' ) );
    options.push( buildKeyText( 'parseByCommas' ) );
    options.push( buildKeyText( 'textAsNumber' ) );
    options.push( buildKeyText( 'mathCeiling' ) );
    options.push( buildKeyText( 'mathFloor' ) );
    options.push( buildKeyText( 'mathRound' ) );
    options.push( buildKeyText( 'groupBy10s' ) );
    options.push( buildKeyText( 'groupBy100s' ) );
    options.push( buildKeyText( 'groupBy1000s' ) );
    options.push( buildKeyText( 'groupByMillions' ) );
    options.push( buildKeyText( '<log10Group' ) );
    options.push( buildKeyText( '>log10Group' ) );
    options.push( buildKeyText( 'log10e3' ) );
    options.push( buildKeyText( 'isDate' ) );
    options.push( buildKeyText( 'groupByDays' ) );
    ///options.push( buildKeyText( 'groupByDaysDDD' ) );
    options.push( buildKeyText( 'groupByWeeks' ) );
    options.push( buildKeyText( 'groupByMonthsMMM' ) );
    options.push( buildKeyText( 'groupByMonthsYYMM' ) );
    options.push( buildKeyText( 'groupByYears' ) );
    options.push( buildKeyText( 'groupByDayOfWeek' ) );
    options.push( buildKeyText( 'groupByDateBuckets' ) );
    options.push( buildKeyText( 'groupByUsers' ) );

    return options;

}

export interface IItemRefiners {
  lev0: any[]; lev1: any[]; lev2: any[];
  comments: string[];
  stat0?: number;
  stat1?: number;
  stat2?: number;
  stat3?: number;
  stat4?: number;
  stat5?: number;
  stat6?: number;
  stat7?: number;
  stat8?: number;
  stat9?: number;
  stat0Count?: number;
  stat1Count?: number;
  stat2Count?: number;
  stat3Count?: number;
  stat4Count?: number;
  stat5Count?: number;
  stat6Count?: number;
  stat7Count?: number;
  stat8Count?: number;
  stat9Count?: number;
}

export interface IRefiners {

  thisKey: string;
  multiCount: number; // Count when counting multi-value fields each time
  itemCount: number; // Count when only counting multi-value fields once
  childrenKeys: string[];
  childrenObjs: IRefinerLayer[];
  childrenMultiCounts: number[];
  childrenCounts: number[];
  stat0?: number;
  stat1?: number;
  stat2?: number;
  stat3?: number;
  stat4?: number;
  stat5?: number;
  stat6?: number;
  stat7?: number;
  stat8?: number;
  stat9?: number;
  stat0Count?: number;
  stat1Count?: number;
  stat2Count?: number;
  stat3Count?: number;
  stat4Count?: number;
  stat5Count?: number;
  stat6Count?: number;
  stat7Count?: number;
  stat8Count?: number;
  stat9Count?: number;
}


export interface IRefinerLayer {
  thisKey: string;
  multiCount: number; // Count when counting multi-value fields each time
  itemCount: number; // Count when only counting multi-value fields once
  childrenKeys: string[];
  childrenObjs?: IRefinerLayer[];
  childrenMultiCounts?: number[];
  childrenCounts?: number[];
  stat0?: number;
  stat1?: number;
  stat2?: number;
  stat3?: number;
  stat4?: number;
  stat5?: number;
  stat6?: number;
  stat7?: number;
  stat8?: number;
  stat9?: number;
  stat0Count?: number;
  stat1Count?: number;
  stat2Count?: number;
  stat3Count?: number;
  stat4Count?: number;
  stat5Count?: number;
  stat6Count?: number;
  stat7Count?: number;
  stat8Count?: number;
  stat9Count?: number;
}


/**
 * 
  {
    "buttons": [
      {
        "label": "ParkMe",
        "primary": true,
        "alert": "Hey, you Parked the project!",
        "confirm": "Are you sure you want to Park this Project?",
        "console": "Confirming we just parked a project",
        "panelMessage": "ParkedPanel Text goes here!",
        "icon": "Car",
        "updateItem": {
          "StatusTMT": "8. Park"
        }
      },
      {
        "label": "CompleteMe",
        "primary": false,
        "alert": "Hey, you Completed the project!",
        "confirm": "Are you sure you want to Complete this Project?",
        "console": "Confirming we just Completed a project",
        "panelMessage": "Complete Panel Text goes here!",
        "icon": "Checkbox",
        "updateItem": {
          "StatusTMT": "9. Completed",
          "CompletedByTMT": "",
          "CompletedDateTMT": ""
        }
      }
    ],
    "onUpdateAlsoCallback": false,
    "callBack": null
  }
 */

/***
 *    db    db d888888b d88888b db   d8b   db .d8888. 
 *    88    88   `88'   88'     88   I8I   88 88'  YP 
 *    Y8    8P    88    88ooooo 88   I8I   88 `8bo.   
 *    `8b  d8'    88    88~~~~~ Y8   I8I   88   `Y8b. 
 *     `8bd8'    .88.   88.     `8b d8'8b d8' db   8D 
 *       YP    Y888888P Y88888P  `8b8' `8d8'  `8888Y' 
 *                                                    
 *                                                    
 */

export interface ICustViewDef {
  minWidth: number;
  viewFields: IViewField[];
  groupByFields?: IGrouping[];
  includeDetails: boolean;
  includeAttach: boolean;
  includeListLink: boolean;
}


/***
 *     .d88b.  db    db d888888b  .o88b. db   dD       .o88b.  .d88b.  .88b  d88. .88b  d88.  .d8b.  d8b   db d8888b. .d8888. 
 *    .8P  Y8. 88    88   `88'   d8P  Y8 88 ,8P'      d8P  Y8 .8P  Y8. 88'YbdP`88 88'YbdP`88 d8' `8b 888o  88 88  `8D 88'  YP 
 *    88    88 88    88    88    8P      88,8P        8P      88    88 88  88  88 88  88  88 88ooo88 88V8o 88 88   88 `8bo.   
 *    88    88 88    88    88    8b      88`8b        8b      88    88 88  88  88 88  88  88 88~~~88 88 V8o88 88   88   `Y8b. 
 *    `8P  d8' 88b  d88   .88.   Y8b  d8 88 `88.      Y8b  d8 `8b  d8' 88  88  88 88  88  88 88   88 88  V888 88  .8D db   8D 
 *     `Y88'Y8 ~Y8888P' Y888888P  `Y88P' YP   YD       `Y88P'  `Y88P'  YP  YP  YP YP  YP  YP YP   YP VP   V8P Y8888D' `8888Y' 
 *                                                                                                                            
 *                                                                                                                            
 */

export const QuickCommandsTMT = {

  buttons: [{
      label: "ParkMe",
      primary: false,
      alert: "Hey, you Parked the project!",
      confirm: "Are you sure you want to Park this Project?",
      console: "Confirming we just parked a project",
      panelMessage: "ParkedPanel Text goes here!",
      icon: "Auto",
      updateItem: {
        StatusTMT: "8. Park",

      }
    },{
      label: "CompleteMe",
      primary: false,
      alert: "Hey, you Completed the project!",
      confirm: "Are you sure you want to Complete this Project?",
      console: "Confirming we just Completed a project",
      panelMessage: "Complete Panel Text goes here!",
      icon: "Checkbox",
      updateItem: {
        StatusTMT: "9. Completed",
        CompletedByTMT: "",
        CompletedDateTMT: "",

      }
    },
  ],
  onUpdateAlsoCallback: false,
  callBack: null,

};

export interface IQuickCommands {

    buttons: IQuickButton[];
    onUpdateAlsoCallback?: boolean; // If there is an update on button, then do callback
    callBack?: any;
    listWebUrl?: string;
    listName?: string;

}

export interface IQuickButton {

  label: string;
  primary: boolean; //  Primary, Default
  secondary?: string;
  alert?: string;  //  Popup Alert
  confirm?: string; //  Message to ask confirmation
  disabled?: boolean;
  console?: string; //  Command Message
  icon?: string;
  checked?: boolean;
  panelMessage?: string; //Message to put below buttons in panel
  updateItem: any; //  Should be object of item to update   example: { DueDate: 'setToToday', CompletedBy: 'setToMe' } 
                  // People column commands:  'setToMe', 'setToClear', 'setToUserID'
                  // Date column commands:  'setToToday', 'setOffsetDays+10', 'setOffsetDays-10', 'setToClear'
                  // 'insertField<StaticFieldName>, insertMyName, insertToday, appendToField
  groupID?: string; //Restrict button to this group of users (ID Number of Group)
  styleButton?: string;
  styleIcon?: string;

}



  /***
 *     .o88b. .d8888. .d8888.       .o88b. db   db  .d8b.  d8888b. d888888b .d8888. 
 *    d8P  Y8 88'  YP 88'  YP      d8P  Y8 88   88 d8' `8b 88  `8D `~~88~~' 88'  YP 
 *    8P      `8bo.   `8bo.        8P      88ooo88 88ooo88 88oobY'    88    `8bo.   
 *    8b        `Y8b.   `Y8b.      8b      88~~~88 88~~~88 88`8b      88      `Y8b. 
 *    Y8b  d8 db   8D db   8D      Y8b  d8 88   88 88   88 88 `88.    88    db   8D 
 *     `Y88P' `8888Y' `8888Y'       `Y88P' YP   YP YP   YP 88   YD    YP    `8888Y' 
 *                                                                                  
 *                                                                                  
 */

 export interface ILabelColor {
    label: string;
    barColor?: string;
    fontColor?: string;
    fontStyle?: string;
  }

  export type ICSSChartTypes = 'pareto-asc' | 'pareto-dec' | 'pareto-labels' | 'stacked-column-labels' | 'stacked-column-dec' | 'stacked-column-asc' | 'kpi-tiles';
  export const CSSChartTypes : ICSSChartTypes[] = ['pareto-asc' , 'pareto-dec' , 'pareto-labels' , 'stacked-column-labels' , 'stacked-column-dec' , 'stacked-column-asc'];

  export type ISeriesSort = 'asis' | 'labels' | 'asc' | 'dec' | string ;

  export interface ICSSChartSeries {
    title: string;
    labels: any[];
    chartTypes: ICSSChartTypes[];
    activeType?: number;
    key: string;
    valueIsCount?: boolean;

    barValueAsPercent? : boolean;
    height?: number | string ; //This would be horizonal bar height... one horizontal layer
    barValues?: 'val1' | 'sums' | 'avgs' | 'percents' | string ;
    titleLocation?: 'top' | 'side';

    barColors?: 'blue' | 'green' |'brown' | 'gray' | 'red' | 'brown' | 'themed' | 'custom' ;
    customColors?: ILabelColor[];
    axisTitle?: string;
    val1?: number[];
    percents?: any[];
    count?: number;
    avg?: number;
    sum?: number;
    min?: number;
    max?: number;
    changes?: any[];
    changeNotes?: string[];
    warnNotes?: string[];
    errorNotes?: string[];
    stylesChart?: any;
    stylesTitle?: any;
    stylesRow?: any;
    stylesBlock?: any;
    stylesLabel?: any;
    stylesValue?: any;
  }
  // , IChartSeries, ICharNote
  
export interface IChartSeries {
  title: string;
  axisTitle: string;
  labels: any[];
  sums: any[];
  counts: any[];
  totalS: number;
  totalC: number;
  changes: any[];
  changeNotes: string[];
  warnNotes: string[];
  errorNotes: string[];
  origLabels?: any[];
  origSums?: any[];
  origCounts?: any[];
}

export interface ICharNote {
  parent: string;
  source: string;
  note: string;
}