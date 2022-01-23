# RS School REST service

## Prerequisites

- **Git** - [Download & Install Git](https://git-scm.com/downloads).
- **Docker** - [Download & Install Docker](https://docs.docker.com/get-docker/).

> My personal development environment is `Docker Desktop 4.3.2` for [**Windows**](https://docs.docker.com/desktop/windows/install/) with `Docker 20.10.11` and `Docker Compose v2.2.1`

- **Node.js** - [Download & Install Node.js](https://nodejs.org/en/download/) `^16.13.0` and **npm** package manager `^8.1.0`

## Download

Clone the repository:

```text
git clone https://github.com/rklepov/nodejs2021Q4-service
```

Go to the root directory of the cloned repository and do:

```text
git checkout task/08-postgresql-typeorm
```

## Running the application

:warning: It's important that the version of [`docker-compose`](https://docs.docker.com/compose/) is compatible with the version `3.9` of [Compose YAML file](https://docs.docker.com/compose/compose-file/compose-file-v3/). Please follow the [instructions](https://docs.docker.com/compose/install/) to upgrade to the newer version of `docker-compose` if necessary.

There're actually 2 ways of how you can run the application: in the container or locally.

:information_source: **PostgreSQL** database instance always runs in the container.

### Option 1: Starting the server in the container

Use the following command:

```text
docker-compose up --build
```

It will build 2 containers (the application and the database) and run them. The DB container starts first because it's configured as the dependency for the app container in the [Compose](https://github.com/rklepov/nodejs2021Q4-service/blob/typeorm-final-v2/docker-compose.yml#L13) file.

### Option 2: Starting the server locally

Here you start the database instance in the container and the server application in your local environment.

To start the PostgreSQL database you can use the following command:

```text
docker-compose up db
```

Next you should strat the server. Provided that `npm install` has been run before, you can start the server with the following command

```text
npm start
```

---

Once the application is up and running either in the container or locally (in both cases in can be confirmed by the message in the log: `INFO: The server has been started successfully`) you should be able to open Swagger documentation in your browser by going to [http://localhost:4004/doc/](http://localhost:4004/doc/)

### Stop the containers and clean up

You can get back to the CLI prompt with <kbd>Ctrl+C</kbd> or just open a new terminal window and run:

```text
docker-compose down --volumes --rmi all
```

This will stop all the running containers (if they've not been stopped already after <kbd>Ctrl+C</kbd>) and do the full cleanup: remove the volumes and the container images.

## Testing

### Installing NPM modules

Whether you've started the application in the container or locally it's easier to run the tests locally. Of course to be able to do that you need to ensure that the necessary dependencies have been installed with `npm install`. Alternatively you can login to the _application container_ with `docker exec` and run the tests there.

### Running the tests

:warning: Please remember that in this task we added authentication to our REST server therefore you need to run the _auth_ test suite with the command below (_not_ with the regular `npm test` as we did before).

Once the container with the application is up and running (look at the log messages in the console which confirm that) enter the following command to run the tests:

```text
npm run test:auth
```

## Development

If you use VSCode, you can get a better developer experience from integration with [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extensions.

### Auto-fix and format

```text
npm run lint
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: [https://code.visualstudio.com/docs/editor/debugging](https://code.visualstudio.com/docs/editor/debugging)
