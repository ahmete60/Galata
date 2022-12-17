		                    require("dotenv").config();
					async = require('async');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool 	  = AmazonCognitoIdentity.CognitoUserPool;
var AWS					  = require('aws-sdk');
var request				  = require('request');
var jwkToPem			  = require('jwk-to-pem');
var jwt					  = require('jsonwebtoken');
var bcrypt                = require('bcryptjs');
//global fetch			  = require('node-fetch');
var AWS_REGION = 'eu-central-1'; //process.env.GALATA_REGION;

const pool_region = AWS_REGION;
var poolData = {};
var userPool = {};
var CLIENT_ID  = "";
const ssmClient = new AWS.SSM({ region: AWS_REGION });
var getParam = { Name: 'GALATA_COGNITO_CLIENT_ID',  WithDecryption: false };
try {       // this is the callback method also test out await-method below
  ssmClient.getParameter( getParam, (err, data) => {
    if (err) {
        console.log(err);// error handling.
    } else {
        console.log(data.Parameter.Value);
        CLIENT_ID  = data.Parameter.Value;

        poolData = {
        //  UserPoolId : process.env.AWS_COGNITO_USER_POOL_ID,        //readme inside .env
        //  ClientId :   process.env.GALATA_COGNITO_CLIENT_ID
            UserPoolId : "eu-central-1_opAfxkATk",  
            ClientId :   CLIENT_ID
        };
        userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    }
  });
  /* await method TODO
  const response = await ssmClient.getParameter( getParam); assigning result to a const may make a difference ?!?!?
  console.log(data.Parameter.Value);
  CLIENT_ID  = data.Parameter.Value;
  // ...
  */  
} catch (error) {
        console.log(error);// error handling.
}
console.log("here");



// This function sends a verification code to the users email.  If 24 hours have passed
// then call the ResendConfirmationCode API operation to generate and send a new code or link.
//
// The user enters the confirmation code in the app. The app calls ConfirmSignUp to send the code
// to the Amazon Cognito service.
//
// Amazon Cognito updates the information about the user status in your user pool. To view this information, 
// you can use the Amazon Cognito console. Or, you can use the AdminGetUser API.
function RegisterUser(theEmail, thePass, reqAttrib){
    userPool.signUp(theEmail, thePass, reqAttrib, null, function(err, result){
        if (err) {
            console.log(err);
            return;
        }
        cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
    });
}

function requestNewCode(email) {
    var userData = {
        Username: email,
        Pool: userPool,
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.resendConfirmationCode(function(err, res) {
        if (err) {
            reject(err);
        } else {
            resolve(res);
        }
    });
}

function verifyCode(email, newCode) {
    var userData = {
        Username: email,
        Pool: userPool,
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.confirmRegistration(newCode, true, function(err, result) {
        if (err) {
            console.log(err.code, ": ", err.message);
            alert(err.message || JSON.stringify(err));
            return;
        }
        console.log('call result: ' + result);
    });
}



function Login() {
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username : theEmail,
        Password : 'K(J/h6g5',
    });

    var userData = {
        Username : theEmail,
        Pool : userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            console.log('access token + ' + result.getAccessToken().getJwtToken());
            console.log('id token + ' + result.getIdToken().getJwtToken());
            console.log('refresh token + ' + result.getRefreshToken().getToken());
        },
        onFailure: function(err) {
            console.log(err);
        },

    });
}

function renewToken() {
    const RefreshToken = new AmazonCognitoIdentity.CognitoRefreshToken(
        {RefreshToken: "your_refresh_token_from_a_previous_login"});

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    const userData = {
        Username: theEmail,
        Pool: userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.refreshSession(RefreshToken, (err, session) => {
        if (err) {
            console.log(err);
        } else {
            let retObj = {
                "access_token": session.accessToken.jwtToken,
                "id_token": session.idToken.jwtToken,
                "refresh_token": session.refreshToken.token,
            }
            console.log(retObj);
        }
    })
}

function update(username, password){
        var attributeList = [];
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "custom:scope",
            Value: "some new value"
        }));
        attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: "name",
            Value: "some new value"
        }));
  
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: username,
            Password: password,
        });

        var userData = {
            Username: username,
            Pool: userPool
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.updateAttributes(attributeList, (err, result) => {
            if (err) {
                //handle error
            } else {
                console.log(result);
            }
        });
}

function ValidateToken(token) {
        request({
            url: `https://cognito-idp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                pems = {};
                var keys = body['keys'];
                for(var i = 0; i < keys.length; i++) {
                    //Convert each key to PEM
                    var key_id = keys[i].kid;
                    var modulus = keys[i].n;
                    var exponent = keys[i].e;
                    var key_type = keys[i].kty;
                    var jwk = { kty: key_type, n: modulus, e: exponent};
                    var pem = jwkToPem(jwk);
                    pems[key_id] = pem;
                }
                //validate the token
                var decodedJwt = jwt.decode(token, {complete: true});
                if (!decodedJwt) {
                    console.log("Not a valid JWT token");
                    return;
                }

                var kid = decodedJwt.header.kid;
                var pem = pems[kid];
                if (!pem) {
                    console.log('Invalid token');
                    return;
                }

                jwt.verify(token, pem, function(err, payload) {
                    if(err) {
                        console.log("Invalid Token.");
                    } else {
                        console.log("Valid Token.");
                        console.log(payload);
                    }
                });
            } else {
                console.log("Error! Unable to download JWKs");
            }
        });
}

function DeleteUser() {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: username,
            Password: password,
        });

        var userData = {
            Username: username,
            Pool: userPool
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                cognitoUser.deleteUser((err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Successfully deleted the user.");
                        console.log(result);
                    }
                });
            },
            onFailure: function (err) {
                console.log(err);
            },
        });
}


function deleteAttributes(username, password){
        var attributeList = [];
        attributeList.push("nickname");
  
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: username,
            Password: password,
        });

        var userData = {
            Username: username,
            Pool: userPool
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.deleteAttributes(attributeList, (err, result) => {
            if (err) {
                //handle error
            } else {
                console.log(result);
            }
        });
}


function ChangePassword(username, password, newpassword) {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: username,
            Password: password,
        });

        var userData = {
            Username: username,
            Pool: userPool
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                cognitoUser.changePassword(password, newpassword, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Successfully changed password of the user.");
                        console.log(result);
                    }
                });
            },
            onFailure: function (err) {
                console.log(err);
            },
        });
}

module.exports = {
  RegisterUser,
  requestNewCode,
  verifyCode,
  Login,
  renewToken,
  update,
  ValidateToken,
  DeleteUser,
  deleteAttributes,
  ChangePassword
};