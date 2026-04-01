import dotenv from "dotenv";
import path from "path";

const backendRoot = path.resolve(__dirname, "../..");
const monorepoRoot = path.resolve(__dirname, "../../..");

dotenv.config({ path: path.join(backendRoot, ".env") });
dotenv.config({ path: path.join(monorepoRoot, ".env") });

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

const port = Number(process.env.BACKEND_PORT ?? 3333);

export const env = {
  host: process.env.BACKEND_HOST ?? "0.0.0.0",
  port,
  databaseUrl: requiredEnv("DATABASE_URL"),
  /** URL publica do API (para links de imagens enviadas). Na VPS use https://api.seudominio.com */
  publicBaseUrl: (process.env.BACKEND_PUBLIC_URL ?? `http://127.0.0.1:${port}`).replace(/\/+$/, "")
};
