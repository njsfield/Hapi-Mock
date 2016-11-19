var Server = require('./mock.js')

var port = 8000;
var myServer = new Server();

    myServer.connection({port: port});
    
    myServer.route({
      method: 'GET',
      path: '/{stuff*}',
      handler: (request, reply) => {
        reply(request.params);
      }
    })
    
    myServer.route({
      method: 'GET',
      path: '/files/{file}/me.jpg',
      handler: (request, reply) => {
        reply(request.params.file);
      }
    })
    
    myServer.start(c => console.log(`server listening on port ${port}`));
    
    myServer.get('/files/nick/me.jpg');
