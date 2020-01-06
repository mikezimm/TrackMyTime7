import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'TrackMyTime7WebPartStrings';
import TrackMyTime7 from './components/TrackMyTime7';
import { ITrackMyTime7Props } from './components/ITrackMyTime7Props';

export interface ITrackMyTime7WebPartProps {
  description: string;
}

export default class TrackMyTime7WebPart extends BaseClientSideWebPart<ITrackMyTime7WebPartProps> {

  public render(): void {
    const element: React.ReactElement<ITrackMyTime7Props > = React.createElement(
      TrackMyTime7,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
