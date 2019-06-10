import React, { Component } from "react";
import { Button, ButtonGroup } from "react-bootstrap";

class ShareActions extends Component {
    state = {};
    render() {
        return (
            <div>
                <ButtonGroup size="sm">
                    <Button variant="success" onClick={this.onClickShareThisRecord}>
                        Share This Record
                    </Button>
                    <Button variant="primary" onClick={this.onClickRefresh}>
                        Refresh
                    </Button>
                </ButtonGroup>
            </div>
        );
    }

    onClickShareThisRecord = () => {
        console.debug("ShareActions.onClickShareThisRecord()");
        alert("//TODO Share This Record");
    };

    onClickRefresh = () => {
        console.debug("ShareActions.onClickRefresh()");
        this.props.onRefresh();
    };
}

export default ShareActions;
