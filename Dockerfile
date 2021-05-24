FROM node:latest

RUN mkdir /app

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

RUN yarn install
COPY . .

CMD ["yarn", "start"]