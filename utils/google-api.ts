/** Prepare Google API for Use */

import { google } from "googleapis";
import { getConfigSync } from "./config";

const {
  gClientId,
  gClientSecret,
  gRefreshToken,
  gAccessToken,
} = getConfigSync();

export { google };

export const auth = new google.auth.OAuth2({
  clientId: gClientId,
  clientSecret: gClientSecret,
});
// TODO implement an access_token storage system
auth.setCredentials({
  refresh_token: gRefreshToken,
  access_token: gAccessToken,
});
