// Environment variable defaults, vars set in .env file
export const {
  PORT = 5000,
  NODE_ENV = "development",

  DB_USERNAME = "admin",
  DB_PASSWORD = "pass",
  DB_HOST = "localhost",
  DB_PORT = 27017,
  DB_NAME = "cerf",
  SECRET,
  MONGOLAB_URI,

  SESS_NAME,
  SESS_SECRET,
  SESS_LIFETIME = 1000 * 60 * 60 * 24 * 30,

  REDIS_HOST = "localhost",
  REDIS_PORT = 6379,
  REDIS_PW = "secret"
} = process.env;

export const IN_PROD = NODE_ENV === "production";
