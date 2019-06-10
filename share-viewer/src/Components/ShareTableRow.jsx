import React, { Component } from "react";
import { dyn, executeAsyncQuery } from "../Utilities/XrmUtilities";
import { Button, ButtonGroup } from "react-bootstrap";

class ShareTableRow extends Component {
    constructor(props) {
        console.debug("ShareTableRow.constructor()");
        super(props);
        this.state = {
            record: props.record,
            principalTypeCode: props.record.principaltypecode,
            principalId: props.record.principalid,
            accessRightsMask: this.convertAccessRightsMask(props.record.accessrightsmask)
        };
    }

    componentDidMount() {
        console.debug("ShareTableRow.componentDidMount()");
        this.getPrincipalName();
    }

    render() {
        console.debug("ShareTableRow.render()");
        return (
            <tr>
                <td>{this.state.principalTypeCode}</td>
                <td>{this.state.principalName}</td>
                <td>{this.state.accessRightsMask}</td>
                <td>
                    <ButtonGroup>
                        <Button variant="warning" onClick={this.onClickChange}>
                            Change
                        </Button>
                        <Button variant="danger" onClick={this.onClickRevoke}>
                            Revoke
                        </Button>
                    </ButtonGroup>
                </td>
            </tr>
        );
    }

    convertAccessRightsMask(accessRightsMask) {
        let access = null;
        switch (accessRightsMask) {
            case 4:
                access = "Append";
                break;
            case 16:
                access = "Append To";
                break;
            case 524288:
                access = "Assign";
                break;
            case 32:
                access = "Create";
                break;
            case 65536:
                access = "Delete";
                break;
            case 0:
                access = "None";
                break;
            case 1:
                access = "Read";
                break;
            case 262144:
                access = "Share";
                break;
            case 2:
                access = "Write";
                break;
            default:
                access = "UNKNOWN";
                break;
        }

        return access != null ? access + " (" + accessRightsMask + ")" : null;
    }

    getPrincipalName = (principalTypeCode, principalId) => {
        console.debug("ShareTableRow.getPrincipalName()");

        if (!dyn) {
            return this.setState({ principalName: "<NO NAME FOUND>" });
        }

        let query = principalTypeCode + "s(" + principalId + ")";
        executeAsyncQuery(
            query,
            resultJSON => {
                this.setPrincipalName(resultJSON, principalTypeCode, principalId);
            },
            error => {
                this.getPrincipalName_Error(error, principalId);
            }
        );
    };

    setPrincipalName = (resultJSON, principalTypeCode, principalId) => {
        let name;
        if (!resultJSON) {
            console.error("Faild to retrieve principal object with id " + principalId);
            name = "<NO NAME FOUND>";
        } else {
            name = principalTypeCode === "systemuser" ? resultJSON.fullname : resultJSON.name;
        }
        this.setState({
            principalName: name
        });
    };

    getPrincipalName_Error(error, principalId) {
        console.error("Faild to retrieve principal object with id " + principalId);
        console.error(error);
    }

    onClickChange() {
        console.debug("ShareTableRow.onClickChange");
        alert("//TODO Change");
    }

    onClickRevoke() {
        console.debug("ShareTableRow.onClickRevoke");
        if (window.confirm("Are you sure you wish to revoke access to this record")) {
            this.revoke();
        }
    }

    revoke() {}
}

export default ShareTableRow;
