// @ts-check
const http = require('http');

const routes = {
  default: (request, response) => {
    response.write('OK')

    return response.end();
  },
  'get:/contact': (request, response) => {
    response.write('Contact us')

    return response.end();
  },
  'post:/signin': async(request, response) => {
    for await (const data of request) {
      const user = JSON.parse(data);

      if (user.email === 'foo@bar.com' && user.password === 'foobar') {
        response.write('Authenticated');
      } else {
        response.writeHead(401);
        response.write('Unauthorized');
      }
    }

    return response.end();
  }
}

const handler = (request, response) => {
  const { method, url } = request;
  const resource = `${method}:${url}`.toLowerCase();
  const call = routes[resource] || routes.default;

  // if(resource === undefined) return;

  response.writeHead(200, {
    'Content-Type': 'text/html',
  });

  return call(request, response);
}

const app = http.createServer(handler)
  .listen(3000, () => console.log('App is listening on port', 3000));

module.exports = app;
