import { IPropertyPanePage, PropertyPaneLabel, IPropertyPaneLabelProps, 
    PropertyPaneHorizontalRule, PropertyPaneTextField, IPropertyPaneTextFieldProps, 
    PropertyPaneLink, IPropertyPaneLinkProps, PropertyPaneDropdown, 
    IPropertyPaneDropdownProps, IPropertyPaneDropdownOption, PropertyPaneToggle, 
    IPropertyPaneConfiguration, PropertyPaneButton, PropertyPaneButtonType,
  } from "@microsoft/sp-property-pane";

  import { Pivot, IPivotStyles, PivotLinkSize, PivotLinkFormat } from 'office-ui-fabric-react/lib/Pivot';
  import { Image, ImageFit, ImageCoverStyle,IImageProps,IImageState } from 'office-ui-fabric-react/lib/Image';

  import * as strings from 'TrackMyTime7WebPartStrings';

  export class TrackTimeOptionsGroup {


    public roundTimeChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: 'none', text: "No rounding, use exact time"  },
        {   index: 1,   key: 'down5', text: "Round Down 5 minutes"  },
        {   index: 2,   key: 'up5', text: "Round Up 5 minutes"  },
        {   index: 3,   key: 'down15', text: "Round Down 15 minutes"  },
        {   index: 4,   key: 'up5', text: "Round Up 15 minutes"  },
    ];
    
    //Currently may not be neccessary
    public getRoundTime (findMe) {
        return findMe;
    }

    public projectMasterPriorityChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: 'your', text: "Your projects (you are Leading)"  },
        {   index: 1,   key: 'team', text: "Your projects (you are on the team)"  },
        {   index: 2,   key: 'everyone', text: "Projects designated for Everyone"  },
        {   index: 2,   key: 'other', text: "All other projects"  },

    ];
    
    //Currently may not be neccessary
    public getProjectMasterPriority (findMe) {
        return findMe;
    }

    public projectUserPriorityChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: 'your', text: "Your projects (you are Leading)"  },
        {   index: 1,   key: 'team', text: "Your projects (you are on the team)"  },
        {   index: 2,   key: 'everyone', text: "Projects designated for Everyone"  },
        {   index: 2,   key: 'other', text: "All other projects"  },
    ];
    
    //Currently may not be neccessary
    public getUserMasterPriority (findMe) {
        return findMe;
    }
    
    public defaultProjectPickerChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: 'yourRecent', text: "defaultProjectPicker - Your most recently used"  },
        {   index: 1,   key: 'yourToday', text: "Yours from today"  },
        {   index: 3,   key: 'yourWeek', text: "Yours from last week"  },
        {   index: 4,   key: 'allRecent', text: "All most recently used"  },
        {   index: 5,   key: 'allToday', text: "All from today"  },
        {   index: 6,   key: 'allWeek', text: "All from last week"  },
    ];
    
    //Currently may not be neccessary
    public getDefaultProjectPicker (findMe) {
        return findMe;
    }
    
    //  These choices need to match up with /src/webparts/trackMyTime/components/fields/choiceFieldBuilder.tsx
    public defaultTimePickerChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: 'sinceLast', text: "Since last entry"  },
        {   index: 1,   key: 'slider', text: "Slider - use Now as start or end"  },
        {   index: 2,   key: 'manual', text: "Manual enter start and end"  },
    ];
    
    //Currently may not be neccessary
    public getDefaultTimePicker (findMe) {
        return findMe;
    }

    public timeSliderIncChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: 5, text: "5 minutes"  },
        {   index: 1,   key: 10, text: "10 minutes"  },
        {   index: 2,   key: 15, text: "15 minutes"  },
        {   index: 2,   key: 30, text: "30 minutes"  },
    ];
    
    //Currently may not be neccessary
    public getTimeSliderIncChoices (findMe) {
        return findMe;
    }

    public targetItemsChoices: IPropertyPaneDropdownOption[] = <IPropertyPaneDropdownOption[]>[
        {   index: 0,   key: 'your', text: strings.FieldLabel_Yours  },
        {   index: 1,   key: 'team', text: strings.FieldLabel_YourTeam  },
        {   index: 2,   key: 'others', text: strings.FieldLabel_Others  },
    ];
    
    //Currently may not be neccessary
    public getTargetItemsChoices (findMe) {

        if (findMe === 'your') {
            return findMe;
        } else if (findMe === 'team') {
            return findMe;
        } else if (findMe === 'others') {
            return findMe;
        }

        return 'notSure';
        
    }

  }

  export let trackTimeOptionsGroup = new TrackTimeOptionsGroup();