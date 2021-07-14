# SYRF My Sailing Profile
A React app for Sailors & Developers to access their sailing profile.


## Project structure

    ├── amplify                  # amplify backend auto generated files
    ├── build                    # app generated files using build command                      
    ├── node_modules                   
    ├── public                   # public assets
    ├── src                      # app relative components & assets
    │   ├── app           # include components & assets & tests
    │   ├── locales       # app localization string files
    │   ├── store         # Redux store
    │   ├── types         
    │   ├── utils         # helpers
    │   ├── index.tsx     # app global index file
    ├── internals           
    ├── syrf-backend             # backend-relative services
    ├── docker-compose.yml         
    ├── tsconfig.json
    ├── dockerfile
    ├── package.json
    ├── package-lock.json
    ├── yarn.lock
    ├── yarn-error.lock
    └── README.md

## Installation
In the project root, run
``docker-compose up``

### Install amplify
``npm install -g @aws-amplify/cli``

Then run
``amplify pull`` to pull the amplify backend and generate the aws-export.js file.

The app will run at ``locahost:3002``

## Testing
This project using Jest as default test engine, to run test please run:

``yarn run test``
