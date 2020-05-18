import * as React from 'react';

import * as strings from 'TrackMyTime7WebPartStrings';

//import * as links from './AllLinks';

import { ITrackMyTime7Props } from '../ITrackMyTime7Props';
import { ITrackMyTime7State, IProjectOptions } from '../ITrackMyTime7State';


import { IButtonProps, Fabric, initializeIcons } from 'office-ui-fabric-react';
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar';

// Initialize icons in case this example uses them
initializeIcons();

import styles from '../TrackMyTime7.module.scss';

export interface ICommandBarProps {
    /**
   * Callback for when the selected pivot item is changed.
   */
  newProject?: (item?: any, ev?: React.MouseEvent<HTMLElement>) => void;
  editProject?: (item?: any, ev?: React.MouseEvent<HTMLElement>) => void;
  copyProject?: (item?: any, ev?: React.MouseEvent<HTMLElement>) => void;
  parkProject?: (item?: any, ev?: React.MouseEvent<HTMLElement>) => void;  
  rejectProject?: (item?: any, ev?: React.MouseEvent<HTMLElement>) => void;
  completeProject?: (item?: any, ev?: React.MouseEvent<HTMLElement>) => void;

  commandClass?: string;
  setLayout?: string;

}

export interface ICommandBarState {
    hovering?: any;
    visible?: any;
}
  
export default class MyCommandBar extends React.Component<ICommandBarProps, ICommandBarState> {

    constructor(props: ICommandBarProps, state: ICommandBarState) {
        super(props);
    
        this.state = {
          hovering: 10,
          visible:10
        };
    }

    public render(): JSX.Element {
     
        const _items: ICommandBarItemProps[] = [
            { key: 'new', text: 'New', onClick: () => this.props.newProject(), iconProps: { iconName: 'Add' } },
            { key: 'edit', text: 'Edit', onClick: () => this.props.editProject(), iconProps: { iconName: 'Edit' } },
            { key: 'copy', text: 'Copy', onClick: () => this.props.copyProject(), iconProps: { iconName: 'Copy' } },

        ];

        const _overFlowItems: ICommandBarItemProps[] = [
            { key: 'park', text: 'Park', onClick: () => this.props.newProject(), iconProps: { iconName: 'Add' } },
            { key: 'reject', text: 'Reject', onClick: () => this.props.editProject(), iconProps: { iconName: 'Edit' } },
            { key: 'complete', text: 'Complete', onClick: () => this.props.copyProject(), iconProps: { iconName: 'Copy' } },

        ];
        // <div className={ styles.container }></div>
        return (
        <div className={ styles.container }>
            <CommandBar 
            items={ _items }
            overflowItems={_overFlowItems}
            farItems={ [] }
            styles={{
                root: {padding:'0px !important'},
                
            }}
            />
        </div>
        );

    }

}    
