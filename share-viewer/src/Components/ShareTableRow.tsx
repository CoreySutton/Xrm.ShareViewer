import * as React from "react";
import WebApi from "../Utilities/WebApi";
import { Button, ButtonGroup } from "react-bootstrap";
import { PrincipalObjectAccess, SystemUser, Team } from "../Typings/Entities";

interface ShareTableRowState {
    record: PrincipalObjectAccess;
    principalTypeCode: string;
    principalId: string;
    principalName: string;
    accessRightsMask: string;
}

interface ShareTableRowProps {
    record: PrincipalObjectAccess;
}

class ShareTableRow extends React.Component<ShareTableRowProps, ShareTableRowState> {
    constructor(props: Readonly<ShareTableRowProps>) {
        super(props);
        console.debug("ShareTableRow.constructor()");
        this.state = {
            record: props.record,
            principalTypeCode: props.record.principaltypecode,
            principalId: props.record.principalid,
            principalName: null,
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
                        <Button variant="danger" onClick={this.onClickRevoke}>
                            Revoke
                        </Button>
                    </ButtonGroup>
                </td>
            </tr>
        );
    }

    convertAccessRightsMask(accessRightsMask: number) {
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

    getPrincipalName = () => {
        console.debug("ShareTableRow.getPrincipalName()");
        WebApi.getSingle<SystemUser | Team>(this.state.principalTypeCode, this.state.principalId)
            .then(this.setPrincipalName)
            .catch(error => {
                console.error("Faild to retrieve principal object with id " + this.state.principalId);
                console.error(error);
            });
    };

    setPrincipalName = (entity: SystemUser | Team) => {
        let name: string;
        if (!entity) {
            console.error("Faild to retrieve principal object with id " + this.state.principalId);
            name = "<NO NAME FOUND>";
        } else {
            switch (this.state.principalTypeCode) {
                case "systemuser": {
                    name = (entity as SystemUser).fullname;
                    break;
                }
                case "team": {
                    name = (entity as Team).name;
                    break;
                }
                default:
                    name = "<UNKNOWN ENTITY TYPE>";
            }
        }
        this.setState({
            principalName: name
        });
    };

    onClickRevoke() {
        console.debug("ShareTableRow.onClickRevoke");
        if (window.confirm(`Are you sure you wish to revoke ${this.state.principalName}'s access to this record`)) {
            this.revoke();
        }
    }

    revoke() {
        alert("TODO");
    }
}

export default ShareTableRow;
