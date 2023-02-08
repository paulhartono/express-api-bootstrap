import convict from 'convict'
import * as dotenv from 'dotenv'

if (process.env.DOTENV) {
  dotenv.config({ path: process.env.DOTENV })
} else {
  dotenv.config()
}

const config = convict({
  CHECK_AUTH_HEADER: {
    env: 'CHECK_AUTH_HEADER',
    format: Boolean,
    default: true,
  },
  APP_NAME: {
    env: 'APP_NAME',
    format: '*',
    default: '',
  },
  HTTP_PORT: {
    env: 'HTTP_PORT',
    format: 'port',
    default: 3000,
  },
  JWT_SECRET: {
    env: 'JWT_SECRET',
    format: String,
    default: 'jwt-secret',
  },
  JWT_TTL_SECONDS: {
    env: 'JWT_TTL_SECONDS',
    format: 'nat',
    default: 60,
  },
  REDIS_HOST: {
    env: 'REDIS_HOST',
    format: String,
    default: '127.0.0.1',
  },
  REDIS_PORT: {
    env: 'REDIS_PORT',
    format: 'port',
    default: 6379,
  },
  ROOM_TTL_SECONDS: {
    env: 'ROOM_TTL_SECONDS',
    format: 'nat',
    default: 60 * 60 * 12, // 12 hours
  },
  FREE_DECK_TTL_SECONDS: {
    env: 'ROOM_TTL_SECONDS',
    format: 'nat',
    default: 60 * 60 * 24 * 14, // 14 days
  },
  MAX_CACHE_DECK: {
    env: 'MAX_CACHE_DECK',
    format: Number,
    default: 3
  },
})

config.validate({allowed: 'strict'})
export { config }
