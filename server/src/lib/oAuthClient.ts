import { OAuth2Client } from "google-auth-library";
import envVars from "../constants/envVars";

const oauthClient = new OAuth2Client(envVars.GOOGLE_CLIENT_ID);

export default oauthClient;
