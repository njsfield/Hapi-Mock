/* 
In Hapi, routes that match paths with higher specificity win...

Route 1 : path = '/{stuff*}',
Route 2 : path = '/files/{file}/me.jpg',

Get request Path = '/file/nick/me.jpg'

Winner = Route 2.

This demonstrates how routes can be compared against a live get request path to match the more specific route.
Uses a fake .get method (like server.inject)

*/


//// Hapi Server Mock

function Server (){
  this.port = null;
  this.routes = [];
  this.started = false;
}

// Add Port
Server.prototype.connection = function(portObj){
  this.port = portObj.port;
}

// Add Route Object
Server.prototype.route = function(routeObj){
  this.routes.push(routeObj);
}

// Checks for a port and routes
Server.prototype.start = function(cb){
  if (!this.port) {
    return 'No port specified';
  } else if (!this.routes.length) {
    return 'No routes given';
  }
  this.started = true;
  cb();
  
}

// Compares array of routes against path, eventually calls the handler function provided and returns the result
Server.prototype.get = function(path){
    var selectedRoute;
    var matchCount = 0;
    var params = {};
    var requestObj = {};
    var result;
    
    if (!this.started){
      return 'Server needs to be started first';
    }
    for (var route of this.routes){
      var matchPieces = route.path.split(/\/|\./);
      var pathPieces = path.split(/\/|\./);
      
      // If route path is '/{.*}'
      if (matchPieces.length == 2 && matchPieces[0] === '' && /{.*\*}/.test(matchPieces[1])) {
        if (matchCount < 1) {
          selectedRoute = route;
          matchCount = 1;
          params[matchPieces[1].slice(1,-1)] = path.substring(1);
        }
      }
      // If route path is more complex, e.g. '/files/{file}/me.jpg'
      else {
        var nestedParams = {};
        var test = matchPieces.every(function(c,i,a){
          if (/{.*}/.test(c)) {
            nestedParams[c.slice(1,-1)] = pathPieces[i];
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
    selectedRoute.handler(requestObj, function(response){
      result = response;
    });
    return result;
}