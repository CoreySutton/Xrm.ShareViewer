export interface PrincipalObjectAccess {
    "@odata.etag": string;
    "principaltypecode@OData.Community.Display.V1.FormattedValue": string;
    principaltypecode: string;
    "changedon@OData.Community.Display.V1.FormattedValue": string;
    changedon: Date;
    principalid: string;
    objectid: string;
    "versionnumber@OData.Community.Display.V1.FormattedValue": string;
    versionnumber: number;
    "accessrightsmask@OData.Community.Display.V1.FormattedValue": string;
    accessrightsmask: number;
    "objecttypecode@OData.Community.Display.V1.FormattedValue": string;
    objecttypecode: string;
    "inheritedaccessrightsmask@OData.Community.Display.V1.FormattedValue": string;
    inheritedaccessrightsmask: number;
    principalobjectaccessid: string;
    timezoneruleversionnumber?: any;
    utcconversiontimezonecode?: any;
}

export interface SystemUser {
    fullname: string;
}

export interface Team {
    name: string;
}
