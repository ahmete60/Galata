export const SERVICE_URL = {
    REGION: 'us-east-2',
    USER_POOL_ID: 'us-east-2_j1zH8CjqL',
    USER_POOL_WEB_CLIENT_ID: '751sfdgtukdtd744546rvbienn',
    IDENTITY_POOL_ID: 'us-east-2:6a45b72f-fe1b-49a7-92ca-913e2e5d4fcb',
    BASE_URL_DEV: 'https://r1jloxvii9.execute-api.us-east-2.amazonaws.com',
    LOCAL_API_URL_DEV: 'https://yycdmm4pnc.execute-api.us-east-2.amazonaws.com',
    CALLBACK_URL: 'http://localhost:3000/influencer-form',
    ENVIRONMENT: 'dev',
    YOUTUBE_BASIC_ANALYTICS: (params)=>{ let str = ''; if(params) Object.keys(params).map((key)=>{ return str+=  key+'='+params[key]+'&'}); return '/api/v1/google/getBasicAnalytics'+(str ? ('?'+str): '')},
    MOST_WATCHED_VIDEOS_ANALYTICS: (params)=>{ let str = ''; if(params) Object.keys(params).map((key)=>{ return str+=  key+'='+params[key]+'&'}); return '/api/v1/google/getMostWatchedVideosAnalytics'+(str ? ('?'+str): '')},
    GENERATE_URL: (userName, callback) => { return '/api/v1/google/generateURL?userId=' + userName+'&callbackURL='+callback},
    GENERATE_TOKEN: (code)=>{ return '/api/v1/google/generateToken?code=' + code},
    GENERATE_REFRESH_TOKEN: (refreshToken)=>{ return '/api/v1/google/generateRefreshToken?refreshToken=' + refreshToken}

}