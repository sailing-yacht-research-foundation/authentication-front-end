#!/bin/bash
set -e
IFS='|'

REACTCONFIG="{\
\"SourceDir\":\"src\",\
\"DistributionDir\":\"build\",\
\"BuildCommand\":\"yarn build\",\
\"StartCommand\":\"yarn start\"\
}"
AWSCLOUDFORMATIONCONFIG="{\
\"configLevel\":\"project\",\
\"useProfile\":false,\
\"profileName\":\"default\",\
\"accessKeyId\":\"AKIAU4MUOS3JNYGU6XGC\",\
\"secretAccessKey\":\"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\",\
\"region\":\"us-west-2\"\
}"
AMPLIFY="{\
\"projectName\":\"syrf\",\
\"appId\":\"d29rwzm6pkx02t\",\
\"envName\":\"dev\",\
\"defaultEditor\":\"code\"\
}"
FRONTEND="{\
\"frontend\":\"javascript\",\
\"framework\":\"react\",\
\"config\":$REACTCONFIG\
}"
PROVIDERS="{\
\"awscloudformation\":$AWSCLOUDFORMATIONCONFIG\
}"
STORAGECONFIG="{\
  \"region\": \"us-west-2\",\
  \"bucketName\": \"syrfstorage154055-dev\"\
}"
CATEGORIES="{\
  \"storage\":$STORAGECONFIG\
}"

amplify pull \
--amplify $AMPLIFY \
--frontend $FRONTEND \
--providers $PROVIDERS \
--categories $CATEGORIES \
--yes