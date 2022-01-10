# RS School REST service

## Prerequisites

- **Git** - [Download & Install Git](https://git-scm.com/downloads).
- **Docker** - [Download & Install Docker](https://docs.docker.com/get-docker/).

> My personal development environment is `Docker Desktop 4.3.2` for [**Windows**](https://docs.docker.com/desktop/windows/install/) with `Docker 20.10.11` and `Docker Compose v2.2.1`

- _\[Opt.\]_ **Node.js** - [Download & Install Node.js](https://nodejs.org/en/download/) `^16.13.0` and **npm** package manager `^8.1.0`

> For this task you actually need **Node.js** only in the case if you'd like to run tests locally (outside the container).

## Download

Clone the repository:

```text
git clone https://github.com/rklepov/nodejs2021Q4-service
```

Go to the root directory of the cloned repository and do:

```text
git checkout task/07-docker
```

## Running the application

:warning: It's important that the version of [`docker-compose`](https://docs.docker.com/compose/) is compatible with the version `3.9` of [Compose YAML file](https://docs.docker.com/compose/compose-file/compose-file-v3/). Please follow the [instructions](https://docs.docker.com/compose/install/) to upgrade to the newer version of `docker-compose` if necessary.

### Build and run the containers

Use the following command:

```text
docker-compose up --build
```

It will build 2 containers (the application and the database) and run them. The DB container starts first because it's configured as the dependency for the app container in the Compose file.

Once the application container is running on the configured port (4000 as default) you should be able to open in your browser OpenAPI documentation by typing [http://localhost:4000/doc/](http://localhost:4000/doc/)

### Stop the containers and clean up

You can get back to the CLI prompt with <kbd>Ctrl+C</kbd> or just open a new terminal window and run:

```text
docker-compose down --volumes --rmi all
```

This will stop all the running containers (if they've not been stopped already after <kbd>Ctrl+C</kbd>) and do the full cleanup: remove the volumes and the container images.

## Testing

### Installing NPM modules

:warning: In this task you need to run **npm** installation locally _only_ if you'd like to run the tests locally for the target service running in the container.

```text
npm install
```

### Running the tests

After the container with the application is up and running enter the following commands to run the tests:

```text
npm test
```

### Checking `src/` monitoring

You can simply change one of the source `*.ts` files under `src/` and see that [**nodemon**](https://github.com/remy/nodemon) has restarted the application.

> :warning: Please make sure to do the _valid_ change here: in order to be able to check container restart functionality (see the section below) **nodemon** is configured to _exit_ on the application crash to let Docker [restart](https://docs.docker.com/config/containers/start-containers-automatically/) the container. If the change to the source code is invalid (e.g. syntax error) than you risk to get into the infinite loop of container restarts: **nodemon** won't be able to start the application and therefore will exit causing the container to stop. Then Docker will try to start it again and here we are in the infinite restart loop... (until the issue in the source file is fixed).

### Checking container restart after a failure

The app container is configured to be [restarted](https://github.com/rklepov/nodejs2021Q4-service/blob/docker-service-and-db/docker-compose.yml#L17) in the case of a failure. There're several ways to simulate the "failure":

1. Generate `uncaughtException` or `unhandledRejection` the same way we did in the [previous](https://github.com/rolling-scopes-school/basic-nodejs-course/blob/master/descriptions/logging-error-handling.md) task: just uncomment the respective line in [`src/server.ts`](https://github.com/rklepov/nodejs2021Q4-service/blob/docker-service-and-db/src/server.ts#L80). The changes will be picked up automatically (see [above](#checking-src-monitoring)) by **nodemon** which will detect the app crash and exit because it's started with (rather poorly [documented](https://github.com/remy/nodemon/blob/main/faq.md#using-nodemon-with-forever)) `--exitoncrash` flag.

2. Alternatively you can just forcibly kill **nodemon** process in the container with following command:

```text
docker exec rklepov-nodejs2021q4-service_app_1 pkill -f nodemon
```

In either case you'll be able to observe that Docker is restarting the container in the console where you run `docker-compose`.

## Development

If you use VSCode, you can get a better developer experience from integration with [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extensions.

### Auto-fix and format

```text
npm run lint
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: [https://code.visualstudio.com/docs/editor/debugging](https://code.visualstudio.com/docs/editor/debugging)
