import secret from './secret'

export const {
  PORT = 5000,
  NODE_ENV = 'development',
  DB_USERNAME = 'admin',
  DB_PASSWORD = secret.password,
  DB_HOST = secret.host,
  DB_PORT = secret.port,
  DB_NAME = 'cerf',
  SECRET = secret.hashSecret
} = process.env

export const IN_PROD = NODE_ENV === 'production'
