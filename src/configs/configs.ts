export const MODE = "prod"; // dev, prod

/*
0 = DEV
1 = SIT
2 = UAT
3 = PROD.
*/
// prod
const APP_VERSION_CODE_PROD = "0.9.0.0"; // [0] == version
// dev
const APP_VERSION_CODE_DEV = "V0.9.3.2-dev";
export const APP_VERSION =
  MODE === "prod" ? APP_VERSION_CODE_PROD : APP_VERSION_CODE_DEV;

export const API_URL =
  MODE === "prod"
    ? "https://v2-backend-service-gtbie.ondigitalocean.app/api/v1.0"
    : "https://v2-backend-service-gtbie.ondigitalocean.app/api/v1.0";
