import { override } from '@microsoft/decorators';
import * as React from 'react';
import { css } from 'office-ui-fabric-react/lib/Utilities';
import * as _ from '@microsoft/sp-lodash-subset';
import { IExpandingCardProps } from 'office-ui-fabric-react/lib/HoverCard';
import { DirectionalHint } from 'office-ui-fabric-react/lib/common/DirectionalHint';
import { Persona, PersonaSize } from 'office-ui-fabric-react/lib/Persona';
import { IconButton, Button, ButtonType } from 'office-ui-fabric-react/lib/Button';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { Icon } from 'office-ui-fabric-react/lib/Icon';

import { IPrincipal, IUserProfileProperties, IODataKeyValuePair } from '../../../common/SPEntities';
import { IFieldRendererProps } from '../fieldCommon/IFieldRendererProps';

import styles from './ProjectHistoryRenderer.module.scss';
import { IContext } from '../../../common/Interfaces';
import { GeneralHelper } from '../../../common/utilities/GeneralHelper';
import { SPHttpClient } from '@microsoft/sp-http';
import ProjectHistoryHoverCard, { IProjectHistoryHoverCardProps } from './ProjectHistoryHoverCard';
import * as telemetry from '../../../common/telemetry';

import * as strings from 'ControlStrings';
import { SPHelper } from '../../../common/utilities';

export interface IProjectHistoryRendererProps extends IFieldRendererProps {
    /**
     * users to be displayed
     */
    users?: IPrincipal[];
    /**
     * Customizer context
     */
    context: IContext;
}

/**
 * Internal interface to work with user profile
 */
export interface IProjectHistory {
    /**
     * display  name
     */
    displayName?: string;
    /**
     * job title
     */
    jobTitle?: string;
    /**
     * department
     */
    department?: string;
    /**
     * user id
     */
    id?: string;
    /**
     * avatar url
     */
    imageUrl?: string;
    /**
     * email
     */
    email?: string;
    /**
     * skype for business username
     */
    sip?: string;
    /**
     * true if the user is current user
     */
    currentUser?: boolean;
    /**
     * work phone
     */
    workPhone?: string;
    /**
     * cell phone
     */
    cellPhone?: string;
    /**
     * url to edit user profile in Delve
     */
    userUrl?: string;
}

export interface IProjectHistoryRendererState {
    users?: IProjectHistory[];
}

/**
 * Field User Renderer.
 * Used for:
 *   - People and Groups
 */
export class ProjectHistoryRenderer extends React.Component<IProjectHistoryRendererProps, IProjectHistoryRendererState> {

    // cached user profiles

    public constructor(props: IProjectHistoryRendererProps, state: IProjectHistoryRendererState) {
        super(props, state);

        telemetry.track('ProjectHistoryRenderer', {});

        const users: IProjectHistory[] = this.props.users ? this.props.users.map(user => {
            return this._getUserFromPrincipalAndProps(user, {});
        }) : [];

        this.state = {
            users: users
        };
    }

    @override
    public render(): JSX.Element {
        const userEls: JSX.Element[] = this.state.users.map((user, index) => {
            const expandingCardProps: IExpandingCardProps = {
                onRenderCompactCard: (user.email ? this._onRenderCompactCard.bind(this, index) : null),
                onRenderExpandedCard: (user.email ? this._onRenderExpandedCard.bind(this) : null),
                renderData: user,
                directionalHint: DirectionalHint.bottomLeftEdge,
                gapSpace: 1,
                expandedCardHeight: 150
            };
            const hoverCardProps: IProjectHistoryHoverCardProps = {
                expandingCardProps: expandingCardProps,
                displayName: user.displayName,
                cssProps: this.props.cssProps
            };
            return <ProjectHistoryHoverCard {...hoverCardProps} />;
        });
        return <div style={this.props.cssProps} className={css(this.props.className)}>{userEls}</div>;
    }

    /**
     * Renders compact part of user Hover Card
     * @param index user index in the list of users/groups in the People and Group field value
     * @param user IUser
     */
    private _onRenderCompactCard(index: number, user: IProjectHistory): JSX.Element {
        const sip: string = user.sip || user.email;
        let actionsEl: JSX.Element;
        if (user.currentUser) {
            actionsEl = <div className={styles.actions}>
                <Button buttonType={ButtonType.command} iconProps={{ iconName: 'Edit' }} href={user.userUrl} target={'_blank'}>{strings.UpdateProfile}</Button>
            </div>;
        }
        else {
            actionsEl = <div className={styles.actions}>
                <IconButton iconProps={{ iconName: 'Mail' }} title={strings.SendEmailTo.replace('{0}', user.email)} href={`mailto:${user.email}`} />
                <IconButton iconProps={{ iconName: 'Chat' }} title={strings.StartChatWith.replace('{0}', sip)} href={`sip:${sip}`} className={styles.chat} />
            </div>;
        }

        return <div className={styles.main}>
            <Persona
                imageUrl={user.imageUrl}
                primaryText={user.displayName}
                secondaryText={user.department}
                tertiaryText={user.jobTitle}
                size={PersonaSize.large} />
            {actionsEl}
        </div>;
    }

    /**
     * Renders expanded part of user Hover Card
     * @param user IUser
     */
    private _onRenderExpandedCard(user: IProjectHistory): JSX.Element {
            return <ul className={styles.sections}>
            </ul>;

            /**
             *             return <ul className={styles.sections}>
                <li className={styles.section}>
                    <div className={styles.header}>{strings.Contact} <Icon iconName="ChevronRight" className={styles.chevron} /></div>
                    <div className={styles.contactItem}>
                        <Icon iconName={'Mail'} />
                        <Link className={styles.content} title={user.email} href={`mailto:${user.email}`} target={'_self'}>{user.email}</Link>
                    </div>
                    {user.workPhone &&
                        <div className={styles.contactItem}>
                            <Icon iconName={'Phone'} />
                            <Link className={styles.content} title={user.workPhone} href={`tel:${user.workPhone}`} target={'_self'}>{user.workPhone}</Link>
                        </div>
                    }
                    {user.cellPhone &&
                        <div className={styles.contactItem}>
                            <Icon iconName={'Phone'} />
                            <Link className={styles.content} title={user.cellPhone} href={`tel:${user.cellPhone}`} target={'_self'}>{user.cellPhone}</Link>
                        </div>
                    }
                </li>
            </ul>;
             */

            return <Spinner size={SpinnerSize.large} />;
        }

}