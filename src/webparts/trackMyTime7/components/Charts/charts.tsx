

import * as React from 'react';

import {IProject, ILink, ISmartText, ITimeEntry, IProjectTarget, IUser, 
  IProjects, IProjectInfo, IEntryInfo, IEntries, ITrackMyTime7State, ISaveEntry,
  IChartData, IChartSeries} from '../ITrackMyTime7State';

import { ITrackMyTime7Props } from '../ITrackMyTime7Props';
import * as strings from 'TrackMyTime7WebPartStrings';

import { ChartControl, ChartType } from '@pnp/spfx-controls-react/lib/ChartControl';

import styles from '../TrackMyTime7.module.scss';

export function creatCharts(parentProps:ITrackMyTime7Props , parentState: ITrackMyTime7State, series: IChartSeries){

  // set the options
  const options: Chart.ChartOptions = {
    scales:
    {
      yAxes:[{ticks:{beginAtZero: true}}]
    }
  };

  console.log('creatCharts', series);
  //if ( parentState.currentTimePicker !== 'slider') { return ""; }
  let maxTime = parentProps.timeSliderMax;
  return (
    <div style={{minWidth: 400, }}>
        <ChartControl 
        type={ChartType.Bar}
        data={{
            labels: series.labels,
            datasets: [{
            label: series.title,
            data: series.values
            }]
        }}
        options={options} />

    </div>

  );

}

/*
function _onChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void {
  console.dir(option);
}
*/