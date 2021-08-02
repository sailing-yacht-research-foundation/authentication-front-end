FROM node:12

ENV REACT_APP_FACEBOOK_CLIENT_ID=4037107746377946
ENV REACT_APP_TWITTER_CLIENT_ID=00000
ENV REACT_APP_INSTAGRAM_CLIENT_ID=478370613251328
ENV REACT_APP_TOKEN_SERVICE_ENDPOINT=http://localhost:3003
ENV REACT_APP_BUCKET_URL=https://syrfstorage154055-dev.s3-us-west-2.amazonaws.com/public/
ENV REACT_APP_ENV=development
ENV REACT_APP_MAP_BOX_API_KEY=pk.eyJ1IjoiandlaXNiYXVtODkiLCJhIjoiY2s2dmxkeHVsMDM1MjNlbWhjcWJ2bGYzZyJ9.gHaMu1bLXgouNFs_qjlMhg

RUN mkdir /app

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

RUN yarn install
COPY . .

CMD ["yarn", "start"]