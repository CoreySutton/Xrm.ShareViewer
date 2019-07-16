import * as React from "react";
import ShareTableRow from "./ShareTableRow";
import WebApi from "../Utilities/WebApi";
import { PrincipalObjectAccess } from "../Typings/Entities";
import { WebApiResults } from "../Typings/WebApi";

interface ShareTableBodyState {
    poaRecords: PrincipalObjectAccess[];
}

interface ShareTableBodyProps {
    onRefresh: (onRefrech: () => void) => void;
    recordId: string;
}

class ShareTableBody extends React.Component<ShareTableBodyProps, ShareTableBodyState> {
    state = {
        poaRecords: new Array<PrincipalObjectAccess>()
    };
    componentDidMount() {
        console.debug("ShareTableBody.componentDidMount()");
        this.props.onRefresh(this.populateTable);
        this.populateTable();
    }

    render() {
        console.debug("ShareTableBody.render()");
        if (!this.state.poaRecords || this.state.poaRecords.length === 0) return null;
        return (
            <tbody>
                {this.state.poaRecords.map(poaRecord => (
                    <ShareTableRow
                        key={poaRecord.principalobjectaccessid}
                        record={poaRecord}
                        refresh={this.populateTable}
                    />
                ))}
            </tbody>
        );
    }

    populateTable = () => {
        this.getPoaRecords()
            .then(this.parsePoaRecords)
            .catch(error =>
                WebApi.errorHandler(error, "Faild to retrieve POA records for object id " + this.props.recordId)
            );
    };

    getPoaRecords = (): Promise<WebApiResults<PrincipalObjectAccess>> => {
        console.debug("ShareTableBody.getPoaRecords()");
        return WebApi.getMultiple<PrincipalObjectAccess>(
            "principalobjectaccessset",
            `objectid eq '${this.trimId(this.props.recordId)}' and accessrightsmask ne 0`
        );
    };

    trimId = (id: string) => {
        return id.replace("{", "").replace("}", "");
    };

    parsePoaRecords = (results: WebApiResults<PrincipalObjectAccess>) => {
        console.debug("ShareTableBody.parsePoaRecords()");
        let poaRecords = new Array<PrincipalObjectAccess>();

        if (!results) {
            console.error("Faild to retrieve POA records for object id " + this.props.recordId);
        } else {
            console.debug("Retrieved " + results.value.length + " POA Records");
            results.value.forEach(record => {
                poaRecords.push(record);
            });
        }
        this.setState({
            poaRecords: poaRecords
        });
    };
}

export default ShareTableBody;
