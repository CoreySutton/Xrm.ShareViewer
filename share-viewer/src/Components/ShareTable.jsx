import React, { Component } from "react";
import ShareTableBody from "./ShareTableBody";
import Table from "react-bootstrap/Table";
import ShareActions from "./ShareActions";

class ShareTable extends Component {
    state = {
        refresh: false
    };

    render() {
        console.debug("ShareTable.render()");
        return (
            <div>
                <ShareActions onRefresh={this.onRefresh} />
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Name</th>
                            <th>Access</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <ShareTableBody
                        recordId="741EB865-115C-E911-A982-000D3A11EC14"
                        onRefresh={this.setOnRefreshCallback}
                    />
                </Table>
            </div>
        );
    }

    onRefreshCallback;
    setOnRefreshCallback = onRefreshCallback => {
        console.debug("ShareTable.setOnRefreshCallback()");
        this.onRefreshCallback = onRefreshCallback;
    };
    onRefresh = () => {
        console.debug("ShareTable.onRefresh()");
        this.onRefreshCallback();
    };
}

export default ShareTable;
