import React, { Component } from "react";
import ShareTableRow from "./ShareTableRow";
import { dyn, executeAsyncQuery } from "../Utilities/XrmUtilities";
import * as sampleData from "../Data/sampleData";

class ShareTableBody extends Component {
    state = {
        poaRecords: null
    };

    componentDidMount() {
        console.debug("ShareTableContent.componentDidMount()");
        this.props.onRefresh(this.onRefresh);
        this.getPoaRecords(this.props.recordId, this.parsePoaRecords, this.getPoaRecords_error);
    }

    render() {
        console.debug("ShareTableContent.render()");
        if (!this.state.poaRecords || this.state.poaRecords.length === 0) return null;
        return (
            <tbody>
                {this.state.poaRecords.map(poaRecord => (
                    <ShareTableRow key={poaRecord.principalobjectaccessid} record={poaRecord} />
                ))}
            </tbody>
        );
    }

    getPoaRecords = (recordId, success, error) => {
        console.debug("ShareTableContent.getPoaRecords()");

        // TODO Remove this once we can connect to crm outside a web resource
        if (!dyn) success(sampleData.poaResults);
        else {
            let query = "principalobjectaccessset?$filter=objectid eq '" + recordId + "'";
            executeAsyncQuery(
                query,
                resultsJSON => {
                    success(resultsJSON);
                },
                e => {
                    error(e);
                }
            );
        }
    };

    getPoaRecords_error = error => {
        console.debug("ShareTableContent.getPoaRecords_error()");
        console.error("Faild to retrieve POA records for object id " + this.props.recordId);
        console.error(error);
    };

    parsePoaRecords = poaRecordsJSON => {
        console.debug("ShareTableContent.parsePoaRecords()");
        let poaRecords = [];

        if (!poaRecordsJSON) {
            console.error("Faild to retrieve POA records for object id " + this.props.recordId);
        } else {
            console.debug("Retrieved " + poaRecordsJSON.value.length + " POA Records");
            poaRecordsJSON.value.forEach(record => {
                poaRecords.push(record);
            });
        }
        this.setState({
            poaRecords: poaRecords
        });
    };

    onRefresh = () => {
        console.debug("ShareTableBody.onRefresh()");
        this.getPoaRecords(this.props.recordId, this.parsePoaRecords, this.getPoaRecords_error);
    };
}

export default ShareTableBody;
