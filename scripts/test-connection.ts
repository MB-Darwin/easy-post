import { serverEnv } from "../src/shared/env/server-env";
import dns from "node:dns/promises";

import axios from "axios";
import https from "https";

async function testConnection() {
  const url = `${serverEnv.GENUKA_API_URL}/oauth/token`;
  console.log("Testing connection with axios to:", url);

  try {
    const response = await axios.post(
      url,
      new URLSearchParams({
        grant_type: "authorization_code",
        code: "test_code",
        client_id: serverEnv.GENUKA_CLIENT_ID,
        client_secret: serverEnv.GENUKA_CLIENT_SECRET,
        redirect_uri: serverEnv.GENUKA_REDIRECT_URI,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        httpsAgent: new https.Agent({ family: 4 }), // Force IPv4
      }
    );
    console.log("Response status:", response.status);
    console.log("Response data:", response.data);
  } catch (error) {
    console.error("Axios connection failed:", error.message);
    if (error.cause) console.error("Cause:", error.cause);
  }
}

testConnection();
