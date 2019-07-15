import * as React from "react";
import { Button, ButtonGroup } from "react-bootstrap";

interface ShareActionsState {}

interface ShareActionsProps {
    onRefresh: () => void;
}

class ShareActions extends React.Component<ShareActionsProps, ShareActionsState> {
    state = {};
    render() {
        return (
            <div>
                <ButtonGroup size="sm">
                    <Button variant="primary" onClick={this.onClickRefresh}>
                        Refresh
                    </Button>
                </ButtonGroup>
            </div>
        );
    }

    onClickRefresh = () => {
        console.debug("ShareActions.onClickRefresh()");
        this.props.onRefresh();
    };
}

export default ShareActions;
