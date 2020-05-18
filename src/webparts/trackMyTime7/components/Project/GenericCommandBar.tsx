import * as React from 'react';

import { CommandBar, ICommandBarItemProps } from "office-ui-fabric-react/lib/CommandBar";
import {CommandBarButton, IButtonProps} from "office-ui-fabric-react/lib/Button";

import styles from '../TrackMyTime7.module.scss';

export interface ICommandBarProps {
    /**
   * Callback for when the selected pivot item is changed.
   */
  newProject?: (item?: any, ev?: React.MouseEvent<HTMLElement>) => void;
  editProject?: (item?: any, ev?: React.MouseEvent<HTMLElement>) => void;
  copyProject?: (item?: any, ev?: React.MouseEvent<HTMLElement>) => void;
  closeProject?: (item?: any, ev?: React.MouseEvent<HTMLElement>) => void;
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
            { key: 'new', text: 'New', onClick: () => console.log('New'), iconProps: { iconName: 'Add' } },
            { key: 'edit', text: 'Edit', onClick: () => console.log('Edit'), iconProps: { iconName: 'Edit' } },
            { key: 'copy', text: 'Copy', onClick: () => console.log('Copy'), iconProps: { iconName: 'Copy' } },

        ];
        // <div className={ styles.container }></div>
        return (
        <div className={ styles.container }>
            <CommandBar 
            items={ _items }
            overflowItems={[]}
            farItems={ [] }
            styles={{
                root: {padding:'0px !important'},
                
            }}
            />
        </div>
        );

    }

}    
