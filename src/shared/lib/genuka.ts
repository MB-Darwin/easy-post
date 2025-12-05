import axios from "axios";
import https from "https";
import Genuka from "genuka-api";
import { serverEnv } from "../env/server-env";

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in_minutes: number;
}

const httpsAgent = new https.Agent({ family: 4 });

export async function initializeGenuka(companyId: string) {
  return await Genuka.initialize({ id: companyId });
}

export async function exchangeCodeForToken(
  code: string
): Promise<TokenResponse> {
  const url = `${serverEnv.GENUKA_API_URL}/oauth/token`;
  console.log("Exchanging code for token at:", url);

  try {
    const response = await axios.post(
      url,
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: serverEnv.GENUKA_CLIENT_ID,
        client_secret: serverEnv.GENUKA_CLIENT_SECRET,
        redirect_uri: serverEnv.GENUKA_REDIRECT_URI,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        httpsAgent,
      }
    );

    return response.data as TokenResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Token exchange failed: ${error.response?.status} ${JSON.stringify(
          error.response?.data
        )}`
      );
    }
    throw error;
  }
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<TokenResponse> {
  try {
    const response = await axios.post(
      `${serverEnv.GENUKA_API_URL}/oauth/refresh`,
      {
        refresh_token: refreshToken,
        client_id: serverEnv.GENUKA_CLIENT_ID,
        client_secret: serverEnv.GENUKA_CLIENT_SECRET,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        httpsAgent,
      }
    );

    return response.data as TokenResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Token refresh failed: ${error.response?.status} ${JSON.stringify(
          error.response?.data
        )}`
      );
    }
    throw error;
  }
}

export async function getCompanyInfo(companyId: string) {
  const genuka = await initializeGenuka(companyId);
  return await genuka.company.retrieve();
}
