import { SERVICE_URL } from "../Common/ServiceConstants";
const awsconfig = {
  Auth: {
    region: SERVICE_URL.REGION,
    userPoolId: SERVICE_URL.USER_POOL_ID,
    userPoolWebClientId: SERVICE_URL.USER_POOL_WEB_CLIENT_ID,
    identityPoolId: SERVICE_URL.IDENTITY_POOL_ID,
  },
  API: {
    endpoints: [
      {
        name: "$default",
        endpoint: SERVICE_URL.BASE_URL_DEV,
      },
    ],
  },
};

export default awsconfig;
