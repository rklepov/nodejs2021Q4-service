# Dockerfile

FROM node:16.13-alpine3.15

ARG workdir=/usr/app
ARG port=4000

WORKDIR $workdir

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY nodemon-docker.json tsconfig.json ./
COPY src/ src/
COPY test/ test/

EXPOSE $port

CMD npm run start:container

#__EOF__
