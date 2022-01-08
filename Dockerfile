# Dockerfile

FROM node:16.13-alpine3.15 AS base

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY nodemon.json tsconfig.json ./
COPY src/ src/


FROM node:16.13-alpine3.15

WORKDIR /usr/app

COPY --from=base /usr/app ./

EXPOSE $port

CMD npm start

#__EOF__
