const COOKIE_NAME = "camisa7_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12h
const SESSION_TOKEN = "authenticated";

export function createAdminSessionToken(): string {
  return SESSION_TOKEN;
}

export function verifyAdminSessionToken(token: string): boolean {
  return token === SESSION_TOKEN;
}

export function getAdminCookieName(): string {
  return COOKIE_NAME;
}

export function getAdminSessionMaxAgeSeconds(): number {
  return Math.floor(SESSION_TTL_MS / 1000);
}
