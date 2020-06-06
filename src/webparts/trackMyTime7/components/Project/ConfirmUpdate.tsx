
import * as React from 'react';
import styles from '../TrackMyTime7.module.scss';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

export function createDialog(title: string, subText: string, acceptText: string, dismissText: string, show: boolean, _accept: any, _dismiss: any ){

    return (
        <div >
            <Dialog
                isOpen={show}
                type={DialogType.normal}
                onDismiss={_dismiss}
                title={ title }
                subText={ subText }
                isBlocking={false}
                className={''}
            >
            <DialogFooter>
                <PrimaryButton onClick={_accept}> { acceptText }</PrimaryButton>
                <DefaultButton onClick={_dismiss}>{ dismissText }</DefaultButton>
            </DialogFooter>
            </Dialog>
        </div >);
}