# Dockerfile

FROM node:16.13-alpine3.15

ARG workdir=/usr/app
ARG port=4000

WORKDIR $workdir

COPY package*.json ./

RUN npm install --omit optional && npm cache clean --force

COPY tsconfig*.json ./
COPY src/ src/
COPY static/lipsum.txt static/
COPY test/ test/

EXPOSE $port

CMD npm run start:dev

#__EOF__
