# RS School REST service

## Prerequisites

- **Git** - [Download & Install Git](https://git-scm.com/downloads).
- **Docker** - [Download & Install Docker](https://docs.docker.com/get-docker/).

> My personal development environment is `Docker Desktop 4.4.4` for [**Windows**](https://docs.docker.com/desktop/windows/install/) with `Docker 20.10.12` and `Docker Compose v2.2.3`

- **Node.js** - [Download & Install Node.js](https://nodejs.org/en/download/) `^16.13.0` and **npm** package manager `^8.1.0`

## Download

Clone the repository:

```text
git clone https://github.com/rklepov/nodejs2021Q4-service
```

Go to the root directory of the cloned repository and do:

```text
git checkout task/10-nestjs
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

Once the application is up and running either in the container or locally (in both cases in can be confirmed by the message in the log: `INFO: Nest application successfully started`) you should be able to open Swagger documentation in your browser by going to [http://localhost:4004/doc/](http://localhost:4004/doc/) (by default the server is started on port `4004`).

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

### Testing file upload / download functionality

:information_source: For the purpose of testing the `/file` route for `GET` methods is unprotected so the you could use your browser to download the files.

#### Get the list of files

You can get the list of available files (in a simplistic form) just by navigating to the endpoint [http://localhost:4004/file/](http://localhost:4004/file/) in your browser. The server is supplied with a sample file [`lipsum.txt`](https://github.com/rklepov/nodejs2021Q4-service/blob/v3.0.0/static/lipsum.txt) which you can use to check the download right away.

#### Download a file

Just use your browser to get either the sample file [`http://localhost:4004/file/lipsum.txt`](http://localhost:4004/file/lipsum.txt) or the file that you've uploaded previously.

#### Upload a file

Here it's recommended to use [Postman](https://www.postman.com/downloads/) app. Prepare and send `POST` request with `multipart/form-data` content type containing your file (only a single file upload is supported at the moment):

![image](https://user-images.githubusercontent.com/43303762/152753043-75af0ac6-f733-449c-8f83-0abdce470354.png)

The file is saved with the original name on the server side. You can check that the file has been successfully uploaded by navigating to [http://localhost:4004/file/](http://localhost:4004/file/) in your web browser. After that you can try to download it back as explained in the section above.

:warning: Contrary to `GET`, the `POST` method of `/file` route is JWT _protected_. So prior to the upload you need to get the valid token via `/login` and supply it to **Postman** (see the _**Authorization**_ tab on the screenshot above).

## Performance test

The performance testing has been conducted using [Artillery](https://www.artillery.io/docs) framework for load testing. The test script itself is [here](https://github.com/rklepov/nodejs2021Q4-service/blob/v3.0.0/artillery/artillery.yaml). The results of the tests are in the table below:

```text
+-----------------------------------------+-----------------------------------------+
|  Express                                |  Fastify                                |
+-----------------------------------------+-----------------------------------------+
|  http.codes.200: ............ 5000      |  http.codes.200: ............ 5000      |
|  http.codes.201: ............ 2500      |  http.codes.201: ............ 2500      |
|  http.codes.204: ............ 2500      |  http.codes.204: ............ 2500      |
|  http.request_rate: ......... 11/sec    |  http.request_rate: ......... 11/sec    |
|  http.requests: ............. 10000     |  http.requests: ............. 10000     |
|  http.response_time:                    |  http.response_time:                    |
|    min: ..................... 9         |    min: ..................... 7         |
|    max: ..................... 76807     |    max: ..................... 73437     |
|    median: .................. 26643.2   |    median: .................. 25598.5   |
|    p95: ..................... 62964     |    p95: ..................... 60495.1   |
|    p99: ..................... 73889.3   |    p99: ..................... 69586.2   |
|  http.responses: ............ 10000     |  http.responses: ............ 10000     |
|  vusers.completed: .......... 500       |  vusers.completed: .......... 500       |
|  vusers.created: ............ 500       |  vusers.created: ............ 500       |
|  vusers.created_by_name.0: .. 500       |  vusers.created_by_name.0: .. 500       |
|  vusers.session_length:                 |  vusers.session_length:                 |
|    min: ..................... 4128      |    min: ..................... 5481.6    |
|    max: ..................... 681566.5  |    max: ..................... 659043.5  |
|    median: .................. 579773.2  |    median: .................. 557039.3  |
|    p95: ..................... 680373.8  |    p95: ..................... 653695.1  |
|    p99: ..................... 680373.8  |    p99: ..................... 653695.1  |
+-----------------------------------------+---------------------------------------- +
```

The detailed HTML reports are available in the repository: [Express](https://github.com/rklepov/nodejs2021Q4-service/tree/v3.0.0/artillery/reports/express), [Fastify](https://github.com/rklepov/nodejs2021Q4-service/tree/v3.0.0/artillery/reports/fastify).

As you can see there's actually no big difference in numbers for Express and Fastify platforms in this test. I assume that the main bottleneck was actually the database: the test is quite heavy on write operations (`POST` and `PUT` requests) so the difference in performance of the web frameworks was simply absorbed by that.
