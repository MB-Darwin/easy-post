import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "dev-secret"
);

// ----------------------------
// CREATE SESSION TOKEN
// ----------------------------
export async function createSession(companyId: string, userId: string) {
  const token = await new SignJWT({ companyId, userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);

  return { session: token };
}

// ----------------------------
// DECODE SESSION TOKEN
// ----------------------------
export async function decodeSession(sessionToken: string) {
  const { payload } = await jwtVerify(sessionToken, SECRET);
  return payload as { companyId: string; userId: string };
}

// ----------------------------
// GET companyId FROM COOKIES
// ----------------------------
export async function getSessionCompanyId() {
  const cookieStore = await cookies(); // 👈 MUST await here

  const session = cookieStore.get("session")?.value;
  if (!session) return null;

  try {
    const payload = await decodeSession(session);
    return payload.companyId;
  } catch {
    return null;
  }
}
