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

export function createIconButton(iconName, titleText, _onClick, thisID,  iconStyles){

    if ( iconStyles == null ) { iconStyles = defCommandIconStyles ; }

    if ( iconName === 'Help' ) { iconStyles.icon.fontWeight = '900' ; }

    if (thisID == null ) { thisID = Math.random().toString(36).substring(7);} else {
      //Remove all special characters in Title or this so that it can be made an element ID
      thisID = thisID.replace(/[^\w\s|-]/gi, '');
    }

    console.log('createIconButton:', iconStyles);

    return (
      <div className= {styles.buttons} id={ thisID }>
      <IconButton iconProps={{ iconName: iconName }} 
      title= { titleText} 
      //uniqueId= { titleText } 
      //data= { titleText } 
      //key= { titleText } 
      //ariaLabel= { titleText } 
      disabled={false} 
      checked={false}
      onClick={ _onClick }
      styles={ iconStyles }
      />
      </div>
    );
  }

