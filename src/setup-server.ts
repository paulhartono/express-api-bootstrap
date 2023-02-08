import { Express } from 'express'
import { ApolloServer } from 'apollo-server-express'
import * as http from 'http'
import { execute, subscribe } from 'graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { setupExpress } from './setup-express'
import { setupApolloServer } from './setup-apollo-server'
import { SetupExpressOptions } from './setup-express'
import { SetupApolloServerOptions } from './setup-apollo-server'

interface SetupMainAppOutputs {
  express: Express
  apolloServer: ApolloServer
  httpServer?: http.Server
}

type SetupServerOptions = SetupExpressOptions & { apollo: SetupApolloServerOptions }

export const setupServer = async (options: SetupServerOptions): Promise<SetupMainAppOutputs> => {

  const { apolloServer, schema } = await setupApolloServer(options.apollo)

  return setupExpress(apolloServer, options)
    .then(({ express }) => {

      if (options.apollo.subscriptions?.onConnect) {

        const httpServer = http.createServer(express)

        SubscriptionServer.create(
          {
            schema,
            execute,
            subscribe,
            onConnect: options.apollo.subscriptions.onConnect,
          },
          {
            path: apolloServer.graphqlPath,
            server: httpServer,
          },
        )

        return {
          express,
          apolloServer,
          httpServer,
        }
      }

      return {
        express,
        apolloServer,
      }
    })

}
