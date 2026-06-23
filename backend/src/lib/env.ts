import dotenv from "dotenv";

dotenv.config();

// ==================== ENV VALIDATION ====================

const requiredEnv = (key: string, fallback?: string) => {
  const value = process.env[key] || fallback;

  if (!value) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }

  return value;
};

// ==================== EXPORT ENV ====================

export const env = {
  NODE_ENV: requiredEnv("NODE_ENV", "development"),
  PORT: parseInt(requiredEnv("PORT", "5000")),

  DATABASE_URL: requiredEnv("DATABASE_URL"),

  JWT_SECRET: requiredEnv("JWT_SECRET"),

  SMTP_USER: requiredEnv("SMTP_USER"),
  SMTP_PASS: requiredEnv("SMTP_PASS"),
};