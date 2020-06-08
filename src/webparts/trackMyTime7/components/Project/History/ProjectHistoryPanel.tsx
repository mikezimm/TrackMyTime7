// Copied from
// https://github.com/pnp/sp-dev-fx-controls-react/blob/6dfc483c50bedaee3a82f0a7af3eddca1821bbbd/src/controls/fields/fieldUserRenderer/FieldUserHoverCard.tsx

import * as React from 'react';
import { HoverCard, IExpandingCardProps } from 'office-ui-fabric-react/lib/HoverCard';

import styles from '../ProjectHistoryRenderer.module.scss';

export interface IProjectHistoryHoverCardProps {
    /**
     * IExpandingCardProps
     */
    expandingCardProps: IExpandingCardProps;
    /**
     * User display name
     */
    history: string[];
    /**
     * CSS styles to apply to the renderer
     */
    cssProps?: React.CSSProperties;
}

export interface IProjectHistoryHoverCardState {
    contentRendered?: HTMLDivElement;
}

/**
 * Component to render User name with related Hover Card
 */
export default class ProjectHistoryHoverCard extends React.Component<IProjectHistoryHoverCardProps, IProjectHistoryHoverCardState> {
    constructor(props: IProjectHistoryHoverCardProps) {
        super(props);

        this.state = {
            contentRendered: undefined
        };
    }

    public render(): JSX.Element {
        return (
            <div className={styles.user} style={this.props.cssProps}>
                <span ref={(c: HTMLDivElement) => !this.state.contentRendered && this.setState({ contentRendered: c })} data-is-focusable={true}>{ this.props.history[0]  }</span>
                {this.state.contentRendered && this.props.expandingCardProps.onRenderCompactCard &&
                    <HoverCard
                        expandingCardProps={this.props.expandingCardProps}
                        target={this.state.contentRendered}
                        cardDismissDelay={0}
                    />}
            </div>
        );
    }
}