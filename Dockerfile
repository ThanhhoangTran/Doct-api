FROM node:20-alpine

WORKDIR /opt/doct-api

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "NODE_OPTIONS='--no-experimental-require-module' yarn dev"]