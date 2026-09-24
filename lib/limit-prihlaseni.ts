import "server-only";
import { db, pouzivaDatabazi } from "./db";
let lokalni = { pocet: 0, do: 0 };

/** Globální limit malého spolkového webu platí i mezi instancemi serveru. */
export async function povolPrihlaseni(): Promise<boolean> {
  if (!pouzivaDatabazi) {
    if (process.env.VERCEL) return false;
    if (lokalni.do < Date.now()) lokalni = { pocet: 0, do: Date.now() + 600_000 };
    return ++lokalni.pocet <= 8;
  }
  const radky = await db()`
    INSERT INTO csz_login_attempts(key, attempts, expires_at)
    VALUES ('sprava', 1, now() + interval '10 minutes')
    ON CONFLICT (key) DO UPDATE SET
      attempts = CASE WHEN csz_login_attempts.expires_at <= now() THEN 1 ELSE csz_login_attempts.attempts + 1 END,
      expires_at = CASE WHEN csz_login_attempts.expires_at <= now() THEN now() + interval '10 minutes' ELSE csz_login_attempts.expires_at END
    RETURNING attempts
  `;
  return Number(radky[0].attempts) <= 8;
}
