// server.ts

import { PORT } from './common/config';
import App from './app';

/**
 * The main entry point of the REST server application.
 * Creates the application instance and starts the server on the specified port.
 *
 * @param port - The server port number
 */
function run(port: number) {
  const app = new App();
  app
    .start(port)
    .then(() => {
      app.fastify.log.info('The server has been started successfully');
    })
    .catch((e) => {
      const errMsg = e instanceof Error ? e.message : String(e);
      app.fastify.log.fatal(`Failed to start the server on ${port}: ${errMsg}`);
    });
}

run(Number(PORT) || 4000);

// __EOF__
