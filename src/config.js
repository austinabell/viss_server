import secret from "./secret";

export const {
  PORT = 5000,
  NODE_ENV = "development",

  DB_USERNAME = "admin",
  DB_PASSWORD = secret.password || "pass",
  DB_HOST = secret.host || "localhost",
  DB_PORT = secret.port || 27017,
  DB_NAME = "cerf",
  SECRET = secret.hashSecret || "placeholdersecret",

  SESS_NAME = secret.sessionName || "sid",
  SESS_SECRET = secret.sessionSecret || "oeufbn4s7dnj",
  SESS_LIFETIME = 1000 * 60 * 60 * 2,

  REDIS_HOST = secret.redisHost || "localhost",
  REDIS_PORT = secret.redisPort || 6379,
  REDIS_PW = secret.redisPW || "secret"
} = process.env;

export const IN_PROD = NODE_ENV === "production";
