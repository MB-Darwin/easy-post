// // src/shared/config/facebook.ts
// export const facebookConfig = {
//   appId: process.env.FB_APP_ID!,
//   appSecret: process.env.FB_APP_SECRET!,
//   redirectUri: process.env.FB_REDIRECT_URI!,
//   apiVersion: "v16.0",
//   scopes: ["email", "public_profile"],
// };

// // Validation au démarrage
// if (!facebookConfig.appId || !facebookConfig.appSecret) {
//   throw new Error("Missing Facebook OAuth environment variables");
// }
// src/shared/config/facebook.ts
export const facebookConfig = {
  appId: process.env.FB_APP_ID || "test_app_id",
  appSecret: process.env.FB_APP_SECRET || "test_app_secret",
  redirectUri:
    process.env.FB_REDIRECT_URI || "http://localhost:3000/api/auth/facebook",
  apiVersion: "v16.0",
  scopes: ["email", "public_profile"],
};

// Fonction pour simuler Facebook en développement
export const isDevelopment = process.env.NODE_ENV === "development";

// Données de test
export const mockFacebookUser = {
  id: "123456789",
  name: "Test User",
  email: "test@example.com",
  picture: {
    data: {
      url: "https://example.com/test.jpg",
    },
  },
};
