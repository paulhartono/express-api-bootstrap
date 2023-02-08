import { ApolloServer } from "apollo-server-express"
import { ApolloServerExpressConfig } from 'apollo-server-express'
import { ServerOptions } from "subscriptions-transport-ws"
import { makeExecutableSchema } from '@graphql-tools/schema'
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'
import { v4 as uuid } from 'uuid'
import { ApolloServerPluginLandingPageGraphQLPlayground, PluginDefinition } from 'apollo-server-core'

export interface SetupApolloServerOptions {
  schemaPath: string
  resolvers: any[]
  context?: ApolloServerExpressConfig['context']
  formatError?: ApolloServerExpressConfig['formatError']
  subscriptions?: Required<Pick<ServerOptions, 'onConnect'>>
  playground?: boolean
  introspection?: boolean
}

export const setupApolloServer = async (options: SetupApolloServerOptions) => {

  const {schemaPath, resolvers, context, formatError, subscriptions, playground, introspection} = options

  const schema = makeExecutableSchema({
    typeDefs: [
      mergeTypeDefs(loadFilesSync(schemaPath, { extensions: ['graphql'] })) as any,
    ],
    resolvers: mergeResolvers([
      ...resolvers,
    ]),
  })

  const defaultContextFn: SetupApolloServerOptions['context'] = ({ req }) => {
    return {
      sessionUser: (req as any).user,
      traceToken: (req as any).traceToken || uuid(),
      ipAddress: req.ip,
    }
  }

  const plugins: PluginDefinition[] = [
    {
      requestDidStart: async () => {

        return {
          didEncounterErrors: async (requestContext) => {

            const { operationName, context: { traceToken, ipAddress, user: sessionuser } } = requestContext

            const errors = formatError ? requestContext.errors.map(formatError) : requestContext.errors

            errors.forEach((err) => {
              console.error(' ==> didEncounterErrors', { err, traceToken, operationName, ipAddress, email: sessionuser?.email })
            })

          },

          executionDidStart: async (requestContext) => {

            const { operationName, context: { traceToken, ipAddress, user: sessionUser } } = requestContext

            return {
              executionDidEnd: async () => {
                console.debug('apollo server request lifecycle: executionDidEnd', { traceToken, operationName, ipAddress, email: sessionUser?.email })
              },
            }
          },

        }
      },
    },
  ]

  if (playground) {
    plugins.push(ApolloServerPluginLandingPageGraphQLPlayground())
  }

  const apolloServer = new ApolloServer({
    schema,
    context: context || defaultContextFn,
    plugins,
    formatError,
    introspection
  })

  await apolloServer.start()

  return { apolloServer, schema }
}
