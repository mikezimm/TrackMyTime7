import * as React from 'react';

import * as strings from 'TrackMyTime7WebPartStrings';

//import * as links from './AllLinks';

import { ITrackMyTime7Props } from '../ITrackMyTime7Props';
import { ITrackMyTime7State, IProjectOptions, IProjectAction } from '../ITrackMyTime7State';

import { MyCons, projActions } from '../TrackMyTime7';

import { Fabric, initializeIcons } from 'office-ui-fabric-react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';
import {CommandBarButton, IButtonProps,} from "office-ui-fabric-react/lib/Button";

// Initialize icons in case this example uses them
initializeIcons();

import styles from './CommandBar.module.scss';

export interface ICommandBarProps {
    /**
     * Callback for when the selected pivot item is changed.
     */
    hasProject: boolean;
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

export interface ICommandBarState {
    hovering?: any;
    visible?: any;
}

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

        if (rebuild === true) {
            this._updateStateOnPropsChange(this.props.hasProject);
        }
    }
    
    private buildCommandBarProps ( thisAction: IProjectAction , onClick: any ) {

        let newProps: ICommandBarItemProps = { key: thisAction.status, text: thisAction.status,  name: '',   ariaLabel: thisAction.status, commandBarButtonAs: customButton,
            iconProps: {  iconName: thisAction.icon, },
            onClick: () => onClick,
        };

        return newProps;
    }


    //public render(): JSX.Element {
    public render(): React.ReactElement<ICommandBarProps> {
        //2020-05-19:  Copied from Socialiis7/Master CommandBar.tsx
        console.log('ProjectCommandBar hasProject:', this.props.hasProject);

        const _new : ICommandBarItemProps = this.buildCommandBarProps(projActions.new, this.props.newProject());
        const _edit : ICommandBarItemProps = this.buildCommandBarProps(projActions.edit, this.props.editProject());
        const _copy : ICommandBarItemProps = this.buildCommandBarProps(projActions.copy, this.props.copyProject());

        const _park : ICommandBarItemProps = this.buildCommandBarProps(projActions.park, this.props.parkProject());
        const _cancel : ICommandBarItemProps = this.buildCommandBarProps(projActions.cancel, this.props.cancelProject());
        const _complete : ICommandBarItemProps = this.buildCommandBarProps(projActions.complete, this.props.completeProject());
        const _review : ICommandBarItemProps = this.buildCommandBarProps(projActions.review, this.props.reviewProject());
        const _plan : ICommandBarItemProps = this.buildCommandBarProps(projActions.plan, this.props.planProject());
        const _process : ICommandBarItemProps = this.buildCommandBarProps(projActions.process, this.props.processProject());

        //2020-05-19:  Format copied from Socialiis7/Master CommandBar.tsx
        const _items: ICommandBarItemProps[] = [ _new, _edit, _copy ] ;

        //2020-05-19:  Format copied from Socialiis7/Master CommandBar.tsx
        const _overFlowItems: ICommandBarItemProps[] = [  _review, _plan, _process, _park, _cancel, _complete  ] ;

        // <div className={ styles.container }></div>
        return (
        <div>
            <CommandBar 
            items={ _items }
            overflowItems={_overFlowItems }
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
