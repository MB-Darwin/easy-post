/**
 * OAuth Types for Genuka API Integration
 */

export interface OAuthCallbackParams {
  /** Authorization code from OAuth provider */
  code: string;
  /** Company/tenant identifier */
  company_id: string;
  /** Timestamp of the callback */
  timestamp: string;
  /** HMAC signature for request validation */
  hmac: string;
  /** URL to redirect after authentication */
  redirect_to?: string;
}

export interface OAuthTokenRequest {
  /** Authorization code to exchange for token */
  code: string;
  /** OAuth grant type */
  grant_type?: "authorization_code";
  /** Redirect URI (must match registered URI) */
  redirect_uri?: string;
}

export interface OAuthTokenResponse {
  /** Access token for API requests */
  access_token: string;
  /** Token type (typically "Bearer") */
  token_type: string;
  /** Token expiration in seconds */
  expires_in: number;
  /** Refresh token for renewing access */
  refresh_token?: string;
  /** Space-separated list of granted scopes */
  scope?: string;
}

export interface OAuthErrorResponse {
  /** Error code */
  error: string;
  /** Human-readable error description */
  error_description?: string;
  /** URI with error information */
  error_uri?: string;
}

export interface AuthenticatedUser {
  /** User identifier */
  id: string;
  /** User email */
  email?: string;
  /** User name */
  name?: string;
  /** Company/tenant ID */
  company_id: string;
  /** Access token */
  access_token: string;
  /** Token expiration timestamp */
  expires_at: number;
}
