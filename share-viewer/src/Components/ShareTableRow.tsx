import * as React from "react";
import WebApi from "../Utilities/WebApi";
import { Button, ButtonGroup } from "react-bootstrap";
import { PrincipalObjectAccess, SystemUser, Team } from "../Typings/Entities";
import { RevokeAccessParameters, WebApiError } from "../Typings/WebApi";
import Dynamics from "../Utilities/Dynamics";

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
    state = {
        record: this.props.record,
        principalTypeCode: this.props.record.principaltypecode,
        principalId: this.props.record.principalid,
        principalName: "",
        accessRightsMask: this.convertAccessRightsMask(this.props.record.accessrightsmask)
    };

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
            .catch(error => error(error, "Faild to retrieve principal object with id " + this.state.principalId));
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

    onClickRevoke = () => {
        console.debug("ShareTableRow.onClickRevoke");
        if (window.confirm(`Are you sure you wish to revoke ${this.state.principalName}'s access to this record`)) {
            this.revoke();
        }
    };

    revoke = () => {
        const targetEntityName = Dynamics.getCurrentRecordEntityName();
        WebApi.getPrimaryIdAttributeName(targetEntityName)
            .then((targetPrimaryIdAttributeName: string) => {
                WebApi.getPrimaryIdAttributeName(this.state.principalTypeCode)
                    .then((principalPrimaryIdAttributeName: string) => {
                        this.revokeSharedRecord(targetPrimaryIdAttributeName, principalPrimaryIdAttributeName);
                    })
                    .catch(this.error);
            })
            .catch(this.error);
    };

    revokeSharedRecord = (targetPrimaryIdAttrName: string, principalPrimaryIdAttrName: string) => {
        const targetEntityName = Dynamics.getCurrentRecordEntityName();
        const targetId = Dynamics.getCurrentRecordId();
        const data: RevokeAccessParameters = {
            Target: {
                [targetPrimaryIdAttrName]: targetId,
                "@odata.type": `Microsoft.Dynamics.CRM.${targetEntityName}`
            },
            Revokee: {
                [principalPrimaryIdAttrName]: this.state.principalId,
                "@odata.type": `Microsoft.Dynamics.CRM.${this.state.principalTypeCode}`
            }
        };
        WebApi.callAction("RevokeAccess", data)
            .then(() => alert("Revoked"))
            .catch((error: WebApiError) => {
                console.error(error.message);
                console.error(error);
            });
    };

    error = (error: WebApiError, customMessage?: string) => {
        if (customMessage) console.error(customMessage);
        console.error(error.message);
        console.error(error);
    };
}

export default ShareTableRow;
