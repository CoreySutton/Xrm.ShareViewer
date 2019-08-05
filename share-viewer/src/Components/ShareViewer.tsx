import * as React from "react";
import ShareTable from "./ShareTable";
import ShareActions from "./ShareActions";
import Dynamics from "../Utilities/Dynamics";
import ShareTablePagination from "./ShareTablePagination";
import WebApi from "../Utilities/WebApi";
import { WebApiResults } from "../Typings/WebApi";
import { PrincipalObjectAccess } from "../Typings/Entities";

interface ShareViewerProps {}

interface ShareViewerState {
    poaRecords: PrincipalObjectAccess[];
    refresh: boolean;
    pageNumber: number;
    recordsCount: number;
}

class ShareViewer extends React.Component<ShareViewerProps, ShareViewerState> {
    pageSize = 1;
    state = {
        poaRecords: new Array<PrincipalObjectAccess>(),
        recordsCount: 0,
        refresh: false,
        pageNumber: 0
    };

    componentDidMount() {
        this.refreshTable();
    }

    render() {
        console.debug("ShareViewer.render()");
        return (
            <div>
                <ShareActions onRefresh={this.refreshTable} />
                <ShareTable
                    poaRecords={this.state.poaRecords}
                    onRefresh={this.refreshTable}
                    pageNumber={this.state.pageNumber}
                    pageSize={this.pageSize}
                />
                <ShareTablePagination
                    pageSize={this.pageSize}
                    pageNumber={this.state.pageNumber}
                    recordsCount={this.state.recordsCount}
                    onPageChange={this.onPageChange}
                    onPageIncrement={this.onPageIncrement}
                    onPageDecrement={this.onPageDecrement}
                />
            </div>
        );
    }

    refreshTable = async () => {
        try {
            const poaRecords = await this.getPoaRecords();
            this.parsePoaRecords(poaRecords);
        } catch (error) {
            WebApi.errorHandler(error, "Faild to retrieve POA records for object id " + Dynamics.getCurrentRecordId());
        }
    };

    getPoaRecords = async (): Promise<WebApiResults<PrincipalObjectAccess>> => {
        console.debug("ShareViewer.getPoaRecords()");
        return WebApi.getMultiple<PrincipalObjectAccess>(
            "principalobjectaccessset",
            `objectid eq '${this.trimId(Dynamics.getCurrentRecordId())}' and accessrightsmask ne 0`
        );
    };

    trimId = (id: string) => {
        return id.replace("{", "").replace("}", "");
    };

    parsePoaRecords = (results: WebApiResults<PrincipalObjectAccess>) => {
        console.debug("ShareViewer.parsePoaRecords()");
        let poaRecords = new Array<PrincipalObjectAccess>();

        if (!results) {
            console.error("Faild to retrieve POA records for object id " + Dynamics.getCurrentRecordId());
        } else {
            console.debug("Retrieved " + results.value.length + " POA Records");
            results.value.forEach(record => {
                poaRecords.push(record);
            });
        }
        this.setState({
            poaRecords: poaRecords,
            pageNumber: 1,
            recordsCount: poaRecords.length
        });
    };

    onPageChange = (pageNumber: number) => {
        this.setState({ pageNumber: pageNumber });
    };

    onPageIncrement = () => {
        if (this.state.pageNumber < this.state.poaRecords.length * this.pageSize)
            this.setState({ pageNumber: this.state.pageNumber + 1 });
    };

    onPageDecrement = () => {
        if (this.state.pageNumber > 1) this.setState({ pageNumber: this.state.pageNumber - 1 });
    };
}

export default ShareViewer;
