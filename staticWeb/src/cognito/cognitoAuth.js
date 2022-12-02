import { CognitoUserAttribute, CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import UserPool from "./userPool";

export const SignUp = (props) => {
  /**
   * @description Used for a new Sign-Up and send a verification mailto the given mail .
   * @param {} props Props should have a email ; role and password for the signup 
   */
  const { email, role, password, reference = '', infRef = '' } = props;
  return new Promise((resolve, reject) => {
    var error, message
    const attributes = [
      new CognitoUserAttribute({ Name: "custom:userType", Value: role }),
      new CognitoUserAttribute({ Name: "custom:reference", Value: reference }),
      new CognitoUserAttribute({ Name: "custom:infRef", Value: infRef }),
      new CognitoUserAttribute({ Name: "custom:isCompleted", Value: 'false' }),
    ];
    UserPool.signUp(email, password, attributes, null, (err, data) => {
      if (err) {
        error = true; message = err
        reject({ error, message })
      } else resolve({ error: false, message: data })
    });
  })
}

export const updateAttributes = async (Username, Password, attributeList) => new Promise((resolve, reject) => {
  const cognitoUser = new CognitoUser({ Username, Pool: UserPool });

  const authDetails = new AuthenticationDetails({ Username, Password });

  cognitoUser.authenticateUser(authDetails, {
    onSuccess: (data) => {
      cognitoUser.updateAttributes(attributeList, (err, result) => {
        if (err) reject(err);
        resolve(result);  
      });
    }
  })

});

export const authenticate = async (Username, Password) => {
  return await new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username, Pool: UserPool });

    const authDetails = new AuthenticationDetails({ Username, Password });

    user.authenticateUser(authDetails, {
      onSuccess: (data) => {
        resolve(data);
      },
      onFailure: (err) => {
        console.error("onFailure: ", err);
        reject(err);
      },
      newPasswordRequired: (data) => {
        resolve(data);
      },
    });
  });
};

export const SignIn = (props) => {
  /**
   * @description Used for authenticating and logging in the registered user .
   * @param {} props Props should have a email and password to authenticate 
   */
  const { email, password } = props;
  // const { authenticate } = useContext(AccountContext);
  return new Promise((resolve, reject) => {
    var error, message
    authenticate(email, password)
      .then((data) => {
        error = false; message = data
        resolve({ error, message })
      })
      .catch((err) => {
        error = true; message = err
        reject({ error, message })
      });
  })
}

export const ChnagePassword = (props) => {
  /**
  * @description Used to change password of a logged in user .
  * @param {} props Props password-old password and newPassword 
  * User must be logged in .
  */
  const { password, newPassword } = props
  // const { getSession } = useContext(AccountContext);
  return new Promise((resolve, reject) => {
    GetSession().then(({ user }) => {
      user.changePassword(password, newPassword, (err, result) => {
        if (err) {
          reject({ error: true, message: err })
        } else {
          resolve({ error: false, message: result })
        }
      });
    }).catch((error) => {
      console.error("Failed to Get session", error);
      reject(error)
    })
  })

}

export const resendConfirmationCode = ({ email }) => new Promise((resolve, reject) => {
  const getUser = new CognitoUser({
    Username: email,
    Pool: UserPool,
  })

  getUser.resendConfirmationCode((error, data) => {
    if (error) reject(error);
    resolve(data);
  })
})

export const SendLinkResetPassword = (props) => {
  /**
  * @description Used to send an link to reset password of a registered user.
  * @param {} props Props should have a registered email of user.
  */
  const { email } = props

  return new Promise((resolve, reject) => {
    var error, message
    const getUser = new CognitoUser({
      Username: email,
      Pool: UserPool,
    })

    getUser.forgotPassword({
      onSuccess: data => {
        error = false; message = 'mail send to email'
        resolve({ error, message })
      },
      onFailure: err => {
        error = true; message = err
        reject({ error, message })
      },
      inputVerificationCode: data => {
        error = false; message = 'mail send to email'
        resolve({ error, message })
      }
    })
  })
}

export const ResetPassword = (props) => {
  /**
  * @description Used to resset password through redirecting from email link send in SendLinkResetPassword() .
  * @param {} props Props should have a userId ; newPassword and verificationCode from the queryParams of url . 
  */
  const { userId, newPassword, verificationCode } = props

  return new Promise((resolve, reject) => {
    const getUser = () => new CognitoUser({
      Username: userId,
      Pool: UserPool,
    })

    getUser().confirmPassword(verificationCode, newPassword, {
      onSuccess: data => {
        let error = false, message = 'Password reset Succesful'
        resolve({ error: error, message: message, data: data })
      },
      onFailure: err => {
        let error = true, message = err
        reject({ error: error, message: message })
      }
    })
  })

}

export const GetSession = async () => {
  return await new Promise((resolve, reject) => {
    const user = UserPool.getCurrentUser();
    if (user) {
      user.getSession(async (err, session) => {
        if (err) {
          reject();
        } else {
          const attributes = await new Promise((resolve, reject) => {
            user.getUserAttributes((err, attributes) => {
              if (err) {
                reject(err);
              } else {
                const results = {};

                for (let attribute of attributes) {
                  const { Name, Value } = attribute;
                  results[Name] = Value;
                }

                resolve(results);
              }
            });
          });

          resolve({ user, ...session, ...attributes });
        }
      });
    } else {
      reject();
    }
  });
};

export const confirmUser = async (props) => new Promise((resolve, reject) => {
  const { userId, code } = props

  const getUser = () => new CognitoUser({
    Username: userId,
    Pool: UserPool,
  });

  getUser().confirmRegistration(code, true, (err, result) => {
    if (err) reject(err);
    resolve(result);
  });
})
