import { verifyHmac } from "@/shared/lib/hmac";
import { exchangeCodeForToken, getCompanyInfo } from "@/shared/lib/genuka";
import { companyService, CompanyInsert } from "@/entities/company";

export class OAuthService {
  private companyDBService: typeof companyService;

  constructor() {
    this.companyDBService = companyService;
  }

  async handleCallback(params: {
    code: string;
    companyId: string;
    timestamp: string;
    hmac: string;
    redirectTo: string;
  }) {
    const isValidHmac = await verifyHmac(
      {
        code: params.code,
        company_id: params.companyId,
        redirect_to: params.redirectTo,
        timestamp: params.timestamp,
      },
      params.hmac
    );

    if (!isValidHmac) {
      throw new Error("Invalid HMAC signature");
    }

    const timestampAge = Date.now() - parseInt(params.timestamp) * 1000;
    if (timestampAge > 5 * 60 * 1000) {
      throw new Error("Request expired");
    }

    const tokenResponse = await exchangeCodeForToken(params.code);

    const companyInfo = await getCompanyInfo(params.companyId);

    // Calculate token expiration date
    const tokenExpiresAt = new Date(
      Date.now() + tokenResponse.expires_in_minutes * 60 * 1000
    );

    const companyData: CompanyInsert = {
      id: params.companyId,
      handle: companyInfo.handle || null,
      name: companyInfo.name,
      description: companyInfo.description || null,
      accessToken: tokenResponse.access_token || null,
      refreshToken: tokenResponse.refresh_token || null,
      tokenExpiresAt: tokenExpiresAt,
      logoUrl: companyInfo.logoUrl || null,
      phone: companyInfo.metadata?.contact || null,
    };
    await this.companyDBService.upsert(companyData);

    return { success: true, companyId: params.companyId };
  }

  validateCallbackParams(params: {
    code?: string | null;
    companyId?: string | null;
    timestamp?: string | null;
    hmac?: string | null;
  }): boolean {
    return !!(
      params.code &&
      params.companyId &&
      params.timestamp &&
      params.hmac
    );
  }
}

export const oauthService = new OAuthService();
