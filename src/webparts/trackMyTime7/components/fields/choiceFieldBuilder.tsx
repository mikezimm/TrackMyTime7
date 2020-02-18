

import * as React from 'react';

import {IProject, ILink, ISmartText, ITimeEntry, IProjectTarget, IUser, IProjects, IProjectInfo, IEntryInfo, IEntries, ITrackMyTime7State, ISaveEntry} from '../ITrackMyTime7State';

import { ITrackMyTime7Props } from '../ITrackMyTime7Props';
import * as strings from 'TrackMyTime7WebPartStrings';

import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

import styles from '../TrackMyTime7.module.scss';

import { IFieldDef } from './fieldDefinitions';

/*
Entry Type Choices need to match these:  \src\services\propPane\WebPartSettingsPage.ts

    public defaultTimePickerChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: 'sinceLast', text: "Since last entry"  },
        {   index: 1,   key: 'slider', text: "Slider - use Now as start or end"  },
        {   index: 2,   key: 'manual', text: "Manual enter start and end"  },
    ];

*/

export function creatEntryTypeChoices(selectedKey: string, _onChange){

  let options : IChoiceGroupOption[] = [];
  let choiceSpacer = '\u00A0\u00A0';
  let spacer4x = choiceSpacer + choiceSpacer + choiceSpacer + choiceSpacer;
  options.push(  {key: 'start', text: 'Start' + spacer4x });
  options.push(  {key: 'sinceLast', text: 'Since last' + spacer4x });
  options.push(  {key: 'slider', text: 'Slider' + spacer4x });
  options.push(  {key: 'manual', text: 'Manual' + choiceSpacer });

  return (
    
    <ChoiceGroup
      // className = "inlineflex" //This didn't do anything
      //className="defaultChoiceGroup" //This came with the example but does not seem to do anything
      //https://github.com/OfficeDev/office-ui-fabric-react/issues/8079#issuecomment-479136073
      styles={{ flexContainer: { display: "flex" , paddingLeft: 30} }}
      selectedKey={ selectedKey }
      options={options}
      onChange={_onChange}
      label="Time entry mode"
      required={true}
    />
  );
}

export function creatChartChoices( selectedKey: string, _onChange){

  let options : IChoiceGroupOption[] = [];
  let choiceSpacer = '\u00A0\u00A0';
  let spacer4x = choiceSpacer + choiceSpacer + choiceSpacer + choiceSpacer;
  options.push(  {key: 'snapShot', text: 'Snapshot' + spacer4x });
  options.push(  {key: 'longTerm', text: 'Long Term' + spacer4x });
  options.push(  {key: 'story', text: 'Story' + spacer4x });
  options.push(  {key: 'usage', text: 'Usage' + choiceSpacer });

  return (
    
    <ChoiceGroup
      // className = "inlineflex" //This didn't do anything
      //className="defaultChoiceGroup" //This came with the example but does not seem to do anything
      //https://github.com/OfficeDev/office-ui-fabric-react/issues/8079#issuecomment-479136073
      styles={{ flexContainer: { display: "flex" , paddingLeft: 30} }}
      selectedKey={ selectedKey }
      options={options}
      onChange={_onChange}
      label="Dashboards"
      required={true}
    />
  );
}


/*
function _onChange(ev: React.FormEvent<HTMLInputElement>, option: IChoiceGroupOption): void {
  console.dir(option);
}
*/