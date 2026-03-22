import { cookies } from "next/headers";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export type SessionPayload = {
  userId: string;
  email: string;
  role: string;
};

const SESSION_COOKIE = "session";
const MAX_AGE_SEC = 60 * 60 * 24 * 7;

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

function payloadFromJwt(claims: JWTPayload): SessionPayload | null {
  const { userId, email, role } = claims;
  if (
    typeof userId !== "string" ||
    typeof email !== "string" ||
    typeof role !== "string"
  ) {
    return null;
  }
  return { userId, email, role };
}

/**
 * Подписывает payload в JWT (JWS) для записи в куку.
 */
export async function encrypt(payload: SessionPayload): Promise<string> {
  const key = getSecretKey();
  const exp = new Date(Date.now() + MAX_AGE_SEC * 1000);
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(key);
}

/**
 * Проверяет подпись JWT и возвращает payload или null.
 */
export async function decrypt(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const key = getSecretKey();
    const { payload } = await jwtVerify(token, key);
    return payloadFromJwt(payload);
  } catch {
    return null;
  }
}

/**
 * Создаёт сессию: httpOnly-кука с JWT (userId, email, role).
 */
export async function login(payload: SessionPayload): Promise<void> {
  const token = await encrypt(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

/**
 * Завершает сессию: удаляет куку.
 */
export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/**
 * Текущая сессия из httpOnly JWT или null.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return decrypt(token);
}

/**
 * Только для Server Actions / RSC: не-админы получают исключение.
 */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Доступ запрещён");
  }
  return session;
}

export { SESSION_COOKIE as SESSION_COOKIE_NAME };
