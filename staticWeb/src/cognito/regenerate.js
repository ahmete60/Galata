import axios from "axios";

const client_id = process.env.REACT_APP_CLIENT_ID
// const history = useHistory()

const getAccessToken = (refreshToken) => {
  if (!refreshToken) return { error: true, message: "Refresh token needed" }
  const body = {
    "ClientId": client_id,
    "AuthFlow": "REFRESH_TOKEN_AUTH",
    "AuthParameters": {
      "REFRESH_TOKEN": refreshToken
    }
  }
  return axios
    .post(`https://cognito-idp.us-east-2.amazonaws.com/`, body, {
      headers: {
        "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
        "Content-Type": "application/x-amz-json-1.1"
      },
    })
    .then((res) => {
      const response = {
        newAccessToken: res.data.AuthenticationResult['AccessToken'],
        newIdToken: res.data.AuthenticationResult['IdToken']
      }
      return response
    })
    .catch((err) => {
      window.location.href = '/login';
    });
}

export const setAccessToken = async () => {
  let data = window.localStorage.getItem("loggedInData");
  data = JSON.parse(data);

  if (data.refreshToken && data.refreshToken !== "") {
    let tokenResponse = await getAccessToken(data.refreshToken)
    data.accessToken = tokenResponse.newAccessToken
    data.idToken = tokenResponse.newIdToken
    window.localStorage.setItem("loggedInData", JSON.stringify(data))
    return {
      success: true,
      accessToken: tokenResponse.newAccessToken,
    }
  } else {
    window.location.href = '/login'
  }
}
