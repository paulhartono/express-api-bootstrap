import express from 'express'
import { setupServer } from './setup-server'
import { config } from './config'
import  * as authenticate  from './routes/authenticate'
import { resolvers } from './graphql/resolvers'
import * as path from 'path'
import { setupRoutes } from './routes'
import { v4 as uuidv4 } from 'uuid'
import { JwtPayload, UserType } from './graphql/types'
import { ForbiddenError } from 'apollo-server-errors'

const listen = (app: express.Express, name: string, port: number) => {
  return app.listen(port, () => {
    console.info(`Express ${name} server running at http://0.0.0.0:${port}/`)
  })
}

const startMainApp = (): Promise<express.Express> => {
  return setupServer({
    appName: config.get('APP_NAME'),
    logger: console,
    jwt: config.get('CHECK_AUTH_HEADER') ? {
      audience: config.get('APP_NAME'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      secret: config.get('JWT_SECRET') as any,
      authenticateRoute: authenticate.post,
      rollJwtMiddleware: (req, res, next) => {
        // beef does not support roll jwt at the moment (todo)
        next()
      },
    } : 'disabled',
    apollo: {
      schemaPath: path.join(__dirname, 'graphql', 'schema'),
      resolvers,
      playground: true,
      context: ({ req }) => {

        // decoded jwt token is by default is set on req.user
        // Reference: https://github.com/auth0/express-jwt
        // we are saving this as a const user which refer to the session user
        const user = (req as any).user

        if (user.type === UserType.Anonymous) {
          user.id = `anon-${user.id}`
        } else {

          if (!user.email) {
            throw new ForbiddenError(`user email not found`)
          }

          // Find userId by email
          // TODO: currently this value is hardcoded to id, but we need to call either via API call or DB call to get userId

          // Remove this line when the TODO item above has been implemented
          throw new ForbiddenError(`Only Anonymous user is allowed for now`)
        }
        console.debug('session userId = ', user.id)

        const context: { user: JwtPayload, traceToken: string, ipAddress: string} = {
          user,
          traceToken: (req as any).traceToken || uuidv4(),
          ipAddress: req.ip,
        }

        return context

      },
    },
    setupRoutes,
  })
    .then(({ express }) => express)
    .catch((err) => {
      console.log(err) // eslint-disable-line
      process.exit(1)
    })
}


Promise.all([
  startMainApp(),
])
  .then(([mainApp]) => {

    const mainServer = listen(mainApp, 'main', config.get('HTTP_PORT'))

    process.on('SIGTERM', () => {

      mainServer.close(() => {
        console.info('mainApp stopped by sigterm')
      })

    })

  })
  .catch((err) => {
    console.log(err) // eslint-disable-line
    process.exit(1)
  })
