export type HttpAction = "POST" | "PATCH" | "PUT" | "GET" | "DELETE";
export type DynamicsAction = "GrantAccess" | "RevokeAccess";

declare global {
    export interface Window {
        GetGlobalContext: any;
        Xrm: any;
    }
}

export interface Header {
    name: string;
    value: string;
}
export interface WebApiResults<Entity> {
    "@Microsoft.Dynamics.CRM.totalrecordcount": number;
    "@Microsoft.Dynamics.CRM.totalrecordcountlimitexceeded": boolean;
    "@odata.context": string;
    value: Entity[];
}

export interface WebApiError {
    code: string;
    innerError: {
        message: string;
        stacktrace: string;
        type: string;
    };
    message: string;
}
export interface EntityDefinition {
    EntitySetName: string;
    PrimaryIdAttribute: string;
}

export interface RevokeAccessParameters {
    Target: CrmBaseEntity;
    Revokee: CrmBaseEntity;
}

export interface CrmBaseEntity {
    [name: string]: string;
    "@odata.type": string;
}
