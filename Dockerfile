FROM node:18.20.4-alpine

WORKDIR /opt/doct-api

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]