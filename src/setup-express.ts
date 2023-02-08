import { v4 as uuidv4 } from 'uuid'
import express from 'express'
import expressJwt from 'express-jwt'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { ApolloServer, GetMiddlewareOptions } from 'apollo-server-express'
import { traceToken, defaultErrorHandler } from './middlewares'

export interface SymmetricSecurityOptions {
  secret: string
  audience: string
  authenticateRoute: express.RequestHandler
  rollJwtMiddleware: express.RequestHandler
}

// - cookie based
// - xsrf verification too
// - public/private key pairs
export interface AsymmetricSecurityOptions {
  middlewares: {
    verifyAccessToken: express.RequestHandler // this is the equiv of express-jwt
  }
  routes?: {
    wellKnown: {
      jwks: {
        get: express.RequestHandler // this returns the public key for use in verification
      }
    }
    authenticate: {
      post: express.RequestHandler // this signs a token and set token on cookie
      patch: express.RequestHandler // this rolls existing token and sets new token on cookie
      destroy: express.RequestHandler // this deletes token from cookie
    }
  }
}

export interface SetupExpressOptions {
  appName: string
  jwt: 'disabled' | SymmetricSecurityOptions | AsymmetricSecurityOptions
  cors?: {
    origin: string[]
    headers?: string[]
  }
  logger: Console
  parseCookies?: boolean
  useIdempotencyToken?: boolean
  healthcheck?: () => Promise<void>
  maximumRequestBodySize?: string | number
  setupRoutes?: (router: express.Router) => void
}

interface SetupExpressOutputs {
  express: express.Express
}

export const setupExpress = async (apolloServer: ApolloServer, options: SetupExpressOptions): Promise<SetupExpressOutputs> => {

  const app: express.Express = express()

  app.set('trust proxy', true)

  const healthcheck = () => {
    return {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now()
    }
	}

  app.use(express.json()) // for parsing application/json
  app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

  app.use('/healthcheck', options.healthcheck ?? healthcheck)

  if (options.parseCookies === true) {
    app.use('/', cookieParser())
  }

  const router = express.Router()

  // setup route level middlewares
  router.use(traceToken())

  if (options.useIdempotencyToken) {

    router.use((req, res, next) => {
      const idempotencyToken = req.get('x-ph-idempotency-token') || uuidv4()
      // @ts-ignore
      req.idempotencyToken = idempotencyToken
      res.set('x-ph-idempotency-token', idempotencyToken)

      next()
    })
  }

  const graphqlUrlPath = '/graphql'

  const apolloServerMiddlewareOptions: GetMiddlewareOptions = {
    path: graphqlUrlPath,
  }

  if (options.cors && options.cors.origin && options.cors.origin.length > 0) {

    const corsHeaders = [
      'x-ph-trace-token',
      'x-xsrf-token',
      'Content-Type',
      ...options.cors.headers ?? []
    ]

    router.use(cors({
      origin: options.cors.origin,
      allowedHeaders: corsHeaders,
      exposedHeaders: corsHeaders,
      credentials: true,
    }))

    // @ts-ignore
    router.options('*', cors({ origin: options.cors.origin }))

    apolloServerMiddlewareOptions.cors = false
  }

  if (options.jwt !== 'disabled') {

    if (isSymmetricSecurityOptions(options.jwt)) {

      router.use(
        graphqlUrlPath,
        options.jwt.rollJwtMiddleware,
        expressJwt({
          ...options.jwt,
          algorithms: ['HS256'],
        }),
      )
      router.post('/authenticate', options.jwt.authenticateRoute)

    } else {
      const { middlewares, routes } = options.jwt as AsymmetricSecurityOptions

      router.use(graphqlUrlPath, middlewares.verifyAccessToken)

      if (routes) {
        router.get('/.well-known/jwks.json', routes.wellKnown.jwks.get)

        router.post('/authenticate', routes.authenticate.post)
        router.patch('/authenticate', routes.authenticate.patch)
        router.delete('/authenticate', routes.authenticate.destroy)
      }
    }
  }

  router.use(apolloServer.getMiddleware(apolloServerMiddlewareOptions))

  if (options.setupRoutes) {
    options.setupRoutes(router)
  }

  app.use(router)

  // default error handler
  app.use(defaultErrorHandler(options.logger))

  return { express: app }
}


const isSymmetricSecurityOptions = (securityOptions: SymmetricSecurityOptions | AsymmetricSecurityOptions): securityOptions is SymmetricSecurityOptions => {
  return (securityOptions as SymmetricSecurityOptions).secret !== undefined
}
