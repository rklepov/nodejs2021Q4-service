# Dockerfile

FROM node:16.13-alpine3.15

EXPOSE 4000

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY ./src ./src
COPY tsconfig.json ./
COPY .env ./

CMD ["npm", "start"]

#__EOF__
