const Server = require('./mock.js');

const port = 8000;
const myServer = new Server();

    myServer.connection({port: port});

    myServer.route({
      method: 'GET',
      path: '/{stuff*}',
      handler: (request, reply) => {
        reply(request.params);
      }
    });

    myServer.route({
      method: 'GET',
      path: '/files/{file}/me.jpg',
      handler: (request, reply) => {
        reply(request.params.file);
      }
    });

    myServer.start(c => console.log(`server listening on port ${port}`));

    let result = myServer.get('/files/nick/me.jpg');

    console.log(`Server returned '${result}' when receiving GET request '/files/nick/me.jpg'`);
