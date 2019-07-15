import * as React from "react";
import ShareTableBody from "./ShareTableBody";
import { Table } from "react-bootstrap";
import ShareActions from "./ShareActions";

class ShareTable extends React.Component {
    state = {
        refresh: false
    };

    render() {
        console.debug("ShareTable.render()");
        return (
            <div>
                <ShareActions onRefresh={this.onRefresh} />
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Name</th>
                            <th>Access</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <ShareTableBody
                        recordId={parent.Xrm.Page.data.entity.getId()}
                        onRefresh={this.setOnRefreshCallback}
                    />
                </Table>
            </div>
        );
    }

    onRefreshCallback: () => void;
    setOnRefreshCallback = (onRefreshCallback: () => void) => {
        console.debug("ShareTable.setOnRefreshCallback()");
        this.onRefreshCallback = onRefreshCallback;
    };
    onRefresh = () => {
        console.debug("ShareTable.onRefresh()");
        this.onRefreshCallback();
    };
}

export default ShareTable;
