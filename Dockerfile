FROM node:16.17.0-bullseye-slim

WORKDIR /usr/src/app

COPY package.json package-lock.json ./


RUN npm ci

COPY . .

RUN npm run build

CMD node dist/main