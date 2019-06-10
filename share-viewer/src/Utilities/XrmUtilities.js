// Get XRM
export const dyn = window.Xrm ? window.Xrm : window.parent.Xrm ? window.parent.Xrm : null;

export function executeSyncQuery(query, annotations) {
    // Create request URL
    var clientUrl = dyn.Page.context.getClientUrl();
    var requestString = clientUrl + "/api/data/v9.0/" + query;

    // Create request
    var request = new XMLHttpRequest();
    request.open("Get", requestString, false);
    request.setRequestHeader("Accept", "application/json");
    request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    request.setRequestHeader("OData-MaxVersion", "4.0");
    request.setRequestHeader("OData-Version", "4.0");
    if (annotations) {
        request.setRequestHeader("Prefer", 'odata.include-annotations="*"');
    }
    request.send();

    // Manage response
    if (request.status !== 200) {
        console.error(request.response);
        return null;
    } else {
        return JSON.parse(request.response);
    }
}

export function executeAsyncQuery(query, annotations, success, error) {
    console.log("executeAsyncQuery()");
    // Create request URL
    var clientUrl = dyn.Page.context.getClientUrl();
    var requestString = clientUrl + "/api/data/v9.0/" + query;

    // Create request
    var request = new XMLHttpRequest();
    request.open("Get", requestString, false);
    request.setRequestHeader("Accept", "application/json");
    request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    request.setRequestHeader("OData-MaxVersion", "4.0");
    request.setRequestHeader("OData-Version", "4.0");
    if (annotations) {
        request.setRequestHeader("Prefer", 'odata.include-annotations="*"');
    }
    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            if (request.status === 200) {
                success(JSON.parse(request.response));
            } else {
                error(request.response);
            }
        }
    };
    request.send();
}
