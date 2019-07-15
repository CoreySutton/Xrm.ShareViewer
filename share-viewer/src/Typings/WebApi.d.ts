export type HttpAction = "POST" | "PATCH" | "PUT" | "GET" | "DELETE";

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
export interface EntityDefinition {
    EntitySetName: string;
}
