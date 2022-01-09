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

Once the application container is running on the configured port (4000 as default) you should be able to open in your browser OpenAPI documentation by typing http://localhost:4000/doc/

### Stop the containers and clean up

You can get back to the CLI propmt with <kbd>Ctrl+C</kbd> or just open a new terminal window and run:

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

### Checking container restart after a failure

## Development

If you're using VSCode, you can get a better developer experience from integration with [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extensions.

### Auto-fix and format

```text
npm run lint
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
