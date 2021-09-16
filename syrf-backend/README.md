
# SYRF Node Service

SYRF Node Service is for getting and exchanging access token from Facebook, Instagram, Twitter because we can only get tokens with a backend due to CORS.


## Project structure

    ├── bin                   
    ├── node_modules
    ├── models                   # model classes
    ├── controllers              # app controllers
    ├── config                   # app relative configs
    ├── public                   # public assets
    ├── routes                   # controller routes
    ├── tests                    # tests
    ├── utils                    # helpers
    ├── view
    ├── app.js
    ├── docker-compose.yml
    ├── dockerfile
    ├── package.json
    ├── package-lock.json
    └── README.md

## Installation
First, please copy the .env-example to .env and fillout all the variables needed. Please contact the team if you dont have the variables.

Then, from the command line run:

```bash
docker-compose up -d
```
The application will run on port 3003

## Available services
### Exchange short lived Facebook token for long lived token
#### Request
```bash 
POST /facebook/token/exchange
```
```bash
curl -i -H 'Accept: application/json' -d 'token={short-lived-token}' http://localhost:3003/facebook/token/exchange
```
#### Response

```bash
{ "access_token":"{long-lived-user-access-token}", "token_type": "bearer", "expires_in": 5183944 }

```

### Exchange short lived Instagram token for long lived token

#### Request
```bash 
POST /instagram/token/exchange
```
```bash
curl -i -H 'Accept: application/json' -d 'token={short-lived-token}' http://localhost:3003/instagram/token/exchange
```

#### Response

```bash
{
  "access_token":"{long-lived-user-access-token}",
  "token_type": "bearer",
  "expires_in": 5183944 // Number of seconds until token expires
}

```


### Refresh Instagram long lived token
#### Request
```bash 
POST /instagram/token/refresh
```
```bash
curl -i -H 'Accept: application/json' -d 'token={long-lived-token}' http://localhost:3003/instagram/token/refresh
```

#### Response

```bash
{
  "access_token":"{long-lived-user-access-token}",
  "token_type": "bearer",
  "expires_in": 5183944 // Number of seconds until token expires
}

```

### Get Instagram token from code
```bash 
POST /instagram/token
```
```bash
curl -i -H 'Accept: application/json' -d 'code={code-returned-from-instagram-after-login}' http://localhost:3003/instagram/token
```

#### Response

```bash
{
    "access_token": "{instagram-access-token}",
    "user_id": "{user-id}"
}

```

## Testing
This project using Jest as test engine.

To start testing, first you have to use docker container environment
```bash
docker exec -it syrf-backend_main_1 bash

```
Then run test using the following command:
```bash
npm run test

```