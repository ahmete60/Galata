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

## Amazon Cognito -> User pools -> Create user pool
```sh
npm install --save amazon-cognito-identity-js
npm install --save aws-sdk
npm install --save request
npm install --save jwk-to-pem
npm install --save jsonwebtoken
npm install --save node-fetch
```
REPLY-TO email address      ahmet@neweracapital.com

User pool name              ahmetneweracapital

Domain                      https://ahmetneweracapital.auth.eu-central-1.amazoncognito.com

App client name             ahmetneweracapital

Allowed callback URLs       https://main.d2z5c1ttjcgx85.amplifyapp.com/staticWeb/cognitoback

**User pool ID                eu-central-1_opAfxkATk**

## Amazon Cognito -> User pools -> ahmetneweracapital -> App Integration

Add a new app client and **make sure the Generate client secret option is deselected**. Client secrets aren't currently supported with the JavaScript SDK.

Client ID               	6bu5iv9153c64hrm9pa9m0llab
