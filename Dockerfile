FROM node:14

ENV REACT_APP_FACEBOOK_CLIENT_ID=4037107746377946
ENV REACT_APP_TWITTER_CLIENT_ID=00000
ENV REACT_APP_INSTAGRAM_CLIENT_ID=478370613251328
ENV REACT_APP_TOKEN_SERVICE_ENDPOINT=http://localhost:3003
ENV REACT_APP_BUCKET_URL=https://syrfstorage154055-dev.s3-us-west-2.amazonaws.com/public/
ENV REACT_APP_ENV=development
ENV REACT_APP_MAP_BOX_API_KEY=pk.eyJ1IjoiandlaXNiYXVtODkiLCJhIjoiY2s2dmxkeHVsMDM1MjNlbWhjcWJ2bGYzZyJ9.gHaMu1bLXgouNFs_qjlMhg
ENV REACT_APP_SYRF_API_URL=http://live-data-lb-732013269.us-east-1.elb.amazonaws.com
ENV REACT_APP_SYRF_API_VERSION=/v1
ENV REACT_APP_SYRF_API_DEV_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgxYWQ2Nzg4LTQ1NDEtNDMxMi05YTdkLTQ5MmNhOGI4MTdiYSIsImlzc3VlZEF0IjoxNjI5MDg3OTI5MjAyLCJpYXQiOjE2MjkwODc5Mjl9.ObGzXCy0bHY60ofeB1Bl2n6okn95KJnBC9anDoxupzI
ENV REACT_APP_KEY_CLOAK_API_URL=https://auth.syrf.io
ENV REACT_APP_KEY_CLOAK_REALM_NAME=syrf
ENV REACT_APP_KEY_CLOAK_CLIENT_ID=SyrfWebApp

RUN mkdir /app

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

RUN yarn install
COPY . .

CMD ["yarn", "start"]