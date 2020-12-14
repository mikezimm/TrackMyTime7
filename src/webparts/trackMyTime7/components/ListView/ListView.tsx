import {  } from '@microsoft/sp-webpart-base';

import * as React from 'react';
import { Link } from 'office-ui-fabric-react/lib/Link';
//import Utils from './utils';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";
import {ITimeEntry, IProject} from '../ITrackMyTime7State';
import * as fields from './ViewFields';

import * as cStyles from '../../../../services/styleReact';
import styles from '../TrackMyTime7.module.scss';

/**
 * 
 * @param parentProps 
 * @param parentState 
 * @param theseAreItems 
 */

export function listViewBuilder(parentProps,parentState, theseAreItems: ITimeEntry[]){

  let groupByFields: IGrouping[] = [  {   name: 'timeGroup',   order: 1,   }  ];

  let viewFields = fields.viewFieldsFull();

  let listView = 
  <div className={ parentState.debugColors ? styles.timeListView : '' } >
    <ListView
      items={theseAreItems}
      viewFields={viewFields}
      compact={true}
      selectionMode={SelectionMode.none}
      //selection={this._getSelection}
      showFilter={true}
      //defaultFilter="John"
      filterPlaceHolder="Search..."
      groupByFields={groupByFields}
    /></div>;

  return listView;

}

export function projectBuilder(parentProps, parentState, theseAreItems: IProject[], _getSelectedProject){

  //console.log('projectBuilder',parentState.selectedProjectIndex)
  let viewFields = fields.viewFieldsProject();

  if ( theseAreItems.length === 0 ) { return "";}

  let listView = 
    <div className={ parentState.debugColors ? styles.projectListView : '' } >
      <ListView
      
        items={theseAreItems}
        viewFields={viewFields}
        compact={true}
        selectionMode={SelectionMode.single}
        selection={_getSelectedProject}
        showFilter={true}
        defaultSelection={[parentState.selectedProjectIndex]}
        //defaultFilter="John"
        filterPlaceHolder="Search..."
        //groupByFields={groupByFields}

        //render={this._onRenderRow}
        
      />
    </div>
;

  return listView;

}
