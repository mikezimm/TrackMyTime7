import * as React from 'react';

import * as strings from 'TrackMyTime7WebPartStrings';

//import * as links from './AllLinks';

import { ITrackMyTime7Props } from '../ITrackMyTime7Props';
import { ITrackMyTime7State, IProjectOptions } from '../ITrackMyTime7State';

import { Fabric, Stack, IStackTokens, initializeIcons } from 'office-ui-fabric-react';
import {CommandBarButton,} from "office-ui-fabric-react/lib/Button";

import ButtonCompound from '../createButtons/ICreateButtons';
import { IButtonProps, ISingleButtonProps, IButtonState } from "../createButtons/ICreateButtons";
import { createIconButton } from "../createButtons/IconButton";

// Initialize icons in case this example uses them
initializeIcons();

import styles from './ProjectPage.module.scss';

export interface IProjectPageProps {
    showProjectScreen: false | 'edit' | 'copy' | 'new';
    _closeProjectEdit: any;
}

export interface IProjectPageState {
    showProjectScreen?: string;
}

export default class MyProjectPage extends React.Component<IProjectPageProps, IProjectPageState> {

    /***
 *          .o88b.  .d88b.  d8b   db .d8888. d888888b d8888b. db    db  .o88b. d888888b  .d88b.  d8888b. 
 *         d8P  Y8 .8P  Y8. 888o  88 88'  YP `~~88~~' 88  `8D 88    88 d8P  Y8 `~~88~~' .8P  Y8. 88  `8D 
 *         8P      88    88 88V8o 88 `8bo.      88    88oobY' 88    88 8P         88    88    88 88oobY' 
 *         8b      88    88 88 V8o88   `Y8b.    88    88`8b   88    88 8b         88    88    88 88`8b   
 *         Y8b  d8 `8b  d8' 88  V888 db   8D    88    88 `88. 88b  d88 Y8b  d8    88    `8b  d8' 88 `88. 
 *          `Y88P'  `Y88P'  VP   V8P `8888Y'    YP    88   YD ~Y8888P'  `Y88P'    YP     `Y88P'  88   YD 
 *                                                                                                       
 *                                                                                                       
 */

    constructor(props: IProjectPageProps) {
        super(props);
    
        this.state = {
            showProjectScreen : this.props.showProjectScreen === "edit" ? "EDIT": this.props.showProjectScreen === "new" ? "NEW": this.props.showProjectScreen === "copy" ? "COPY": "HELP!"
        };
    }

        
    public componentDidMount() {
        //this._getListItems();
        
    }


    /***
     *         d8888b. d888888b d8888b.      db    db d8888b. d8888b.  .d8b.  d888888b d88888b 
     *         88  `8D   `88'   88  `8D      88    88 88  `8D 88  `8D d8' `8b `~~88~~' 88'     
     *         88   88    88    88   88      88    88 88oodD' 88   88 88ooo88    88    88ooooo 
     *         88   88    88    88   88      88    88 88~~~   88   88 88~~~88    88    88~~~~~ 
     *         88  .8D   .88.   88  .8D      88b  d88 88      88  .8D 88   88    88    88.     
     *         Y8888D' Y888888P Y8888D'      ~Y8888P' 88      Y8888D' YP   YP    YP    Y88888P 
     *                                                                                         
     *                                                                                         
     */

    public componentDidUpdate(prevProps){

        let rebuildTiles = false;
        //if (rebuildTiles === true) {
            //this._updateStateOnPropsChange({});
        //}
    }

    /***
     *         d8888b. d88888b d8b   db d8888b. d88888b d8888b. 
     *         88  `8D 88'     888o  88 88  `8D 88'     88  `8D 
     *         88oobY' 88ooooo 88V8o 88 88   88 88ooooo 88oobY' 
     *         88`8b   88~~~~~ 88 V8o88 88   88 88~~~~~ 88`8b   
     *         88 `88. 88.     88  V888 88  .8D 88.     88 `88. 
     *         88   YD Y88888P VP   V8P Y8888D' Y88888P 88   YD 
     *                                                          
     *                                                          
     */

    public render(): React.ReactElement<IProjectPageProps> {
        
        console.log('Rendering Project Edit Page');
        let isSaveButtonDisabled = false;

        const buttons: ISingleButtonProps[] =
        [{
            disabled: false,  
            checked: true, 
            primary: false,
            label: "Cancel",
            buttonOnClick: this.cancelForm.bind(this),
        },{
            disabled: false,  
            checked: true, 
            primary: false,
            label: "Clear form",
            buttonOnClick: this.clearForm.bind(this),
        },{
            disabled: isSaveButtonDisabled,  
            checked: true, 
            primary: true,
            label: "Save/Update",
            buttonOnClick: this.saveProject.bind(this),
        },
        ];

        let saveButtons = 
        <div style={{ paddingTop: '20px' }}>

            <h2>{"Track My Time:  Project " + this.state.showProjectScreen }</h2>
            <ButtonCompound
            buttons={buttons} horizontal={true}
            />
        </div>;

  /***
 *                   d8888b. d88888b d888888b db    db d8888b. d8b   db 
 *                   88  `8D 88'     `~~88~~' 88    88 88  `8D 888o  88 
 *                   88oobY' 88ooooo    88    88    88 88oobY' 88V8o 88 
 *                   88`8b   88~~~~~    88    88    88 88`8b   88 V8o88 
 *                   88 `88. 88.        88    88b  d88 88 `88. 88  V888 
 *                   88   YD Y88888P    YP    ~Y8888P' 88   YD VP   V8P 
 *                                                                      
 *                                                                      
 */

        // <div className={ styles.container }></div>
        return (
        <div>
            { saveButtons }
        </div>
        );

    }

    private cancelForm() {
        alert('canceled form');
        this.props._closeProjectEdit();
    }

    private clearForm() {
        alert('cleared form');
        this.props._closeProjectEdit();
    }

    private saveProject() {
        alert('saved form');
        this.props._closeProjectEdit();
    }
}    
