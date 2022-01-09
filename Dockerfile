# Dockerfile

FROM node:16.13-alpine3.15 AS base

ARG workdir

WORKDIR $workdir

COPY package*.json ./

RUN npm install

COPY nodemon-docker.json tsconfig.json ./
COPY src/ src/


FROM node:16.13-alpine3.15

ARG workdir
ARG port

WORKDIR $workdir

COPY --from=base $workdir ./

EXPOSE $port

CMD npm run start:container

#__EOF__
