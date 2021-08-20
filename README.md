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
``chmod +x ./amplify-pull-staging.sh`` and
``./amplify-pull-staging.sh`` to pull amplify cognito backend

The app will run at ``locahost:3002``

You may see errors due to missing node_modules folder
Please install yarn then install the modules using the following commands:
``npm install -g yarn``
``yarn install``
## Testing
This project using Jest as default test engine, to run test please run:

``yarn run test``
