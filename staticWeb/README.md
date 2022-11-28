# Loading a static web up on aws amplify

Create Zip File of Website

Go to the AWS Amplify Console

Choose “Deploy without Git provider”

Drag and drop upload

record Domain provided, for sharing with friends.

# Building a serverless web application

serverless create --template aws-nodejs --path galata_tt

This will create the serverless.yml configuration file and a handler.js that contains the entrypoint for Lambda.

Set up Serverless credentials on AWS Credentials.

npm init
npm install --save handlebars
npm install --save isomorphic-unfetch

When you deploy your app, Serverless will package up everything including your node_modules and push it all up to the cloud.