import {
    EntityDefinition,
    WebApiResults,
    Header,
    HttpAction,
    DynamicsAction,
    CrmBaseEntity,
    WebApiError
} from "../Typings/WebApi";

export default class WebApi {
    private static webAPIPath = "/api/data/v9.0";

    public static callAction(actionName: DynamicsAction, data: any): Promise<void> {
        return WebApi.execute("POST", actionName, data);
    }

    public static getEntitySetName(entityLogicalName: string) {
        return new Promise(function(resolve, reject) {
            WebApi.get<EntityDefinition>(`EntityDefinitions(LogicalName='${entityLogicalName}')`)
                .then((entityDefinition: EntityDefinition) => {
                    resolve(entityDefinition.EntitySetName);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    public static getPrimaryIdAttributeName(entityLogicalName: string) {
        return new Promise(function(resolve, reject) {
            WebApi.get<EntityDefinition>(`EntityDefinitions(LogicalName='${entityLogicalName}')`)
                .then((entityDefinition: EntityDefinition) => {
                    resolve(entityDefinition.PrimaryIdAttribute);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    public static getSingle<T>(entityLogicalName: string, id: string, annotations?: boolean): Promise<T> {
        return new Promise(function(resolve, reject) {
            WebApi.getEntitySetName(entityLogicalName)
                .then((entitySetName: string) => {
                    resolve(WebApi.get<T>(`/${entitySetName}(${id})`, annotations));
                })
                .catch(error => reject(error));
        });
    }

    public static getMultiple<T>(
        entityLogicalName: string,
        filter?: string,
        select?: string,
        top?: number,
        annotations?: boolean
    ): Promise<WebApiResults<T>> {
        let query = `/${entityLogicalName}`;
        if (filter || select || top) query += "?";
        if (filter) query += `$filter=${filter}`;
        if (select) {
            if (query.charAt(query.length - 1) !== "?") query += "&";
            query += `$select=`;
        }
        if (top) {
            if (query.charAt(query.length - 1) !== "?") query += "&";
            query += `$top=`;
        }

        return WebApi.get(query, annotations);
    }

    public static getSync(query: string, annotations?: boolean, addHeader?: Header): JSON {
        console.log("executeSyncQuery()");
        return WebApi.executeSync("GET", query, null, annotations, addHeader);
    }

    public static get<T>(query: string, annotations?: boolean, addHeader?: Header): Promise<T> {
        console.log("getAsync()");
        return WebApi.execute("GET", query, null, annotations, addHeader);
    }

    public static execute<T>(
        action: HttpAction,
        query: string,
        data?: any,
        annotations?: boolean,
        addHeader?: Header
    ): Promise<T> {
        console.log("executeAsync()");
        return new Promise(function(resolve, reject) {
            let request = WebApi.buildRequest(action, query, true, data, annotations, addHeader);
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    request.onreadystatechange = null;
                    switch (request.status) {
                        case 200: // Success with content returned in response body.
                        case 204: // Success with no content returned in response body.
                        case 304: // Success with Not Modified
                            resolve(request.response ? JSON.parse(request.response) : undefined);
                            break;
                        default:
                            // All other statuses are error cases.
                            let error;
                            try {
                                error = JSON.parse(request.response).error;
                            } catch (e) {
                                error = new Error("Unexpected Error");
                            }
                            reject(error);
                            break;
                    }
                }
            };
            request.send(data ? JSON.stringify(data) : undefined);
        });
    }

    public static executeSync(
        action: HttpAction,
        query: string,
        data?: any,
        annotations?: boolean,
        addHeader?: Header
    ): JSON {
        console.log("executeSync()");
        let request = WebApi.buildRequest(action, query, false, data, annotations, addHeader);
        request.send(JSON.stringify(data));
        switch (request.status) {
            case 200: // Success with content returned in response body.
            case 204: // Success with no content returned in response body.
            case 304: // Success with Not Modified
                return JSON.parse(request.response);
            default:
                // All other statuses are error cases.
                try {
                    console.error(JSON.parse(request.response).error);
                } catch (e) {
                    console.error("Unexpected Error");
                }
                return null;
        }
    }

    public static buildRequest(
        action: HttpAction,
        query: string,
        async: boolean,
        data?: any,
        annotations?: boolean,
        addHeader?: Header
    ): XMLHttpRequest {
        WebApi.validateRequestParams(action, query, data, addHeader);

        let request = new XMLHttpRequest();
        request.open(action, encodeURI(WebApi.getRequestPath(query)), async);
        request.setRequestHeader("Accept", "application/json");
        request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        request.setRequestHeader("OData-MaxVersion", "4.0");
        request.setRequestHeader("OData-Version", "4.0");
        if (annotations) {
            request.setRequestHeader("Prefer", 'odata.include-annotations="*"');
        }
        if (addHeader) {
            request.setRequestHeader(addHeader.name, addHeader.value);
        }

        return request;
    }

    public static validateRequestParams(action: HttpAction, query: string, data?: any, addHeader?: Header) {
        if (!RegExp(action, "g").test("POST PATCH PUT GET DELETE")) {
            throw new Error(
                "XrmUtilities.executeRequest: action parameter must be one of the following: " +
                    "POST, PATCH, PUT, GET, or DELETE."
            );
        }
        if (!(typeof query === "string")) {
            throw new Error("XrmUtilities.executeRequest: query parameter must be a string.");
        }
        if (RegExp(action, "g").test("POST PATCH PUT") && !data) {
            throw new Error(
                "XrmUtilities.executeRequest: data parameter must not be null for operations that create or modify data."
            );
        }
        if (addHeader) {
            if (typeof addHeader.name != "string" || typeof addHeader.value != "string") {
                throw new Error(
                    "XrmUtilities.executeRequest: addHeader parameter must have header and value properties that are strings."
                );
            }
        }
    }

    public static getClientUrl(): string {
        let context: any;
        // GetGlobalContext defined by including reference to
        // ClientGlobalContext.js.aspx in the HTML page.
        if (typeof window.GetGlobalContext != "undefined") {
            context = window.GetGlobalContext();
        } else {
            if (typeof window.Xrm != "undefined") {
                // Xrm.Page.context defined within the Xrm.Page object model for form scripts.
                context = window.Xrm.Page.context;
            } else {
                throw new Error("Context is not available.");
            }
        }
        return context.getClientUrl();
    }

    public static getWebAPIPath(): string {
        return WebApi.getClientUrl() + WebApi.webAPIPath;
    }

    public static getRequestPath(query: string): string {
        return `${WebApi.getWebAPIPath()}${query.charAt(0) === "/" ? query : `/${query}`}`;
    }

    public static errorHandler = (error: WebApiError, customMessage?: string) => {
        if (customMessage) console.error(customMessage);
        console.error(error.message);
        console.error(error);
    };
}
