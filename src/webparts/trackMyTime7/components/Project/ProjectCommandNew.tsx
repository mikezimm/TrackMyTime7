import * as React from 'react';

import * as strings from 'TrackMyTime7WebPartStrings';

//import * as links from './AllLinks';

import { ITrackMyTime7Props } from '../ITrackMyTime7Props';
import { ITrackMyTime7State, IProjectOptions } from '../ITrackMyTime7State';

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
  
export default class MyCommandBarNew extends React.Component<ICommandBarProps, ICommandBarState> {

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
    
    //public render(): JSX.Element {
    public render(): React.ReactElement<ICommandBarProps> {
        //2020-05-19:  Copied from Socialiis7/Master CommandBar.tsx
        console.log('ProjectCommandBar hasProject:', this.props.hasProject);

        //2020-05-19:  Format copied from Socialiis7/Master CommandBar.tsx
        const _new : ICommandBarItemProps = { key: 'new', text: 'New',  name: '',   ariaLabel: 'New', commandBarButtonAs: customButton,
            iconProps: {  iconName: 'Add', },
            onClick: () => this.props.newProject(),
        };

        // <div className={ styles.container }></div>
        return (
        <div>
            <CommandBar 
            items={ [ _new ] }
            overflowItems={ [] }
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
