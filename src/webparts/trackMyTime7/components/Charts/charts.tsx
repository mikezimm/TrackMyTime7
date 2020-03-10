

import * as React from 'react';

import {IProject, ILink, ISmartText, ITimeEntry, IProjectTarget, IUser, 
  IProjects, IProjectInfo, IEntryInfo, IEntries, ITrackMyTime7State, ISaveEntry,
  IChartData, IChartSeries} from '../ITrackMyTime7State';

import { ITrackMyTime7Props } from '../ITrackMyTime7Props';

import * as strings from 'TrackMyTime7WebPartStrings';

import { ChartControl, ChartType } from '@pnp/spfx-controls-react/lib/ChartControl';

import styles from '../TrackMyTime7.module.scss';
import { IDataOptions } from './chartsPage';

export function create1SeriesCharts(series: IChartSeries, thisType: ChartType, dataOptions: IDataOptions){

  // set the options
  const lineOptions: Chart.ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales:  { yAxes:[{ticks:{beginAtZero: true}}] },
    title: {
      display: true,
      text: series.title,
    },
    legend: {
      display: false
   },
  };

  // set the options
  const doughnutOptions: Chart.ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    //scales:  { yAxes:[{ticks:{beginAtZero: true}}] },
    title: {
      display: true,
      text: series.title,
    },
    legend: {
      display: false  //legend must be false until I can properly size the chart
    },
  };

  let chartOptions: Chart.ChartOptions = null;
  if ( thisType === ChartType.Bar ) { chartOptions = lineOptions; }
  else if ( thisType === ChartType.Doughnut ) { chartOptions = doughnutOptions; }
  else if ( thisType === ChartType.Line ) { chartOptions = lineOptions; }
  else if ( thisType === ChartType.HorizontalBar ) { chartOptions = lineOptions; }
  

  if ( !series ) {
    return null;
  } else {


    let theseValues  = !series || series.sums == null ? '' :  series.sums.map(
      (x) => {
        //console.log('x.toFixed', typeof x, x);
        if (typeof x == 'string') {
          return x;
        } else if ( !x || x == null ) {
          return null;
        } else {
          return x.toFixed(1);
        }
      }
    ).join(' ');

    let theseChanges  = !series || series.changeNotes == null || dataOptions == null || !dataOptions.chartChanges ? null :  
        series.changeNotes.map( x => { return <li>{x}</li>; } );

      console.log('theseChanges', theseChanges);
    let r = Math.random().toString(36).substring(7);
  
    return (
      <div style={{ }}>
          <ChartControl 
          ref={ r }
          type={ thisType }
          data={{
              labels: series.labels,
              datasets: [{
              //label: series.title,
              data: series.sums
              }]
          }}
          options={ chartOptions } />
  
          <div>{ theseValues }</div>
          <div>{ theseChanges }</div>
      </div>
  
    );

  }


}

/**
 * 
 * @param parentProps Name	Type	Default	  Description
responsive	                boolean	true	  Resizes the chart canvas when its container does (important note...).
responsiveAnimationDuration	number	0	      Duration in milliseconds it takes to animate to new size after a resize event.
maintainAspectRatio       boolean	true	    Maintain the original canvas aspect ratio (width / height) when resizing.
aspectRatio	              number	  2	      Canvas aspect ratio (i.e. width / height, a value of 1 representing a square canvas). Note that this option is ignored if the height is explicitly defined either as attribute or via the style.
 * @param parentState 
 * @param series 
 */


//Try this
/*https://stackoverflow.com/a/53233861/4210807
options: {
  responsive: true,
  maintainAspectRatio: false,
}
*/

/*//https://stackoverflow.com/a/54602573/4210807
<style type="text/css">
    #canvas-holder {
        background-color: #FFFFFF;
        position: absolute;
        top: 8px;
        left: 8px;
        right: 8px;
        bottom: 8px;
    }
</style>
For the appropriate Divs:

<div id="canvas-holder">
    <canvas id="chart-area"></canvas>
</div>
*/



export function createMultiSeries1ScaleCharts(chartTitle: string, stackMe: boolean, showLegend: boolean, 
    series: IChartSeries[], selectedIndex: number, thisType: ChartType, WebpartWidth: number, dataOptions: IDataOptions){
//https://codepen.io/natenorberg/pen/WwqRar?editors=0010

  // set the options
  const lineOptions: Chart.ChartOptions = {
    responsive: true,
    maintainAspectRatio: true, //false = regular works
    aspectRatio: WebpartWidth/300,
    scales:  { yAxes:[{ticks:{beginAtZero: true}, stacked: stackMe,}] },
    title: {
      display: chartTitle.length > 0 ? true : false,
      text: chartTitle.length > 0 ? chartTitle : '',
    },
    legend: {
      display: showLegend
   },
  };
/*
    // set the options
    const doughnutOptions: Chart.ChartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      //scales:  { yAxes:[{ticks:{beginAtZero: true}}] },
      title: {
        display: chartTitle.length > 0 ? true : false,
        text: chartTitle.length > 0 ? chartTitle : '',
      },
      legend: {
        display: false  //legend must be false until I can properly size the chart
     },
    };
  */

    let chartOptions: Chart.ChartOptions = null;
    if ( thisType === ChartType.Bar ) { chartOptions = lineOptions; }
    //else if ( thisType === ChartType.Doughnut ) { chartOptions = doughnutOptions; }
    else if ( thisType === ChartType.Line ) { chartOptions = lineOptions; }
    else if ( thisType === ChartType.HorizontalBar ) { chartOptions = lineOptions; }
    
    if ( !series || series.length === 0 ) {
      return null;
    } else {

      let myDataSets = series.map((s) => {
        return {
          label: s.title,
          data: s.sums,
        };
      });

      let theseValues = !series[selectedIndex] || series[selectedIndex].sums == null ? '' : series[selectedIndex].sums.map(
        (x) => {
          //console.log('x.toFixed', typeof x, x);
          if (typeof x == 'string') {
            return x;
          } else if ( !x || x == null ) {
            return null;
          } else {
            return x.toFixed(1);
          }
        }
      ).join();

      let r = Math.random().toString(36).substring(7);

      return (
        <div style={{  }}>
            <ChartControl 
            type={ thisType }
            ref={ r }
            data={{
                labels: series[selectedIndex].labels,
                datasets: myDataSets
            }}
            options={ chartOptions } />
        <div>{ theseValues }</div>
        </div>

    );
  }
}



export function creatLineChart(parentProps:ITrackMyTime7Props , parentState: ITrackMyTime7State, series: IChartSeries){

  // set the options
  const options: Chart.ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales:
    { yAxes:[{ticks:{beginAtZero: true}}] }
  };

  return (
    <div style={{ }}>
        <ChartControl 
        type={ChartType.Line}
        data={{
            labels: series.labels,
            datasets: [{
            label: series.title,
            data: series.sums
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