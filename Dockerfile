FROM node:16.17.0-bullseye-slim

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

# THIS IS TO ENABLE PRISMA TO DETECT REQUIRED FILES
RUN apt-get update && apt-get install -y openssl libssl-dev

RUN npm ci

COPY . .

CMD npm start