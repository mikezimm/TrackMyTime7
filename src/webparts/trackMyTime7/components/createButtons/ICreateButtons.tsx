import * as React from 'react';
import { DefaultButton, PrimaryButton, CompoundButton, Stack, IStackTokens, elementContains } from 'office-ui-fabric-react';
import styles from './CreateButtons.module.scss';

export interface ISingleButtonProps {
  disabled?: boolean;
  checked?: boolean;
  primary?: boolean;
  label?: string;
  secondary?: string;
  buttonOnClick?: (item?: any, ev?: React.MouseEvent<HTMLElement>) => void;
}

export interface IButtonProps {
  // These are set based on the toggles shown above the s (not needed in real code)
  buttons: ISingleButtonProps[];
  horizontal?: boolean;
}

export interface IButtonState {

}
//  formatting
const stackTokens: IStackTokens = { childrenGap: 40 };

export default class ButtonCompound extends React.Component<IButtonProps, IButtonState> {

  /**
   * Constructor
   */

  constructor(props: IButtonProps) {
    super(props);

    this.state = {
      width: null
    };

  }

  public createButtons(buttons: ISingleButtonProps[] ){

    /*
        let button = buttons.map(thisButton => (
      <CompoundButton 
        primary={thisButton.primary  ? thisButton.primary : false }
        onClick={thisButton.buttonOnClick.bind(this)}
        secondaryText={thisButton.secondary} 
        disabled={thisButton.disabled} 
        checked={thisButton.checked}>
        {thisButton.label}
      </CompoundButton>
      ));
      */

    let button = buttons.map(thisButton => ( thisButton.primary ?
       <PrimaryButton text={thisButton.label} onClick={thisButton.buttonOnClick.bind(this)} allowDisabledFocus disabled={thisButton.disabled} checked={thisButton.checked} />
      :<DefaultButton text={thisButton.label} onClick={thisButton.buttonOnClick.bind(this)} allowDisabledFocus disabled={thisButton.disabled} checked={thisButton.checked} />
      ));
      return button;

  }

  public render(): React.ReactElement<IButtonProps> {

    let buttons = this.createButtons(this.props.buttons);
      return (
        <div className={styles.floatRight}>
          <Stack horizontal={this.props.horizontal} tokens={stackTokens}>
            {buttons}
          </Stack>
        </div>
      );
  }
}
