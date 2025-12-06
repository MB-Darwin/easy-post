// // src/shared/utils/encryption.ts
// import crypto from "crypto";

// const algorithm = "aes-256-ctr";
// const secretKey = process.env.ENCRYPTION_KEY || "your-fallback-secret-key";

// export function encrypt(text: string): string {
//   const iv = crypto.randomBytes(16);
//   const cipher = crypto.createCipheriv(
//     algorithm,
//     Buffer.from(secretKey, "hex"),
//     iv
//   );
//   const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
//   return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
// }

// export function decrypt(text: string): string {
//   const [iv, encrypted] = text.split(":");
//   const decipher = crypto.createDecipheriv(
//     algorithm,
//     Buffer.from(secretKey, "hex"),
//     Buffer.from(iv, "hex")
//   );
//   const decrypted = Buffer.concat([
//     decipher.update(Buffer.from(encrypted, "hex")),
//     decipher.final(),
//   ]);
//   return decrypted.toString();
// }

// src/shared/utils/encryption.ts
export function encrypt(text: string): string {
  // Version simplifiée pour le développement
  // En production, utilisez une vraie bibliothèque de chiffrement
  if (process.env.NODE_ENV === "development") {
    return `dev_encrypted_${text}`; // Juste pour tester
  }

  // En production, implémentez un vrai chiffrement
  return Buffer.from(text).toString("base64");
}

export function decrypt(text: string): string {
  if (process.env.NODE_ENV === "development") {
    return text.replace("dev_encrypted_", "");
  }

  return Buffer.from(text, "base64").toString();
}
