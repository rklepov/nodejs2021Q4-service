# Dockerfile

FROM node:16.13-alpine3.15 AS base

ARG workdir=/usr/app

WORKDIR $workdir

COPY package*.json ./

RUN npm install

COPY nodemon-docker.json tsconfig.json ./
COPY src/ src/
COPY test/ test/


FROM node:16.13-alpine3.15

ARG workdir=/usr/app
ARG port=4000

WORKDIR $workdir

COPY --from=base $workdir ./

EXPOSE $port

CMD npm run start:container

#__EOF__
