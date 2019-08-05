import * as React from "react";
import ShareTableRow from "./ShareTableRow";
import { PrincipalObjectAccess } from "../Typings/Entities";
import { Table } from "react-bootstrap";

interface ShareTableState {}

interface ShareTableProps {
    onRefresh: () => void;
    poaRecords: PrincipalObjectAccess[];
    pageNumber: number;
    pageSize: number;
}

class ShareTable extends React.Component<ShareTableProps, ShareTableState> {
    render() {
        return (
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Access</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.poaRecords && this.props.poaRecords.length > 0 ? this.createTableBody() : null}
                </tbody>
            </Table>
        );
    }

    createTableBody = () => {
        const pageLowerBound = (this.props.pageNumber - 1) * this.props.pageSize;
        const pageUpperBound = this.props.pageNumber * this.props.pageSize;

        let out = [];
        for (let i = pageLowerBound; i < pageUpperBound; i++) {
            let poaRecord = this.props.poaRecords[i];
            out.push(
                <ShareTableRow
                    key={poaRecord.principalobjectaccessid}
                    record={poaRecord}
                    refresh={this.props.onRefresh}
                />
            );
        }
        return out;
    };
}

export default ShareTable;
