import * as React from 'react';

import * as strings from 'TrackMyTime7WebPartStrings';

//import * as links from './AllLinks';

import { ITrackMyTime7Props } from '../ITrackMyTime7Props';
import { ITrackMyTime7State, IProjectOptions, IProjectAction  } from '../ITrackMyTime7State';

import { MyCons, projActions } from '../TrackMyTime7';

import { Fabric, initializeIcons } from 'office-ui-fabric-react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import {CommandBarButton, IButtonProps,} from "office-ui-fabric-react/lib/Button";

// Initialize icons in case this example uses them
initializeIcons();

import styles from './CommandBar.module.scss';

/***
 *    d888888b                  d8888b. d8888b.  .d88b.  d8888b. .d8888. 
 *      `88'                    88  `8D 88  `8D .8P  Y8. 88  `8D 88'  YP 
 *       88                     88oodD' 88oobY' 88    88 88oodD' `8bo.   
 *       88         C8888D      88~~~   88`8b   88    88 88~~~     `Y8b. 
 *      .88.                    88      88 `88. `8b  d8' 88      db   8D 
 *    Y888888P                  88      88   YD  `Y88P'  88      `8888Y' 
 *                                                                       
 *                                                                       
 */

export interface ICommandBarProps {
    /**
     * Callback for when the selected pivot item is changed.
     */
    hasProject: boolean;
    testUpdate: any; //Object with current props to compare with to check update
    newProject?: (item?: any, ev?: React.MouseEvent<HTMLElement>) => void;
    editProject?: (item?: any, ev?: React.MouseEvent<HTMLElement>) => void;
    copyProject?: (item?: any, ev?: React.MouseEvent<HTMLElement>) => void;
    parkProject?: (item?: any, ev?: React.MouseEvent<HTMLElement>) => void;  
    cancelProject?: (item?: any, ev?: React.MouseEvent<HTMLElement>) => void;
    completeProject?: (item?: any, ev?: React.MouseEvent<HTMLElement>) => void;

    reviewProject?: (item?: any, ev?: React.MouseEvent<HTMLElement>) => void;
    planProject?: (item?: any, ev?: React.MouseEvent<HTMLElement>) => void;
    processProject?: (item?: any, ev?: React.MouseEvent<HTMLElement>) => void;
    
    commandClass?: string;
    setLayout?: string;

}

/***
 *    d888888b                  .d8888. d888888b  .d8b.  d888888b d88888b 
 *      `88'                    88'  YP `~~88~~' d8' `8b `~~88~~' 88'     
 *       88                     `8bo.      88    88ooo88    88    88ooooo 
 *       88         C8888D        `Y8b.    88    88~~~88    88    88~~~~~ 
 *      .88.                    db   8D    88    88   88    88    88.     
 *    Y888888P                  `8888Y'    YP    YP   YP    YP    Y88888P 
 *                                                                        
 *                                                                        
 */

export interface ICommandBarState {
    hovering?: any;
    visible?: any;
}


/***
 *     .o88b.  .d88b.  d8b   db .d8888. d888888b 
 *    d8P  Y8 .8P  Y8. 888o  88 88'  YP `~~88~~' 
 *    8P      88    88 88V8o 88 `8bo.      88    
 *    8b      88    88 88 V8o88   `Y8b.    88    
 *    Y8b  d8 `8b  d8' 88  V888 db   8D    88    
 *     `Y88P'  `Y88P'  VP   V8P `8888Y'    YP    
 *                                               
 *                                               
 */

export const customButton = (props: IButtonProps) => {

    return (
      <CommandBarButton
        {...props}
        styles={{
          ...props.styles,
          root: {backgroundColor: 'white'  ,padding:'10px 20px 10px 10px !important', height: 32, borderColor: 'white'},
          textContainer: { fontSize: 16, color: '#00457E' },
          icon: { 
            fontSize: 18,
            fontWeight: "bolder",
            margin: '0px 2px',
         },
         
        }}
      />
    );
  };


/***
 *    d8888b. d88888b d88888b  .d8b.  db    db db      d888888b       .o88b. db       .d8b.  .d8888. .d8888. 
 *    88  `8D 88'     88'     d8' `8b 88    88 88      `~~88~~'      d8P  Y8 88      d8' `8b 88'  YP 88'  YP 
 *    88   88 88ooooo 88ooo   88ooo88 88    88 88         88         8P      88      88ooo88 `8bo.   `8bo.   
 *    88   88 88~~~~~ 88~~~   88~~~88 88    88 88         88         8b      88      88~~~88   `Y8b.   `Y8b. 
 *    88  .8D 88.     88      88   88 88b  d88 88booo.    88         Y8b  d8 88booo. 88   88 db   8D db   8D 
 *    Y8888D' Y88888P YP      YP   YP ~Y8888P' Y88888P    YP          `Y88P' Y88888P YP   YP `8888Y' `8888Y' 
 *                                                                                                           
 *                                                                                                           
 */  


export default class MyCommandBar extends React.Component<ICommandBarProps, ICommandBarState> {

    constructor(props: ICommandBarProps, state: ICommandBarState) {
        super(props);
    
        this.state = {
          hovering: 10,
          visible:10
        };
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

        let rebuild = false;
        if (this.props.hasProject !== prevProps.hasProject) {  rebuild = true ; }
        else if (this.props.testUpdate !== prevProps.testUpdate) {  rebuild = true ; }

        if (rebuild === true) {
            this._updateStateOnPropsChange(this.props.hasProject);
        }
    }
    

    private buildCommandBarProps ( thisAction: IProjectAction , onClick: any ) {

        const newProps: ICommandBarItemProps = { 
            key: thisAction.status, 
            text: thisAction.status,  
            name: '',   
            ariaLabel: thisAction.status, 
            commandBarButtonAs: customButton,
            iconProps: {  iconName: thisAction.icon, },
            onClick: () => onClick(),
        };

        return newProps;
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

    //public render(): JSX.Element {
    public render(): React.ReactElement<ICommandBarProps> {
        //2020-05-19:  Copied from Socialiis7/Master CommandBar.tsx
        console.log('ProjectCommandBar hasProject:', this.props.hasProject);

        const _new : ICommandBarItemProps = this.buildCommandBarProps(projActions.new, this.props.newProject);
        const _edit : ICommandBarItemProps = this.buildCommandBarProps(projActions.edit, this.props.editProject);
        const _copy : ICommandBarItemProps = this.buildCommandBarProps(projActions.copy, this.props.copyProject);

        const _park : ICommandBarItemProps = this.buildCommandBarProps(projActions.park, this.props.parkProject);
        const _cancel : ICommandBarItemProps = this.buildCommandBarProps(projActions.cancel, this.props.cancelProject);
        const _complete : ICommandBarItemProps = this.buildCommandBarProps(projActions.complete, this.props.completeProject);
        const _review : ICommandBarItemProps = this.buildCommandBarProps(projActions.review, this.props.reviewProject);
        const _plan : ICommandBarItemProps = this.buildCommandBarProps(projActions.plan, this.props.planProject);
        const _process : ICommandBarItemProps = this.buildCommandBarProps(projActions.process, this.props.processProject);

        //2020-05-19:  Format copied from Socialiis7/Master CommandBar.tsx
        const _items: ICommandBarItemProps[] = [ _new, _edit, _copy ] ;
        const _itemsHasNoProjects: ICommandBarItemProps[] = [ _new, ] ;

        //2020-05-19:  Format copied from Socialiis7/Master CommandBar.tsx
        const _overFlowItems: ICommandBarItemProps[] = [  _review, _plan, _process, _park, _cancel, _complete  ] ;

        
        
  /***
 *                   d8888b. d88888b d888888b db    db d8888b. d8b   db 
 *                   88  `8D 88'     `~~88~~' 88    88 88  `8D 888o  88 
 *                   88oobY' 88ooooo    88    88    88 88oobY' 88V8o 88 
 *                   88`8b   88~~~~~    88    88    88 88`8b   88 V8o88 
 *                   88 `88. 88.        88    88b  d88 88 `88. 88  V888 
 *                   88   YD Y88888P    YP    ~Y8888P' 88   YD VP   V8P 
 *                                                                      
 *                                                                      
 */

        // <div className={ styles.container }></div>
        return (
        <div>
            <CommandBar 
            items={ this.props.hasProject === true ? _items : _itemsHasNoProjects }
            overflowItems={ this.props.hasProject === true ? _overFlowItems : [] }
            //items={ _items }
            //overflowItems={ _overFlowItems }    
            farItems={ [] }
            styles={{
                root: { background: 'white', paddingLeft: '0px', height: '32px' }, // - removed backgroundColor: 'white'  
                primarySet: { height: '32px' }, //This sets the main _items - removed backgroundColor: 'white'  
                secondarySet:  { height: '32px' }, //This sets the _farRightItems

            }}
            overflowButtonAs = {customButton}
            />
        </div>
        );
    }

    private _updateStateOnPropsChange(params: any ): void {
        this.setState({
    
        });
      }
}    
