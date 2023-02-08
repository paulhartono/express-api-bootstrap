import IORedis from 'ioredis'
import { config } from '../config'

const logger = console

export const cache: { instance: IORedis.Redis | null } = {
  instance: null,
}

export const redisClient = (): IORedis.Redis => {

  if (!cache.instance) {
    cache.instance = new IORedis({
        host: config.get('REDIS_HOST'),
        port: config.get('REDIS_PORT'),
        maxRetriesPerRequest: 5,
    })
      .on('connect', () => logger.info('frontend redis event: connect'))
      .on('ready', () => logger.info('frontend redis event: ready'))
      .on('reconnecting', () => logger.info('frontend redis event: reconnecting'))
      .on('close', () => logger.warn('frontend redis event: close'))
      .on('error', err => logger.error({ err }, 'frontend redis event: error'))
  }

  return cache.instance
}
