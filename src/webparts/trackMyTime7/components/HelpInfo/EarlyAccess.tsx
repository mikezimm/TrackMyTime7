//https://autoliv.sharepoint.com/sites/crs/PublishingImages/Early%20Access%20Image.png

import * as React from 'react';

import { Link, ILinkProps } from 'office-ui-fabric-react';
import { CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';
import { IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';

import WebPartLinks from './WebPartLinks';

import { createIconButton , defCommandIconStyles} from "../createButtons/IconButton";

import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';

import { Image, ImageFit, ImageCoverStyle} from 'office-ui-fabric-react/lib/Image';

import { Icon } from 'office-ui-fabric-react/lib/Icon';

import styles from './InfoPane.module.scss';

export interface IEarlyAccessProps {
    image?: string;
    email?: string;   //Valid email URL like:  'mailto:General - WebPart Dev <0313a49d.yourTenant.onmicrosoft.com@amer.teams.ms>?subject=Drilldown Webpart Feedback&body=Enter your message here :)  \nScreenshots help!'
    messages?: any[];
    links?: any[];
    farRightIcons?: any[];
    stylesImage?: any; //Not yet set up
    stylesBar?: any; //Not yet set up
    stylesBanner?: any; //Not yet set up

}

export interface IEarlyAccessState {
    imgHover: boolean;
    eleHover: boolean;
}

export default class EarlyAccess extends React.Component<IEarlyAccessProps, IEarlyAccessState> {




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

    public constructor(props:IEarlyAccessProps){
        super(props);
        this.state = { 
            imgHover: false,
            eleHover: false,

        };

        
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

    public render(): React.ReactElement<IEarlyAccessProps> {


        const stackTokensBody: IStackTokens = { childrenGap: 10 };

        let thisPage = null;

        const iconClassInfo = mergeStyles({
            fontSize: 18,
            margin: '5px',
            verticalAlign: 'bottom',
            padding: '0px !important',
          });

          let hasFarRight = this.props.farRightIcons !== null && this.props.farRightIcons !== undefined && this.props.farRightIcons.length > 0 ?  true : false;

          let iconStyles: any = { root: {
              //color: h.color ? h.color : "blue",
              cursor: 'pointer',
              paddingRight: hasFarRight === true ? null : '20px',
          }};
  
          let barLinkHover = styles.barLinkHover;
          let farLinkHover = styles.farLinkHover;
  
          defCommandIconStyles.icon.fontWeight = '600' ;
  
          let emailButton = <div title={ "Feedback" } className={ farLinkHover } style={{background: 'white', opacity: .7, borderRadius: '10px', cursor: 'pointer', marginRight: hasFarRight === true ? null : '20px' }}>
          { createIconButton('MailReply','Email',this._onIconClick.bind(this), null, defCommandIconStyles, false ) } </div>;
  
//        let emailIcon = this.props.email == null || this.props.email == undefined ? null :
//                <div className= { styles.mailLinkHover } style={{background: 'white', opacity: '.7', borderRadius: '10px' }}><Icon title={ "Feedback" } iconName={ "MailReply"} className={ iconClassInfo } styles = {iconStyles} onClick = { this._onIconClick.bind(this) } /></div>;

        //styles.earlyAccess, styles.innerShadow
        
        let image = this.props.image == null || this.props.image == undefined ? null : 
            <div style={{ paddingLeft: '20px' }}><Image 
                className={[
                styles.imgHoverZoom, 
                ( this.state.imgHover === true  ? styles.imgHoverZoomHover : null )
                ].join(" ")} 
                src={ this.props.image } 
                shouldFadeIn={true} 
                imageFit={ ImageFit.centerContain }
                coverStyle={ ImageCoverStyle.landscape }      
                width={ 100 } height={ 50 }
            /></div>;

        let messages = this.props.messages == null || this.props.messages == undefined ? null : this.props.messages.map( mess => { return <div style={{whiteSpace: 'nowrap'}}> { mess } </div>; });

        let links = this.props.links == null || this.props.links == undefined ? null : this.props.links.map( link => { return <div className={ barLinkHover } style={{whiteSpace: 'nowrap'}}> { link } </div>; });

        let farRightIcons = this.props.farRightIcons == null || this.props.farRightIcons == undefined ? null : this.props.farRightIcons.map( icon => { return <div className={ farLinkHover }> { icon } </div>; });

        let defBannerStyle = this.props.stylesBanner ? this.props.stylesBanner : { background: 'lightgray', color: 'black', width: '100%', verticalAlign: 'center' };

        thisPage = <div className= { styles.infoPane } ><div className= { [ styles.earlyAccess, styles.innerShadow ].join(' ') } style={ defBannerStyle }>
            <Stack horizontal={true} wrap={true} horizontalAlign={"space-between"} verticalAlign={"center"} tokens={stackTokensBody}>

                { image }
                { messages }
                { links }
                { emailButton }
                { farRightIcons }
            </Stack>

        </div></div>;

        return ( thisPage );


    }   //End Public Render


    public mouseOver(event): void {
        this.setState({ imgHover: true });
      }
    
      public mouseOut(event): void {
        this.setState({ imgHover: false });
      }

      private _onIconClick( event ) : void {
        window.open( this.props.email );
      }

}