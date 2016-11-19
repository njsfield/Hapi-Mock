//// Hapi Server Mock

class Server {

    constructor() {
        this.port = null;
        this.routes = [];
        this.started = false;
    }


    // Add Port
    connection(portObj) {
        this.port = portObj.port;
    };

    // Add Route Object
    route(routeObj) {
        this.routes.push(routeObj);
    };

    // Checks for a port and routes
    start(cb) {
        if (!this.port) {
            return 'No port specified';
        } else if (!this.routes.length) {
            return 'No routes given';
        }
        this.started = true;
        cb();

    };

    // Compares array of routes against path, eventually calls the handler function provided and returns the result
    get(path) {
        let selectedRoute;
        let matchCount = 0;
        let params = {};
        let requestObj = {};
        let result;

        if (!this.started) {
            return 'Server needs to be started first';
        }
        for (var route of this.routes) {
            let matchPieces = route.path.split(/\/|\./);
            let pathPieces = path.split(/\/|\./);

            // If route path is '/{.*}'
            if (matchPieces.length == 2 && matchPieces[0] === '' && /{.*\*}/.test(matchPieces[1])) {
                if (matchCount < 1) {
                    selectedRoute = route;
                    matchCount = 1;
                    params[matchPieces[1].slice(1, -1)] = path.substring(1);
                }
            }
            // If route path is more complex, e.g. '/files/{file}/me.jpg'
            else {
                let nestedParams = {};
                let test = matchPieces.every(function(c, i, a) {
                    if (/{.*}/.test(c)) {
                        nestedParams[c.slice(1, -1)] = pathPieces[i];
                        c = pathPieces[i];
                    }
                    return c == pathPieces[i] ? true : false;
                });
                if (test) {
                    if (matchPieces.length > matchCount) {
                        matchCount = matchPieces.length - 1;
                        selectedRoute = route;
                        params = nestedParams;
                    }
                }
            }
        }
        // Initialise request Obj
        requestObj['params'] = params;

        // Use handler function to retrieve result
        selectedRoute.handler(requestObj, function(response) {
            result = response;
        });
        return result;
    };

}

module.exports = Server;
