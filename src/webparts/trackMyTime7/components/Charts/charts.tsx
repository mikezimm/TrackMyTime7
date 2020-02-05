

import * as React from 'react';

import {IProject, ILink, ISmartText, ITimeEntry, IProjectTarget, IUser, IProjects, IProjectInfo, IEntryInfo, IEntries, ITrackMyTime7State, ISaveEntry} from '../ITrackMyTime7State';

import { ITrackMyTime7Props } from '../ITrackMyTime7Props';
import * as strings from 'TrackMyTime7WebPartStrings';

import { ChartControl, ChartType } from '@pnp/spfx-controls-react/lib/ChartControl';

import styles from '../TrackMyTime7.module.scss';

export function creatCharts(parentProps:ITrackMyTime7Props , parentState: ITrackMyTime7State){


  //if ( parentState.currentTimePicker !== 'slider') { return ""; }
  let maxTime = parentProps.timeSliderMax;
  return (
    <div style={{minWidth: 400, }}>
        <ChartControl 
        type={ChartType.Bar}
        data={{
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
            label: 'My First dataset',
            data: [65, 59, 80, 81, 56, 55, 40]
            }]
        }} />

    </div>

  );

}

/*
function _onChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void {
  console.dir(option);
}
*/