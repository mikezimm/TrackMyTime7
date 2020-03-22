import * as React from 'react';
import { IconButton, IIconProps, IContextualMenuProps, Stack, Link } from 'office-ui-fabric-react';

import {ITrackMyTime7State} from '../ITrackMyTime7State';
import { ITrackMyTime7Props } from '../ITrackMyTime7Props';

const emojiIcon: IIconProps = { iconName: 'BarChartVerticalFill' };

import styles from './CreateButtons.module.scss';

export const defCommandIconStyles = {
  root: {padding:'10px !important', height: 32},//color: 'green' works here
  icon: { 
    fontSize: 18,
    fontWeight: "normal",
    margin: '0px 2px',
    color: '#00457e', //This will set icon color
 },
};

export function createIconButton(iconName, titleText, _onClick, iconStyles){

    if ( iconStyles == null ) { iconStyles = defCommandIconStyles ; }

    if ( iconName === 'Help' ) { iconStyles.icon.fontWeight = '900' ; }

    console.log('createIconButton:', iconStyles);

    return (
      <div className= {styles.buttons}>
      <IconButton iconProps={{ iconName: iconName }} 
      title= { titleText } 
      ariaLabel= { titleText } 
      disabled={false} 
      checked={false}
      onClick={ _onClick }
      styles={ iconStyles }
      />
      </div>
    );
  }

