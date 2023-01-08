FROM node:16.17.0-bullseye-slim

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN npm install

COPY . .

RUN npm run build

CMD node dist/main