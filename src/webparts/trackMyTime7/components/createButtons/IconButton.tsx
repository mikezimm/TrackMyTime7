import * as React from 'react';
import { IconButton, IIconProps, IContextualMenuProps, Stack, Link } from 'office-ui-fabric-react';

import {ITrackMyTime7State} from '../ITrackMyTime7State';
import { ITrackMyTime7Props } from '../ITrackMyTime7Props';

export interface IButtonExampleProps {
  // These are set based on the toggles shown above the examples (not needed in real code)
  disabled?: boolean;
  checked?: boolean;
  onClick?: any;
}

const emojiIcon: IIconProps = { iconName: 'Emoji2' };


export function createIconButton(parentProps:ITrackMyTime7Props , parentState: ITrackMyTime7State, _onToggle){

  
    return (
      
        <div>
        <IconButton iconProps={emojiIcon} 
        title="Emoji" 
        ariaLabel="Emoji" 
        disabled={false} 
        checked={false}
        onMenuClick={ _onToggle }
        
        />
    </div>
    );
  }

